const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
    res.send("API Page - refer to route 3000 on localhost for frontend.");
});

module.exports = router;