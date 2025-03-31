const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const User = require("../models/User");
const UserLog = require("../models/UserLog");

const router = express.Router();

/**
 * ✅ GET User Profile (Protected)
 */
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    console.log("🔹 Decoded User ID:", req.user);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("❌ Error fetching profile:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ✅ PUT Update User Profile (Protected)
 */
router.put("/profile", authenticateUser, async (req, res) => {
  try {
    console.log("🔹 Decoded User ID:", req.user);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const { username, email, phone, total_points, rank } = req.body;

    // Fetch current user to check old data
    const existingUser = await User.findById(req.user.userId);
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    // Check if the user data has changed
    if (
      existingUser.username === username &&
      existingUser.email === email &&
      existingUser.phone === phone &&
      existingUser.total_points === total_points &&
      existingUser.rank === rank
    ) {
      return res.status(200).json({ message: "No changes detected", user: existingUser });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { username, email, phone, total_points, rank },
      { new: true, runValidators: true }
    ).select("-password");

    // Log the profile update
    await UserLog.create({
      userId: req.user.userId,
      action: "ProfileUpdated",
      details: `Updated profile: username=${username}, email=${email}, phone=${phone}`,
    });

    // Log rank change if applicable
    if (existingUser.rank !== rank || existingUser.total_points !== total_points) {
      await UserLog.create({
        userId: req.user.userId,
        action: "RankUpdated",
        pointsChange: total_points - existingUser.total_points,
        oldRank: existingUser.rank,
        newRank: rank,
        details: `Rank changed from ${existingUser.rank} to ${rank}`,
      });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser }); // ✅ Send updated user data
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
