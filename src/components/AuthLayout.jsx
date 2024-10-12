import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthLayout = ({ children, authentication = true }) => {
  const isAuthenticated = useSelector((state) => state.auth.status);

  if (authentication && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else if (!authentication && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthLayout;
