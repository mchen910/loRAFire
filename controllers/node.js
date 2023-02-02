const { query, validationResult } = require('express-validator');

const Node = require('../models/node');
const Gateway = require('../models/gateway');

// ========= INDEX ========= 
// PUT => Make new node 
// POST <id> <obj> => Updates node  with <id> according to the object 
// DELETE <id> => Delete node with <id> 

// GET => Get all nodes 
// GET <id> => Get node with <id>


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
        console.log("Node PUT req, query: ", req.query);
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(422).json({
                errors: errors.array()
            });

        const node = new Node({
            _id: req.query.id,
            location: {
                latitude: req.query.latitude,
                longitude: req.query.longitude
            },
        });
        node.save( err => err ? next(err) : res.status(201).json(node) );
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
        console.log("Node POST req, query: ", req.query);

        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422)
                .json({ errors: errors.array() });
        
        const node = new Node({
            lastPing: req.query.lastPing ? new Date(parseInt(req.query.lastPing)) : undefined,
            adjacencies:  req.query.adj,
        });
        Node.findByIdAndUpdate(
            req.query.id,
            node,
            {new: true},
            (err, _node) => {
                if (err) 
                    return next(err);
                return res.status(200).json(_node);
            }
        );
    }
]

// DuELETE request for deleting an existing node
exports.delete = [
    query("id")
        .exists()
        .isInt()
        .withMessage("Invalid node ID"),
    (req, res, next) => { 
        console.log("Node DELETE: id: ", req.query.id);
        Node.findByIdAndDelete(req.query.id, e => {
            e ? next(e) : res.status(204)
        })
    }
];


// GET request for a list of nodes
exports.get_all = (req, res, next) => {
    Node.find()
        .sort([['_id', 'ascending']])
        .exec((err, nodeList) => err ? next(err) : res.status(200).json(nodeList));
};

// GET request for a node by its id
exports.get = (req, res, next) => {
    Node.findById(req.params.id, function (err, node) {
        if (err) 
            return next(err);

        if (node === null) {
            var err = new Error('Node not found');
            err.status = 404;
            return next(err);
        }
        console.log("query result", node);
        res.status(200).json({
            _id: node._id,
            lastPing: node.lastPing,
            location: node.location,
        });
    });
};
