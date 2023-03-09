import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

function RiskAlert(props) {
    
    const [show, setShow] = useState(true);

    if (show) {
        if (props.node.gateway == false) {
            return (
                <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>ALERT: NODE {props.node._id} AT RISK!</Alert.Heading>
                    <ul>
                        <li>{"Location: (" + (props.node.location.longitude).toFixed(2) + ", " + (props.node.location.latitude).toFixed(2) + ")"}</li>
                        <li>{"Last Updated At: " + moment(new Date(props.node.lastPing)).format('MMMM Do YYYY, h:mm:ss a')}</li>
                        <li>{"Risk Level: " + (props.node.analysis.riskLvl).toFixed(3)}</li>
                    </ul>
                </Alert>
            )
        } else {
            return (
                <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>ALERT: GATEWAY {props.node._id} AT RISK!</Alert.Heading>
                    <ul>
                        <li>{"Location: (" + (props.node.location.longitude).toFixed(2) + ", " + (props.node.location.latitude).toFixed(2) + ")"}</li>
                        <li>{"Last Updated At: " + moment(new Date(props.node.lastPing)).format('MMMM Do YYYY, h:mm:ss a')}</li>
                        <li>{"Risk Level: " + (props.node.analysis.riskLvl).toFixed(3)}</li>
                    </ul>
                </Alert>
            )
        }
    }
}

export default RiskAlert;