require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");  // User Authentication Routes
const adminRoutes = require("./routes/adminRoutes"); // Admin Authentication Routes
const userRoutes =  require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const app = express();

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
  
// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);  // ✅ Ensure this is added
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/uploads", express.static("uploads"));
console.log("User Routes:", userRoutes); // Debugging


// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));