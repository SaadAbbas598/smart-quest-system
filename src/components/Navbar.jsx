import React, { useState } from "react";
import {
  FaSearch,
  FaMoon,
  FaSun,
  FaUser,
  FaKey,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/themeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const { darkMode, setDarkMode } = useTheme();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const user = JSON.parse(userData);
  const username = user?.username || "";
  const role = user?.role || "";

  // Determine base path based on user role
  const basePath =
    role === "faculty" ? "/faculty" : role === "admin" ? "/admin" : "/student";

  // Get the first letter of the username and capitalize it
  const profileInitial = username ? username.charAt(0).toUpperCase() : "";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setProfileOpen(false);

    toast.info("Logging out... Redirecting to login page", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: darkMode ? "dark" : "light",
    });

    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <>
      <ToastContainer />
      <nav
        className={`w-full p-3 shadow-sm fixed top-0 left-0 right-0 z-50 transition-all ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex items-center justify-between px-4">
          {/* Brand Name */}
          <div className="text-xl font-bold">Smart Quest</div>

          {/* Menu Button for Small Screens */}
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="md:hidden text-2xl"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="px-4 py-2 pl-10 border rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
            </div>

            {/* Dark Mode Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className="w-12 h-12 rounded-full overflow-hidden shadow-md flex items-center justify-center bg-blue-500 text-white font-bold text-xl"
                onClick={() => setProfileOpen(!isProfileOpen)}
              >
                {profileInitial}
              </button>
              {isProfileOpen && (
                <div
                  className={`absolute right-0 mt-2 w-56 shadow-lg rounded-lg overflow-hidden z-50 transition-all ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <div className="p-4 flex items-center gap-3 border-b">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      {profileInitial}
                    </div>
                    <div>
                      <p className="font-semibold">{username}</p>
                      <p className="text-sm text-gray-500">{role}</p>
                    </div>
                  </div>
                  <Link
                    to={`${basePath}/view-profile`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 transition"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FaUser /> Profile
                  </Link>
                  <Link
                    to={`${basePath}/change-password`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 transition"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FaKey /> Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-200 transition text-left"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;