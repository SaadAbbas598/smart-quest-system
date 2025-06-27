import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/themeContext";
import Notifications from "../../../components/Notifications";
import Sidebar from "../../../components/SideBar";
import ProfileCard from "../../../components/ViewProfile";

function FacultyProfile() {
  const { darkMode } = useTheme();
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null; // Parse userData safely
  const role = user ? user.role : ""; // Ensure faculty_role is not undefined
  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
    <Sidebar role={role} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
        <div className="w-full max-w-8xl">
          <ProfileCard
            name="John Doe" 
            username="johndoe" 
            email="johndoe@example.com" 
          />
        </div>
      </main>

      {/* Notifications Panel */}
      <Notifications />
    </div>
  );
}

export default FacultyProfile;