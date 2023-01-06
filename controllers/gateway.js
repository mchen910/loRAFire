var { body, validationResult } = require('express-validator');

var Node = require('../models/node');
var Gateway = require('../models/gateway');

// GET request for a list of gateways
exports.GET_gatewayList = (req, res, next) => {
    res.send('not implemented yet, returns list of gateways');
};

// GET request for a gateway by its id
exports.GET_gatewayID = (req, res) => {
    res.send('not implemented yet, returns a gateway from id');
};

// POST request for creating a new gateway entry
exports.POST_gateway = (req, res) => {
    res.send('not implemented yet, add a new gateway');
}

// DELETE request for deleting an existing gateway
exports.DELETE_gateway = (req, res) => {
    res.send('not implemented yet, delete a gateway');
}

// UPDATE request for updating a gateway
exports.PUT_gateway = (req, res) => {
    res.send('not implemented yet, update a gateway')
}