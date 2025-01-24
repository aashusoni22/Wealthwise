import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  PencilLine,
  Save,
  Plus,
  Target,
  Loader2,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import appService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import { showToast } from "../Toast";

const BudgetModal = ({
  isOpen,
  onClose,
  categoryConfig,
  onBudgetUpdate,
  expenses = [],
}) => {
  const [budgets, setBudgets] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Existing budget metrics calculation
  const budgetMetrics = useMemo(() => {
    const total = budgets.reduce(
      (sum, budget) => sum + (parseFloat(budget.amount) || 0),
      0
    );
    const currentDate = new Date();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] =
        (acc[expense.category] || 0) + parseFloat(expense.amount || 0);
      return acc;
    }, {});

    const totalSpent = Object.values(categorySpending).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return {
      totalBudget: total,
      totalSpent,
      utilization: total > 0 ? (totalSpent / total) * 100 : 0,
      dailyBudget: total / daysInMonth,
      daysInMonth,
      categorySpending,
    };
  }, [budgets, expenses]);

  // Keep existing useEffect and data fetching logic...
  useEffect(() => {
    if (isOpen) {
      fetchBudgets();
    }
  }, [isOpen]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) {
        showToast("Please log in first", "error");
        onClose();
        return;
      }

      const response = await appService.getCurrentBudgets(user.$id);
      if (response?.documents) {
        const fetchedBudgets = response.documents.map((doc) => ({
          id: doc.$id,
          category: doc.category,
          amount: parseFloat(doc.amount) || 0,
        }));
        setBudgets(fetchedBudgets);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
      showToast("Failed to fetch budgets", "error");
    } finally {
      setLoading(false);
    }
  };

  // Keep existing handlers...
  const handleAmountChange = (index, value) => {
    const newBudgets = [...budgets];
    newBudgets[index] = {
      ...newBudgets[index],
      amount: parseFloat(value) || 0,
    };
    setBudgets(newBudgets);
  };

  const handleAddBudget = async () => {
    try {
      if (!newCategory || !newAmount) return;

      const amount = parseFloat(newAmount);
      if (isNaN(amount) || amount <= 0) {
        showToast("Please enter a valid amount", "error");
        return;
      }

      const existingCategory = budgets.find((b) => b.category === newCategory);
      if (existingCategory) {
        showToast("Category already exists", "error");
        return;
      }

      const user = await authService.getCurrentUser();
      if (!user) {
        showToast("User not found", "error");
        return;
      }

      // Add to local state first for immediate UI update
      const newBudgets = [...budgets, { category: newCategory, amount }];
      setBudgets(newBudgets);

      // Calculate new total budget
      const totalBudget = newBudgets.reduce(
        (sum, budget) => sum + (parseFloat(budget.amount) || 0),
        0
      );

      // Create the new budget in the backend
      await appService.createBudget({
        userId: user.$id,
        category: newCategory,
        amount: amount,
        totalBudget: totalBudget,
      });

      // Clear form and trigger update
      setNewCategory("");
      setNewAmount("");
      setIsAdding(false);
      onBudgetUpdate?.();
    } catch (error) {
      console.error("Error adding budget:", error);
      showToast("Failed to add budget", "error");
    }
  };

  const handleRemoveBudget = async (index) => {
    try {
      const budgetToRemove = budgets[index];
      if (!budgetToRemove?.id) {
        showToast("Invalid budget selected", "error");
        return;
      }

      // Update local state first for immediate UI update
      const newBudgets = budgets.filter((_, i) => i !== index);
      setBudgets(newBudgets);

      // Delete from backend
      await appService.deleteBudget(budgetToRemove.id);

      // Trigger update
      onBudgetUpdate?.();
      showToast("Budget removed successfully", "success");
    } catch (error) {
      console.error("Error removing budget:", error);
      showToast("Failed to remove budget", "error");
      // Revert local state on error
      await fetchBudgets();
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) {
        showToast("User not found", "error");
        return;
      }

      const existingBudgets = await appService.getCurrentBudgets(user.$id);
      await Promise.all(
        existingBudgets.documents.map((budget) =>
          appService.deleteBudget(budget.$id)
        )
      );

      await Promise.all(
        budgets.map((budget) =>
          appService.createBudget({
            userId: user.$id,
            category: budget.category,
            amount: budget.amount,
            totalBudget: budgetMetrics.totalBudget,
          })
        )
      );

      onBudgetUpdate?.();
      showToast("Budget settings saved successfully", "success");
      setEditMode(false);
      onClose();
    } catch (error) {
      console.error("Error saving budgets:", error);
      showToast("Failed to save budget settings", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] bg-slate-900 rounded-2xl shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-100">
              Monthly Budget Settings
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your spending limits by category
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!loading && (
              <button
                onClick={() => setEditMode(!editMode)}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300"
              >
                <PencilLine className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary-500/20 p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Total Budget</p>
                      <p className="text-lg sm:text-xl font-semibold text-slate-100">
                        $
                        {budgetMetrics.totalBudget.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">
                    ${budgetMetrics.dailyBudget.toFixed(2)} per day
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-emerald-500/20 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Total Spent</p>
                      <p className="text-lg sm:text-xl font-semibold text-slate-100">
                        $
                        {budgetMetrics.totalSpent.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">
                    {budgetMetrics.utilization.toFixed(1)}% of budget used
                  </div>
                </div>
              </div>

              {/* Budget Categories */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300 mb-3">
                  Category Budgets
                </h3>
                <AnimatePresence>
                  {budgets.map((budget, index) => {
                    const category =
                      categoryConfig[budget.category] || categoryConfig.Other;
                    const Icon = category.icon;
                    const spent =
                      budgetMetrics.categorySpending[budget.category] || 0;
                    const percentage = (spent / budget.amount) * 100;

                    return (
                      <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-slate-800/30 rounded-xl p-4 group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center`}
                          >
                            <Icon className={`w-5 h-5 ${category.textColor}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-200 truncate">
                                {budget.category}
                              </span>
                              {editMode ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={budget.amount}
                                    onChange={(e) =>
                                      handleAmountChange(index, e.target.value)
                                    }
                                    className="w-20 sm:w-24 px-2 py-1 bg-slate-700 rounded-lg text-right text-slate-200 text-sm"
                                  />
                                  <button
                                    onClick={() => handleRemoveBudget(index)}
                                    className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-sm font-medium text-slate-200">
                                  ${budget.amount.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <div className="mt-2">
                              <div className="h-1.5 bg-slate-700/30 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${Math.min(percentage, 100)}%`,
                                  }}
                                  className={`h-full ${category.textColor.replace(
                                    "text-",
                                    "bg-"
                                  )}`}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-slate-400">
                                  ${spent.toFixed(2)} spent
                                </span>
                                <span className="text-xs text-slate-400">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Add New Budget Category */}
                {editMode && (
                  <div className="mt-4">
                    {!isAdding ? (
                      <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center justify-center gap-2 px-4 py-3 w-full bg-slate-800/30 hover:bg-slate-800/50 rounded-xl text-slate-400 hover:text-slate-300"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add Category</span>
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800/30 rounded-xl p-4"
                      >
                        <div className="flex flex-col sm:flex-row gap-3">
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-700 rounded-lg text-slate-200 text-sm"
                          >
                            <option value="">Select Category</option>
                            {Object.keys(categoryConfig)
                              .filter(
                                (category) =>
                                  !budgets.find((b) => b.category === category)
                              )
                              .map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                          </select>
                          <div className="flex gap-3">
                            <input
                              type="number"
                              placeholder="Amount"
                              value={newAmount}
                              onChange={(e) => setNewAmount(e.target.value)}
                              className="w-full sm:w-32 px-3 py-2 bg-slate-700 rounded-lg text-slate-200 text-sm"
                            />
                            <button
                              onClick={handleAddBudget}
                              disabled={!newCategory || !newAmount}
                              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm whitespace-nowrap"
                            >
                              Add Category
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
          {!loading && editMode && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetModal;
