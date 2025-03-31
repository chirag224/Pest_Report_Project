import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaStar, FaTrophy } from "react-icons/fa";
import InputField from "../components/InputField";
import Button from "../components/Button";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found. User not logged in.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:3000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        const user = response.data.user;
        user.rank = calculateRank(user.total_points);
        setUserData(user);
        setOriginalUserData(user);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching profile data:", error);
        setLoading(false);
      });
  }, []);

  const calculateRank = (points) => {
    if (points >= 26) return "Expert";
    if (points >= 16) return "Advanced";
    if (points >= 11) return "Intermediate";
    return "Novice";
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (JSON.stringify(userData) === JSON.stringify(originalUserData)) {
      alert("No changes made to the profile.");
      setEditing(false);
      return;
    }

    const token = localStorage.getItem("token");

    axios
      .put("http://localhost:3000/api/user/profile", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        alert("✅ Profile updated successfully");
        const updatedUser = response.data.user;
        updatedUser.rank = calculateRank(updatedUser.total_points);
        setUserData(updatedUser);
        setOriginalUserData(updatedUser);
        setEditing(false);
      })
      .catch((error) => console.error("❌ Error updating profile:", error));
  };
  
 

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      <div className="flex justify-center items-center flex-grow p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg border border-gray-300">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">My Profile</h2>

          {loading ? (
            <p className="text-center text-gray-500">⏳ Loading profile...</p>
          ) : userData ? (
            <>
              {!editing ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 border-b pb-4">
                    <FaUser className="text-blue-500 text-2xl" />
                    <p className="text-lg">
                      <span className="font-semibold">Username:</span> {userData.username}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 border-b pb-4">
                    <FaEnvelope className="text-green-500 text-2xl" />
                    <p className="text-lg">
                      <span className="font-semibold">Email:</span> {userData.email}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 border-b pb-4">
                    <FaPhone className="text-orange-500 text-2xl" />
                    <p className="text-lg">
                      <span className="font-semibold">Phone:</span> {userData.phone}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 border-b pb-4">
                    <FaStar className="text-yellow-500 text-2xl" />
                    <p className="text-lg">
                      <span className="font-semibold">Total Points:</span> {userData.total_points}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <FaTrophy className="text-purple-500 text-2xl" />
                    <p className="text-lg">
                      <span className="font-semibold">Rank:</span> {userData.rank}
                    </p>
                  </div>

                  <Button type="button" onClick={() => setEditing(true)} text="Edit Profile" color="blue" className="mt-6 w-full" />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <InputField label="Username" type="text" name="username" value={userData.username} onChange={handleChange} />
                  <InputField label="Email" type="email" name="email" value={userData.email} onChange={handleChange} />
                  <InputField label="Phone" type="text" name="phone" value={userData.phone} onChange={handleChange} />

                  <InputField label="Total Points" type="number" name="total_points" value={userData.total_points} disabled={true} />
                  <InputField label="Rank" type="text" name="rank" value={userData.rank} disabled={true} />

                  <div className="flex justify-between mt-6">
                    <Button type="submit" text="Save" color="blue" className="w-1/2" />
                    <Button type="button" onClick={() => setEditing(false)} text="Cancel" color="red" className="w-1/2" />
                  </div>
                </form>
              )}
            </>
          ) : (
            <p className="text-center text-red-500">❌ Error loading profile data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;