const express = require("express");
const cors = require("cors");
require("dotenv").config();

const travelRoutes = require("./routes/travelRoutes");
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const metricsRoutes = require("./routes/metricsRoutes");

const app = express();

const rawOrigins = process.env.CLIENT_ORIGIN || "http://localhost:5173,https://ai-travel-planner-web-wabu.onrender.com";
const allowedOrigins = rawOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.includes("localhost")) {
        return callback(null, true);
      }
      return callback(null, true); // Allow all dev origins gracefully
    },
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/travel", travelRoutes);
app.use("/travel", travelRoutes); // Legacy backward compatibility

app.get("/health", (req, res) => {
  res.json({ success: true, message: "AI Travel Planner API online 🚀" });
});

module.exports = app;
