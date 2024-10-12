import React from "react";
import { Toaster, toast } from "react-hot-toast";

const Toast = () => {
  return <Toaster reverseOrder={true} />;
};

export const showToast = (message, type) => {
  if (type === "error") {
    toast.error(message);
  } else if (type === "success") {
    toast.success(message);
  }
};

export default Toast;
