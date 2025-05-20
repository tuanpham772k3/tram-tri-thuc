const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.config.js");

dotenv.config();

// Import passport sau khi load biến môi trường
// const passport = require("./config/passport.config.js");

// Cấu hình CORS
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Origin của frontend
    credentials: true, // Cho phép gửi cookie/credentials
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Các method được phép
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires"], // Headers được phép
};

const app = express();

// Log request để debug
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url} from ${req.headers.origin}`);
    if (req.method === "OPTIONS") {
        console.log("Preflight headers:", req.headers);
    }
    next();
});

// Vô hiệu hóa caching cho tất cả API
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Xử lý preflight request
app.use(cookieParser());
app.use(express.json());

// Khởi tạo Passport
// app.use(passport.initialize());

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
