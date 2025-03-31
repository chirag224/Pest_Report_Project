import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (formData.phone.length !== 10 || isNaN(formData.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    const signupData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        signupData,
        { withCredentials: true } // Include cookies with the request
      );
      console.log("Signup Successful:", response.data);
      alert("Signup successful!");
      navigate("/login"); // Navigate to login page after signup
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <InputField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" />
          <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
          <InputField label="Phone" type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" />
          <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
          <InputField label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <Button text="Sign Up" type="submit" color="green" />
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
