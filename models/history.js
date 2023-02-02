const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Types = mongoose.Types;

const HistorySchema = new Schema({
    srcID: Number,
    humidSensor: {
        temp: Number,
        humidity: Number,
    },
    smokeSensor: {
        smokeLevel: Number,
    }
},
    {
        timestamps: true,
        versionKey: false
    },
);

module.exports = mongoose.model('History', HistorySchema)