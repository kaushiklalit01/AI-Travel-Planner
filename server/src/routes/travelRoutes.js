const express = require("express");

const router = express.Router();

const {
  healthCheck,
  planTrip,
} = require("../controllers/travelController");

router.get("/health", healthCheck);

router.post("/plan", planTrip);

module.exports = router;