import React, {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import {GoogleMap, LoadScript, MarkerF, useJsApiLoader} from "@react-google-maps/api";
import { auto } from '@popperjs/core';

/*
https://www.digitalocean.com/community/tutorials/how-to-integrate-the-google-maps-api-into-react-applications
*/


function Map() {
    const [nodeData, setNodeData] = useState([]);
    const [gateData, setGateData] = useState([]);

    useEffect(() => {
      fetch("http://localhost:5000/api/nodes").then(
        response => response.json()
      ).then(
        data => setNodeData(data)
      )
    }, []);
    //console.log(nodeData);


    useEffect(() => {
      fetch("http://localhost:5000/api/gateways").then(
        response => response.json()
      ).then(
        data => setGateData(data)
      )
    }, []);

    const containerStyle = {
        height: "100%",
        width: "100%",
        padding: "auto",
        margin: "auto",
        position: "absolute"
    };
      

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyA3Ow506dj9kpI7quNGe9aU9Qul0XdPSAM"
    })

    console.log(isLoaded.googleMapsApiKey);

    const [map, setMap] = useState(null);
    
    const totalData = nodeData.concat(gateData);

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        let len = totalData.length;
        while (len--) {
            let lat = totalData[len].location.latitude;
            let long = totalData[len].location.longitude;
            console.log(lat, long);
            bounds.extend({lat, long});
        }

        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
        console.log(map);

        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    const onlineNodeImage = {
      path: "M 4,8 a 4,4 0 1,1 8,0 a 4,4 0 1,1 -8,0",
      fillColor: "green",
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



    return isLoaded ? (
        <>
            <GoogleMap
            mapContainerStyle={containerStyle}
            onLoad={onLoad}
            onUnmount={onUnmount}>
            {nodeData.map((item, index) => {
                console.log(index + " " + item.location.latitude + ", " + item.location.longitude);
                return (
                  <MarkerF key={index}
                  position={
                    {
                      lat:item.location.latitude,
                      lng:item.location.longitude
                    }
                  }
                  icon={onlineNodeImage}
                  />
                )
            })
          }

          {gateData.map((item, index) => {
              console.log(index + " " + item.location.latitude + ", " + item.location.longitude);
              return (
                <MarkerF key={index}
                position={
                  {
                    lat:item.location.latitude,
                    lng:item.location.longitude
                  }
                }
                icon={onlineGateImage}
                />
              )
          })

            //<Marker position={{ lat: 18.52043, lng: 73.856743 }} />
            }
            </GoogleMap>
        </>
    ) : <></>
}

export default Map;

