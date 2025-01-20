import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../store/authSlice";
import authService from "../appwrite/auth";
import { showToast } from "./Toast";
import Logo from "./Logo";
import {
  Menu,
  LayoutDashboard,
  Wallet,
  TrendingUp,
  LogOut,
  LogIn,
  UserPlus,
  ChevronLeft,
  PieChart,
  Target,
  User,
} from "lucide-react";

const MenuItem = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        group flex w-full items-center gap-3 rounded-xl p-3
        transition-all duration-300 ease-out
        ${
          isActive
            ? "bg-primary-500/10 text-primary-500"
            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
        }
      `}
    >
      <Icon
        className={`h-5 w-5 ${
          isActive ? "text-primary-500" : "text-slate-400"
        }`}
      />
      <span className="text-sm font-medium">{label}</span>
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="ml-auto h-2 w-2 rounded-full bg-primary-500"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const UserProfile = ({ user }) => (
  <div className="w-full flex items-center gap-3 rounded-xl p-3 text-slate-300 bg-surface-800/20 backdrop-blur-sm border border-slate-700/50">
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500/10">
      <User className="w-5 h-5 text-primary-500" />
    </div>

    <div className="min-w-0 flex-1">
      <h2 className="truncate text-sm font-medium text-slate-200">
        {user?.name || "Guest User"}
      </h2>
      <p className="truncate text-xs text-slate-400">
        {user?.email || "Not signed in"}
      </p>
    </div>

    <div className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
  </div>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate("/login");
      showToast("Successfully logged out", "success");
    } catch (error) {
      showToast("Error logging out: " + error.message, "error");
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
      requireAuth: true,
      section: "main",
    },
    {
      label: "Expenses",
      icon: Wallet,
      path: "/expenses",
      requireAuth: true,
      section: "money",
    },
    {
      label: "Income",
      icon: TrendingUp,
      path: "/income",
      requireAuth: true,
      section: "money",
    },
    {
      label: "Budgets",
      icon: PieChart,
      path: "/budgets",
      requireAuth: true,
      section: "money",
    },

    // Planning
    {
      label: "Goals",
      icon: Target,
      path: "/goals",
      requireAuth: true,
      section: "planning",
    },
  ];

  const authItems = [
    { label: "Login", icon: LogIn, path: "/login", requireAuth: false },
    { label: "Sign Up", icon: UserPlus, path: "/signup", requireAuth: false },
  ];

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800/50">
        <Logo textsize="text-xl" />
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 hover:bg-slate-800/50 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-4 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-700">
        {/* Main Section */}
        <div className="space-y-1">
          {isAuthenticated && (
            <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Main
            </h2>
          )}
          {navItems
            .filter(
              (item) =>
                item.section === "main" && item.requireAuth === isAuthenticated
            )
            .map((item) => (
              <MenuItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
        </div>

        {/* Money Management */}
        <div className="space-y-1">
          {isAuthenticated && (
            <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Money Management
            </h2>
          )}
          {navItems
            .filter(
              (item) =>
                item.section === "money" && item.requireAuth === isAuthenticated
            )
            .map((item) => (
              <MenuItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
        </div>

        {/* Planning */}
        <div className="space-y-1">
          {isAuthenticated && (
            <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Planning
            </h2>
          )}
          {navItems
            .filter(
              (item) =>
                item.section === "planning" &&
                item.requireAuth === isAuthenticated
            )
            .map((item) => (
              <MenuItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
        </div>

        {/* Auth Section */}
        {!isAuthenticated && (
          <div
            className={`space-y-1 ${
              isAuthenticated && "border-t border-slate-800  pt-4"
            }`}
          >
            {authItems.map((item) => (
              <MenuItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        )}
      </nav>

      {isAuthenticated && (
        <div className="p-4 border-t border-slate-800/50 space-y-3">
          <UserProfile user={userData} />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl p-3 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-slate-800/50 bg-surface-900/95 backdrop-blur-xl">
        <Logo textsize="text-xl" />
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-slate-800/50 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800/50 bg-surface-900/95 backdrop-blur-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-y-0 right-0 z-50 w-72 flex flex-col bg-surface-900/95 backdrop-blur-xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
