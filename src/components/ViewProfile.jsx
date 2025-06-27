import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/themeContext";

function ProfileCard() {
  const { darkMode } = useTheme();  
  const [userData, setUserData] = useState({
    name: "John Doe",
    username: "johndoe",
    email: "johndoe@example.com",
    role: "User",
    faculty_role: "",
    date_joined: ""
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user"));
    console.log("Stored User Data:", storedData);  // Debugging log

    if (storedData) {
      setUserData({
        ...storedData,
        date_joined: formatDate(storedData.date_joined) // Format date before setting state
      });
    }
  }, []);

  // Function to format the date from ISO to a readable format
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A"; 
    console.log("Raw Date Value:", isoDate); // Debugging log
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-2xl p-6 sm:p-8 border-2 rounded-lg shadow-lg mt-10 ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <motion.h2
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-center mb-6"
      >
        User Profile
      </motion.h2>
      
      <div className="flex flex-col items-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div className="w-32 h-32 flex items-center justify-center rounded-full bg-blue-300 text-white text-4xl font-bold shadow-md">
            {getInitial(userData.username)}
          </div>
        </motion.div>
        
        <motion.h2 
          className="mt-4 text-2xl font-semibold"
          whileHover={{ scale: 1.03 }}
        >
          {userData.name}
        </motion.h2>
        
        <motion.p className="text-blue-500 font-medium">
          Username: {userData.username}
        </motion.p>
        
        <motion.p className={`mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          {userData.role}
        </motion.p>
        
        <div className="mt-6 w-full space-y-3">
          <motion.div 
            className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
            whileHover={{ scale: 1.01 }}
          >
            <p><strong>Email:</strong> {userData.email}</p>
          </motion.div>
          
          <motion.div 
            className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
            whileHover={{ scale: 1.01 }}
          >
            <p><strong>Role:</strong> {userData.role}</p>
          </motion.div>
          
          {userData.role === 'faculty' && (
            <motion.div 
              className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
              whileHover={{ scale: 1.01 }}
            >
              <p><strong>Faculty Role:</strong> {userData.faculty_role}</p>
            </motion.div>
          )}
          
          <motion.div 
            className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
            whileHover={{ scale: 1.01 }}
          >
            <p><strong>Member Since:</strong> {userData.date_joined}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileCard;
