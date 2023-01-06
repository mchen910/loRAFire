const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Types = mongoose.Types;

const HistorySchema = new Schema({
    nodeID: Types.ObjectId,
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
        timestamps: true,
        versionKey: false
    },
);

module.exports = mongoose.model('History', HistorySchema)