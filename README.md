# Pest Report System

## Description

A full-stack web application developed using the MERN stack that allows users to register and report pest problems in their locality. The application features role-based access for users and administrators, a reporting system with image uploads, and a user ranking system based on reporting activity[cite: 1]. This project fulfills the requirements of the Full-Stack MERN Developer programming assignment[cite: 1].

## Features

### User Features

* **Authentication:** User registration (username, email, phone, password) and JWT-based login/logout[cite: 3].
* **Profile Management:** View and update profile information[cite: 4].
* **Pest Reporting:** Submit detailed pest reports including location, pest type, description, and optional photo uploads (up to 5)[cite: 4].
* **View Reports:** Users can view their previously submitted reports and their status[cite: 4].
* **Ranking System:** Users earn points for valid reports (5 points per verified report) and are assigned ranks (Novice, Intermediate, Advanced, Expert) based on their total points, displayed on their profile[cite: 5, 6].

### Admin Features

* **Admin Login:** Separate login for administrators.
* **View All Reports:** Admins can view all reports submitted by all users[cite: 7].
* **Mark Report Status:** Admins can mark reports as 'Verified' or 'Invalid'[cite: 7]. Verifying a report awards points to the submitting user[cite: 5].
* **View User Rankings:** Admins can view a list of all users with their current ranks and points[cite: 8].
* **View Activity Logs:** Admins can view user activity logs (e.g., logins, report submissions)[cite: 8].

## Tech Stack

* **Frontend:** React (Vite), `react-router-dom`, `axios`, Tailwind CSS
* **Backend:** Node.js, Express.js [cite: 9]
* **Database:** MongoDB (using Mongoose ODM) [cite: 9]
* **Authentication:** JSON Web Tokens (JWT), `bcryptjs` for password hashing [cite: 3]
* **File Uploads:** `multer` (for handling image uploads)
* **Environment Variables:** `dotenv`
* **Other:** `cors`, `cookie-parser` (if used)

## Project Structure

.
├── Pest_Report_Backend/
│   ├── config/
│   │   └── .env             # Environment variables (DO NOT COMMIT)
│   ├── controller/
│   │   ├── adminController.js
│   │   └── ...              # Other controller files (auth, user, report)
│   ├── middleware/
│   │   ├── isAdminAuth.js
│   │   └── ...              # Other middleware files (auth)
│   ├── models/
│   │   ├── Admin.js
│   │   ├── PestReport.js
│   │   ├── User.js
│   │   └── ...              # Other model files (UserLog, etc.)
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   └── ...              # Other route files
│   ├── seeders/
│   │   └── adminSeeder.js   # Script to create initial admin
│   ├── uploads/             # Directory for uploaded report images (add to .gitignore)
│   ├── package.json
│   └── server.js            # Main backend entry point
│
└── Pest_Report_Frontend/
├── public/
├── src/
│   ├── components/      # Reusable UI components (Navbar, ReportCard, etc.)
│   ├── pages/           # Page components (Home, Login, AdminReportsPage, etc.)
│   ├── App.jsx          # Main app component with routing
│   └── main.jsx         # Frontend entry point
├── index.html
├── package.json
└── vite.config.js       # Vite configuration (including proxy for dev)


## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```
2.  **Backend Setup:**
    ```bash
    cd Pest_Report_Backend
    npm install # or yarn install
    ```
    * Create a `.env` file in the `/config` directory (or backend root, adjust paths accordingly). See the Environment Variables section below.
    * Run the admin seeder (optional, if you want to create the admin via script):
        ```bash
        node seeders/adminSeeder.js
        ```
3.  **Frontend Setup:**
    ```bash
    cd ../Pest_Report_Frontend
    npm install # or yarn install
    ```
    * Ensure the `proxy` setting in `package.json` points to your backend server address and port (e.g., `"proxy": "http://localhost:3000"`).

## Environment Variables

Create a `.env` file in the backend's config directory (`Pest_Report_Backend/config/`) with the following variables:

```dotenv
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_strong_jwt_secret_key>
PORT=3000 # Or any port your backend should run on

# Optional: Used by adminSeeder.js (Ensure these match your seeded admin if run)
# ADMIN_EMAIL=admin@gmail.com
# ADMIN_PASSWORD=admin123

# Needed for Production Deployment (Render Example)
# CORS_ORIGIN=[https://your-deployed-frontend-url.onrender.com](https://www.google.com/search?q=https://your-deployed-frontend-url.onrender.com)
IMPORTANT: Add your .env file to your backend's .gitignore file. Never commit sensitive information like database connection strings or JWT secrets to GitHub.

Running the Application Locally
Run the Backend Server:
Bash

cd Pest_Report_Backend
npm run dev # Uses nodemon for auto-restarting
# OR
# npm start # Uses node server.js directly
Run the Frontend Server:
Bash

cd ../Pest_Report_Frontend
npm run dev # Starts Vite dev server (usually on localhost:5173)
Open your browser and navigate to the frontend development URL (e.g., http://localhost:5173).
Usage / Admin Credentials
Users can register, log in, submit reports, and view their profile/reports.
Administrators can log in via the /admin/login path.
Default Admin Credentials ( seeded ):

Email: admin@gmail.com
Password: admin123
🚨 SECURITY WARNING: The default admin password admin123 is insecure. If you used the seeder with this password:

Change it immediately after your first login if you implement the password change feature.
OR, modify the adminSeeder.js script and use a strong password set via environment variables before deploying or running the seeder for the first time.
Do not deploy publicly with easily guessable default credentials.
Deployment
This application is designed to be deployed to platforms like Render.   

Backend: Deploy as a Node.js "Web Service".

Build Command: npm install (or yarn install)
Start Command: node server.js (or npm start)
Set Environment Variables (MONGO_URI, JWT_SECRET, NODE_ENV=production, CORS_ORIGIN) in the Render dashboard.
Frontend: Deploy as a "Static Site".

Build Command: npm install && npm run build (or yarn install && yarn build)
Publish Directory: dist
Add Rewrite Rule: Source /*, Destination /index.html, Action Rewrite.
Set VITE_API_URL environment variable in Render to the deployed backend URL.
Live Demo URL: [Link to your deployed frontend on Render] (Update this after deployment)

Backend URL: [Link to your deployed backend on Render] (Update this after deployment)

