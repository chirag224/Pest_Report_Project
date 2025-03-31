// src/pages/PreviousReports.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReportCard from "../components/ReportCard"; // Use corrected path if needed
// Use corrected path if needed
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "../components/Icons";

// Assuming Navbar is handled by UserLayout, removed import

const PreviousReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReportImages, setSelectedReportImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's reports
  useEffect(() => {
    const token = localStorage.getItem("token"); // User token
    if (!token) {
      console.error("❌ Token not found. User not logged in.");
      setError("Not logged in.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // --- CHANGE IS HERE ---
    // Using relative path now
    axios
      .get("/api/reports/my-reports", { // <<< Relative path
        headers: { Authorization: `Bearer ${token}` },
      })
      // --------------------
      .then((response) => {
        // Assuming backend sends the array directly for this endpoint
        if (Array.isArray(response.data)) {
            setReports(response.data);
        } else {
            console.error("Expected an array of reports, received:", response.data);
            setReports([]); // Set empty array on unexpected data
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching reports:", err);
        setError(err.response?.data?.message || "Failed to fetch reports.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // Empty dependency array, runs once on mount

  // --- Modal Logic ---
  const handleImageClick = (photos) => { if (photos && photos.length > 0) { setSelectedReportImages(photos); setCurrentImageIndex(0); }};
  const closeModal = () => setSelectedReportImages(null);
  const showNextImage = (e) => { e.stopPropagation(); setCurrentImageIndex((prev) => prev < selectedReportImages.length - 1 ? prev + 1 : 0); };
  const showPrevImage = (e) => { e.stopPropagation(); setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : selectedReportImages.length - 1); };
  // --- End Modal Logic ---


  return (
    // Assuming UserLayout provides outer structure and padding
    <div>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-3xl mb-8 font-bold text-gray-800 text-center tracking-tight">
          Previous Reports
        </h2>

        {isLoading && <p className="text-center text-gray-500">Loading your reports...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!isLoading && !error && reports.length === 0 ? (
          <p className="text-gray-600 text-center mt-10 text-lg">No reports filed yet.</p>
        ) : (
          !isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {reports.map((report) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  isAdminView={false}
                  onImageClick={handleImageClick}
                />
              ))}
            </div>
          )
        )}

        {/* Image Modal */}
        {selectedReportImages && (
          <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50 p-4" onClick={closeModal} >
             {/* Modal content */}
             <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50" onClick={(e) => { e.stopPropagation(); closeModal(); }} aria-label="Close image viewer"><CloseIcon /></button>
             <div className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}> <img src={`http://localhost:3000/${selectedReportImages[currentImageIndex]}`} alt={`Zoomed Image ${currentImageIndex + 1}`} className="block object-contain max-w-full max-h-full rounded-lg shadow-xl" /></div>
             {selectedReportImages.length > 1 && (<> <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 z-50" onClick={showPrevImage} aria-label="Previous image"><ChevronLeftIcon /></button> <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 z-50" onClick={showNextImage} aria-label="Next image"><ChevronRightIcon /></button> <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">{`${currentImageIndex + 1} / ${selectedReportImages.length}`}</div></>)}
          </div>
        )}
        {/* End Image Modal */}

      </div>
    </div>
  );
};

export default PreviousReports;