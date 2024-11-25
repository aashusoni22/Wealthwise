import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";

const GoalModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Add Goal</h2>
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
                Target
              </label>
              <input
                type="number"
                step="0.01"
                {...register("target", { required: "Target is required" })}
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-500"
                placeholder="Enter target amount"
              />
              {errors.target && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.target.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                {...register("duedate", {
                  required: "Due Date is required",
                })}
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-500"
                placeholder="Enter due date"
              />
              {errors.duedate && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.duedate.message}
                </p>
              )}
            </div>
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
              {loading ? "Adding..." : "Add Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
