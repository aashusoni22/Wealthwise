import React from "react";
import { X, DollarSign, Calendar, Wallet, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { showToast } from "../Toast";

const IncomeModal = ({
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
          source: "",
          description: "",
          date: getTodayDateString(),
        },
    resolver: (values) => {
      const errors = {};

      const inputDate = new Date(values.date);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);

      if (inputDate > maxDate) {
        errors.date = {
          type: "manual",
          message: "Date cannot be more than 1 year in the future",
        };
      }

      // Additional strict validation
      if (!values.title?.trim()) {
        errors.title = {
          type: "required",
          message: "Title is required",
        };
      }

      if (!values.amount || parseFloat(values.amount) <= 0) {
        errors.amount = {
          type: "required",
          message: "Please enter a valid amount",
        };
      }

      if (!values.source) {
        errors.source = {
          type: "required",
          message: "Source is required",
        };
      }

      return {
        values,
        errors,
      };
    },
  });

  const onSubmitHandler = async (data) => {
    try {
      await onSubmit(data);
      showToast(
        mode === "edit"
          ? "Income updated successfully"
          : "Income added successfully",
        "success"
      );
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
            {mode === "edit" ? "Edit Income" : "Add New Income"}
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
                placeholder="Enter income title"
                className={`w-full bg-surface-900/50 border ${
                  errors.title ? "border-red-500" : "border-slate-700/50"
                } rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
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
                  } rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
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
                  {...register("date", { required: "Date is required" })}
                  type="date"
                  max={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() + 1)
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  className={`w-full bg-surface-900/50 border ${
                    errors.date ? "border-red-500" : "border-slate-700/50"
                  } rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
              </div>
            </div>
          </div>

          {/* Source */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Source <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                {...register("source", {
                  required: "Source is required",
                })}
                className={`w-full bg-surface-900/50 border ${
                  errors.source ? "border-red-500" : "border-slate-700/50"
                } rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none`}
              >
                <option className="bg-gray-800 text-white" value="">
                  Select source
                </option>
                <option className="bg-gray-800 text-white" value="Salary">
                  Salary
                </option>
                <option className="bg-gray-800 text-white" value="Freelance">
                  Freelance
                </option>
                <option className="bg-gray-800 text-white" value="Investments">
                  Investments
                </option>
                <option className="bg-gray-800 text-white" value="Business">
                  Business
                </option>
                <option className="bg-gray-800 text-white" value="Rental">
                  Rental
                </option>
                <option className="bg-gray-800 text-white" value="Side Gig">
                  Side Gig
                </option>
                <option className="bg-gray-800 text-white" value="Other">
                  Other
                </option>
              </select>
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
              className="w-full bg-surface-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  ? "bg-emerald-600/50 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } text-white transition-colors`}
            >
              {isSubmitting
                ? "Processing..."
                : mode === "edit"
                ? "Update Income"
                : "Add Income"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeModal;
