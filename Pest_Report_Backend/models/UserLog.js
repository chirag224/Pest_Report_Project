const mongoose = require("mongoose");

const userLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // References Users
    action: { 
        type: String, 
        enum: ["Login", "ReportSubmitted", "ProfileUpdated", "RankUpdated"], 
        required: true 
    },
    pointsChange: { type: Number, default: 0 }, // Only for RankUpdated actions
    oldRank: { type: String, default: null }, // Only for RankUpdated actions
    newRank: { type: String, default: null }, // Only for RankUpdated actions
    details: { type: String, default: "" }, // Extra info (e.g., IP address, report ID)
    timestamp: { type: Date, default: Date.now }, // Auto timestamp
});

module.exports = mongoose.model("UserLog", userLogSchema);
