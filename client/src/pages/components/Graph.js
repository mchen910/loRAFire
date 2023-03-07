import React, { useState, useEffect } from 'react';
import {AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area} from 'recharts';
import moment from 'moment';

const PORT = 8000;

function Graph(props) {
    const [data, setData] = useState([]);
    const [node, setNode] = useState();

    useEffect(() => {
        fetch(`http://localhost:${PORT}/api/history/${props.nodeID}`)
            .then(res => res.json())
            .then(resJson => setData(resJson.results))
    }, [props.nodeID])

    useEffect(() => {
        fetch(`http://localhost:${PORT}/api/history`)
            .then(res => res.json())
            .then(resJson => setNode(resJson[props.nodeID]))
    }, [props.nodeID])

    const customSort = (a, b) => {return new Date(a.time).getTime() - new Date(b.time).getTime()}
    data.sort(customSort);


    const CustomTooltip = (value) => {
        const idx = value["label"];
        console.log(idx);
        if (data[idx] === undefined) {
            return null;
        } else {
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

    if (node != null) {
        const color = props.offline ? "#a83232": "#32a852";
        return (
            <div style={{margin: "auto 0"}}>
                <ResponsiveContainer width="100%" aspect={5}>
                    <AreaChart data={data} margin={{left: 5, bottom: 50, top: 10, right: 20}}>
                        <defs>
                            <linearGradient id="color" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#ccc" strokeDasharray="3, 3"/>
                        <XAxis tick={true} label={{ value: 'Timestamp', }} />
                        <YAxis dataKey={props.value} label={{ value: 'Temperature', angle: '-90', offset: '-30'}}/>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                        <Area type='monotone' dataKey={props.value} stroke={color} fillOpacity={1} fill="url(#color)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

export default Graph;