import React, {useEffect, useState} from 'react';
import {GoogleMap, MarkerF, useJsApiLoader} from "@react-google-maps/api";
import moment from 'moment';

/*
https://www.digitalocean.com/community/tutorials/how-to-integrate-the-google-maps-api-into-react-applications
*/


const Map = (props) => {
    /* ================================== PASSBACK OF SELECTED MARKER TO PARENT COMP ================================== */
    const [selectedCenter, setSelectedCenter] = useState(null);

    /* ================================== HELPER FUNCTIONS + CUSTOMIZABLE CONSTANTS ================================== */
    const timeIntervalLockout = 180;
  
    const OPTIONS = {
      minZoom: 2.0,
      maxZoom: 18.0,
      disableDefaultUI: true,
    }

    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: "AIzaSyA3Ow506dj9kpI7quNGe9aU9Qul0XdPSAM"
  })

    const coordinates = {
      lat: [],
      lng: [],
    }
  

    const containerStyle = {
        height: "100%",
        width: "100%",
        padding: "auto",
        margin: "auto",
        position: "absolute",
        overflow: "visible"
    };

    const [map, setMap] = useState(null);

    const onLoad = React.useCallback(function callback(map) {
      props.nodeData.map(l => {
        coordinates.lat.push(Number(l.location.latitude))
        coordinates.lng.push(Number(l.location.longitude))
      })

      console.log(coordinates);
    
      const averageLng = (Math.max(...coordinates.lng) + Math.min(...coordinates.lng)) / 2;
      const averageLat = (Math.max(...coordinates.lat) + Math.min(...coordinates.lat)) / 2;

      console.log(averageLng, averageLat);

        map.setCenter({lat: 0, lng: 0});
        map.setZoom(2.0);
        console.log("ZOOM", map.getZoom());
        console.log("CENTER", map.getCenter());
        setMap(map);


      }, []);
    

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    function calcOffline(timeStamp) {
      const currDate = new Date(moment().toISOString());
      const timeDate = new Date(timeStamp);
      //console.log(currDate, timeDate);
      let minutes = (currDate - timeDate) / (1000 * 60);
      return minutes > timeIntervalLockout;
    }

    /* ================================== SVG ICONS FOR NODES AND GATEWAYS ================================== */
    const onlineNodeImage = {
      path: "M 4,8 a 4,4 0 1,1 8,0 a 4,4 0 1,1 -8,0",
      fillColor: "green",
      fillOpacity: 2, 
      strokeWeight: 1,
      rotation: 0,
      scale: 2
    }

    const offlineNodeImage = {
      path: "M 4,8 a 4,4 0 1,1 8,0 a 4,4 0 1,1 -8,0",
      fillColor: "red",
      fillOpacity: 2, 
      strokeWeight: 1,
      rotation: 0,
      scale: 2
    }

    const onlineGateImage = {
      path: "M 2 2 H 8 V 8 H 2 L 2 2",
      fillColor: "green",
      fillOpacity: 2, 
      strokeWeight: 1,
      rotation: 0,
      scale: 2
    }

    const offlineGateImage = {
      path: "M 2 2 H 8 V 8 H 2 L 2 2",
      fillColor: "red",
      fillOpacity: 2, 
      strokeWeight: 1,
      rotation: 0,
      scale: 2
    }
    
    /* ================================== RENDERING OF MAP COMPONENT ================================== */
    return isLoaded ? (
        <>
            <GoogleMap
            mapContainerStyle={containerStyle}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options = {OPTIONS}
            >
            {
              props.nodeData.map((item, index) => {
                //console.log(index + " " + item.location.latitude + ", " + item.location.longitude);
                return (
                    <MarkerF key={index}
                    position={{
                        lat:item.location.longitude,
                        lng:item.location.latitude
                      }}
                    icon={(item.gateway == true) ? (calcOffline(item.lastPing) ? offlineGateImage : onlineGateImage) : (calcOffline(item.lastPing) ? offlineNodeImage : onlineNodeImage)}
                    
                    onClick = {() => {
                      props.parentCallback(item);
                    }}
                    />
                  )
                }
              ) 
          }
        
          </GoogleMap>
        </>
    ) : <></>
}

export default Map;

