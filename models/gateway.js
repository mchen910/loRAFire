const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Types = mongoose.Types;

const GatewaySchema = new Schema({
    _id: Number,
    location: {
        latitude: Number,
        longitude: Number,
    },    
    lastPing: { type: Date, default: Date.now },
    adjacencies: [{type: Number}]
},
    { versionKey: false }
);

module.exports = mongoose.model('Gateway', GatewaySchema);