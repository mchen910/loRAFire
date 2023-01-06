var { body, validationResult } = require('express-validator');
var { query } = require('express-validator/check')

var Node = require('../models/node');
var History = require('../models/history');

// GET request for a list of nodes
exports.history_index = [
    // Check query parameters for beginning and ending timestamps
    query('start')
        .optional()
        .isInt({ gt: 1e13 })
        .withMessage('Invalid start timestamp'),
    query('end')
        .optional()
        .isInt({ gt: 1e13 })
        .withMessage('Invalid end timestamp'),
    query('humidity')
        .exists()
        .isBoolean()
        .withMessage('Missing humidity indication (true/false)'),
    query('smoke')
        .exists()
        .isBoolean()
        .withMessage('Missing smoke indication (true/false)'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            });
            return;
        }


        if (req.query.start === undefined) {
            req.query.start = new Date(2001, 9, 10, 0, 0, 0, 0);
        }
        if (req.query.end === undefined) {
            req.query.end = Date.now()
        }

        // Check if end date is before start date
        if (req.query.end < req.query.start) {
            var err = new Error('end timestamp before start timestamp');
            err.status = 400;
            return next(err);
        }

        // req.query.start/end are in milliseconds
        let start = new Date(req.query.start).toISOString();
        let end = new Date(req.query.end).toISOString();

        History.find({ 'timestamp': { $gte: start, $lt: end } })
            .exec(function (err, results) {
                if (err) {
                    return next(err);
                }

                res.status(200).json({ results });
            })
    }

];

// POST request for creating a new history entry
exports.history_create = [
    body('nodeID')
        .isMongoId()
        .withMessage('Invalid node ID'),
    body('humidSensor.battery')
        .isFloat({min: 0, max: 1})
        .withMessage('Invalid humidity sensor battery percentage'),
    body('humidSensor.humidity')
        .isFloat({min: 0, max: 1})
        .withMessage('Invalid humidity percentage'),
    body('smokeSensor.battery')
        .isFloat({min: 0, max: 1})
        .withMessage('Invalid smoke sensor battery percentage'),
    body('smokeSensor.battery')
        .isFloat({min: 0})
        .withMessage('Invalid smoke reading'),

    (req, res, next) => {
        // Extract errors
        const errors = validationResult(req);

        var history = new History({
            nodeID: req.params.nodeID,
            humidSensor: req.params.humidSensor,
            smokeSensor: req.params.smokeSensor
        });

        if (!errors.isEmpty()) {
            res.status(422).json({
                errors: errors.array()
            });
            return;

        } else {
            history.save(function (err) {
                if (err) {
                    return next(err);
                }
            })
        }
    }
]

// DELETE request for deleting an existing history entry
exports.history_destroy = [
    // Check query params
    query('start')
        .optional()
        .isInt({ gt: 1e13 })
        .withMessage('Invalid start timestamp'),
    query('end')
        .optional()
        .isInt({ gt: 1e13 })
        .withMessage('Invalid end timestamp'),

    (req, res, next) => {
        // Extract errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({
                errors: errors.array()
            });
            return;

        } else {
            const node = Node.findById(req.params.id);
            if (!node) {
                var err = new Error('Node not found');
                err.status = 400;
                return next(err);
            }

            // Check for valid timestamps
            if (start === undefined || end === undefined) {
                History.deleteMany({nodeID: req.params.id})
                res.status(200);
                return;

            } else {
                if (start > end) {
                    var err = new Error('Invalid timestammps');
                    err.status = 400;
                    return next(err);
                }

                History.deleteMany({"timestamp": {$gte: start, $lt: end}}, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.status(204);
                });

            }
        }
    }
]

// GET request for the history of a node by its id
exports.history_show = (req, res, next) => {
    History.find({ 'nodeID': req.params.id })
        .sort([['timestamp', 'ascending']])
        .exec(function (err, histories) {
            if (err) {
                return next(err);
            }

            res.status(200).json(histories);
        })
};

// No reason to implement a PUT request
exports.history_update = (req, res, next) => {
    // Return 501 Not Implemented
    res.status(501)
}

