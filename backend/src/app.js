require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const apiRoutes = require("./utils/index.js");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler.js");

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

const app = express();

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Import routes
app.use("/api/v1", apiRoutes);

app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
