/* global google */

import React, {useEffect, useState} from 'react';
import {GoogleMap, Marker, Polyline, useJsApiLoader} from "@react-google-maps/api";
import moment from 'moment';

const Map = (props) => {
    /* ================================== HELPER FUNCTIONS + CUSTOMIZABLE CONSTANTS ================================== */
    const timeIntervalLockout = 180;
    const [toggleNetwork, setToggleNetwork] = useState(true);
  
    const OPTIONS = {
      minZoom: 2.0,
      maxZoom: 18.0,
      disableDefaultUI: true,
      gestureHandling: 'greedy'
    }

    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: "AIzaSyA3Ow506dj9kpI7quNGe9aU9Qul0XdPSAM"
  })

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
        map.setCenter({lat: 0, lng: 0});
        map.setZoom(2.0);
        console.log(props);
        setMap(map);

      //console.log(props.data);
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
      path: "M 3 3 H 9 V 9 H 3 L 3 3",
      fillColor: "green",
      fillOpacity: 2, 
      strokeWeight: 1,
      rotation: 0,
      scale: 2
    }
    
    const declareIcon = (item) => {
      console.log("POINT TO BE RENDERED", item.location.latitude, item.location.longitude);

      if (item.gateway) {
        if (calcOffline(item.lastPing)) {
          return {
            anchor: google.maps.Point(item.location.latitude, item.location.longitude),
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "red",
            fillOpacity: 2, 
            strokeWeight: 1,
            rotation: 0,
            scale: 10
          }
        } else {
          return {
            anchor: google.maps.Point(item.location.latitude, item.location.longitude),
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "green",
            fillOpacity: 2, 
            strokeWeight: 1,
            rotation: 0,
            scale: 10
          }
        }
      } 
      else {
        if (calcOffline(item.lastPing)) {
          return {
            anchor: google.maps.Point(item.location.latitude, item.location.longitude),
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "red",
            fillOpacity: 2, 
            strokeWeight: 1,
            rotation: 0,
            scale: 6
          };
        } else {
          return {
            anchor: google.maps.Point(item.location.latitude, item.location.longitude),
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "green",
            fillOpacity: 2, 
            strokeWeight: 1,
            rotation: 0,
            scale: 6
          };
        }
      }
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
              props.data.map((item, index) => {
                //console.log(index + " " + item.location.latitude + ", " + item.location.longitude + ", " + item.gateway + ", " + calcOffline(item.lastPing));
                return (
                    <Marker key={index}
                    position={{
                        lat:item.location.latitude,
                        lng:item.location.longitude
                      }}
                    icon={declareIcon(item)}
                    
                    onClick = {() => {
                      props.parentCallback(item);
                    }}
                    />
                  )
                }
              ) 
            }

            {
            (() => {
              let lines = [];
              let idx = 0;
              props.data.map((item, index) => {
                const connections = item.adjacencies;

                console.log("CONNECTIONS for node " + item._id + ": " + item.adjacencies);
                connections.map((nodeID, sni) => {

                  let startNode = null;
                  for (let i = 0; i < props.data.length; i++) {
                    if (props.data[i] != null && props.data[i]._id == nodeID) {
                      startNode = props.data[i];
                      break;
                    }
                  }

                if (startNode != null) {
                  const path = [
                    {lat: item.location.latitude, lng: item.location.longitude},
                    {lat: startNode.location.latitude, lng: startNode.location.longitude}
                  ]

                  console.log(path);
                  lines.push(
                    <Polyline 
                      path={path}
                      geodesic={true}
                      options={{
                        strokeColor: "#3d4452",
                        strokeOpacity: 0.75,
                        strokeWeight: 2,
                      }}
                    />
                  )
                }
                })
              });

              return lines;
            }
            )()
            }
          </GoogleMap>
        </>
    ) : <></>
}

export default Map;

