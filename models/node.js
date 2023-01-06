const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Types = mongoose.Types;

const NodeSchema = new Schema({
    // There is no N/S, W/E, just positive and negative values
    location: {
        latitude: Number,
        longitude: Number,
    },

    online: { type: Boolean, default: true },

    gatewayID: { type: Types.ObjectId },
    hSensorID: { type: Types.ObjectId },
    sSensorID: { type: Types.ObjectId }
},

    { versionKey: false }
)


module.exports = mongoose.model('Node', NodeSchema)