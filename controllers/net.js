var { body, validationResult } = require('express-validator');

var Node = require('../models/node');
var Gateway = require('../models/gateway');

// Handle a data packet post
exports.data_post = (req, res, next) => {
    // Create & set history
    // Update last ping time
};

// Handles a node adjacency packet post
exports.node_adjacency_post = (req, res, next) => {
    // Set adjacency list of node
    // Set last ping time
};

// Handles a gateway adjacency packet post
exports.gateway_adjacency_post = (req, res, next) => {
    // Set adjacency list of node
    // Set last ping time
};