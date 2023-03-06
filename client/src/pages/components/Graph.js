import React, { useState, useEffect, useDebugValue } from 'react';
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import moment from 'moment';

function Graph(props) {
    const [data, setData] = useState([]);
    const [node, setNode] = useState();

    useEffect(() => {
        fetch(`http://localhost:5000/api/history/${props.nodeID}`).then(
            res => res.json()
        ).then(
            resJson => setData(resJson.results)
        )
    }, [props.nodeID])

    useEffect(() => {
        fetch("http://localhost:5000/api/history").then(
            res => res.json()
        ).then(
            resJson => setNode(resJson[props.nodeID])
        )
    }, [props.nodeID])

    const customSort = (a, b) => {return new Date(a.time).getTime() - new Date(b.time).getTime()}
    data.sort(customSort);

    let i = 0;

    const CustomTooltip = (value) => {
        const idx = value["label"];
        console.log(idx);
        i++;
        if (data[idx] === undefined) {
            return null;
        } else {
            console.log(data[idx]);
            return (
                <div style={{color: "#e6d7d5", backgroundColor: "#45433e", margin: "5%"}}>
                    <ul>
                        <li>{"Temp: " + (data[idx].temp).toFixed(2)}</li>
                        <li>{"Humidity: " + (data[idx].humidity).toFixed(2)}</li>
                        <li>{"Smoke Level: " + (data[idx].smokeLevel).toFixed(2)}</li>
                        <li>{"Time Stamp: " + moment(new Date(data[idx].time)).format('MMMM Do YYYY, h:mm:ss a')}</li>
                    </ul>
                </div>
            ); 
        }
    };

    if (node != null){
        return (
            <div style={{margin: "auto 0"}}>
                <ResponsiveContainer width="100%" aspect={5}>
                    <LineChart data={data} margin={{left: -55, bottom: 40, top: 10, right: 5}}>
                        <Line type="monotone" dataKey={props.value} stroke={props.offline ? "#a83232": "#32a852"} />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis tick={false} />
                        <YAxis dataKey={props.value}/>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

export default Graph;