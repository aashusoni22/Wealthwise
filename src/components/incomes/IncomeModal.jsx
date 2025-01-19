import React, { useState } from "react";
import {
  X,
  DollarSign,
  Calendar,
  FileText,
  Tag,
  Clock,
  Building,
  Plus,
} from "lucide-react";
import appService from "../../appwrite/config";
import authService from "../../appwrite/auth";

const IncomeModal = ({ onClose }) => {
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    description: "",
    source: "",
    newSource: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) {
        throw new Error("No user ID found");
      }

      const source = isAddingNewCategory ? formData.newSource : formData.source;

      await appService.createIncome({
        ...formData,
        source,
        userId,
      });

      onClose();
    } catch (error) {
      console.error("Failed to create income:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "source") {
      setIsAddingNewCategory(value === "new");
    }
  };

  return (
    <div className="fixed inset-0 -top-6 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 rounded-2xl max-w-lg w-full border border-slate-700/50 shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-white">Add New Income</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title and Amount Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Title
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Enter income title"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  name="amount"
                  required
                  step="0.01"
                  placeholder="0.00"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Source and Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Source
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  name="source"
                  required
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={formData.source}
                  onChange={handleChange}
                >
                  <option className="bg-gray-800 text-white" value="">
                    Select source
                  </option>
                  <option className="bg-gray-800 text-white" value="Salary">
                    Salary
                  </option>
                  <option className="bg-gray-800 text-white" value="Bonus">
                    Bonus
                  </option>
                  <option className="bg-gray-800 text-white" value="Investment">
                    Investment
                  </option>
                  <option className="bg-gray-800 text-white" value="Freelance">
                    Freelance
                  </option>
                  <option className="bg-gray-800 text-white" value="Gift">
                    Gift
                  </option>
                  <option className="bg-gray-800 text-white" value="new">
                    Add new source
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* New Source Input (Conditional) */}
          {isAddingNewCategory && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                New Source Name
              </label>
              <div className="relative">
                <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="newSource"
                  required
                  placeholder="Enter new source name"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.newSource}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Add a note or description..."
              rows="3"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={handleChange}
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
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:bg-blue-800/50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Income"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeModal;
