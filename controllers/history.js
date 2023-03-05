var { param, query, validationResult } = require('express-validator');

var Node = require('../models/node');
var History = require('../models/history');

// ======= Routes ======
// GET <nodeID> <start (def=now-1week)> <end (def=now)>: Gets the histories in the specified interval of the given node
// GET <cutoff (def=now)>: Gets, for each node, the most recent history prior to the cutoff time. Returns object where obj[id] = history 

// ===== Private Functions ===== 
// delete (cutoff): Deletes all histories before cutoff time
// put (id, time, temp, humidity): PUTs new history instance, sets last ping of node


// GET <nodeID> <start (def=now-1week)> <end (def=now)>: Gets the histories in the specified interval of the given node
exports.get_by_node = [
    // Check query parameters for beginning and ending timestamps
    param("id")
        .exists()
        .isInt()
        .withMessage("Invalid node ID"),
    query('start')
        .optional()
        .isInt()
        .withMessage('Invalid start timestamp'),
    query('end')
        .optional()
        .isInt()
        .withMessage('Invalid end timestamp'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        if (req.query.start === undefined) 
            req.query.start = Date.now() - 6.048e8;
            
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

        console.log(req.params.id);
        console.log(new Date(req.query.start).toString());
        console.log(new Date(req.query.end).toString());

        History.find({srcID: req.params.id, time: { $gte: new Date(start), $lt: new Date(end)} })
            .exec( (err, results) => err? next(err) : res.status(200).json({ results }) );
    }
];

// GET <cutoff (def=now)>: Gets, for each node, the most recent history prior to the cutoff time. Returns object where obj[id] = history 
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

        History.find({ 'timestamp': { $lt: cutoff } }).exec( (err, results) => {
            if (err) 
                return next(err);
            const out = {};
            for (const i of results) {
                if (!(i.srcID in out) || out[i.srcID].createdAt < i.createdAt) {
                    out[i.srcID] = i;
                } 
            }
            res.status(200).json(out);
        });
    }
];


// ======= Private Functions ===== 

// delete (cutoff): Deletes all histories before cutoff time
exports.delete = cutoff => {
    let millis = new Date(parseInt(cutoff));
    
    History.deleteMany({"timestamp": {$lt: millis}}, err => {
        if (err) console.log(err);
    });
}

// put (id, time, temp, humidity): PUTs new history instance, sets last ping of node
exports.put = (id, time, temp, humidity) => {
    console.log("History PUT");
    if (!id) {
        console.log("no ID provided.");
        return;
    }

    // Set last ping
    Node.findByIdAndUpdate(
        id,
        {lastPing: time},
        {},
        (err, res) => {
            if (err) 
                console.error(`cannot find node '${id}' to update last ping`);
        }
    )
    // PUT history
    var history = new History({
        srcID: id,
        temp: temp,
        humidity: humidity,
    });

    history.save(err => {
        if (err) 
            return next(err);
    });
}