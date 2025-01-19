import React from "react";
import { cn } from "../lib/utils";

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export const loader = ({ size = "md", className }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-t-2 border-b-2 border-primary-500",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};
