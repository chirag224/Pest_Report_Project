// src/pages/admin/AdminReportsPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Removed Navbar import - it's handled by AdminLayout
import ReportCard from '../components/ReportCard'; // <<< Corrected path (up two levels)
// Import Icons if needed for modal
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/Icons'; // <<< Corrected path (up two levels)

const AdminReportsPage = () => {
    // --- State Variables ---
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // State for image modal
    const [selectedReportImages, setSelectedReportImages] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // --- Navbar Links Definition Removed - Handled by AdminLayout ---

    // --- Fetch Reports ---
    const fetchReports = async () => {
        setIsLoading(true);
        setError(null);
        console.log("Fetching reports for admin...");
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error("Admin token not found. Please login.");
            }

            const response = await axios.get('http://localhost:3000/api/admin/reports', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("Reports fetched:", response.data);

            // Ensure setting state with the reports array
            if (response.data && Array.isArray(response.data.reports)) {
                setReports(response.data.reports);
            } else {
                console.error("Received data.reports is not an array:", response.data);
                setReports([]);
            }

        } catch (err) {
            console.error("Error fetching reports:", err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch reports.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch reports when component mounts
    useEffect(() => {
        fetchReports();
    }, []);

    // --- Handle Status Update ---
    const handleMarkStatus = async (reportId, newStatus) => {
        // ... (handleMarkStatus function remains the same) ...
        console.log(`Attempting to mark report ${reportId} as ${newStatus}`);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error("Admin token not found.");
            const response = await axios.put(
                `http://localhost:3000/api/admin/reports/${reportId}/status`,
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            console.log("Mark status response:", response.data);
            setReports(prevReports =>
                prevReports.map(report =>
                    report._id === reportId ? { ...report, status: newStatus } : report
                )
            );
            alert(`Report successfully marked as ${newStatus}!`);
        } catch (err) {
            console.error(`Error marking report ${reportId} as ${newStatus}:`, err);
            alert(`Failed to mark report as ${newStatus}. ${err.response?.data?.msg || err.message}`);
        }
    };

    // --- Image Modal Handlers ---
    const handleImageClick = (photos) => { if(photos && photos.length>0){setSelectedReportImages(photos); setCurrentImageIndex(0);}};
    const closeModal = () => setSelectedReportImages(null);
    const showNextImage = (e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev < selectedReportImages.length - 1 ? prev + 1 : 0); };
    const showPrevImage = (e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev > 0 ? prev - 1 : selectedReportImages.length - 1); };
    // --- End Image Modal Handlers ---

    // --- Return JSX ---
    // No surrounding <div> needed if AdminLayout provides structure
    // Removed <Navbar /> component
    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8"> {/* Keep container if Layout doesn't provide it */}
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
                Manage Pest Reports
            </h2>

            {/* Loading and Error States */}
            {isLoading && <p className="text-center text-gray-500 py-10">Loading reports...</p>}
            {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">Error: {error}</p>}

            {/* No Reports Message */}
            {!isLoading && !error && reports.length === 0 && (
                <p className="text-center text-gray-600 mt-10 text-lg">No reports found to manage.</p>
            )}

            {/* Reports Grid */}
            {!isLoading && !error && reports.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {reports.map((report) => (
                        <ReportCard
                            key={report._id}
                            report={report}
                            isAdminView={true}
                            onMarkStatus={handleMarkStatus}
                            onImageClick={handleImageClick}
                        />
                    ))}
                </div>
            )}

            {/* --- Image Modal --- */}
            {selectedReportImages && (
                <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50 p-4" onClick={closeModal}>
                    {/* Modal content remains the same */}
                    <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50" onClick={(e) => { e.stopPropagation(); closeModal(); }} aria-label="Close image viewer"><CloseIcon /></button>
                    <div className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}> <img src={`http://localhost:3000/${selectedReportImages[currentImageIndex]}`} alt={`Report Image ${currentImageIndex + 1}`} className="block object-contain max-w-full max-h-full rounded-lg shadow-xl" /></div>
                    {selectedReportImages.length > 1 && (<> <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 z-50" onClick={showPrevImage} aria-label="Previous image"><ChevronLeftIcon /></button> <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 z-50" onClick={showNextImage} aria-label="Next image"><ChevronRightIcon /></button> <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">{`${currentImageIndex + 1} / ${selectedReportImages.length}`}</div></>)}
                </div>
            )}
            {/* --- End Image Modal --- */}

        </div> // End container div
    );
};

export default AdminReportsPage;