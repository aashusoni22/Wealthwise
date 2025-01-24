import React from "react";
import { Toaster, toast } from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerClassName="font-sans"
      toastOptions={{
        // Default options
        duration: 2000,
        className: "!bg-surface-900/95 !text-slate-100 backdrop-blur-lg",
        style: {
          padding: "16px",
          borderRadius: "12px",
          maxWidth: "400px",
          fontSize: "14px",
        },

        // Success toast
        success: {
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          className: "!bg-surface-800/95 !text-slate-100 backdrop-blur-lg",
          style: {
            border: "1px solid rgba(16, 185, 129, 0.2)",
          },
        },

        // Error toast
        error: {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          className: "!bg-surface-800/95 !text-slate-100 backdrop-blur-lg",
          style: {
            border: "1px solid rgba(239, 68, 68, 0.2)",
          },
        },

        // Warning toast
        warning: {
          icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
          className: "!bg-surface-800/95 !text-slate-100 backdrop-blur-lg",
          style: {
            border: "1px solid rgba(245, 158, 11, 0.2)",
          },
        },

        // Info toast
        info: {
          icon: <Info className="w-5 h-5 text-sky-500" />,
          className: "!bg-surface-800/95 !text-slate-100 backdrop-blur-lg",
          style: {
            border: "1px solid rgba(14, 165, 233, 0.2)",
          },
        },
      }}
    />
  );
};

export const showToast = (message, type = "info") => {
  const options = {
    style: {
      padding: "16px",
      borderRadius: "12px",
    },
  };

  switch (type) {
    case "success":
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-medium">Success</span>
          <span className="text-slate-300 text-sm">{message}</span>
        </div>,
        options
      );
      break;
    case "error":
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-medium">Error</span>
          <span className="text-slate-300 text-sm">{message}</span>
        </div>,
        options
      );
      break;
    case "warning":
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } bg-surface-800/95 backdrop-blur-lg border border-amber-500/20 shadow-lg rounded-xl p-4 flex items-start gap-3`}
          >
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="font-medium text-slate-100">Warning</span>
              <span className="text-slate-300 text-sm">{message}</span>
            </div>
          </div>
        ),
        options
      );
      break;
    default:
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } bg-surface-800/95 backdrop-blur-lg border border-sky-500/20 shadow-lg rounded-xl p-4 flex items-start gap-3`}
          >
            <Info className="w-5 h-5 text-sky-500 flex-shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="font-medium text-slate-100">Info</span>
              <span className="text-slate-300 text-sm">{message}</span>
            </div>
          </div>
        ),
        options
      );
  }
};

// Add some helpful utility functions
export const successToast = (message) => showToast(message, "success");
export const errorToast = (message) => showToast(message, "error");
export const warningToast = (message) => showToast(message, "warning");
export const infoToast = (message) => showToast(message, "info");

export default Toast;
