const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { createReport, getUserReports } = require("../controller/reportController");

// 📝 Submit a new report (Max 5 images)
router.post("/", authenticateUser, upload.array("photos", 5), createReport); // Corrected line

// 📄 Get all reports for the logged-in user
router.get("/my-reports", authenticateUser, getUserReports);

module.exports = router;