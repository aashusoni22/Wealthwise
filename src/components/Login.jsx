import React from "react";
import { useForm } from "react-hook-form";
import { LuLogIn } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "./Toast";
import authService from "../appwrite/auth";
import { login as authLogin } from "../store/authSlice";
import { Logo } from "../components";
import Button from "./ui/Button";
import { Input } from "./ui/Input";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
    <div className="min-h-[90vh] flex items-center justify-center bg-surface-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-surface-50">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-surface-400">
            Sign in to manage your finances
          </p>
        </div>

        <form onSubmit={handleSubmit(login)} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-lg bg-surface-800/30 p-8 shadow-2xl backdrop-blur">
            <div>
              <Input
                type="email"
                label="Email address"
                error={errors.email}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>

            <div>
              <Input
                type="password"
                label="Password"
                error={errors.password}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign in
            </Button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-surface-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
