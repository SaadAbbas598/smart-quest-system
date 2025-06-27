import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import Preloader from "./Preloader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../../context/themeContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "student",
    faculty_role: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preLoading, setPreLoading] = useState(true);
  const [showFacultyPopup, setShowFacultyPopup] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    setTimeout(() => {
      setPreLoading(false);
    }, 2000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "role" && value === "faculty") {
      setShowFacultyPopup(true);
    }
  };

  const handleFacultyRoleChange = (e) => {
    setFormData({ ...formData, faculty_role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/register/",
        formData
      );
      toast.success(response.data.message || "Signup successful!", {
        position: "top-center",
      });

      setTimeout(() => {
        navigate("/verify-account");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        let errorMessages = [];

        for (const key in errors) {
          if (key !== "role" && Array.isArray(errors[key])) {
            errorMessages.push(`${errors[key].join(", ")}`);
          }
        }

        if (errorMessages.length > 0) {
          toast.error(errorMessages.join("\n"), { position: "top-center" });
        } else {
          toast.error("Signup failed. Try again.", { position: "top-center" });
        }
      } else {
        toast.error("Signup failed. Try again.", { position: "top-center" });
      }
    }

    setLoading(false);
  };

  const closeFacultyPopup = () => {
    if (formData.faculty_role) {
      setFormData({ ...formData, role: "faculty" });
    } else {
      setFormData({ ...formData, role: "student" });
    }
    setShowFacultyPopup(false);
  };

  if (preLoading) {
    return <Preloader />;
  }

  return (
    <div
      className={`flex h-screen transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-r from-blue-50 to-purple-50"
      }`}
    >
      <ToastContainer />
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-4">
        <div
          className={`w-full max-w-md rounded-xl shadow-lg p-6 transition-all ${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className={`text-sm mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Join us to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Username */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Username
              </label>
              <div
                className={`flex items-center border rounded-lg px-3 py-2 hover:shadow-md transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <FaUser className={`mr-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  className={`w-full outline-none text-sm bg-transparent ${
                    darkMode ? "text-white placeholder-gray-400" : "text-gray-700"
                  }`}
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Email
              </label>
              <div
                className={`flex items-center border rounded-lg px-3 py-2 hover:shadow-md transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <FaEnvelope className={`mr-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  className={`w-full outline-none text-sm bg-transparent ${
                    darkMode ? "text-white placeholder-gray-400" : "text-gray-700"
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Password
              </label>
              <div
                className={`flex items-center border rounded-lg px-3 py-2 hover:shadow-md transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <FaLock className={`mr-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className={`w-full outline-none text-sm bg-transparent ${
                    darkMode ? "text-white placeholder-gray-400" : "text-gray-700"
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Confirm Password
              </label>
              <div
                className={`flex items-center border rounded-lg px-3 py-2 hover:shadow-md transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <FaLock className={`mr-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                <input
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm password"
                  className={`w-full outline-none text-sm bg-transparent ${
                    darkMode ? "text-white placeholder-gray-400" : "text-gray-700"
                  }`}
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full text-sm border rounded-lg px-3 py-2 outline-none hover:shadow-md transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-medium text-sm mt-2 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-4">
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-purple-600 hover:text-purple-500 font-medium"
              >
                Login
              </NavLink>
            </p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-4">
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
          <img
            src="https://www.soilsearch.in/assets/login-image.jpg"
            alt="Signup"
            className="w-full h-full object-cover transform transition-all duration-500 hover:scale-105"
          />
          <div className={`absolute inset-0 `}></div>
        </div>
      </div>

      {/* Faculty Role Popup */}
      {showFacultyPopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-xl p-4 w-full max-w-xs ${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          }`}>
            <h3 className="font-semibold text-lg mb-3">
              Select Faculty Role
            </h3>
            <select
              name="faculty_role"
              value={formData.faculty_role}
              onChange={handleFacultyRoleChange}
              className={`w-full text-sm border rounded-lg px-3 py-2 mb-4 outline-none ${
                darkMode ? "bg-gray-700 border-gray-600" : "border-gray-300"
              }`}
            >
              <option value="">Select Role</option>
              <option value="batch_advisor">Batch Advisor</option>
              <option value="chairman">Chairman</option>
              <option value="hostel_wardan">Hostel Wardan</option>
              <option value="hostel_incharge">Hostel Incharge</option>
              <option value="librarian">Librarian</option>
              <option value="dean">Dean</option>
              <option value="vc">VC</option>
            </select>
            <button
              onClick={closeFacultyPopup}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;