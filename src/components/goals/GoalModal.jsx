import React, { useState } from "react";
import {
  X,
  Target,
  Calendar,
  Tag,
  CreditCard,
  FileText,
  TrendingUp,
  Award,
} from "lucide-react";

const GoalModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    category: "",
    description: "",
    deadline: new Date().toISOString().split("T")[0],
    currentProgress: "0",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -top-6 z-50 flex items-center justify-center p-4">
      <div className="bg-surface-800/90 rounded-2xl max-w-lg w-full border border-slate-700/50 shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-white">Add New Goal</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Title</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="title"
                required
                placeholder="Enter goal title"
                className="w-full bg-surface-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Target and Deadline Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Target Amount
              </label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  name="target"
                  required
                  step="0.01"
                  placeholder="0.00"
                  className="w-full bg-surface-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.target}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Deadline
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  name="deadline"
                  required
                  className="w-full bg-surface-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.deadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Category and Current Progress Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Category
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  name="category"
                  required
                  className="w-full bg-surface-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option className="bg-gray-800 text-white" value="">
                    Select category
                  </option>
                  <option className="bg-gray-800 text-white" value="Financial">
                    Financial
                  </option>
                  <option className="bg-gray-800 text-white" value="Personal">
                    Personal
                  </option>
                  <option className="bg-gray-800 text-white" value="Career">
                    Career
                  </option>
                  <option className="bg-gray-800 text-white" value="Health">
                    Health
                  </option>
                  <option className="bg-gray-800 text-white" value="Education">
                    Education
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Current Progress
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  name="currentProgress"
                  step="0.01"
                  placeholder="Current progress (optional)"
                  className="w-full bg-surface-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.currentProgress}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Add notes or milestones..."
              rows="3"
              className="w-full bg-surface-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.description}
              onChange={handleInputChange}
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
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
