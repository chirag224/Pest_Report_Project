import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaStar, FaTrophy } from "react-icons/fa";
// Assuming these components exist and path is correct
import InputField from "../components/InputField";
import Button from "../components/Button";
// Removed Navbar import, assuming UserLayout handles it

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Add error state

  // Fetch profile data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found. User not logged in.");
      setError("User not logged in. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    // --- CHANGE IS HERE (GET Request) ---
    axios
      .get("/api/user/profile", { // <<< Relative path
        headers: { Authorization: `Bearer ${token}` },
        // withCredentials: true, // Usually not needed when sending Bearer token
      })
      // ---------------------------------
      .then((response) => {
        const user = response.data.user || response.data; // Adjust based on backend response structure
        // Ensure total_points exists before calculating rank
        user.total_points = user.total_points || 0;
        // You might not need to calculate rank here if backend sends it
        // user.rank = calculateRank(user.total_points);
        user.rank = user.rank || calculateRank(user.total_points); // Use backend rank or calculate
        setUserData(user);
        setOriginalUserData(JSON.parse(JSON.stringify(user))); // Deep copy for comparison
      })
      .catch((error) => {
        console.error("❌ Error fetching profile data:", error);
        setError(error.response?.data?.message || "Failed to load profile.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Run once on mount

  // Function to calculate rank (if needed on frontend)
  const calculateRank = (points = 0) => {
    if (points >= 26) return "Expert";
    if (points >= 16) return "Advanced";
    if (points >= 11) return "Intermediate";
    return "Novice";
  };

  const handleCancelEdit = () => {
      setUserData(JSON.parse(JSON.stringify(originalUserData))); // Restore original data
      setEditing(false);
      setError(''); // Clear errors on cancel
  }

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (JSON.stringify(userData) === JSON.stringify(originalUserData)) {
      alert("ℹ️ No changes detected.");
      setEditing(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication error. Please log in again.");
      return;
    }

    // Exclude points and rank from being sent if they are not editable
    const { total_points, rank, ...updateData } = userData;

    try {
      // --- CHANGE IS HERE (PUT Request) ---
      const response = await axios.put(
        "/api/user/profile", // <<< Relative path
        updateData,          // Send only editable data
        {
          headers: { Authorization: `Bearer ${token}` },
          // withCredentials: true, // Usually not needed with Bearer token
        }
      );
      // ----------------------------------

      alert("✅ Profile updated successfully!"); // Or use a more subtle notification
      const updatedUser = response.data.user || response.data; // Adjust based on backend response
      updatedUser.total_points = updatedUser.total_points || 0;
      // Recalculate or use rank sent from backend
      updatedUser.rank = updatedUser.rank || calculateRank(updatedUser.total_points);
      setUserData(updatedUser);
      setOriginalUserData(JSON.parse(JSON.stringify(updatedUser))); // Update original data
      setEditing(false);

    } catch (err) {
        console.error("❌ Error updating profile:", err);
        setError(err.response?.data?.message || "Failed to update profile.");
        // Optional: Restore original data on error?
        // setUserData(JSON.parse(JSON.stringify(originalUserData)));
    }
  };

  return (
    // Assuming UserLayout provides outer structure and padding
    <div>
      <div className="flex justify-center items-center flex-grow p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">My Profile</h2>

          {/* Loading State */}
          {loading && <p className="text-center text-gray-500 py-10">⏳ Loading profile...</p>}

          {/* Error State */}
          {!loading && error && <p className="text-center text-red-600 bg-red-100 p-3 rounded mb-4">{error}</p>}

          {/* Profile Display/Edit Form */}
          {!loading && !error && userData ? (
            <>
              {!editing ? (
                // --- Display Mode ---
                <div className="space-y-4">
                  {/* Added nullish coalescing for safer rendering */}
                  <div className="flex items-center space-x-3 border-b pb-3"> <FaUser className="text-blue-500 text-xl" /> <p><span className="font-semibold">Username:</span> {userData.username ?? 'N/A'}</p> </div>
                  <div className="flex items-center space-x-3 border-b pb-3"> <FaEnvelope className="text-green-500 text-xl" /> <p><span className="font-semibold">Email:</span> {userData.email ?? 'N/A'}</p> </div>
                  <div className="flex items-center space-x-3 border-b pb-3"> <FaPhone className="text-orange-500 text-xl" /> <p><span className="font-semibold">Phone:</span> {userData.phone ?? 'N/A'}</p> </div>
                  <div className="flex items-center space-x-3 border-b pb-3"> <FaStar className="text-yellow-500 text-xl" /> <p><span className="font-semibold">Total Points:</span> {userData.total_points ?? 0}</p> </div>
                  <div className="flex items-center space-x-3"> <FaTrophy className="text-purple-500 text-xl" /> <p><span className="font-semibold">Rank:</span> {userData.rank ?? 'N/A'}</p> </div>
                  <Button type="button" onClick={() => { setEditing(true); setError(''); }} text="Edit Profile" color="blue" className="mt-6 w-full" />
                </div>
              ) : (
                // --- Editing Mode ---
                <form onSubmit={handleSubmit} className="space-y-4">
                  <InputField label="Username" type="text" name="username" value={userData.username ?? ''} onChange={handleChange} required/>
                  <InputField label="Email" type="email" name="email" value={userData.email ?? ''} onChange={handleChange} required/>
                  <InputField label="Phone" type="tel" name="phone" value={userData.phone ?? ''} onChange={handleChange} required/>
                  {/* Display Points and Rank but disable editing */}
                  <InputField label="Total Points" type="number" name="total_points" value={userData.total_points ?? 0} disabled={true} readOnly />
                  <InputField label="Rank" type="text" name="rank" value={userData.rank ?? 'N/A'} disabled={true} readOnly />

                  <div className="flex justify-between items-center gap-4 mt-6">
                    <Button type="button" onClick={handleCancelEdit} text="Cancel" color="gray" className="flex-1" />
                    <Button type="submit" text="Save Changes" color="blue" className="flex-1" />
                  </div>
                </form>
              )}
            </>
          ) : (
            // Only show if not loading and no specific error, but data is null
            !loading && !error && <p className="text-center text-gray-500">Could not load profile data.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;