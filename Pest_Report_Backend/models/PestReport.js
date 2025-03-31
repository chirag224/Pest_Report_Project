const mongoose = require("mongoose");

const pestReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // References User
    location: { type: String, required: true },
    pestTypes: { type: [String], required: true }, // Allows multiple pests
    description: { type: String, required: true },
    photos: { 
        type: [String], // Array of image URLs
        validate: {
            validator: (val) => val.length <= 5,
            message: "You can upload a maximum of 5 images"
        },
        default: []
    },
    status: { type: String, enum: ["Pending", "Verified", "Invalid"], default: "Pending" },
    submittedAt: { type: Date, default: Date.now }, // Auto-set timestamp
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null } // Admin reference (nullable)
});

// Ensure an admin is assigned when verifying a report
pestReportSchema.pre("save", function (next) {
    if (this.isModified("status") && this.status !== "Pending" && !this.verifiedBy) {
        return next(new Error("Admin verification required to change status."));
    }
    next();
});

module.exports = mongoose.model("PestReport", pestReportSchema);
