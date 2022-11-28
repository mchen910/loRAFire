const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    nodeID: mongoose.Types.ObjectId,
    time: Date,
    hValue: Number,
    sValue: Number
})

module.exports = mongoose.model('Update', dataSchema)