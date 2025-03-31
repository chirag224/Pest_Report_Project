const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the 'uploads/reports' directory exists
const uploadDir = "uploads/reports/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user ? req.user.userId : "anonymous"; // Changed to req.user.userId
    cb(null, `${userId}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Create Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit each file to 5MB
});

// Export only the `upload` instance (not `.array()`)
module.exports = upload;