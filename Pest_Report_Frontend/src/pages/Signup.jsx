import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField"; // Assuming path is correct
import Button from "../components/Button";       // Assuming path is correct
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [error, setError] = useState(null); // For error message
  const navigate = useNavigate(); // For navigation after successful signup

  const handleChange = (e) => {
    setError(null); // Clear error on change
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // --- Frontend validation ---
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    // Basic phone validation (adjust regex if needed for specific formats)
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    // ------------------------

    // Data to send to backend (exclude confirmPassword)
    const signupData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    };

    try {
      // --- CHANGE IS HERE ---
      // Using relative path now
      const response = await axios.post(
        "/api/auth/signup", // <<< Relative path
        signupData
        // Removed { withCredentials: true } unless specifically needed for cookie-based sessions
        // For JWT, usually only need Authorization header on subsequent requests, not signup
      );
      // --------------------

      console.log("Signup Successful:", response.data);
      alert("Signup successful! Please log in."); // Give clear feedback
      navigate("/login"); // Navigate to login page after successful signup

    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      // Display error from backend if available
      setError(err.response?.data?.message || err.response?.data?.msg || "Signup failed! Please check your details or try a different username/email.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Using InputField components */}
          <InputField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" required />
          <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
          <InputField label="Phone (10 digits)" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your 10-digit phone number" required maxLength={10} />
          <InputField label="Password (min 6 chars)" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
          <InputField label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" required />

          {/* Display Error Message */}
          {error && <div className="text-red-500 text-sm text-center mt-2 p-2 bg-red-50 rounded">{error}</div>}

          <Button text="Sign Up" type="submit" color="green" className="w-full" />
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
        <p className="text-center mt-4 text-gray-600"> <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link> </p>
      </div>
    </div>
  );
};

export default Signup;