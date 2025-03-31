import React, { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import Button from "../components/Button";

const NewReport = () => {
  const [reportData, setReportData] = useState({
    location: "",
    pestTypes: [],
    description: "",
    photos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData({
      ...reportData,
      [name]: name === "pestTypes" ? value.split(",") : value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setReportData({ ...reportData, photos: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Unauthorized! Please log in again.");
      return;
    }

    console.log("Token being sent:", token);

    const formData = new FormData();
    formData.append("location", reportData.location);
    formData.append("pestTypes", JSON.stringify(reportData.pestTypes));
    formData.append("description", reportData.description);
    reportData.photos.forEach((file) => formData.append("photos", file));

    try {
      const response = await axios.post("http://localhost:3000/api/reports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });

      alert("✅ Report filed successfully!");
      setReportData({
        location: "",
        pestTypes: [],
        description: "",
        photos: [],
      });
    } catch (error) {
      console.log("Axios Error:", error);
      alert(`⚠️ Error submitting report: ${error.response?.data?.message || error.message}`);
    }
  };
  
 ;

  return (
    <div>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          🐞 File a Pest Report
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="📍 Location"
            type="text"
            name="location"
            value={reportData.location}
            onChange={handleChange}
            placeholder="Enter the location"
          />

          <InputField
            label="🐜 Pest Types (comma-separated)"
            type="text"
            name="pestTypes"
            value={reportData.pestTypes.join(",")}
            onChange={handleChange}
            placeholder="E.g. Ants, Cockroaches"
          />

          <div>
            <label className="block text-gray-700 font-medium mb-1">📝 Description</label>
            <textarea
              name="description"
              value={reportData.description}
              onChange={handleChange}
              placeholder="Describe the pest situation..."
              className="p-2 border border-gray-300 rounded w-full resize-none h-24 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">📸 Upload Photos</label>
            <input
              type="file"
              name="photos"
              onChange={handleFileChange}
              multiple
              className="p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500"
            />
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