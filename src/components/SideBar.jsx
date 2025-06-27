import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaBars,
  FaCalendarAlt,
  FaUniversity,
  FaFileSignature,
  FaFileAlt,
} from "react-icons/fa";
import { MdFeedback } from "react-icons/md";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { useTheme } from "../context/themeContext";
import { useHiddenField } from "../context/hiddenValueContext";

function Sidebar({ role, isSidebarOpen }) {
  const { darkMode } = useTheme();
  const { setHiddenFieldValue } = useHiddenField();
  const basePath =
    role === "admin" ? "/admin" : role === "faculty" ? "/faculty" : "/student";
  const location = useLocation();

  // Determine if complaint is active
  const isComplaintActive =
    location.pathname.startsWith(`${basePath}-complaint`) ||
    location.pathname.startsWith("/student-complaint");

  return (
    <motion.aside
      initial={{ x: "-100%" }}
      animate={{ x: isSidebarOpen ? 0 : "-100%" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`w-60 shadow-md p-5 h-screen fixed top-16 left-0 z-30 overflow-y-auto lg:w-60 md:w-48 sm:w-40 max-sm:w-36 transition-all ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <nav className="space-y-2 flex-grow">
        <SidebarLink
          to={`${basePath}-dashboard`}
          currentPath={location.pathname}
          icon={<FaTachometerAlt />}
          onClick={() => setHiddenFieldValue("sideData", "")}
        >
          Dashboard
        </SidebarLink>

        <SidebarLink
          to={role === "student" ? "/student-complaint" : `${basePath}-complaint`}
          currentPath={location.pathname}
          icon={<FaFileSignature />}
          onClick={() => setHiddenFieldValue("sideData", "Complaint")}
          customActiveCheck={isComplaintActive}
        >
          Complaint
        </SidebarLink>

        <SidebarLink
          to={`${basePath}-request`}
          currentPath={location.pathname}
          icon={<FaFileAlt />}
          onClick={() => setHiddenFieldValue("sideData", "Request")}
        >
          Request
        </SidebarLink>

        {role !== "faculty" && (
          <SidebarLink
            to={`${basePath}-feedback`}
            currentPath={location.pathname}
            icon={<MdFeedback />}
            onClick={() => setHiddenFieldValue("sideData", "feedback")}
          >
            Feedback
          </SidebarLink>
        )}

        <SidebarLink
          to={`${basePath}-schedule`}
          currentPath={location.pathname}
          icon={<FaCalendarAlt />}
        >
          Schedule
        </SidebarLink>

        <SidebarLink
          to={`${basePath}-semester`}
          currentPath={location.pathname}
          icon={<FaUniversity />}
        >
          Semester
        </SidebarLink>
      </nav>
    </motion.aside>
  );
}

function SidebarLink({ to, currentPath, icon, children, onClick, customActiveCheck }) {
  const isActive =
    customActiveCheck !== undefined ? customActiveCheck : currentPath.startsWith(to);

  return (
    <Link to={to} className="block">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-3 h-auto w-full text-left px-4 py-2 rounded-lg transition-all mt-2 text-sm sm:text-base ${
          isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-200"
        }`}
        onClick={onClick}
      >
        {icon}
        {children}
      </motion.button>
    </Link>
  );
}

export default function Layout({ role, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex">
      <Navbar />
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 md:hidden w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center z-50"
      >
        <FaBars size={24} />
      </button>
      <Sidebar role={role} isSidebarOpen={isSidebarOpen} />
      <main
        className={`flex-1 p-5 mt-16 transition-all ${
          isSidebarOpen ? "ml-60 md:ml-60" : "ml-0 md:ml-60"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
