// controllers/adminController.js

// --- Required Modules ---
const path = require('path');
const Admin = require('../models/Admin');       // Adjust path if needed
const User = require('../models/User');         // Adjust path if needed
const PestReport = require('../models/PestReport'); // Adjust path if needed
const UserLog = require('../models/UserLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Load Environment Variables ---
// Assuming 'controllers' folder is 1 level inside backend root
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // Adjust path

const JWT_SECRET = process.env.JWT_SECRET;

// --- Controller Functions ---

/**
 * @desc    Authenticate Admin and Get Token
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) { return res.status(400).json({ msg: 'Please provide email and password.' }); }
    if (!JWT_SECRET) { console.error("FATAL ERROR: JWT_SECRET is not defined."); return res.status(500).send('Server Configuration Error'); }

    try {
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) { return res.status(401).json({ msg: 'Invalid credentials.' }); }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) { return res.status(401).json({ msg: 'Invalid credentials.' }); }
        const payload = { admin: { id: admin.id, email: admin.email, role: 'admin' } };
        jwt.sign( payload, JWT_SECRET, { expiresIn: '5h' }, (err, token) => { if (err) throw err; res.status(200).json({ token }); });
    } catch (err) { console.error("Admin login error:", err.message); res.status(500).send('Server Error'); }
};

/**
 * @desc    Get all pest reports (for Admin)
 * @route   GET /api/admin/reports
 * @access  Private (Admin Only)
 */
const getAllReports = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    try {
        const reports = await PestReport.find({})
            .populate('userId', 'username email') // Populate user fields
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalCount = await PestReport.countDocuments({});
        const totalPages = Math.ceil(totalCount / limit);
        res.status(200).json({ reports, currentPage: page, totalPages, totalCount });
    } catch (err) {
        console.error("Error fetching all reports:", err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Update status of a specific pest report
 * @route   PUT /api/admin/reports/:reportId/status
 * @access  Private (Admin Only)
 */
const updateReportStatus = async (req, res) => {
    const { reportId } = req.params;
    const { status } = req.body;
    const adminId = req.admin.id;

    console.log(res);

    if (!['Verified', 'Invalid'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status value provided.' });
    }

    try {
        const report = await PestReport.findById(reportId);
        if (!report) { return res.status(404).json({ msg: 'Report not found.' }); }
        if (report.status === status) { return res.status(400).json({ msg: `Report is already marked as ${status}.` }); }

        // Update report fields
        report.status = status;
        report.verifiedBy = adminId;

        let userUpdatePromise = null;

        // Handle points/rank update if 'Verified'
        if (status === 'Verified') {
            // --- Debugging Start ---
            console.log(`[DEBUG] Report ${reportId} marked Verified. Finding user ID: ${report.userId}`);
            // --- Debugging End ---
            

            const user = await User.findById(report.userId);

            // --- Debugging Start ---
            // Log if user was found, convert to plain object for logging if exists
            console.log(`[DEBUG] Found user object:`, user ? user.toObject() : null);
            // --- Debugging End ---

            if (user) {
                 // Ensure user model has points: { type: Number, default: 0 }, rank: { type: String, default: 'Novice' }
                 // --- Debugging Start ---
                 const oldPoints = user.total_points;
                 // --- Debugging End ---

                user.total_points = (user.total_points || 0) + 5; // Award 5 points

                // --- Debugging Start ---
                console.log(`[DEBUG] User points updated calculation: ${oldPoints} -> ${user.points}`);
                // --- Debugging End ---

                // Update rank based on new points
                const oldRank = user.rank;
                if (user.total_points <= 10) { user.rank = 'Novice'; }
                else if (user.total_points <= 15) { user.rank = 'Intermediate'; }
                else if (user.total_points <= 25) { user.rank = 'Advanced'; }
                else { user.total_rank = 'Expert'; }

                 // --- Debugging Start ---
                 if (oldRank !== user.rank) {
                     console.log(`[DEBUG] User rank updated calculation: ${oldRank} -> ${user.rank}`);
                 } else {
                     console.log(`[DEBUG] User rank remains: ${user.rank}`);
                 }
                 // --- Debugging End ---

                // Save the user document asynchronously
                console.log(`[DEBUG] Attempting to save user ${user._id}...`); // Debug log before save
                userUpdatePromise = user.save()
                    .then(savedUser => console.log(`[DEBUG] User ${savedUser._id} saved successfully.`)) // Log success
                    .catch(err => console.error(`[DEBUG] Error saving user ${user._id}:`, err)); // Log specific error during save

            } else {
                console.warn(`[WARN] User ID ${report.userId} not found for report ${reportId} when trying to award points.`);
            }
        }

        // Save the report changes
        const updatedReport = await report.save();

        // Wait for user update promise if it exists
        if (userUpdatePromise) {
            try {
                await userUpdatePromise; // Wait for the save promise to resolve or reject
            } catch (userSaveError) {
                // Even if user save failed, the report was saved. Log user save error.
                 console.error(`[ERROR] Background user save failed after report update, but report ${reportId} was updated:`, userSaveError);
                 // Decide if you should try to revert report status or just log
            }
        }

        // Send success response
        res.status(200).json(updatedReport);

    } catch (err) {
        console.error(`Error updating report status for ${reportId}:`, err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Get user rankings (for Admin)
 * @route   GET /api/admin/users/rankings
 * @access  Private (Admin Only)
 */
// Example implementation in controllers/adminController.js
const getUserRankings = async (req, res) => {
    try {
        // Default sort: Ascending points (Novice first)
        let sortOrder = { total_points: 1 };

        // Optional: Allow frontend to specify sort direction via query param
        if (req.query.sort === 'desc') {
            sortOrder = { total_points: -1 }; // Expert first
        }

        const users = await User.find({})
            .select('username email total_points rank') // Select needed fields (+_id is included by default)
            .sort(sortOrder); // Sort based on points

        res.status(200).json(users); // Send the sorted list

    } catch (err) {
        console.error("Error fetching user rankings:", err.message);
        res.status(500).send('Server Error');
    }
};
// Remember to export getUserRankings in module.exports

/**
 * @desc    Get activity logs (for Admin)
 * @route   GET /api/admin/logs
 * @access  Private (Admin Only)
 */

const getUserByIdForAdmin = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find user by ID passed in URL, exclude password field
        const user = await User.findById(userId).select('-password'); // Exclude password hash

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        // Send back the user data (without password)
        res.status(200).json(user);

    } catch (err) {
        console.error(`Error fetching user ${userId} for admin:`, err.message);
        // Handle potential CastError if userId is not a valid ObjectId format
        if (err.name === 'CastError') {
             return res.status(400).json({ msg: 'Invalid User ID format.' });
        }
        res.status(500).send('Server Error');
    }
};

const getActivityLogs = async (req, res) => {
    // Pagination Setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Show more logs per page?
    const skip = (page - 1) * limit;

    try {
        // Fetch logs, populate user details, sort by timestamp descending
        const logs = await UserLog.find({}) // Find all logs
            .populate('userId', 'username email') // Populate user details based on schema
            .sort({ timestamp: -1 }) // Sort by log timestamp, newest first
            .skip(skip)
            .limit(limit);

        // Get total count for pagination metadata
        const totalCount = await UserLog.countDocuments({});
        const totalPages = Math.ceil(totalCount / limit);

        // Send response with logs and pagination info
        res.status(200).json({
            logs,
            currentPage: page,
            totalPages,
            totalCount
        });

    } catch (err) {
        console.error("Error fetching activity logs:", err.message);
        res.status(500).send('Server Error');
    }
};

// --- Make sure getActivityLogs is exported ---
module.exports = {
    loginAdmin,
    getAllReports,
    updateReportStatus,
    getUserRankings, // Still a placeholder unless implemented
    getActivityLogs,
    getUserByIdForAdmin // <<< Now implemented
    // getUserByIdForAdmin // Don't forget this if you implemented it
};