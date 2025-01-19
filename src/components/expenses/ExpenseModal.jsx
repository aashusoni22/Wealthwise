import React, { useState } from "react";
import {
  X,
  DollarSign,
  Calendar,
  CreditCard,
  FileText,
  Tag,
  Clock,
} from "lucide-react";

const ExpenseModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "",
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
    <div className="fixed inset-0 -top-6 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-800/90 rounded-2xl max-w-lg w-full border border-slate-700/50 shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-white">Add New Expense</h2>
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
                placeholder="Enter expense title"
                className="w-full bg-surface-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Amount and Date Row */}
          <div className="grid grid-cols-2 gap-4">
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
                  className="w-full bg-surface-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
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
                  className="w-full bg-surface-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Category and Payment Method Row */}
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
                  <option className="bg-gray-800 text-white" value="Shopping">
                    Shopping
                  </option>
                  <option
                    className="bg-gray-800 text-white"
                    value="Food & Drink"
                  >
                    Food & Drink
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
                    Utilities
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Payment Method
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  name="paymentMethod"
                  required
                  className="w-full bg-surface-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
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
                  <option
                    className="bg-gray-800 text-white"
                    value="Bank Transfer"
                  >
                    Bank Transfer
                  </option>
                  <option
                    className="bg-gray-800 text-white"
                    value="Mobile Payment"
                  >
                    Mobile Payment
                  </option>
                </select>
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
              placeholder="Add a note or description..."
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
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
