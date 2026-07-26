const express = require("express");
const cors = require("cors");
require("dotenv").config();

const travelRoutes = require("./routes/travelRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/travel", travelRoutes);

module.exports = app;