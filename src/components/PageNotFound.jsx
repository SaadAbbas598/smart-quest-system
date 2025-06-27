import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      <img 
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" 
        alt="404 Not Found" 
        className="w-80 mb-6"
      />
      <h1 className="text-5xl font-bold text-gray-800 mb-2">Oops! Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
    </div>
  );
};

export default PageNotFound;
