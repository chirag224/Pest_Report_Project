import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
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

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", formData, { withCredentials: true });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/profile"); // Navigate to profile after successful login
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">User Login</h2>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
          <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
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
