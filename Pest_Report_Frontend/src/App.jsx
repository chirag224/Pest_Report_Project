import React from 'react'; // Import React if not already globally available via build tool
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// --- Page Imports ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import Profile from "./pages/Profile";
import NewReport from "./pages/NewReport";
import PreviousReports from "./pages/PreviousReports";
// Admin Pages - Using your names
import AdminReportsPage from "./pages/AdminReportsPage"; // Assuming this name is correct too
import AdminRankings from "./pages/AdminRankings"; // <<< Your Name
import AdminViewUserProfile from "./pages/AdminViewUserProfile"; // <<< Your Name
import AdminLogsPage from "./pages/AdminLogsPage"; // <<< Your Name

// --- Component Imports ---
import Navbar from './components/Navbar'; // Import your reusable Navbar

// --- User Protected Route ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Checks for USER token
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children; // Render child component if token exists
};

// --- Admin Protected Route (Checks for Admin Token) ---
const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken"); // Checks for ADMIN token
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }
  return children; // Render child component if admin token exists
};

// --- User Layout --- (Example, adjust as needed)
const UserLayout = () => {
  const userLinks = [
    { path: '/profile', label: 'Profile' },
    { path: '/new-report', label: 'New Report' },
    { path: '/previous-reports', label: 'Previous Reports' },
  ];
  return (
    <div>
      <Navbar links={userLinks} />
      <main className="container mx-auto p-4"><Outlet /></main>
    </div>
  );
};

// --- Admin Layout --- (Example, adjust as needed)
const AdminLayout = () => {
  const adminLinks = [
    { path: '/admin/reports', label: 'Manage Reports' },
    { path: '/admin/rankings', label: 'User Rankings' },
    { path: '/admin/logs', label: 'Activity Logs' },
  ];
  return (
    <div>
      <Navbar links={adminLinks} />
      <main className="container mx-auto p-4"><Outlet /></main>
    </div>
  );
};


// --- Main App Component ---
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* --- REMOVED Admin routes from here --- */}
      {/* <Route path = "/admin/rankings" element = {<AdminRankings/>} /> */}
      {/* <Route path="/admin/user/:userId" element={<AdminViewUserProfile />} /> */}
      {/* <Route path="/admin/logs" element={<AdminLogsPage />} /> */}


      {/* User Protected Routes - Using Layout */}
      <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>} >
        <Route path="/profile" element={<Profile />} />
        <Route path="/new-report" element={<NewReport />} />
        <Route path="/previous-reports" element={<PreviousReports />} />
      </Route>

      {/* Admin Protected Routes - Using Layout */}
      <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>} >
        {/* === ALL Admin pages go INSIDE this block === */}
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/rankings" element={<AdminRankings />} /> {/* <<< MOVED & Using YOUR name */}
        <Route path="/admin/user/:userId" element={<AdminViewUserProfile />} /> {/* <<< MOVED & Using YOUR name */}
        <Route path="/admin/logs" element={<AdminLogsPage />} /> {/* <<< MOVED & Using YOUR name */}
        {/* =========================================== */}
      </Route>

      {/* Optional: Catch-all 404 Not Found route */}
      {/* <Route path="*" element={<NotFound />} /> */}

    </Routes>
  );
}

export default App;