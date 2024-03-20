const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");

router.post("/", reportController.createReport);
// Add other report routes here

module.exports = router;
