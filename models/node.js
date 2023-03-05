const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Types = mongoose.Types;

const NodeSchema = new Schema({
    _id: Number,
    gateway: { type: Boolean, default: false },
    lastPacketID: { type: Number, default: -1 },
    location: {
        latitude: Number,
        longitude: Number,
    },
    lastPing: { type: Date, default: Date.now },
    adjacencies: [{type: Number}],
    gateway: Boolean
},
    { versionKey: false }
);

module.exports = mongoose.model('Node', NodeSchema)
