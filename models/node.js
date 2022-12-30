const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Types = mongoose.Types;

const NodeSchema = new Schema({
    name: {
        type: String,
        minLength: 5,
        maxLength: 30, 
    },

    // There is no N/S, W/E, just positive and negative values
    location: {
        latitude: Types.Decimal128,
        longitude: Types.Decimal128,
    },

    online: { type: Boolean, default: true },

    gatewayID: { type: Types.ObjectId, ref: 'Gateway', required: true},
    hSensorID: { type: Types.ObjectId },
    sSensorID: { type: Types.ObjectId }
})


// // Virtual methods (getters for computed values)
// NodeSchema.virtual('url').get(function() {
//     return `/nodes/${this._id}`;
// });

// NodeSchema.virtual('location').get(function() {
//     let lat = this.location.latitude, lon = this.location.longitude;
//     lat += (lat > 0) ? "\u00b0N" : "\u00b0S";
//     lon += (lon > 0) ? "\u00b0E" : "\u00b0W";
//     return `${lat}, ${lon}`;
// })


module.exports = mongoose.model('Node', NodeSchema)