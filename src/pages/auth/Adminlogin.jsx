import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../../context/themeContext";

function Adminlogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { darkMode } = useTheme(); // Get dark mode state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        email,
        password,
      });

      if (response.data) {
        console.log(response.data);

        // Store token and user details in localStorage
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            role: response.data.role,
            faculty_role: response.data.faculty_role,
          })
        );

        toast.success("Login successful! Redirecting...", {
          position: "top-center",
          autoClose: 3000,
        });

        // Redirect based on role
        setTimeout(() => {
          if (response.data.role === "admin") {
            navigate("/admin-dashboard");
          } else {
            toast.error("Unauthorized role. Please contact support.", {
              position: "top-center",
            });
          }
        }, 3000);
      } else {
        toast.error("Invalid login response.", { position: "top-center" });
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <div
      className={`flex h-screen transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-r from-blue-50 to-purple-50"
      }`}
    >
      <ToastContainer />
      <div className="w-1/2 flex justify-center items-center">
        <div
          className={`w-full max-w-md p-8 rounded-xl shadow-2xl transition-all ${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <h2 className="text-4xl font-bold text-center mb-6">Welcome Back!</h2>
          <p className="text-center mb-8">Sign in to your account to continue</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                    : "bg-white text-gray-900 border-gray-300 placeholder-gray-600"
                }`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                    : "bg-white text-gray-900 border-gray-300 placeholder-gray-600"
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Sign in
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-purple-600 hover:text-purple-500 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center relative overflow-hidden">
        <div className="w-full flex items-center justify-center">
          <img
            src="https://www.soilsearch.in/assets/login-image.jpg"
            alt="Signup"
            className="h-full max-h-screen object-cover rounded-xl shadow-lg w-full transform transition-all duration-500 hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
}

export default Adminlogin;


