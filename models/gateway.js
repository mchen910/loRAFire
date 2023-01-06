const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Types = mongoose.Types;

const GatewaySchema = new Schema({
    location: {
        latitude: Number,
        longitude: Number,
    },
    
    online: { type: Boolean, default: true },
    nodes: [{type: Types.ObjectId}]
},
    { versionKey: false }
);

module.exports = mongoose.model('Gateway', GatewaySchema);