import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";

export const useAuthMonitor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let lastCheckedUserId = null;

    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        const currentUserId = user?.$id;

        // If the user ID has changed
        if (lastCheckedUserId !== null && lastCheckedUserId !== currentUserId) {
          // Force reload to clear all states
          window.location.reload();
        }

        lastCheckedUserId = currentUserId;
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    // Check immediately
    checkAuth();

    // Set up interval to check periodically
    const interval = setInterval(checkAuth, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [navigate]);
};
