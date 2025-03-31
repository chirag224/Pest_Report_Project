// src/pages/AdminLogin.js (or components)
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
// Assuming you have these custom components, otherwise use standard inputs/buttons
import InputField from "../components/InputField";
import Button from "../components/Button";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:3000/api/admin/login', // Using full URL as it worked
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token } = response.data;
      localStorage.setItem('adminToken', token); // Store token

      // --- Redirect to the Admin Reports Page ---
      console.log("Login successful, navigating to /admin/reports"); // Optional debug log
      navigate('/admin/reports'); // <<< CHANGED HERE

    } catch (err) {
      console.error("--- Full Error Object Caught ---");
      console.error(err);
      console.error("--- End Full Error Object ---");
      console.error("Admin Login Error Details:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || 'Login failed. Please check credentials or server connection.');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Replace InputField/Button with standard elements if needed */}
          <InputField
            label="Admin Email" type="email" name="email"
            value={formData.email} onChange={handleChange}
            placeholder="Enter admin email" required
          />
          <InputField
            label="Password" type="password" name="password"
            value={formData.password} onChange={handleChange}
            placeholder="Enter password" required
          />
          {error && (
            <p className="text-red-500 text-sm text-center my-3">{error}</p>
          )}
          <Button text="Login as Admin" type="submit" color="red" />
        </form>
        <p className="text-center mt-4 text-gray-600">
          <Link to="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;