import React from "react";
import { FaUser } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { showToast } from "./Toast";
import { Logo } from "../components";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const create = async (data) => {
    try {
      const userData = await authService.createAccount({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      if (userData) {
        const loggedInUserData = await authService.login({
          email: data.email,
          password: data.password,
        });
        if (loggedInUserData) {
          dispatch(login(loggedInUserData));
          navigate("/");
          reset();
        }
      }
    } catch (error) {
      console.log(error);
      if (error.message && error.message.includes("already exists")) {
        showToast("Email already exists", "error");
      } else {
        showToast("Failed to create account", "error");
      }
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-[25%] -translate-y-1/2 bg-gradient-to-br from-gray-900 to-black h-auto w-96 p-8 rounded-lg shadow-lg shadow-purple-400/50 border-pink-500 border-2 transition duration-300 hover:shadow-pink-600/80">
      <form onSubmit={handleSubmit(create)} className="space-y-6">
        <h1 className="text-2xl text-white font-medium flex items-center">
          <span className="text-xl mr-2">
            <FaUser />
          </span>{" "}
          Sign Up
        </h1>
        <input
          type="text"
          placeholder="Username"
          className="p-3 text-sm w-full rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          {...register("name", { required: true })}
        />
        {errors.name && showToast("Username is required", "error")}

        <input
          type="email"
          placeholder="Email"
          className="p-3 text-sm w-full rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          {...register("email", { required: true })}
        />
        {errors.email && showToast("Email is required", "error")}

        <input
          type="password"
          placeholder="Password"
          className="p-3 text-sm w-full rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          {...register("password", { required: true })}
        />
        {errors.password && showToast("Password is required", "error")}

        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-pink-600 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-2 focus:outline-none focus:ring-purple-200 dark:focus:ring-pink-500">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Sign Up
          </span>
        </button>
      </form>
      <p className="text-gray-500 text-sm font-medium mt-5">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-pink-400 duration-300 transition-all ease-in-out hover:text-white"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
