import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Helmet} from 'react-helmet';
import Map from "./components/Map";

function Home() {
return (
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
                    <Map />
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.rectangle}>

                </View>
            </View>
            
        </>
    )
};

const styles = StyleSheet.create({
    topContainer: {
      //backgroundColor: "#45433e",
      flex: 1,
      alignItems: "stretch", // ignore this - we'll come back to it
      justifyContent: "center", // ignore this - we'll come back to it
      flexDirection: "row"
    },
    bottomContainer: {
        //backgroundColor: "#45433e",
        flex: 1,
        alignItems: "stretch", // ignore this - we'll come back to it
        justifyContent: "center", // ignore this - we'll come back to it
        flexDirection: "column"
    },
    leftSquare: {
        backgroundColor: "#292b26",
        width: "29%",
        height: "50vh",
        marginRight: "0.5%",
        marginLeft: "0.5%",
        marginTop: "0.5%",
        borderRadius: 10,
        display: "inline-block"
    },
    rightSquare: {
        backgroundColor: "#292b26",
        width: "69%",
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