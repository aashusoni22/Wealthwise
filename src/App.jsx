import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import authService from "./appwrite/auth";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./components"; // Sidebar should still be rendered

const App = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch(login(user));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        dispatch(logout());
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-7">
        <Outlet />{" "}
      </main>
    </div>
  );
};

export default App;
