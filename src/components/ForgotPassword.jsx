import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Toast, { showToast } from "./Toast";
import authService from "../appwrite/auth";
import { Logo } from "../components";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const handleForgotPassword = async (data) => {
    try {
      await authService.forgotPassword(data.email);
      showToast("Password reset link sent to your email", "success");
      reset();
    } catch (error) {
      showToast(error.message || "Failed to send reset link", "error");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-surface-900 px-4 lg:py-12 sm:px-6 lg:px-8">
      <Toast />
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-surface-50">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-surface-400">
            No worries, we'll send you reset instructions
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4 rounded-lg p-8 backdrop-blur">
            <div>
              <label className="block text-sm font-medium text-surface-200 mb-1">
                Email address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`
                  block w-full rounded-lg bg-surface-800/50 
                  border ${
                    errors.email ? "border-red-500" : "border-surface-600"
                  } 
                  px-4 py-3 text-surface-100 placeholder-surface-400
                  focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent
                  transition-colors
                `}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-surface-400">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
