const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Types = mongoose.Types;

const GatewaySchema = new Schema({
    name: { 
        type: String, 
        minLength: 7, 
        maxLength: 40, 
    },
    location: {
        latitude: Types.Decimal128,
        longitude: Types.Decimal128,
    },
    online: { type: Boolean, default: true },
    nodes: [{type: Types.ObjectId, ref: 'Node'}]
});

module.exports = mongoose.model('Gateway', GatewaySchema);