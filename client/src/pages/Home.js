import React, { useEffect, useState } from 'react';
import {StyleSheet, View} from 'react-native';
import {Helmet} from 'react-helmet';
import moment from 'moment';
import HorizontalTimeline from 'react-horizontal-timeline';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Map from "./components/Map";

function Home() {

    /* ================================== HANDLING PASSBACK OF SELECTED CHILD MARKER =================================== */
    
    const [timelineData, setTimelineData] = useState({});
    const [retrieved, setRetrieved] = useState();
    const [gateData, setGateData] = useState([]);
    const [nodeData, setNodeData] = useState([]);
    const [latestNodeInfo, setLatestNodeInfo] = useState({});
    const [retrievedTimeStamps, setRetrievedTimeStamps] = useState([]);
    const [value, setValue] = useState('');

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

    function calcOffline(timeStamp) {
        const timeIntervalLockout = 180;
        const currDate = new Date(moment().toISOString());
        const timeDate = new Date(timeStamp);
        //console.log(currDate, timeDate);
        let minutes = (currDate - timeDate) / (1000 * 60);
        return minutes > timeIntervalLockout;
    }

    const handleSelect = (e) => {
        console.log(e);
        setValue(e);
    }


    useEffect(() => {
        fetch("http://localhost:5000/api/history/").then(
            response => response.json()
        ).then(
            data => setRetrievedTimeStamps(data)
        )
    }, []);

    const totalData = gateData.concat(nodeData);

    const handleCallback = (childData) =>{
        setRetrieved(childData);
        console.log(timelineData);

        fetch(`http://localhost:5000/api/history/${childData._id}`).then(
            (response) => response.json() 
        ).then(
            data => setTimelineData(data)
        );
        setLatestNodeInfo(retrievedTimeStamps[childData._id]);
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
                                        <div style={(calcOffline(retrieved.lastPing)) ? styles.offlineTitle : styles.onlineTitle}>
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
                                } else {
                                    return (<div>
                                        <div style={(calcOffline(retrieved.lastPing)) ? styles.offlineTitle : styles.onlineTitle}>
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
                    (() => {
                        if (retrieved != null && !retrieved.gateway && latestNodeInfo != null)
                        return (
                            <>
                                <div>
                                    <h4 style={{textAlign:"center", color: "#e6d7d5"}}>Timeline</h4>
                                </div>
                                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                        <DropdownButton id='dropdown-variants-secondary' variant='secondary' title="Select Graphs" onSelect={handleSelect}> 
                                            <Dropdown.Item eventKey="temp">Temperature</Dropdown.Item>
                                            <Dropdown.Item eventKey="humidity">Humidity</Dropdown.Item>
                                            <Dropdown.Item eventKey="smokeLevel">Smoke Level</Dropdown.Item>
                                        </DropdownButton>
                                </div>
                                <div>
                                    <p style={styles.subInfo}>
                                        I selected {value} on node {retrieved._id}
                                    </p>
                                </div>
                            </>
                        )
                    })()
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
    onlineTitle: {
        //textAlign: "center",
        marginLeft: "10px",
        color: "#32a852"
    },
    offlineTitle: {
        marginLeft: "10px",
        color: "#a83232"
    },
    rootDiv: {
        marginTop: "50px" 
    },
    subInfo: {
        color: "#e6d7d5"
    }
    });

export default Home;