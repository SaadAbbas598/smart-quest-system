import React from "react";
import Schedule from "../../components/Schedule";
import Notifications from "../../components/Notifications";
import Sidebar from "../../components/SideBar";
import { useTheme } from "../../context/themeContext";

const SSchedule = () => {
    
  const { darkMode } = useTheme();

  
  // Fetch user data from localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : {};
  const role = user?.role || "";
  return (
    <div
      className={`flex min-h-screen mt-15 overflow-hidden ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <main className="flex flex-1 items-center p-6">
       <Schedule />
      </main>

      {/* Notifications Panel */}
      <Notifications />
    </div>
  );
};

export default SSchedule;
