// src/components/AuthLayout.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { SecurityUtils } from "../utils/security";
import { logout } from "../store/authSlice";
import { showToast } from "./Toast";
import authService from "../appwrite/auth";

const AuthLayout = ({ children, authentication = true }) => {
  const isAuthenticated = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authentication && isAuthenticated) {
      // Session and security checks
      const checkSession = async () => {
        if (!SecurityUtils.isSessionValid()) {
          // Session expired
          await authService.logout();
          dispatch(logout());
          navigate("/login");
          showToast("Session expired. Please login again", "warning");
          return;
        }

        // Verify user is still valid in Appwrite
        const user = await authService.getCurrentUser();
        if (!user) {
          dispatch(logout());
          navigate("/login");
          showToast("Please login to continue", "warning");
        }
      };

      checkSession();

      // Periodic session check
      const interval = setInterval(checkSession, 60000); // Every minute

      // Activity monitoring
      const updateActivity = () => SecurityUtils.updateActivity();
      window.addEventListener("click", updateActivity);
      window.addEventListener("keypress", updateActivity);
      window.addEventListener("scroll", updateActivity);
      window.addEventListener("mousemove", updateActivity);

      return () => {
        clearInterval(interval);
        window.removeEventListener("click", updateActivity);
        window.removeEventListener("keypress", updateActivity);
        window.removeEventListener("scroll", updateActivity);
        window.removeEventListener("mousemove", updateActivity);
      };
    }
  }, [authentication, isAuthenticated, dispatch, navigate]);

  // Original routing logic
  if (authentication && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else if (!authentication && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthLayout;
