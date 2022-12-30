const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Types = mongoose.Types;

const HistorySchema = new Schema({
    nodeID: { type: String, ref: 'Node', required: true },
    humidSensor: {
        battery: Number,
        humidity: Number,
    },
    smokeSensor: {
        battery: Number,
        smokeLevel: Number,
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('History', HistorySchema)