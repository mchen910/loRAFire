var { query, validationResult } = require('express-validator');

var Node = require('../models/node');
var History = require('../models/history');

// ======= INDEX ======
// PUT <obj> => PUTs new history instance, sets last ping

// GET <nodeID> <start (def=now-1week)> <end (def=now)> => Gets the history in the specified interval of the given node
// GET <cutoff (def=now)> => gets, for each node, the most recent history prior to the cutoff time  

// ===== INTERNAL ==== 
// DELETE <cutoff> => Deletes all histories before cutoff time

// GET <nodeID> <start (def=now-1week)> <end (def=now)> => Gets the history in the specified interval of the given node
exports.get_by_node = [
    // Check query parameters for beginning and ending timestamps
    query("node")
        .exists()
        .isInt()
        .withMessage("No node ID supplied"),
    query('start')
        .optional()
        .isInt({ gt: 1e13 })
        .withMessage('Invalid start timestamp'),
    query('end')
        .optional()
        .isInt({ gt: 1e13 })
        .withMessage('Invalid end timestamp'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        if (req.query.start === undefined) 
            req.query.start = new Date(2001, 9, 10, 0, 0, 0, 0);
        
        if (req.query.end === undefined) 
            req.query.end = Date.now()
        

        // Check if end date is before start date
        if (req.query.end < req.query.start) {
            var err = new Error('end timestamp before start timestamp');
            err.status = 400;
            return next(err);
        }

        // req.query.start/end are in milliseconds
        let start = new Date(parseInt(req.query.start));
        let end = new Date(parseInt(req.query.end));

        History.find({nodeID: req.query.node, 'timestamp': { $gte: start, $lt: end } })
            .exec( (err, results) => err? next(err) : res.status(200).json({ results }) );
    }
];

// GET <cutoff (def=now)> => gets, for each node, the most recent history prior to the cutoff time  
exports.get_all = [
    query('cutoff')
        .optional()
        .isInt({ gt: 1e13 })
        .withMessage('Invalid start timestamp'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        if (req.query.cutoff === undefined) 
            req.query.end = Date.now()
        
        // req.query.start/end are in milliseconds
        let cutoff = new Date(parseInt(req.query.start));

        History.find({ 'timestamp': { $lt: cutoff } })
            .exec( (err, results) => err? next(err) : res.status(200).json({ results }) );
    }
];

// PUT request for creating a new history entry
exports.put = [
    query('node')
        .isInt()
        .withMessage('Invalid node ID'),
    query('humidSensor.temp')
        .isFloat({min: -30, max: 80})
        .withMessage('Invalid temperature'),
    query('humidSensor.humidity')
        .isFloat({min: 0, max: 100})
        .withMessage('Invalid humidity'),
    query('smokeSensor.smokeLevel')
        .isFloat({min: 0})
        .withMessage('Invalid smoke reading'),

    (req, res, next) => {
        console.log("History PUT req, query: ", req.query);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        // Set last ping
        Node.findByIdAndUpdate(
            req.query.node,
            {lastPing: time},
            {},
            (err, res) => {
                if (err) {
                    console.error("cannot find node to update last ping");
                    return next(err);
                }
            }
        )
        // PUT history
        var history = new History({
            nodeID: req.query.node,
            humidSensor: req.query.humidSensor,
            smokeSensor: req.query.smokeSensor
        });
        history.save(err => {
            if (err) 
                return next(err);
        });
    }
]
// GET request for the history of a node by its id
exports.history_show = (req, res, next) => {
    console.log("History GET id: ", req.query.id);
    History.find({ 'nodeID': req.query.id })
        .sort([['timestamp', 'ascending']])
        .exec((err, histories) => {
            if (err) 
                return next(err);
            res.status(200).json(histories);
        })
};


// ==INTERNAL== DELETE request for deleting an existing history entry
exports.delete = [
   query('cutoff')
        .exists()
        .isInt({ gt: 1e13 })
        .withMessage('Invalid cutoff timestamp'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        let cutoff = new Date(parseInt(req.query.start));
        
        History.deleteMany({"timestamp": {$lt: cutoff}}, function (err) {
            if (err) 
                return next(err);
            res.status(204);
        });
    }
];