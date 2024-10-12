import React, { useState } from "react";
import { useForm } from "react-hook-form";
import appService from "../appwrite/config";
import { FiX } from "react-icons/fi";
import authService from "../appwrite/auth";

const ExpenseModal = ({ onClose }) => {
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (expenseData) => {
    setLoading(true);
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) {
        console.error("No user ID found");
        return;
      }

      const category = isAddingNewCategory
        ? expenseData.newCategory
        : expenseData.category;

      await appService.createExpense({
        ...expenseData,
        category,
        userId,
      });

      onClose();
    } catch (error) {
      console.error("Failed to create expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Add New Expense</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-500"
                placeholder="Enter expense title"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                {...register("amount", { required: "Amount is required" })}
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-500"
                placeholder="Enter amount"
              />
              {errors.amount && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              {...register("description", { required: false })}
              className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-500"
              placeholder="Enter description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Payment Method
              </label>
              <select
                {...register("paymentMethod", {
                  required: "Payment method is required",
                })}
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Other">Other</option>
              </select>
              {errors.paymentMethod && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-500"
                onChange={(e) =>
                  setIsAddingNewCategory(e.target.value === "new")
                }
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="new">Add new category</option>
              </select>
            </div>
          </div>

          {isAddingNewCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                New Category
              </label>
              <input
                type="text"
                {...register("newCategory", {
                  required: "Please enter a category",
                })}
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-500"
                placeholder="Enter new category"
              />
              {errors.newCategory && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.newCategory.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              {...register("date", { required: "Date is required" })}
              className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-500"
            />
            {errors.date && (
              <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded ${
                loading ? "bg-gray-500" : "bg-teal-600"
              } hover:bg-teal-500 transition-colors`}
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
