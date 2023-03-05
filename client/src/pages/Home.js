import React, { useEffect, useState } from 'react';
import {StyleSheet, View} from 'react-native';
import {Helmet} from 'react-helmet';
import moment from 'moment';


import Map from "./components/Map";


function Home() {

    /* ================================== PASSBACK OF SELECTED MARKER TO PARENT COMP ================================== */
    
    const [timelineData, setTimelineData] = useState([]);
    const [retrieved, setRetrieved] = useState();
    const [gateData, setGateData] = useState([]);
    const [nodeData, setNodeData] = useState([]);
    const [latestNodeInfo, setLatestNodeInfo] = useState({});

    useEffect(() => {
        fetch("http://localhost:5000/api/nodes").then(
          response => response.json()
        ).then(
          data => setNodeData(data)
        )
      }, []);

    
    useEffect(() => {
        fetch("http://localhost:5000/api/gateways").then(
            response => response.json()
          ).then(
            data => setGateData(data)
          )
    }, [])

    

    const [retrievedTimeStamps, setRetrievedTimeStamps] = useState([]);
    fetch("http://localhost:5000/api/history/").then(
        response => response.json()
    ).then(
        data => setRetrievedTimeStamps(data)
    )

    const totalData = gateData.concat(nodeData);

    const handleCallback = (childData) =>{
        setRetrieved(childData);
        
        let t = [];
    
        /*Object.entries(retrievedTimeStamps).forEach((entry) => {
            const [key, value] = entry;
            console.log(`${key} : ${JSON.stringify(value)}`);
            if (key == childData._id)
        })*/
        
        setLatestNodeInfo(retrievedTimeStamps[childData._id]);
        setTimelineData(t);
    }

    /* ================================== RENDER OF MAIN HOME FRAME ================================== */
    return totalData.length ? (
        <>
            <div className="application">
                <Helmet>
                    <style>{'body { background-color: #45433e}'}</style>
                </Helmet>
            </div>

            <View style={styles.topContainer}>
                <View style={styles.leftSquare}>
                    {
                        (() => {
                            if (retrieved != null) {
                                if (retrieved.gateway == false && latestNodeInfo != null) {
                                    return (<div>
                                        <div style={styles.title}>
                                            <h2>{("Node-") + retrieved._id }</h2>
                                        </div>
                                        <div style={styles.subInfo}>
                                            <ul>
                                                <li>{"Location: (" + (retrieved.location.longitude).toFixed(2) + ", " + (retrieved.location.latitude).toFixed(2) + ")"}</li>
                                                <li>{"Temp: " + (latestNodeInfo.temp).toFixed(2)}</li>
                                                <li>{"Humidity: " + (latestNodeInfo.humidity).toFixed(2)}</li>
                                                <li>{"Smoke Level: " + (latestNodeInfo.smokeLevel).toFixed(2)}</li>
                                                <li>{"Updated At: " + moment(new Date(retrieved.lastPing)).format('MMMM Do YYYY, h:mm:ss a')}</li>
                                            </ul>
                                        </div>
                                    </div>)
                                } else if (retrieved.gateway == true) {
                                    return (<div>
                                        <div style={styles.title}>
                                            <h2>{("Gateway-") + retrieved._id }</h2>
                                        </div>
                                        <div style={styles.subInfo}>
                                            <ul>
                                                <li>{"Location: (" + (retrieved.location.longitude).toFixed(2) + ", " + (retrieved.location.latitude).toFixed(2) + ")"}</li>
                                                <li>{"Updated At: " + moment(new Date(retrieved.lastPing)).format('MMMM Do YYYY, h:mm:ss a')}</li>
                                            </ul>
                                        </div>
                                    </div>)
                                }
                            }
                        })()
                        
                    }
                </View>
                <View style={styles.rightSquare}> 
                    <Map data = {totalData} parentCallback = {handleCallback}/>
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.rectangle}>
                    {
                        (retrieved != null) ? (
                            <div style={styles.subInfo}>
                                <br /> 
                                <ul>
                                    <li>
                                        <p></p>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div style={styles.subInfo}>
                                <br /> 
                                <ul>
                                    <li>
                                        <h4>Select node. </h4>
                                    </li>
                                </ul>
                            </div>
                        )
                    }
                </View>
            </View>
            
        </>
    ) : (
        <div>Loading data...</div>
    )
};

const styles = StyleSheet.create({
    text : {

    },
    topContainer: {
      flex: 1,
      alignItems: "stretch",
      justifyContent: "center",
      flexDirection: "row"
    },
    bottomContainer: {
        flex: 1,
        alignItems: "stretch", 
        justifyContent: "center", 
        flexDirection: "column"
    },
    leftSquare: {
        backgroundColor: "#292b26",
        width: "39%",
        height: "50vh",
        marginRight: "0.5%",
        marginLeft: "0.5%",
        marginTop: "0.5%",
        borderRadius: 10,
        display: "inline-block",
        
    },
    rightSquare: {
        backgroundColor: "#292b26",
        width: "59%",
        height: "50vh",
        marginLeft: "0.5%",
        marginRight: "0.5%",
        marginTop: "0.5%",
        borderRadius: 10,
        display: "inline-block"
    },
    rectangle: {
        backgroundColor: "#292b26",
        width: "auto",
        height: "40vh",
        marginTop: "0.5%",
        marginLeft: "0.5%",
        marginRight: "0.5%",
        borderRadius: 10,
        display: "inline-block",
        position: "relative"
    },
    title: {
        //textAlign: "center",
        marginLeft: "10px",
        color: "#3497e3"
    },
    subInfo: {
        color: "#dee0e3"
    }
  });

export default Home;