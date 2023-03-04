import React, { useEffect, useState } from 'react';
import {StyleSheet, View} from 'react-native';
import {Helmet} from 'react-helmet';
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

    //console.log(nodeData);

    const handleCallback = (childData) =>{
        this.setState({name: childData})
        console.log(JSON.stringify(childData));
    }

    return nodeData.length ? (
        <>
            <div className="application">
                <Helmet>
                    <style>{'body { background-color: #45433e}'}</style>
                </Helmet>
            </div>

            <View style={styles.topContainer}>
                <View style={styles.leftSquare}>
                    
                </View>
                <View style={styles.rightSquare}> 
                    <Map nodeData = {nodeData} parentCallback = {handleCallback}/>
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.rectangle}>

                </View>
            </View>
            
        </>
    ) : (
        <div>Loading data...</div>
    )
};

const styles = StyleSheet.create({
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
        width: "49%",
        height: "50vh",
        marginRight: "0.5%",
        marginLeft: "0.5%",
        marginTop: "0.5%",
        borderRadius: 10,
        display: "inline-block"
    },
    rightSquare: {
        backgroundColor: "#292b26",
        width: "49%",
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
    }
  });

export default Home;