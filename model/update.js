const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    nodeID: mongoose.Types.ObjectId,
    time: Date,
    hValue: Number,
    sValue: Number
})

module.exports = mongoose.model('Data', dataSchema)