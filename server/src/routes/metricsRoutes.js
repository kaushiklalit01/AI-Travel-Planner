const express = require("express");
const router = express.Router();

const { getSystemMetrics, runLiveBenchmark } = require("../controllers/metricsController");

router.get("/", getSystemMetrics);
router.post("/benchmark", runLiveBenchmark);

module.exports = router;
