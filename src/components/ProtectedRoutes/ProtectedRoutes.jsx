import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ isLoggedIn, allowedRoles, userRole, children }) => {
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    if (isLoggedIn && !allowedRoles.includes(userRole)) {
      alert("Usuario no habilitado");
      setIsAuthorized(false);
    }
  }, [isLoggedIn, userRole, allowedRoles]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;