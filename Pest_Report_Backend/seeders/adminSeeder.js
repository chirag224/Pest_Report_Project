// seeders/adminSeeder.js
const path = require('path'); 
const envPath = path.resolve(__dirname, '../.env');

console.log(`📄 Attempting to load .env file from: ${envPath}`); // Log the path to verify

// --- Load dotenv using the resolved path ---
const dotenvResult = require('dotenv').config({ path: envPath });const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Not strictly needed here if hashing is in model, but good practice
const Admin = require('../models/Admin'); // Adjust path to your Admin model

// --- Configuration ---
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Use a strong default or env var
const MONGO_URI = process.env.MONGO_URI; // Your MongoDB connection string from .env

// --- Seeding Function ---
const seedAdmin = async () => {
    if (!MONGO_URI) {
        console.error('❌ MONGO_URI not found in environment variables.');
        process.exit(1);
    }
    if (ADMIN_PASSWORD === 'ChangeMe123!') {
        console.warn('⚠️ WARNING: Using default admin password. Set ADMIN_PASSWORD environment variable for security.');
    }

    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('🌱 MongoDB Connected for seeding...');

        // Check if admin user already exists
        const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });

        if (!existingAdmin) {
            // Create admin user object (password will be hashed by the model's pre-save hook)
            const adminData = {
                username: ADMIN_USERNAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD, // Pass plain password here
            };

            await Admin.create(adminData); // Mongoose pre-save hook will hash it
            console.log('✅ Admin user created successfully!');
        } else {
            console.log('ℹ️ Admin user already exists.');
        }

    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
        process.exit(1); // Exit with error code
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('🌱 MongoDB Disconnected after seeding.');
        process.exit(0); // Exit successfully
    }
};

// --- Execute Seeder ---
seedAdmin();