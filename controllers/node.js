var { body, validationResult } = require('express-validator');

var Node = require('../models/node');
var Gateway = require('../models/gateway');

// GET request for a list of nodes
exports.node_index = (req, res, next) => {
    Node.find(function (err, nodeList) {
        if (err) {
            return next(err);
        }

        return res.status(200).json(nodeList);
    })
};

// GET request for a node by its id
exports.node_show = (req, res, next) => {
    const node = Node.findById(req.params.id);
    const gateway = Gateway.findById(node.gatewayID);

    if (!node) {
        var err = new Error("Node not found");
        err.status = 400;
        return next(err);
    }
    if (!gateway) {
        var err = new Error("Invalid gateway ID");
        err.status = 400;
        return next(err);
    }

    res.status(200).json({
        _id: node._id,
        online: node.online,
        location: node.location,
        gateway: {
            location: gateway.location,
            online: gateway.online
        }
    });
};

// POST request for creating a new node entry
exports.node_create = [
    body('location.latitude')
        .isFloat({ min: -180.0, max: 180.0 })
        .withMessage('Invalid latitude'),
    body('location.longitude')
        .isFloat({ min: -180.0, max: 180.0 })
        .withMessage('Invalid longitude'),
    body('online')
        .isBoolean()
        .withMessage('Not a boolean value'),
    body('gatewayID')
        .isMongoId()
        .withMessage('Invalid gateway ID'),
    body('hSensorID')
        .optional()
        .isMongoId()
        .withMessage('Invalid gateway ID'),
    body('sSensorID')
        .optional()
        .isMongoId()
        .withMessage('Invalid gateway ID'),

    (req, res, next) => {
        // Extract errors
        const errors = validationResult(req);

        var node = new Node({
            location: req.body.location,
            online: req.body.online,
            gatewayID: req.body.gatewayID,
            hSensorID: req.body.hSensorID,
            sSensorID: req.body.sSensorID
        });

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });

        } else {
            node.save(function (err) {
                if (err) {
                    return next(err);
                }
            });
        }
    }
]

// UPDATE request for updating a node
exports.node_update = [
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
    body('gatewayID')
        .exists()
        .isMongoId()
        .withMessage('Invalid gateway ID'),
    body('hSensorID')
        .optional()
        .isMongoId()
        .withMessage('Invalid gateway ID'),
    body('sSensorID')
        .optional()
        .isMongoId()
        .withMessage('Invalid gateway ID'),

    (req, res, next) => {
        const errors = validationResult(req);

        var node = new Node({
            location: req.body.location,
            online: req.body.online,
            gatewayID: req.body.gatewayID,
            hSensorID: req.body.hSensorID,
            sSensorID: req.body.sSensorID
        });

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });

        } else {
            Node.findByIdAndUpdate(
                req.params.id,
                node,
                {},
                function (err, _node) {
                    if (err) {
                        return next(err);
                    }

                    // redirect??
                    res.redirect(_node.url)
                }
            );
        }
    }
]

// DELETE request for deleting an existing node
exports.node_destroy = (req, res, next) => {
    const node = Node.findById(req.params.id);
    var gateway = Gateway.findById(node.gatewayID);

    if (!node) {
        var err = new Error("Node not found");
        err.status = 404;
        return next(err);
    }
    if (!gateway) {
        var err = new Error("Invalid gateway ID");
        err.status = 400;
        return next(err);
    }

    // Delete the node from the gateway's list of nodes
    let idx = gateway.nodes.indexOf(node);
    gateway.nodes.splice(idx, 1);

    // Finally delete the node
    Node.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            return next(err);
        }

        return res.status(204);
    });
}
