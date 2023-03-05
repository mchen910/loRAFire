var { query, validationResult } = require('express-validator');

const nodeController = require('../controllers/node');
const gatewayController = require('../controllers/gateway');
const historyController = require('../controllers/history');

// ======= Routes ======
// POST <str>: Handles data packet post from gateways. query format: "?str=[node]:[temp]:[humidity]"
// POST <str>: Handles a node adjacency packet post. query format: "?str=[node]:[adj]..."
// POST <str>: Handles a gateway adjacency packet post. query format: "?str=[gateway]:[adj]..."


// POST <str>: Handles data packet post from gateways. query format: "?str=[node]:[temp]:[humidity]"
exports.data_post = [
    query("str")
        .exists()
        .isString(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        let args = req.query.str.split(":");
        const id = parseInt(args[0]);
        const temp = parseInt(args[1]);
        const humidity = parseInt(args[2]);

        // Create & set history
        historyController.put(id, Date.now(), temp, humidity);

        return res.status(204);
    }
];

// POST <str>: Handles a node adjacency packet post. query format: "?str=[node]:[adj]..."
exports.node_adjacency_post = [
    query("str")
        .exists()
        .isString(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        let args = req.query.str.split(":");
        const id = args[0];

        // Set adjacency list of node
        nodeController.update(id, Date.now(), args.slice(1));

        return res.status(204);
    }
];

// POST <str>: Handles a gateway adjacency packet post. query format: "?str=[gateway]:[adj]..."
exports.gateway_adjacency_post = [
    query("str")
        .exists()
        .isString(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        let args = req.query.str.split(":");
        const id = args[0];

        // Set adjacency list of node
        gatewayController.update(id, Date.now(), args.slice(1));

        return res.status(204);
    }
];
