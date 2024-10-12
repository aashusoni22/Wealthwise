import React from "react";
import { useForm } from "react-hook-form";
import { LuLogIn } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "./Toast";
import authService from "../appwrite/auth";
import { login as authLogin } from "../store/authSlice";
import { Logo } from "../components";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (data) => {
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin(userData));
        navigate("/");
        reset();
      }
    } catch (error) {
      showToast("Failed to login", "error");
      reset();
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-[25%] -translate-y-1/2 bg-gradient-to-br from-gray-900 to-black h-auto w-96 p-8 rounded-lg shadow-lg shadow-purple-400/50 border-pink-500 border-2 transition duration-300 hover:shadow-pink-600/80">
      <form onSubmit={handleSubmit(login)} className="space-y-6">
        <h1 className="text-2xl text-white font-medium flex items-center">
          <span className="text-2xl mr-2">
            <LuLogIn />
          </span>
          Login
        </h1>
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="p-3 text-sm w-full rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        {errors.email && showToast("Email is required", "error")}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="p-3 text-sm w-full rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        {errors.password && showToast("Password is required", "error")}

        <button
          type="submit"
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-pink-600 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-2 focus:outline-none focus:ring-purple-200 dark:focus:ring-pink-500"
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Login
          </span>
        </button>
      </form>
      <p className="text-gray-500 text-sm font-medium mt-5">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-pink-400 duration-300 transition-all ease-in-out hover:text-white"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
