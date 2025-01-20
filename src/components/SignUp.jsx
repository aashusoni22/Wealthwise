import React from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { showToast } from "./Toast";
import { Logo } from "../components";
import Button from "./ui/Button";
import { Input } from "./ui/Input";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
    <div className="min-h-[84vh] flex items-center justify-center bg-surface-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-surface-50">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-surface-400">
            Start managing your finances today
          </p>
        </div>

        <form onSubmit={handleSubmit(create)} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-lg p-8 backdrop-blur">
            <div>
              <Input
                type="text"
                label="Username"
                error={errors.name}
                {...register("name", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
              />
            </div>

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
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              <FaUser className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-surface-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
