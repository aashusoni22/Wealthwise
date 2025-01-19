import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import authService from "./appwrite/auth";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./components";
import { Loader } from "./components/ui/loader";

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
      <div className="flex items-center justify-center min-h-screen bg-surface-900">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 text-surface-50">
      <div className="flex flex-col lg:flex lg:flex-row h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
