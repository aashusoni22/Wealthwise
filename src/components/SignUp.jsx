import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, UserIcon } from "lucide-react";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { showToast } from "./Toast";
import { Logo } from "../components";
import Button from "./ui/Button";
import { BsGoogle } from "react-icons/bs";

// Custom FormField component (same as login)
const FormField = React.forwardRef(
  ({ label, error, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-surface-200">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`
            block w-full rounded-lg bg-surface-800/50 
            border ${error ? "border-red-500" : "border-surface-600"} 
            px-4 py-3 text-surface-100 placeholder-surface-400
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
            {...props}
          />
          {type === "password" && (
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
          )}
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
      </div>
    );
  }
);

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = password ? getStrength(password) : 0;
  const bars = Array(5).fill(0);

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {bars.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-full rounded-full transition-colors ${
              index < strength
                ? strength <= 2
                  ? "bg-red-500"
                  : strength === 3
                  ? "bg-yellow-500"
                  : "bg-green-500"
                : "bg-surface-700"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-surface-400">
          Password must contain at least 8 characters, one uppercase letter, one
          lowercase letter, one number, and one special character
        </p>
        {password && (
          <span
            className={`text-xs ${
              strength <= 2
                ? "text-red-500"
                : strength === 3
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {getStrengthText(strength)}
          </span>
        )}
      </div>
    </div>
  );
};

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setError,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const password = watch("password", "");

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      await authService.loginWithGoogle();
    } catch (error) {
      console.error("Google signup error:", error);
      showToast(error.message || "Failed to signup with Google", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (data) => {
    try {
      setIsLoading(true);
      const userData = await authService.createAccount({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (userData) {
        dispatch(login(userData));
        showToast("Account created successfully!", "success");
        navigate("/");
        reset();
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.message && error.message.includes("already exists")) {
        setError("email", { type: "manual", message: "Email already exists" });
      } else if (error.message.includes("Password must")) {
        setError("password", { type: "manual", message: error.message });
      } else {
        showToast(error.message || "Failed to create account", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-auto flex items-center justify-center sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="lg:p-8 space-y-8">
          <div className="flex flex-col items-center">
            <Logo className="h-12 w-auto" />
            <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-surface-400">
              Start managing your finances today
            </p>
          </div>

          <form onSubmit={handleSubmit(create)} className="space-y-6">
            <FormField
              label="Username"
              type="text"
              placeholder="Enter your username"
              error={errors.name}
              disabled={isLoading}
              {...register("name", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
                maxLength: {
                  value: 30,
                  message: "Username must be less than 30 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message:
                    "Username can only contain letters, numbers, and underscores",
                },
              })}
            />

            <FormField
              label="Email address"
              type="email"
              placeholder="Enter your email"
              error={errors.email}
              disabled={isLoading}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />

            <div className="space-y-3">
              <FormField
                label="Password"
                type="password"
                placeholder="Create a strong password"
                error={errors.password}
                disabled={isLoading}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                })}
              />
              <PasswordStrengthIndicator password={password} />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded border-surface-600 text-primary-600 focus:ring-primary-500/50 bg-surface-800"
                disabled={isLoading}
                {...register("terms", {
                  required: "You must accept the terms and conditions",
                })}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-surface-300">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-primary-400 hover:text-primary-300"
                >
                  Terms and Conditions
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-500 mt-1">
                {errors.terms.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center"
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserIcon className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface-800/30 text-surface-400">
                Or sign up with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-surface-600 rounded-lg hover:bg-surface-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BsGoogle className="w-5 h-5" />
            <span className="ml-2 text-surface-200">Continue with Google</span>
          </button>
        </div>

        <p className="mt-2 text-center text-sm text-surface-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
