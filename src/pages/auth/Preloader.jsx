import React from "react";

const Preloader = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-100">
      <div className="flex flex-col items-center">
        <img 
          src="https://www.soilsearch.in/assets/login-image.jpg" 
          alt="Loading" 
          className="w-24 h-24 mb-4 rounded-full shadow-lg object-cover" 
        />
        <div className="flex space-x-2 mt-2">
          <div className="w-4 h-4 bg-blue-700 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-blue-700 rounded-full animate-pulse delay-150"></div>
          <div className="w-4 h-4 bg-blue-700 rounded-full animate-pulse delay-300"></div>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default Preloader;
