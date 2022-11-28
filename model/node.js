const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    nodeID: mongoose.Types.ObjectId,
    time:{
        type: Date,
        default: Date.now()
    },
    location: {
        latitude: mongoose.Types.Decimal128,
        longitude: Number
    },
    batteryLevel: Number,

    gatewayID: mongoose.Types.ObjectId,
    hSensorID: mongoose.Types.ObjectId,
    sSensorID: mongoose.Types.ObjectId
})

module.exports = mongoose.model('Node', dataSchema)