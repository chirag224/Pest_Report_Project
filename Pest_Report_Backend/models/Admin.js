const mongoose = require("mongoose");
const bcrypt = require('bcryptjs'); // <--- Make sure to require bcryptjs

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Good practice to add trim
        lowercase: true // Good practice for emails
    },
    password: {
        type: String,
        required: true
        // Consider adding minlength here too: minlength: 6
    },
    // Add other fields if needed, like 'username'
}, { timestamps: true });

// --- Add this password hashing middleware ---
adminSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        // Generate salt (10 rounds is generally recommended)
        const salt = await bcrypt.genSalt(10);
        // Hash password with the generated salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); // Pass error to the next middleware if hashing fails
    }
});

// --- Optional, but recommended: Add password comparison method ---
adminSchema.methods.comparePassword = async function(candidatePassword) {
    // 'this.password' refers to the hashed password in the database
    return bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model("Admin", adminSchema);