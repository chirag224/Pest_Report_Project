const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("authenticateUser - Decoded Token:", decoded); // ADD THIS LINE
    req.user = decoded;
    console.log("authenticateUser - req.user after decoding:", req.user); // ADD THIS LINE
    next();
  } catch (error) {
    console.error("authenticateUser - Error verifying token:", error); // Good to log errors too
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateUser;