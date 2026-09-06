const express = require("express");
const cors = require("cors");
require("dotenv").config();

const travelRoutes = require("./routes/travelRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173","https://ai-travel-planner-web-wabu.onrender.com")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header are useful for health checks.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.use("/api/travel", travelRoutes);

module.exports = app;
