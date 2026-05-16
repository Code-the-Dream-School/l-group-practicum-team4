const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const characterRoutes = require("./routes/character");
const itemRoutes = require("./routes/item");
const dungeonRoutes = require("./routes/dungeonMap.routes");

const authMiddleware = require("./middleware/authentication");

const app = express();

// Security & best‑practice middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/character", authMiddleware, characterRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/dungeon", dungeonRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

module.exports = app;
