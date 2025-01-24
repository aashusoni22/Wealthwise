import React from "react";
import {
  X,
  DollarSign,
  Calendar,
  CreditCard,
  FileText,
  Tag,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { showToast } from "../Toast";

const ExpenseModal = ({
  onClose,
  onSubmit,
  initialData = null,
  mode = "create",
}) => {
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData
      ? {
          ...initialData,
          date: initialData.date.split("T")[0],
          amount: parseFloat(initialData.amount).toString(),
        }
      : {
          title: "",
          amount: "",
          category: "",
          description: "",
          date: getTodayDateString(),
          paymentMethod: "",
        },
    mode: "onChange",
  });

  const onSubmitHandler = async (data) => {
    try {
      if (!data.title?.trim()) {
        showToast("Title is required", "error");
        return;
      }
      if (!data.amount || parseFloat(data.amount) <= 0) {
        showToast("Please enter a valid amount", "error");
        return;
      }
      if (!data.category) {
        showToast("Please select a category", "error");
        return;
      }
      if (!data.paymentMethod) {
        showToast("Please select a payment method", "error");
        return;
      }
      if (!data.date) {
        showToast("Please select a valid date", "error");
        return;
      }

      const inputDate = new Date(data.date);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);

      if (inputDate > maxDate) {
        showToast("Date cannot be more than 1 year in the future", "error");
        return;
      }
      await onSubmit(data);
      onClose();
    } catch (error) {
      showToast(error.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="fixed inset-0 -top-6 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-800/90 rounded-2xl max-w-lg w-full border border-slate-700/50 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-white">
            {mode === "edit" ? "Edit Expense" : "Add New Expense"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="p-6 space-y-6"
        >
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
                type="text"
                placeholder="Enter expense title"
                className={`w-full bg-surface-900/50 border ${
                  errors.title ? "border-red-500" : "border-slate-700/50"
                } rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
            </div>
          </div>

          {/* Amount and Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("amount", {
                    required: "Amount is required",
                    min: {
                      value: 0.01,
                      message: "Amount must be greater than 0",
                    },
                    pattern: {
                      value: /^\d*\.?\d{0,2}$/,
                      message: "Please enter a valid amount",
                    },
                  })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full bg-surface-900/50 border ${
                    errors.amount ? "border-red-500" : "border-slate-700/50"
                  } rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("date", {
                    required: "Date is required",
                    validate: {
                      futureDate: (value) => {
                        const inputDate = new Date(value);
                        const maxDate = new Date();
                        maxDate.setFullYear(maxDate.getFullYear() + 1);
                        return (
                          inputDate <= maxDate ||
                          "Date cannot be more than 1 year in future"
                        );
                      },
                    },
                  })}
                  type="date"
                  className={`w-full bg-surface-900/50 border ${
                    errors.date ? "border-red-500" : "border-slate-700/50"
                  } rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                />
              </div>
            </div>
          </div>

          {/* Category and Payment Method Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={`w-full bg-surface-900/50 border ${
                    errors.category ? "border-red-500" : "border-slate-700/50"
                  } rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none`}
                >
                  <option className="bg-gray-800 text-white" value="">
                    Select category
                  </option>
                  <option className="bg-gray-800 text-white" value="Shopping">
                    Shopping
                  </option>
                  <option
                    className="bg-gray-800 text-white"
                    value="Food & Drink"
                  >
                    Food & Drink
                  </option>
                  <option className="bg-gray-800 text-white" value="Groceries">
                    Groceries
                  </option>
                  <option className="bg-gray-800 text-white" value="Transport">
                    Transport
                  </option>
                  <option className="bg-gray-800 text-white" value="Housing">
                    Housing
                  </option>
                  <option
                    className="bg-gray-800 text-white"
                    value="Entertainment"
                  >
                    Entertainment
                  </option>
                  <option className="bg-gray-800 text-white" value="Utilities">
                    Utilities (Bills)
                  </option>
                  <option className="bg-gray-800 text-white" value="Medical">
                    Medical
                  </option>
                  <option
                    className="bg-gray-800 text-white"
                    value="Personal Care"
                  >
                    Personal Care
                  </option>
                  <option className="bg-gray-800 text-white" value="Other">
                    Other
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  {...register("paymentMethod", {
                    required: "Payment method is required",
                  })}
                  className={`w-full bg-surface-900/50 border ${
                    errors.paymentMethod
                      ? "border-red-500"
                      : "border-slate-700/50"
                  } rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none`}
                >
                  <option className="bg-gray-800 text-white" value="">
                    Select method
                  </option>
                  <option className="bg-gray-800 text-white" value="Cash">
                    Cash
                  </option>
                  <option
                    className="bg-gray-800 text-white"
                    value="Credit Card"
                  >
                    Credit Card
                  </option>
                  <option className="bg-gray-800 text-white" value="Debit Card">
                    Debit Card
                  </option>
                  <option className="bg-gray-800 text-white" value="PayPal">
                    PayPal
                  </option>
                  <option className="bg-gray-800 text-white" value="Google Pay">
                    Google Pay
                  </option>
                  <option className="bg-gray-800 text-white" value="Apple Pay">
                    Apple Pay
                  </option>
                  <option
                    className="bg-gray-800 text-white"
                    value="Bank Transfer"
                  >
                    Bank Transfer
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Description <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              {...register("description")}
              placeholder="Add a note or description..."
              rows="3"
              className="w-full bg-surface-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-700/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className={`flex-1 px-4 py-2.5 rounded-xl ${
                isSubmitting || Object.keys(errors).length > 0
                  ? "bg-primary-600/50 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              } text-white transition-colors`}
            >
              {isSubmitting
                ? "Processing..."
                : mode === "edit"
                ? "Update Expense"
                : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
