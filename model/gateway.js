const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    gatewayID: mongoose.Types.ObjectId,
    location: {
        latitude: mongoose.Types.Decimal128,
        longitude: Number
    },
    batteryLevel: Number,
    online: Boolean
})

module.exports = mongoose.model('Gateway', dataSchema)