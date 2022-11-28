const mongoose = require('mongoose');
const { Types } = mongoose

const dataSchema = new mongoose.Schema({
    nodeID: Types.ObjectId,
    time:{
        type: Date,
        default: Date.now()
    },
    location: {
        latitude: Types.Decimal128,
        longitude: Number
    },
    batteryLevel: Number,

    gatewayID: Types.ObjectId,
    hSensorID: Types.ObjectId,
    sSensorID: Types.ObjectId
})

module.exports = mongoose.model('Data', dataSchema)