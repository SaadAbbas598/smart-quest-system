import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("accessToken"); // Example authentication check

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
