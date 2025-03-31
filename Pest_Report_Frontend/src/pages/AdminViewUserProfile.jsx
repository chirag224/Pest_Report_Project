// src/pages/admin/AdminViewUserProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams to get ID from URL
import axios from 'axios';

// Note: This page will be rendered inside AdminLayout, so no need for Navbar import

const AdminViewUserProfilePage = () => {
    const { userId } = useParams(); // Get the userId from the URL parameter defined in App.jsx route
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            setError(null);
            console.log(`Workspaceing data for user: ${userId}`);
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) throw new Error("Admin token not found.");

                // --- Backend Needed ---
                // **TODO**: Implement backend route GET /api/admin/user/:userId
                const response = await axios.get(`http://localhost:3000/api/admin/user/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // --------------------

                setUser(response.data); // Assuming backend sends back the user object

            } catch (err) {
                console.error(`Error fetching user ${userId}:`, err);
                setError(err.response?.data?.message || err.message || 'Failed to fetch user data.');
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        } else {
            setError("User ID not found in URL.");
            setIsLoading(false);
        }

    }, [userId]); // Re-fetch if userId changes (though unlikely in this context)

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
                User Profile Details
            </h2>

            {/* Back Link */}
            <div className="mb-6">
                <Link to="/admin/rankings" className="text-blue-600 hover:underline">
                    &larr; Back to User Rankings
                </Link>
            </div>

            {isLoading && <p className="text-center text-gray-500 py-10">Loading user data...</p>}
            {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">Error: {error}</p>}

            {!isLoading && !error && !user && (
                 <p className="text-center text-gray-600 mt-10 text-lg">User not found.</p>
            )}

            {!isLoading && !error && user && (
                <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Username: {user.username}</h3>
                    <p className="text-gray-600 mb-2"><strong className="font-medium text-gray-700">Email:</strong> {user.email}</p>
                    {/* Display phone only if backend sends it */}
                    {user.phone && <p className="text-gray-600 mb-2"><strong className="font-medium text-gray-700">Phone:</strong> {user.phone}</p>}
                    <p className="text-gray-600 mb-2"><strong className="font-medium text-gray-700">Total Points:</strong> {user.total_points}</p>
                    <p className="text-gray-600 mb-2"><strong className="font-medium text-gray-700">Rank:</strong> {user.rank}</p>
                    <p className="text-gray-600 mb-2"><strong className="font-medium text-gray-700">Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    {/* Add more details if needed */}
                    {/* Maybe display a list of reports submitted by this user? (Would require another API call/backend logic) */}
                </div>
            )}
        </div>
    );
};

export default AdminViewUserProfilePage;