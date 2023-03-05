const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Types = mongoose.Types;

const HistorySchema = new Schema({
    srcID: Number,
    temp: Number,
    humidity: Number,
    smokeLevel: Number,
    time: Date,
},
    {
        versionKey: false
    },
);

module.exports = mongoose.model('History', HistorySchema)