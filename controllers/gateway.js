var { body, validationResult } = require('express-validator');

var Node = require('../models/node');
var Gateway = require('../models/gateway');


// GET request for a list of gateways
exports.gateway_index = (req, res, next) => {
    Gateway.find(function (err, gatewayList) {
        if (err) {
            next(err);
            return;
        }

        res.status(200).json(gatewayList);
    })
};

// GET request for a gateway by its id
exports.gateway_show = (req, res, next) => {
    const gateway = Gateway.findById(req.params.id);

    if (!gateway) {
        var err = new Error("Invalid gateway ID");
        err.status = 400;
        return next(err);
    }

    // Valid gateway, get all the connecting nodes
    var nodes = {};
    gateway.nodes.forEach(element => {
        Node.findById(element, function(err) {
            if (err) {
                return next(err);
            }

            var node = {
                online: node.online,
                location: node.location,
                hSensorID: node.hSensorID,
                sSensorID: node.sSensorID
            };

            nodes[element] = node;
        })
    });

    res.status(200).json({
        _id: gateway._id,
        location: gateway.location,
        online: gateway.online,
        nodes: nodes
    });
};

// POST request for creating a new gateway entry
exports.gateway_create = [
    body('location.latitude')
        .isFloat({ min: -180.0, max: 180.0 })
        .withMessage('Invalid latitude'),
    body('location.longitude')
        .isFloat({ min: -180.0, max: 180.0 })
        .withMessage('Invalid longitude'),
    body('online')
        .isBoolean()
        .withMessage('Not a boolean value'),
    body('nodes')
        .isArray()
        .withMessage('Invalid array of node IDs'),
    body('nodes.*')
        .exists()
        .isMongoId()
        .withMessage('Invalid node ID'),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({
                errors: errors.array()
            })
            return;

        } else {
            // Check if the node IDs exist
            req.body.nodes.forEach(nodeID => {
                Node.findById(nodeID, function(err) {
                    if (err) {
                        var e = new Error('Invalid node ID');
                        e.status = 422;
                        next(e);
                        return;
                    }
                })
            });

            // Create the gateway
            var gateway = new Gateway({
                location: req.body.location,
                online: req.body.online,
                nodes: req.body.nodes
            });

            gateway.save(function (err) {
                if (err) {
                    next(err);
                    return;
                }
            })
        }
    }
]

// DELETE request for deleting an existing gateway
exports.gateway_destroy = (req, res, next) => {
    // When a gateway is deleted, the node must either route its data through 
    // another gateway or go offline for the time being. It's up to the user to 
    // update the gateway that the node should connect to.
    const gateway = Gateway.findById(req.params.id);

    if (!gateway) {
        var err = new Error("Invalid gateway ID");
        err.status = 400;
        return next(err);
    }

    // Get nodes that used to connect and update
    let nodes = gateway.nodes;
    nodes.forEach(nodeID => {
        Node.findByIdAndUpdate(
            nodeID, 
            { 
                online: false,
                gateway: undefined 
            }, // change online status and gateway

            function (err, _node) {
                if (err) {
                    return next(err);
                }
            }
        )
    });
    
    // Finally delete the gateway
    Gateway.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return next(err);
        }

        return res.status(204);
    })
}

// UPDATE request for updating a gateway
exports.gateway_update = [
    body('location.latitude')
        .exists()
        .isFloat({ min: -180.0, max: 180.0 })
        .withMessage('Invalid latitude'),
    body('location.longitude')
        .exists()
        .isFloat({ min: -180.0, max: 180.0 })
        .withMessage('Invalid longitude'),
    body('online')
        .exists()
        .isBoolean()
        .withMessage('Not a boolean value'),
    body('nodes')
        .isArray()
        .withMessage('Invalid array of node IDs'),
    body('nodes.*')
        .exists()
        .isMongoId()
        .withMessage('Invalid node ID'),
    
    (req, res, next) => {
        const errors = validationResult(req);

        var gateway = new Gateway({
            location: req.body.location,
            online: req.body.online,
            nodes: req.body.nodes
        });

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        
        } else {
            // If the gateway is offline, there should be no nodes connected
            if (gateway.nodes.length != 0) {
                var err = new Error("Gateway offline, but nodes are still connected");
                err.status = 422;
                return next(err);
            }

            Gateway.findByIdAndUpdate(
                req.params.id,
                gateway,
                {},
                function (err, _gateway) {
                    if (err) {
                        return next(err);
                    }

                    // redirect??
                    res.redirect(_gateway.url);
                }
            );
        }
    }
]


// TODO: add a patch route?
