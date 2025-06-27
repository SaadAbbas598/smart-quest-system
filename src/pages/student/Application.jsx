import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import ApplicationForm from "../../components/ViewApplication";
import { motion } from "framer-motion";
import Notifications from "../../components/Notifications";
import { useTheme } from "../../context/themeContext";
import { useParams } from "react-router-dom";

const Application = () => {
  const { id } = useParams(); // Extract the ID from the URL

  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const userData = localStorage.getItem("user");
  const user = JSON.parse(userData);
  const role = user.role;

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar role={role} />
      </div>

      {/* Main Content - Centered Application */}
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-full" // Increased max-width to full
        >
          <ApplicationForm id={id} />
        </motion.div>
      </main>

      {/* Notifications Panel */}
      <div className="w-64">
        <Notifications />
      </div>
    </div>
  );
};

export default Application;