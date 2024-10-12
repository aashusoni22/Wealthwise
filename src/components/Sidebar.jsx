import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-pink-500/10 text-pink-500"
              : "text-gray-400 hover:bg-pink-500/10 hover:text-pink-500"
          }`}
        >
          {item.icon}
          <span>{item.name}</span>
        </button>
      </li>
    );
  };

  return (
    <div className="h-screen w-72 p-6 bg-gray-900 border-r border-gray-800 flex flex-col sticky top-0">
      <div className="mb-8">
        <Logo textsize="text-2xl" />
      </div>

      {isAuthenticated && (
        <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg mb-8">
          <img
            src={userData?.profilePicture || profile}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-500/30"
          />
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
            className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200"
          >
            <FiSettings className="text-pink-500 w-5 h-5" />
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map(
            (item) => item.active && <NavItem key={item.name} item={item} />
          )}
        </ul>
      </nav>

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-red-500 hover:text-red-400 transition-colors duration-200 px-4 py-3 mt-4"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      )}
    </div>
  );
};

export default Sidebar;
