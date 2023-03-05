const express = require('express');
const router = express.Router();

const nodeController = require('../controllers/node');
const gatewayController = require('../controllers/gateway');
const historyController = require('../controllers/history');
const netController = require('../controllers/net');

/* ## Details on each route can be found in the function headers in their controller files ## */

/* ================ LoRaNet Routes ================== */
/* To be used by the gateways for data posting and configuration tools for setup */


router.post("/data", netController.data_post);                              // Data packet handler, takes in string-formated packet 
router.post("/node-adjacency", netController.node_adjacency_post);          // Node adj packet handler, updates adj list
router.post("/gateway-adjacency", netController.gateway_adjacency_post);    // Gateway adj packet handler, updates adj list 

// PUTs & DELETEs nodes
router.put("/node", nodeController.put);   
router.delete("/node", nodeController.delete);

// PUTs & DELETEs gateways 
router.put("/gateway", gatewayController.put);
router.delete("/gateway", gatewayController.delete);

/* ================ Client Routes ================== */
/* To be used by web client to fetch data */

<<<<<<< Updated upstream
router.get("/nodes", nodeController.get_all);               // Returns all nodes, with their adjacency list 
router.get("/gateways", gatewayController.get_all);         // Returns all gateways, with their adjacency list
=======
router.get("/nodes/", nodeController.get_nodes);             // Returns all nodes, with their adjacency list 
router.get("/gateways/", nodeController.get_gateways);       // Returns all gateways, with their adjacency list
>>>>>>> Stashed changes
router.get("/history/", historyController.get_all);         // Returns an object where 'obj[id] = history'. A cutoff time can be queried 
router.get("/history/:id", historyController.get_by_node);  // Returns the history of a node given a time interval


module.exports = router;