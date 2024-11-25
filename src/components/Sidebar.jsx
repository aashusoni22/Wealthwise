import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import authService from "../appwrite/auth";
import { showToast } from "./Toast";
import Logo from "./Logo";
import profile from "../assets/profile.png";
import { FaMoneyCheckAlt, FaPiggyBank } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { FaMoneyBills } from "react-icons/fa6";
import { BiLogIn, BiUser } from "react-icons/bi";
import { FiLogOut, FiSettings } from "react-icons/fi";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

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
      name: "Dashboard",
      slug: "/",
      icon: <RxDashboard className="w-5 h-5" />,
      active: true,
    },
    {
      name: "Expenses",
      slug: "/expenses",
      icon: <FaMoneyBills className="w-5 h-5" />,
      active: isAuthenticated,
    },
    {
      name: "Income",
      slug: "/income",
      icon: <FaMoneyCheckAlt className="w-5 h-5" />,
      active: isAuthenticated,
    },
    {
      name: "Goals",
      slug: "/goals",
      icon: <FaPiggyBank className="w-5 h-5" />,
      active: isAuthenticated,
    },
    {
      name: "Login",
      slug: "/login",
      icon: <BiLogIn className="w-5 h-5" />,
      active: !isAuthenticated,
    },
    {
      name: "Signup",
      slug: "/signup",
      icon: <BiUser className="w-5 h-5" />,
      active: !isAuthenticated,
    },
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.slug;
    return (
      <li>
        <button
          onClick={() => navigate(item.slug)}
          className={`w-full flex items-center space-x-4 px-6 py-3 rounded-xl transition-all duration-300 group ${
            isActive
              ? "bg-gradient-to-r from-pink-500/20 to-pink-500/10 text-pink-500"
              : "hover:bg-gray-800/40 text-gray-400 hover:text-gray-100"
          }`}
        >
          <span
            className={`transition-transform duration-300 group-hover:scale-110 ${
              isActive
                ? "text-pink-500"
                : "text-gray-400 group-hover:text-pink-500"
            }`}
          >
            {item.icon}
          </span>
          <span className="font-medium">{item.name}</span>
          {isActive && (
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500 ml-auto" />
          )}
        </button>
      </li>
    );
  };

  return (
    <div className="h-screen w-72 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800/50 flex flex-col sticky top-0">
      <div className="p-6">
        <Logo textsize="text-2xl" />
      </div>

      {isAuthenticated && (
        <div className="mx-6 mb-8">
          <div className="relative p-4 bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-2xl backdrop-blur-xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent" />
            <div className="relative flex items-center space-x-4">
              <div className="relative">
                <img
                  src={userData?.profilePicture || profile}
                  alt="Profile"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="absolute inset-0 rounded-xl ring-2 ring-pink-500/20" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-medium truncate">
                  {userData?.name || "User"}
                </h2>
                <p className="text-sm text-gray-400 truncate">
                  {userData?.email || "user@example.com"}
                </p>
              </div>
              <button
                onClick={() => navigate("/settings")}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
              >
                <FiSettings className="text-pink-500 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map(
            (item) => item.active && <NavItem key={item.name} item={item} />
          )}
        </ul>
      </nav>

      {isAuthenticated && (
        <div className="p-4 border-t border-gray-800/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-xl px-6 py-3 transition-all duration-300"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
