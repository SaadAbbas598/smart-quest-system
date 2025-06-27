import React from "react";
import { useTheme } from "../context/themeContext";
function ChangePassword() {
    const { darkMode, setDarkMode } = useTheme(); // Get theme state from context
  
  return (
    <div className={ `flex min-h-screen   items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
>
      {/* Centered Login Form */}
      <div className={`w-full max-w-md p-8  rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-105 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
>
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 animate-bounce animate-infinite animate-duration-1000">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Update Password
        </p>
        <form>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email address
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
