const express = require('express');
const router = express.Router();

const nodeController = require('../controllers/node');
const historyController = require('../controllers/history');
const netController = require('../controllers/net');

const Analyzer = require("../analyzer/analyzer");

/* ## Details on each route can be found in the function headers in their controller files ## */

/* ================ LoRaNet Routes ================== */
/* To be used by the gateways for data posting and configuration tools for setup */

router.post("/packet", netController.packet_handler);

// PUTs & DELETEs nodes
router.put("/node", nodeController.put);   
router.delete("/node", nodeController.delete);

/* ================ Client Routes ================== */
/* To be used by web client to fetch data */

router.get("/nodes", nodeController.get_nodes);             // Returns all nodes, with their adjacency list 
router.get("/gateways", nodeController.get_gateways);       // Returns all gateways, with their adjacency list
router.get("/history/", historyController.get_all);         // Returns an object where 'obj[id] = history'. A cutoff time can be queried 
router.get("/history/:id", historyController.get_by_node);  // Returns the history of a node given a time interval

/* ================ Dev/Test Routes ================== */
router.get("/analyze/:id", (req, res, next) => {
    const id = req.params.id;
    Analyzer.process(id);
    res.status(201);
});

module.exports = router;