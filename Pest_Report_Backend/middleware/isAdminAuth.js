// middleware/isAdminAuth.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure JWT_SECRET is loaded
const JWT_SECRET = process.env.JWT_SECRET;

const isAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Check for Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    if (!token) { // Should be caught by startsWith, but good to double-check
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        // 2. Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. --- Authorization Check ---
        // Check if the decoded payload contains the admin role
        // This depends on how you structured the payload in loginAdmin controller
        // We used: payload = { admin: { id: admin.id, role: 'admin' } }
        if (decoded.admin && decoded.admin.role === 'admin') {
            // Attach admin info to the request object for later use if needed
            req.admin = decoded.admin;
            next(); // Allow access to the route
        } else {
            // Token is valid, but the user is not an admin
            return res.status(403).json({ message: "Forbidden: Admin privileges required." });
        }
    } catch (error) {
        console.error("isAdminAuth - Error verifying token:", error);
        // Token is invalid or expired
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = isAdminAuth;