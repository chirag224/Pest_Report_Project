// src/components/ReportCard.js
import React from 'react';

// Helper function for status styling (can be kept here or imported)
const getStatusClass = (status) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Invalid":
        return "bg-red-100 text-red-800 border border-red-200";
      default: // Handles "Pending"
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
};

// Reusable Report Card Component
const ReportCard = ({ report, isAdminView = false, onMarkStatus = null, onImageClick = null }) => {

    // Basic validation in case report data is missing
    if (!report) {
        return null; // Or render some placeholder/error
    }

    const {
        _id,
        location,
        description,
        pestTypes = [], // Default to empty array
        photos = [],    // Default to empty array
        status = 'Pending', // Default status
        submittedAt,
        userId // Only populated/used in admin view typically
    } = report;

    const handleCardImageClick = () => {
        if (onImageClick && photos.length > 0) {
            onImageClick(photos); // Call the handler passed from the parent
        }
    };

    return (
        <div
            // Card container styling from your PreviousReports page
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-[1.02] duration-300 ease-in-out border border-gray-100"
        >
            {/* --- Image Section --- */}
            <div className="flex-shrink-0">
                {photos.length > 0 ? (
                    <div
                        className="relative group cursor-pointer"
                        onClick={handleCardImageClick} // Use the handler
                    >
                        <img
                            src={`http://localhost:3000/${photos[0]}`}
                            alt={`Report at ${location}`}
                            className="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-90"
                            onError={(e) => { e.target.style.display = 'none'; }} // Basic error hide
                        />
                        {photos.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                                {photos.length} Images
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-sm italic">No Image Provided</span>
                    </div>
                )}
            </div>

            {/* --- Content Section --- */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate" title={location}>
                    {location}
                </h3>

                {/* Display Pest Types */}
                {pestTypes.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {pestTypes.map((pest, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-indigo-200">
                                {pest}
                            </span>
                        ))}
                    </div>
                )}

                {/* Display Description */}
                <p className="text-sm text-gray-600 mb-4 flex-grow" title={description}>
                    {description}
                </p>

                {/* Display User Info (Admin Only) */}
                {isAdminView && userId && (
                    <p className="text-xs text-gray-500 mt-1 mb-3 italic">
                        Submitted by: {userId.email || userId.username || 'N/A'} {/* Adjust based on populated fields */}
                    </p>
                )}


                {/* Status Badge */}
                <div className="mb-4">
                    <strong className="text-gray-600 text-xs font-medium mr-2">Status:</strong>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusClass(status)}`}>
                        {status}
                    </span>
                </div>

                {/* Action Buttons (Admin Only & Pending Status) */}
                {isAdminView && status === 'Pending' && typeof onMarkStatus === 'function' && (
                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end space-x-2">
                        <button
                            onClick={() => onMarkStatus(_id, 'Verified')}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            aria-label={`Mark report at ${location} as Verified`}
                        >
                            Verify
                        </button>
                        <button
                            onClick={() => onMarkStatus(_id, 'Invalid')}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            aria-label={`Mark report at ${location} as Invalid`}
                        >
                            Invalidate
                        </button>
                    </div>
                )}
            </div>

            {/* --- Footer Section (Date/Time) --- */}
            {/* Render footer only if not showing admin buttons OR status is not Pending */}
            {!(isAdminView && status === 'Pending') && (
                 <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto text-right">
                    <p className="text-xs text-gray-500 font-medium">
                        {submittedAt ? new Date(submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-400">
                        {submittedAt ? new Date(submittedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : ''}
                    </p>
                 </div>
            )}
        </div>
    );
};

export default ReportCard;