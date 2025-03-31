const PestReport = require("../models/PestReport"); // Ensure correct path

// 📝 Submit a new report
exports.createReport = async (req, res) => {
    console.log("createReport - req.user at the start:", req.user);
    try {
        if (!req.user || !req.user.userId) { // Changed req.user.id to req.user.userId
            return res.status(401).json({ message: "Unauthorized: Missing user ID" });
        }

        const { location, pestTypes, description } = req.body;
        const photos = req.files ? req.files.map(file => file.path) : [];

        const newReport = new PestReport({
            userId: req.user.userId,  // Changed req.user.id to req.user.userId
            location,
            pestTypes: Array.isArray(pestTypes) ? pestTypes : JSON.parse(pestTypes),
            description,
            photos
        });

        await newReport.save();
        res.status(201).json({ message: "Report submitted successfully", report: newReport });

    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 📄 Get all reports submitted by the logged-in user
exports.getUserReports = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) { // Consider updating this as well for consistency
            return res.status(401).json({ message: "Unauthorized: Missing user ID" });
        }

        const userReports = await PestReport.find({ userId: req.user.userId }).sort({ submittedAt: -1 }); // Update this for consistency
        res.json(userReports);
    } catch (error) {
        console.error("Error fetching user reports:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};