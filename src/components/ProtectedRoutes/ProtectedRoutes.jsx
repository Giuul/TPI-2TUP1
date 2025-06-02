import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, allowedRoles, userRole, children }) => {
   if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  
  if (!Array.isArray(allowedRoles) || !userRole || !allowedRoles.includes(userRole)) {
    
    return <Navigate to="/" replace />; 
  }

  return children;
};

export default ProtectedRoute;