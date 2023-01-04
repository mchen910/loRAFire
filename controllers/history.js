// GET request for a list of nodes
exports.GET_history = (req, res) => {
    // use req.query for parameters
    res.send('not implemented yet, returns history between given timestamps');
};

// GET request for the history of a node by its id
exports.GET_historyID = (req, res) => {
    res.send('not implemented yet, returns the complete history of one node from its id');
};

// POST request for creating a new history entry
exports.POST_history = (req, res) => {
    res.send('not implemented yet, add a new entry in the history table');
}

// DELETE request for deleting an existing history entry
exports.DELETE_history = (req, res) => {
    res.send('not implemented yet, probably will not use');
}

