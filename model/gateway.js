const mongoose = require('mongoose');
const { Types } = mongoose

const dataSchema = new mongoose.Schema({
    gatewayID: Types.ObjectId,
    location: {
        latitude: Types.Decimal128,
        longitude: Number
    },
    batteryLevel: Number,
    online: Boolean
})

module.exports = mongoose.model('Data', dataSchema)