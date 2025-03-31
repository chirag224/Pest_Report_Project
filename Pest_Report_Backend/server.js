require("dotenv").config(); // <<< Keep at the top
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const cors = require("cors"); // <<< Make sure required
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes =  require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const app = express();

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));


// --- START CORS Configuration Update ---

// Use the environment variable set in Render for production,
// fallback to localhost for local development
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

const corsOptions = {
    origin: allowedOrigin, // <<< Use the variable here
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Standard methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Standard headers
    credentials: true, // Allow cookies/auth headers if needed
};

console.log(`🔄 Configuring CORS for origin: ${allowedOrigin}`); // Log for debugging

// Apply CORS middleware *BEFORE* your routes
app.use(cors(corsOptions));

// --- END CORS Configuration Update ---


// ✅ Other Middleware (AFTER CORS)
app.use(express.json());
app.use(cookieParser());
// Use path.join for static uploads - remove the duplicate later
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));

// ✅ Routes (AFTER middleware)
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);



// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));