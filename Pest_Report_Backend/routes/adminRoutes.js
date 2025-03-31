// routes/adminRoutes.js
const express = require('express');
console.log('✅ adminRoutes.js file successfully loaded by server.js'); // Debug log
const router = express.Router();

// Imports look correct (assuming paths relative to 'routes' folder are right)
const { loginAdmin, getAllReports, updateReportStatus , getUserRankings,getUserByIdForAdmin , getActivityLogs } = require('../controller/adminController');
const isAdminAuth = require('../middleware/isAdminAuth');

// Debugging middleware looks fine
router.use((req, res, next) => {
    console.log(`➡️ Request received by adminRouter: ${req.method} ${req.originalUrl}`);
    next();
});

// Public login route
router.post('/login', loginAdmin);

// --- Protected Route for Getting Reports ---
// This line looks correct:
// - Uses router.get for a GET request
// - Path is '/reports' (combined with /api/admin in server.js => /api/admin/reports)
// - Uses isAdminAuth middleware FIRST to protect the route
// - Uses getAllReports controller function LAST to handle the request
router.get('/reports', isAdminAuth, getAllReports);

// Other placeholder routes also look correctly structured
router.put('/reports/:reportId/status', isAdminAuth, updateReportStatus);
router.get('/users/rankings', isAdminAuth, getUserRankings);
router.get('/user/:userId', isAdminAuth, getUserByIdForAdmin);
router.get('/logs', isAdminAuth, getActivityLogs);


//router.get('/logs', isAdminAuth, getActivityLogs);

module.exports = router;