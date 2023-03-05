const { query, validationResult } = require('express-validator');

const Node = require('../models/node');

// ========= Routes =========
// PUT <id> <latitude> <longitude>: Spawns new node document
// DELETE <id>: Delete node with id=<id>

// GET (nodes): Returns all nodes
// GET (gateway): Returns all gateway
// GET <id>: Returns node with id=<id>


// ======== Private Functions =======
// update (id, lastPacketID, lastPing, adj): updates document of node <id>


// PUT <id> <latitude> <longitude>: Spawns new node document
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
        Node.findById(req.query.id, (err, node) => {
            if (node == null) {
                const node = new Node({
                    _id: req.query.id,
                    location: {
                        latitude: req.query.latitude,
                        lonjgitude: req.query.longitude
                    },
                    lastPacketID: 0,
                    lastPing: Date.now()
                });
                if (req.query.gateway) {
                    node.gateway = true;
                }
                node.save( err => err ? next(err) : res.status(201).json(node) );
            } else {
                console.log("hi");
                Node.replaceOne({_id: req.query.id}, {
                    _id: req.query.id,
                    location: {
                        latitude: req.query.latitude,
                        lonjgitude: req.query.longitude
                    },
                    lastPacketID: 0,
                    lastPing: Date.now()
                }, () => res.status(201).json("ACK"));
            }
        });
    }
];


// DELETE <id>: Delete node with id=<id>
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


// GET: Returns all nodes
exports.get_nodes = (req, res, next) => {
    Node.find({gateway: false})
        .sort([['_id', 'ascending']])
        .exec((err, nodeList) => err ? next(err) : res.status(200).json(nodeList));
};

// GET: Returns all gateways
exports.get_gateways = (req, res, next) => {
    Node.find({gateway: true})
        .sort([['_id', 'ascending']])
        .exec((err, nodeList) => err ? next(err) : res.status(200).json(nodeList));
};


// GET <id>: Returns node with id=<id>
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

// update (id, lastPacketID, lastPing, adj): updates document of node <id>
exports.update = (id, lastPacketID, lastPing, adj) => {
    console.log("Node update request");
    const node = new Node({
        lastPacketID: lastPacketID,
        lastPing: lastPing ? new Date(lastPing) : undefined,
        adjacencies: adj,
    });
    Node.findByIdAndUpdate(
        id,
        node,
        {new: true},
        err => {
            if (err)
                console.log("Error on node update: ", err);
        }
    );
};
