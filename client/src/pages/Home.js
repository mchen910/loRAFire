import React, { useEffect, useState } from 'react';
import {StyleSheet, View} from 'react-native';
import {Helmet} from 'react-helmet';
import moment from 'moment';


import Map from "./components/Map";


function Home() {

    const [nodeData, setNodeData] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/nodes").then(
          response => response.json()
        ).then(
          data => setNodeData(data)
        )
      }, []);

    const [gateData, setGateData] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/gateways").then(
            response => response.json()
          ).then(
            data => setGateData(data)
          )
    }, [])

    let totalData = gateData.concat(nodeData);

    const [retrieved, setRetrieved] = useState();
    const [retrievedTimeStamps, setRetrievedTimeStamps] = useState([]);
    
    const handleCallback = (childData) =>{
        setRetrieved(childData);
        console.log(JSON.stringify(retrieved));

    }

    return totalData.length == 26 ? (
        <>
            <div className="application">
                <Helmet>
                    <style>{'body { background-color: #45433e}'}</style>
                </Helmet>
            </div>

            <View style={styles.topContainer}>
                <View style={styles.leftSquare}>
                    {
                        (retrieved != null) ? (
                        <div>
                            <div style={styles.title}>
                                <h2>{((retrieved.gateway == true) ? "Gateway-" : "Node-") + retrieved._id }</h2>
                            </div>
                            <div style={styles.subInfo}>
                                <ul>
                                    <li>
                                        <h4>{"Location: (" + (retrieved.location.longitude).toFixed(2) + ", " + (retrieved.location.latitude).toFixed(2) + ")"}</h4>
                                    </li>
                                </ul>
                            </div>
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