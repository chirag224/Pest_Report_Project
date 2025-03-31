// src/pages/admin/AdminRankingsPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Using the component name you provided
const AdminRankings = () => {
    // --- State Variables ---
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'total_points', direction: 'descending' });

    // --- Fetch User Rankings ---
    const fetchUserRankings = async () => {
        setIsLoading(true);
        setError(null);
        console.log("Fetching user rankings for admin...");
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error("Admin token not found.");

            // --- CHANGE IS HERE ---
            // Using relative path now, axios will prepend the baseURL
            const response = await axios.get('/api/admin/users/rankings', { // <<< Relative path
                headers: { 'Authorization': `Bearer ${token}` }
                // Optionally add params for backend sorting: params: { sort: sortConfig.direction }
            });
            // --------------------
            console.log("User rankings fetched:", response.data);

            if (Array.isArray(response.data)) {
                 setUsers(response.data);
            } else {
                 console.error("Expected an array of users, but received:", response.data);
                 setUsers([]);
            }
        } catch (err) {
            console.error("Error fetching user rankings:", err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch rankings.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch rankings on component mount
    useEffect(() => {
        fetchUserRankings();
    }, []);

    // --- Sorting Logic ---
    const requestSort = (key) => {
        // ... (sorting logic remains the same) ...
        let direction = 'ascending'; if (sortConfig.key === key && sortConfig.direction === 'ascending') { direction = 'descending'; } setSortConfig({ key, direction });
    };

    // Memoize the sorted users array
    const sortedUsers = useMemo(() => {
        // ... (sorting logic remains the same) ...
        let sortableItems = [...users]; if (sortConfig.key !== null) { sortableItems.sort((a, b) => { let aValue = a[sortConfig.key]; let bValue = b[sortConfig.key]; if (sortConfig.key === 'rank') { const rankOrder = { 'novice': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }; aValue = rankOrder[(aValue || 'Novice').toLowerCase()] || 0; bValue = rankOrder[(bValue || 'Novice').toLowerCase()] || 0; } else if (sortConfig.key === 'username' || sortConfig.key === 'email') { aValue = (aValue || '').toLowerCase(); bValue = (bValue || '').toLowerCase(); } else if (sortConfig.key === 'total_points') { aValue = aValue || 0; bValue = bValue || 0; } if (aValue < bValue) { return sortConfig.direction === 'ascending' ? -1 : 1; } if (aValue > bValue) { return sortConfig.direction === 'ascending' ? 1 : -1; } return 0; }); } return sortableItems;
    }, [users, sortConfig]);

    // Helper to get sort indicator
    const getSortIndicator = (key) => {
         // ... (same as before) ...
         if (sortConfig.key !== key) return ''; return sortConfig.direction === 'ascending' ? '🔼' : '🔽';
    }

    // --- Render Logic ---
    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
                User Rankings
            </h2>

            {isLoading && <p className="text-center text-gray-500 py-10">Loading rankings...</p>}
            {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">Error: {error}</p>}

            {!isLoading && !error && (
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 ">
                        {/* Table Head remains the same */}
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100"><tr><th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('username')}> Username {getSortIndicator('username')}</th><th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('rank')}> Rank {getSortIndicator('rank')}</th><th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('total_points')}> Points {getSortIndicator('total_points')}</th><th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('email')}> Email {getSortIndicator('email')}</th></tr></thead>
                        <tbody>
                            {sortedUsers.length === 0 ? (
                                <tr><td colSpan="4" className="text-center px-6 py-4">No users found.</td></tr>
                            ) : (
                                sortedUsers.map((user) => (
                                    <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <Link to={`/admin/user/${user._id}`} className="text-blue-600 hover:underline">
                                                {user.username || 'N/A'}
                                            </Link>
                                        </th>
                                        <td className="px-6 py-4">{user.rank}</td>
                                        <td className="px-6 py-4">{user.total_points}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Using the component name you provided in App.jsx import
export default AdminRankings;