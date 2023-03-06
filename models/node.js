const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Types = mongoose.Types;

const NodeSchema = new Schema({
    _id: Number,
    location: {
        latitude: Number,
        longitude: Number,
    },
    lastPing: { type: Date, default: Date.now },
    latestPacketID: Types.ObjectId,
    adjacencies: [{ type: Number }],
    gateway: Boolean,

    analysis: {
        riskLvl: Number,
        dummy: Number
    }
},
    { versionKey: false }
);

module.exports = mongoose.model('Node', NodeSchema)