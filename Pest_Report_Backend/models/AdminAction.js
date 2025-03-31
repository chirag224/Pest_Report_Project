const mongoose = require("mongoose");

const adminActionSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // References Admin
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: "PestReport", required: true }, // References Pest Reports
    action: { type: String, enum: ["Verified", "Invalid"], required: true },
    reason: { type: String, default: "" }, // Reason required for invalid reports
    timestamp: { type: Date, default: Date.now }, // Auto timestamp
});

module.exports = mongoose.model("AdminAction", adminActionSchema);
