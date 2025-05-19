import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { showToast } from "./Toast";
import authService from "../appwrite/auth";
import { login as authLogin } from "../store/authSlice";
import { Logo } from "../components";
import Button from "./ui/Button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { BsGoogle } from "react-icons/bs";

// Custom FormField component to replace Input
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

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true);
      const userData = await authService.login(formData);
      if (userData) {
        dispatch(authLogin(userData));
        showToast("Login successful!", "success");
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.message.includes("Invalid email or password")) {
        setError("email", {
          type: "manual",
          message: "Invalid email or password",
        });
        setError("password", {
          type: "manual",
          message: "Invalid email or password",
        });
      } else if (error.message.includes("Too many login attempts")) {
        showToast(error.message, "error");
      } else {
        showToast(error.message || "Failed to login", "error");
      }
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await authService.loginWithGoogle();
    } catch (error) {
      console.error("Google login error:", error);
      showToast(error.message || "Failed to login with Google", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin(userData));
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      }
    };

    initAuth();
  }, [dispatch, navigate, from]);

  return (
    <div className="lg:min-h-[89vh] flex items-center justify-center py-5 lg:py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="lg:p-8 space-y-8">
          <div className="flex flex-col items-center">
            <Logo className="h-12 w-auto" />
            <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-surface-400">
              Sign in to manage your finances
            </p>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
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

            <FormField
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password}
              disabled={isLoading}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-600 text-primary-600 focus:ring-primary-500/50 bg-surface-800"
                />
                <span className="ml-2 text-surface-300">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center"
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface-800/30 text-surface-400">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-surface-600 rounded-lg hover:bg-surface-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BsGoogle className="w-5 h-5" />
            <span className="ml-2 text-surface-200">Continue with Google</span>
          </button>
        </div>

        <p className="mt-2 text-center text-sm text-surface-400">
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
