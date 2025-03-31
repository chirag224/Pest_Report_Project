import React, { useState } from "react";
import axios from "axios";
// Assuming these components exist and path is correct
import InputField from "../components/InputField";
import Button from "../components/Button";
// Removed Navbar import, assuming it's handled by UserLayout

const NewReport = () => {
  const [reportData, setReportData] = useState({
    location: "",
    pestTypes: [], // Store as array
    description: "",
  });
  const [photoFiles, setPhotoFiles] = useState([]); // Separate state for files
  const [error, setError] = useState('');       // State for errors
  const [success, setSuccess] = useState('');     // State for success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSuccess(''); // Clear success message on change
    setError('');   // Clear error message on change

    if (name === "pestTypes") {
        // Split by comma, trim whitespace from each item, filter out empty strings
        const typesArray = value.split(",")
                               .map(type => type.trim())
                               .filter(type => type.length > 0);
        setReportData({ ...reportData, [name]: typesArray });
    } else {
        setReportData({ ...reportData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setSuccess(''); // Clear success message on change
    setError('');   // Clear error message on change
    // Limit number of files (e.g., max 5 as per schema)
    const files = Array.from(e.target.files).slice(0, 5);
    setPhotoFiles(files); // Store File objects in separate state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');   // Clear previous errors
    setSuccess(''); // Clear previous success

    const token = localStorage.getItem("token"); // Use 'token' for regular user
    if (!token) {
      setError("Unauthorized! Please log in again.");
      alert("❌ Unauthorized! Please log in again."); // Keep alert or rely on UI message
      return;
    }

    // --- Prepare FormData ---
    const formDataToSend = new FormData();
    formDataToSend.append("location", reportData.location);
    // Send pestTypes as a JSON string array if backend expects that,
    // or loop and append each type if backend expects multiple fields with same name.
    // Assuming backend expects a JSON string array based on previous code:
    formDataToSend.append("pestTypes", JSON.stringify(reportData.pestTypes));
    formDataToSend.append("description", reportData.description);
    // Append files from photoFiles state
    photoFiles.forEach((file) => {
        formDataToSend.append("photos", file); // Use 'photos' as the key, matching backend multer setup
    });

    console.log("Submitting report..."); // Debug log

    try {
      // --- CHANGE IS HERE ---
      // Using relative path now
      const response = await axios.post(
        "/api/reports", // <<< Relative path
        formDataToSend,
        {
          headers: {
            // Content-Type is set automatically by browser for FormData
            // 'Content-Type': 'multipart/form-data', <<< Let browser set this
            "Authorization": `Bearer ${token}` // Send the user token
          }
        }
      );
      // --------------------

      console.log("Report submission response:", response.data); // Debug log
      setSuccess("✅ Report filed successfully!"); // Set success message
      alert("✅ Report filed successfully!"); // Keep alert or rely on UI message

      // Reset form fields and file state
      setReportData({ location: "", pestTypes: [], description: "" });
      setPhotoFiles([]);
      // Reset file input visually (common trick)
      if(e.target.elements.namedItem('photos')) {
         e.target.elements.namedItem('photos').value = '';
      }


    } catch (err) {
      console.error("Error submitting report:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.msg || err.message || "Unknown error occurred.";
      setError(`⚠️ Error submitting report: ${errorMsg}`);
      alert(`⚠️ Error submitting report: ${errorMsg}`); // Keep alert or rely on UI message
    }
  };

  return (
    // Assuming UserLayout provides outer structure and padding
    <div>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          🐞 File a Pest Report
        </h2>
        {/* Display Success/Error Messages */}
        {success && <p className="text-green-600 bg-green-100 p-3 rounded text-center mb-4">{success}</p>}
        {error && <p className="text-red-600 bg-red-100 p-3 rounded text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="📍 Location" type="text" name="location"
            value={reportData.location} onChange={handleChange}
            placeholder="Enter the location" required
          />

          <InputField
            label="🐜 Pest Types (comma-separated)" type="text" name="pestTypes"
            // Display array joined by comma for input field value
            value={reportData.pestTypes.join(", ")}
            onChange={handleChange}
            placeholder="E.g. Ants, Cockroaches" required
          />

          <div>
            <label className="block text-gray-700 font-medium mb-1">📝 Description</label>
            <textarea
              name="description" value={reportData.description} onChange={handleChange}
              placeholder="Describe the pest situation..." required
              className="p-2 border border-gray-300 rounded w-full resize-none h-24 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
                📸 Upload Photos (Max 5)
            </label>
            <input
              type="file" name="photos" // Name used in FormData
              onChange={handleFileChange} multiple
              accept="image/png, image/jpeg, image/jpg" // Accept specific image types
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {/* Display names of selected files (optional) */}
            {photoFiles.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                    {photoFiles.map(file => <li key={file.name}>{file.name} ({ (file.size / 1024).toFixed(1) } KB)</li>)}
                </ul>
            )}
          </div>

          <div className="text-center">
            <Button type="submit" text="🚀 Submit Report" color="blue" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewReport;