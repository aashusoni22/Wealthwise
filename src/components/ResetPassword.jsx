import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Toast, { showToast } from "./Toast";
import authService from "../appwrite/auth";
import { Logo } from "../components";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const password = watch("password", "");

  const handleResetPassword = async (data) => {
    try {
      await authService.resetPassword(
        userId,
        secret,
        data.password,
        data.confirmPassword
      );
      showToast("Password reset successful", "success");
      navigate("/login");
    } catch (error) {
      showToast(error.message || "Failed to reset password", "error");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-surface-900 px-4 lg:py-12 sm:px-6 lg:px-8">
      <Toast />
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-surface-50">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-surface-400">
            Enter your new password below
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4 rounded-lg p-8 backdrop-blur">
            <div>
              <label className="block text-sm font-medium text-surface-200 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`
                    block w-full rounded-lg bg-surface-800/50 
                    border ${
                      errors.password ? "border-red-500" : "border-surface-600"
                    } 
                    px-4 py-3 text-surface-100 placeholder-surface-400
                    focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent
                    transition-colors pr-10
                  `}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-300"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-200 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`
                    block w-full rounded-lg bg-surface-800/50 
                    border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-surface-600"
                    } 
                    px-4 py-3 text-surface-100 placeholder-surface-400
                    focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent
                    transition-colors pr-10
                  `}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-300"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex gap-1">
                {[...Array(4)].map((_, index) => {
                  const passLength = password.length >= 8;
                  const hasUpper = /[A-Z]/.test(password);
                  const hasLower = /[a-z]/.test(password);
                  const hasNumber = /\d/.test(password);
                  const conditions = [
                    passLength,
                    hasUpper,
                    hasLower,
                    hasNumber,
                  ];
                  const metConditions = conditions.filter(Boolean).length;

                  return (
                    <div
                      key={index}
                      className={`h-1 w-full rounded-full transition-colors ${
                        index < metConditions
                          ? metConditions <= 2
                            ? "bg-red-500"
                            : metConditions === 3
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          : "bg-surface-700"
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-surface-400">
                Password must contain at least 8 characters, one uppercase
                letter, one lowercase letter, and one number
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Reset Password"
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

export default ResetPassword;
