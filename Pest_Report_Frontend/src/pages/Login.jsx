import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField"; // Assuming these exist
import Button from "../components/Button";       // Assuming these exist
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); // For error message
  const navigate = useNavigate(); // For navigation after successful login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
      // --- CHANGE IS HERE ---
      // Using relative path now, axios will prepend the baseURL
      const response = await axios.post(
          '/api/auth/login', // <<< Relative path used here
          formData,
          { withCredentials: true } // Keep this if you specifically need cookies handled by browser
        );
      // --------------------

      if (response.data.token) {
        // Store the regular user token
        localStorage.setItem("token", response.data.token);
        navigate("/profile"); // Navigate to profile after successful user login
      } else {
        // Handle cases where backend might not send a token but a message
        setErrorMessage(response.data.message || "Login successful, but no token received.");
      }
    } catch (error) {
      console.error("Login error:", error);
      // Display error from backend response if available
      setErrorMessage(error.response?.data?.msg || error.response?.data?.message || "An error occurred during login. Please check credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">User Login</h2>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
          <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
          <Button text="Login" type="submit" color="blue" />
        </form>
        <p className="text-center mt-4 text-gray-600">
          Haven't yet registered? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
        <p className="text-center mt-4 text-gray-600"> <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link> </p>
      </div>
    </div>
  );
};

export default Login;