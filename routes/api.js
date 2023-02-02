const express = require('express');
const router = express.Router();
 
// Require controller modules
const nodeController = require('../controllers/node');
const gatewayController = require('../controllers/gateway');
const historyController = require('../controllers/history');
const netController = require('../controllers/net');

/* ================ LoRaNet Routes ================== */

router.post("/data", netController.data_post);
router.post("/node-adjacency", netController.node_adjacency_post);
router.post("/gateway-adjacency", netController.gateway_adjacency_post);

router.put("/node", nodeController.put);
router.post("/node", nodeController.post);
router.delete("/node", nodeController.delete);

router.put("/gateway", gatewayController.put);
router.post("/gateway", gatewayController.post);
router.delete("/gateway", gatewayController.delete);

/* ================ Client Routes ================== */

router.get("/nodes", nodeController.get_all);
router.get("/gateways", gatewayController.get_all);
router.get("/history/", historyController.get_all)
router.get("/history/:id", historyController.get_by_node);


/* ================ Test Routes ================== */


module.exports = router;