var { body, query, validationResult } = require('express-validator');

var Node = require('../models/node');
var Gateway = require('../models/gateway');

/* ========= INDEX ========= */
// PUT => Make new gateway
// DELETE <id> => Delete gateway with <id> 
// POST <id> <(opt) lastPing> <(opt) adj> => Updates gateway with <id> with the optional params

// GET => Get all gateways
// GET <id> => Get gateway with <id>

// PUT request for creating a new node entry
exports.put = [
    query('id')
        .exists()
        .isInt()
        .withMessage('Invalid ID'),
    query('latitude')
        .exists()
        .isFloat({ min: -180.0, max: 180.0 })
        .withMessage('Invalid latitude'),
    query('longitude')
        .exists()
        .isFloat({ min: -180.0, max: 180.0 })
        .withMessage('Invalid longitude'),
    (req, res, next) => {
        console.log("Gateway PUT req, query: ", req.query);
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(422).json({
                errors: errors.array()
            });

        const gateway = new Gateway({
            _id: req.query.id,
            location: {
                latitude: req.query.latitude,
                longitude: req.query.longitude
            },
        });
        gateway.save( e => e ? next(e) : res.status(201).json(gateway) );
    }
];

// DELETE request for deleting an existing node
exports.delete = [
    query("id")
        .exists()
        .isInt()
        .withMessage("Invalid node ID"),
    (req, res, next) => { 
        console.log("Node DELETE: id: ", req.query.id);
        Gateway.findByIdAndDelete(req.query.id, e => {
            e ? next(e) : res.status(204)
        })
    }
];

// POST request for updating a node
exports.post = [
    query("id")
        .exists()
        .isInt()
        .withMessage("Invalid ID"),
    query("lastPing")
        .optional()
        .isInt()
        .withMessage("Invalid lastPing timestamp"),
    query('adj.*')
        .optional()
        .isInt()
        .withMessage('Invalid Adjacent ID'),
    (req, res, next) => {
        console.log("Gateway POST req, query: ", req.query);

        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422)
                .json({ errors: errors.array() });
        
        const gateway = new Gateway({
            lastPing: req.query.lastPing ? new Date(parseInt(req.query.lastPing)) : undefined,
            adjacencies:  req.query.adj,
        });
        Gateway.findByIdAndUpdate(
            req.query.id,
            gateway,
            {new: true},
            (err, _gateway) => {
                if (err) 
                    return next(err);
                return res.status(200).json(_gateway);
            }
        );
    }
];


// GET => Get all gateways
exports.get_all = (req, res, next) => {
    Gateway.find(function (err, gatewayList) {
        if (err) 
            return next(err);
        res.status(200).json(gatewayList);
    })
};

// GET <id> => Get gateway with <id>
exports.get = (req, res, next) => {
    const gateway = Gateway.findById(req.params.id);

    if (gateway === undefined) {
        var err = new Error(`None such gateway '${req.params.id}'`);
        err.status = 400;
        return next(err);
    }

    res.status(200).json({
        _id: gateway._id,
        location: gateway.location,
        lastPing: gateway.lastPing,
        nodes:  gateway.nodes
    });
};