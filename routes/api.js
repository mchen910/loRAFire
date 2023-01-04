const express = require('express');
const router = express.Router();

// Require controller modules
const nodeController = require('../controllers/node');
const gatewayController = require('../controllers/gateway');
const historyController = require('../controllers/history');


/* ================ NODE ROUTES ================== */

// GET request for a list of nodes
router.get('/nodes', nodeController.GET_nodeList);

// GET request for a node by its id
router.get('/node/:id', nodeController.GET_nodeID);

// POST request for creating a new node entry
router.post('/node/create', nodeController.POST_node);

// DELETE request for deleting an existing node
router.delete('/node/:id/delete', nodeController.DELETE_node);

// UPDATE request for updating a node
router.put('/node/:id/update', nodeController.PUT_node)


/* ================ GATEWAY ROUTES ================== */

// GET request for a list of gateways
router.get('/gateways', gatewayController.GET_gatewayList);

// GET request for a gateway by its id
router.get('/gateway/:id', gatewayController.GET_gatewayID);

// POST request for creating a new gateway entry
router.post('/gateway/create', gatewayController.POST_gateway);

// DELETE request for deleting an existing gateway
router.delete('/gateway/:id/delete', gatewayController.DELETE_gateway);

// UPDATE request for updating a gateway
router.put('/gateway/:id/update', gatewayController.PUT_gateway)



/* ================ HISTORY ROUTES ================== */

// GET request for a list of nodes
router.get('/history', historyController.GET_history);

// GET request for the history of a node by its id
router.get('/history/:id', historyController.GET_historyID);

// POST request for creating a new history entry
router.post('/history/create', historyController.POST_history);

// DELETE request for deleting an existing history entry
router.delete('/history/:id/delete', historyController.DELETE_history);


module.exports = router;