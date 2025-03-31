// src/pages/PreviousReports.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReportCard from "../components/ReportCard"; // Use corrected path if needed
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "../components/Icons"; // Use corrected path if needed

// Assuming Navbar is handled by UserLayout

const PreviousReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReportImages, setSelectedReportImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Define backendUrl using Vite env variable ---
  // Read during build on Render, fallback for local dev
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  // ------------------------------------------------

  // Fetch user's reports
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { /* ... error handling ... */ setError("Not logged in."); setIsLoading(false); return; }

    setIsLoading(true);
    setError(null);

    axios
      .get("/api/reports/my-reports", { // <<< Relative path (Corrected previously)
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
            setReports(response.data);
        } else {
            console.error("Expected an array of reports, received:", response.data);
            setReports([]);
        }
      })
      .catch((err) => { /* ... error handling ... */ setError(err.response?.data?.message || "Failed to fetch reports."); })
      .finally(() => { setIsLoading(false); });
  }, []);

  // --- Modal Logic ---
  const handleImageClick = (photos) => { if (photos && photos.length > 0) { setSelectedReportImages(photos); setCurrentImageIndex(0); }};
  const closeModal = () => setSelectedReportImages(null);
  const showNextImage = (e) => { e.stopPropagation(); setCurrentImageIndex((prev) => prev < selectedReportImages.length - 1 ? prev + 1 : 0); };
  const showPrevImage = (e) => { e.stopPropagation(); setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : selectedReportImages.length - 1); };
  // --- End Modal Logic ---


  return (
    // Assuming UserLayout provides outer structure
    <div>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-3xl mb-8 font-bold text-gray-800 text-center tracking-tight">
          Previous Reports
        </h2>

        {/* Loading/Error/No Reports states */}
        {isLoading && <p className="text-center text-gray-500">Loading your reports...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!isLoading && !error && reports.length === 0 && <p className="text-center text-gray-600 mt-10 text-lg">No reports filed yet.</p>}

        {/* Grid */}
        {!isLoading && !error && reports.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {reports.map((report) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  isAdminView={false}
                  onImageClick={handleImageClick}
                  // Note: backendUrl defined above could also be passed as a prop to ReportCard
                  // instead of defining it in both places, if preferred.
                />
              ))}
            </div>
          )
        }

        {/* --- Image Modal --- */}
        {selectedReportImages && (
          <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50 p-4" onClick={closeModal} >
             <button className="absolute top-4 right-4 text-white ..." onClick={(e) => { e.stopPropagation(); closeModal(); }} aria-label="Close image viewer"><CloseIcon /></button>
             <div className="relative max-w-[90vw] max-h-[85vh] flex ..." onClick={(e) => e.stopPropagation()}>
                {/* === CHANGE IS HERE === */}
                <img
                    // Construct full URL using backendUrl + relative path from state
                    src={`${backendUrl}/${selectedReportImages[currentImageIndex]}`}
                    alt={`Zoomed Image ${currentImageIndex + 1}`}
                    className="block object-contain max-w-full max-h-full rounded-lg shadow-xl"
                />
                {/* === END CHANGE === */}
            </div>
             {selectedReportImages.length > 1 && (
                <>
                    {/* Modal Nav Buttons */}
                    <button className="absolute left-4 ..." onClick={showPrevImage} aria-label="Previous image"><ChevronLeftIcon /></button>
                    <button className="absolute right-4 ..." onClick={showNextImage} aria-label="Next image"><ChevronRightIcon /></button>
                    <div className="absolute bottom-4 ...">{`${currentImageIndex + 1} / ${selectedReportImages.length}`}</div>
                </>
             )}
          </div>
        )}
        {/* --- End Image Modal --- */}

      </div>
    </div>
  );
};

export default PreviousReports;