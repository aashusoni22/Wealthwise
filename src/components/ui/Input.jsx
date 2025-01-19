import React, { forwardRef } from "react";
import { cn } from "../lib/utils";

export const Input = forwardRef(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-surface-200">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "block w-full rounded-lg border-0 bg-surface-700/50 py-2.5 px-4 text-surface-50 shadow-sm ring-1 ring-inset ring-surface-600 placeholder:text-surface-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6",
            error && "ring-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
