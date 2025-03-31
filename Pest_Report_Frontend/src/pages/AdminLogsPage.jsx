// src/pages/admin/AdminLogsPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Note: This page will be rendered inside AdminLayout, so no Navbar needed here

const AdminLogsPage = () => {
    // --- State Variables ---
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const itemsPerPage = 20; // Or get from backend if variable limit

    // --- Fetch Activity Logs ---
    const fetchActivityLogs = async (page = 1) => {
        setIsLoading(true);
        setError(null);
        console.log(`Workspaceing activity logs for admin (page ${page})...`);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error("Admin token not found.");

            // Call backend endpoint with pagination params
            const response = await axios.get('http://localhost:3000/api/admin/logs', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    page: page,
                    limit: itemsPerPage
                }
            });
            console.log("Activity logs fetched:", response.data);

            // Assuming backend sends { logs: [...], currentPage: ..., totalPages: ..., totalCount: ... }
            if (response.data && Array.isArray(response.data.logs)) {
                setLogs(response.data.logs);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
                setTotalCount(response.data.totalCount);
            } else {
                console.error("Unexpected data structure received for logs:", response.data);
                setLogs([]);
            }

        } catch (err) {
            console.error("Error fetching activity logs:", err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch logs.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch logs when component mounts or page changes
    useEffect(() => {
        fetchActivityLogs(currentPage);
    }, [currentPage]); // Re-fetch when currentPage state changes

    // --- Helper function to format timestamp ---
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            // More detailed format
            return new Date(timestamp).toLocaleString('en-US', {
                dateStyle: 'medium', // e.g., Mar 31, 2025
                timeStyle: 'short'   // e.g., 3:45 AM
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    // --- Pagination Handlers ---
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // --- Render Logic ---
    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
                Activity Logs
            </h2>

            {isLoading && <p className="text-center text-gray-500 py-10">Loading logs...</p>}
            {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">Error: {error}</p>}

            {!isLoading && !error && (
                <>
                    <div className="overflow-x-auto shadow-md sm:rounded-lg mb-6">
                        <table className="w-full text-sm text-left text-gray-500 ">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Timestamp</th>
                                    <th scope="col" className="px-6 py-3">User</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                    <th scope="col" className="px-6 py-3">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center px-6 py-4">No activity logs found.</td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log._id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{formatTimestamp(log.timestamp)}</td>
                                            <td className="px-6 py-4">{log.userId?.username || log.userId?.email || 'N/A'}</td>
                                            <td className="px-6 py-4">{log.action}</td>
                                            <td className="px-6 py-4">
                                                {/* Display relevant details based on action */}
                                                {log.action === 'RankUpdated' && `Points: ${log.pointsChange}, Rank: ${log.oldRank || 'N/A'} -> ${log.newRank || 'N/A'}`}
                                                {log.details && ` (${log.details})`}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage <= 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages} (Total: {totalCount} logs)
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminLogsPage;