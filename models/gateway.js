const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Types = mongoose.Types;

const GatewaySchema = new Schema({
    name: { 
        type: String, 
        minLength: 5, 
        maxLength: 30, 
    },
    location: {
        latitude: Number,
        longitude: Number,
    },
    online: { type: Boolean, default: true },
    nodes: [{type: Types.ObjectId, ref: 'Node'}]
},
    { versionKey: false }
);

module.exports = mongoose.model('Gateway', GatewaySchema);