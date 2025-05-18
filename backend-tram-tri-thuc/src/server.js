const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.config.js");

dotenv.config();

// Import passport sau khi load biến môi trường
const passport = require("./config/passport.config.js");

const app = express();
app.use(cors());
app.use(express.json());

// Khởi tạo Passport
app.use(passport.initialize());

// Connect to MongoDB
connectDB();

// Import routes
const apiRoutes = require("./routers/index.js");
app.use("/api/v1", apiRoutes);

app.get("/", (req, res) => {
    res.send("Backend API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
