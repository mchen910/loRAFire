const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    nodeID: mongoose.Types.ObjectId,
    time: Date,
    location: {
        latitude: Number,
        longitude: Number
    },
    batteryLevel: Number,
    gatewayID: mongoose.Types.ObjectId,
    hSensorID: mongoose.Types.ObjectId,
    sSensorID: mongoose.Types.ObjectId
})

module.exports = mongoose.model('Data', dataSchema)