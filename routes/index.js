const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
    res.send("API Page - refer to port 3000 for web client.");
});

module.exports = router;
