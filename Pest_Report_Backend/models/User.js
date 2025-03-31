const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    phone: { type: String, required: true, unique: true },
    total_points: { type: Number, default: 0 }, // Accumulated points
    rank: { type: String, default: "Novice" }, // Calculated from points
  },
  { timestamps: true } // Adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("User", userSchema);
