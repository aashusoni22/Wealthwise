import React from "react";
import { cn } from "../lib/utils";
import Loader from "./Loader";

const variants = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
  secondary:
    "bg-surface-700 text-surface-50 hover:bg-surface-600 focus:ring-surface-500",
  danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-900",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader size="sm" className="absolute left-4 border-white" />
      )}
      {children}
    </button>
  );
};

export default Button;
