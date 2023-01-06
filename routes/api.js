const express = require('express');
const router = express.Router();

// Require controller modules
const nodeController = require('../controllers/node');
const gatewayController = require('../controllers/gateway');
const historyController = require('../controllers/history');


/* ================ NODE ROUTES ================== */

// GET request for a list of nodes
router.get('/nodes', nodeController.node_index);

// GET request for a node by its id
router.get('/nodes/:id', nodeController.node_show);

// POST request for creating a new node entry
router.post('/nodes', nodeController.node_create);

// DELETE request for deleting an existing node
router.delete('/nodes/:id', nodeController.node_destroy);

// UPDATE request for updating a node
router.put('/nodes/:id', nodeController.node_update);


/* ================ GATEWAY ROUTES ================== */

// GET request for a list of gateways
router.get('/gateways', gatewayController.gateway_index);

// GET request for a gateway by its id
router.get('/gateways/:id', gatewayController.gateway_show);

// POST request for creating a new gateway entry
router.post('/gateways', gatewayController.gateway_create);

// DELETE request for deleting an existing gateway
router.delete('/gateways/:id', gatewayController.gateway_destroy);

// UPDATE request for updating a gateway
router.put('/gateways/:id', gatewayController.gateway_update);



/* ================ HISTORY ROUTES ================== */

// GET request for a list of nodes
router.get('/history', historyController.history_index);

// GET request for the history of a node by its id
router.get('/history/:id', historyController.history_show);

// POST request for creating a new history entry
router.post('/history', historyController.history_create);

// DELETE request for deleting an existing history entry
router.delete('/history/:id', historyController.history_destroy);

// PUT request for updating history
router.put('history/:id', historyController.hitory_update);


module.exports = router;