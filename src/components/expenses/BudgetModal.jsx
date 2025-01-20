import React, { useState, useEffect } from "react";
import { X, PencilLine, Save, Plus, Target, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import appService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import toast from "react-hot-toast";

const BudgetModal = ({ isOpen, onClose, categoryConfig, onBudgetUpdate }) => {
  const [budgets, setBudgets] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch budgets when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBudgets();
    }
  }, [isOpen]);

  // Fetch current budgets
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const userId = await authService.getCurrentUserId();
      if (!userId) return;

      const response = await appService.getCurrentBudgets(userId);
      if (response.documents) {
        const fetchedBudgets = response.documents.map((doc) => ({
          id: doc.$id,
          category: doc.category,
          amount: doc.amount,
        }));

        setBudgets(fetchedBudgets);
        updateTotalBudget(fetchedBudgets);
      }
    } catch (error) {
      toast.error("Failed to fetch budgets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (index, value) => {
    const newBudgets = [...budgets];
    newBudgets[index].amount = parseFloat(value) || 0;
    setBudgets(newBudgets);
    updateTotalBudget(newBudgets);
  };

  const updateTotalBudget = (budgetList) => {
    const total = budgetList.reduce(
      (sum, budget) => sum + (parseFloat(budget.amount) || 0),
      0
    );
    setTotalBudget(total);
  };

  const handleAddBudget = () => {
    if (newCategory && newAmount) {
      const existingCategory = budgets.find((b) => b.category === newCategory);
      if (existingCategory) {
        toast.error("Category already exists");
        return;
      }

      const newBudgets = [
        ...budgets,
        { category: newCategory, amount: parseFloat(newAmount) },
      ];
      setBudgets(newBudgets);
      updateTotalBudget(newBudgets);
      setNewCategory("");
      setNewAmount("");
      setIsAdding(false);
    }
  };

  const handleRemoveBudget = (index) => {
    const newBudgets = budgets.filter((_, i) => i !== index);
    setBudgets(newBudgets);
    updateTotalBudget(newBudgets);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const userId = await authService.getCurrentUserId();
      if (!userId) {
        toast.error("User not found");
        return;
      }

      // Delete existing budgets for current month
      const existingBudgets = await appService.getCurrentBudgets(userId);
      await Promise.all(
        existingBudgets.documents.map((budget) =>
          appService.deleteBudget(budget.$id)
        )
      );

      // Create new budgets
      const savedBudgets = await Promise.all(
        budgets.map((budget) =>
          appService.createBudget({
            userId,
            category: budget.category,
            amount: budget.amount,
            totalBudget,
          })
        )
      );

      onBudgetUpdate?.();

      toast.success("Budget settings saved successfully");
      setEditMode(false);
      onClose();
    } catch (error) {
      toast.error("Failed to save budget settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 -top-5 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-slate-900 rounded-2xl shadow-xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">
              Budget Settings
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Manage your monthly spending limits by category
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!loading && (
              <button
                onClick={() => setEditMode(!editMode)}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300 transition-colors"
              >
                <PencilLine className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : (
            <>
              {/* Total Budget Card */}
              <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Total Monthly Budget
                    </p>
                    <p className="text-2xl font-semibold text-slate-100 mt-1">
                      ${totalBudget.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-primary-500/20 p-3 rounded-xl">
                    <Target className="w-6 h-6 text-primary-500" />
                  </div>
                </div>
              </div>

              {/* Budget Categories */}
              <div className="space-y-4">
                <AnimatePresence>
                  {budgets.map((budget, index) => {
                    const category =
                      categoryConfig[budget.category] || categoryConfig.Other;
                    const Icon = category.icon;

                    return (
                      <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-slate-800/30 rounded-xl p-4 group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center`}
                          >
                            <Icon className={`w-5 h-5 ${category.textColor}`} />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-200 font-medium">
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
                                    className="w-24 px-3 py-1 bg-slate-700 rounded-lg text-right text-slate-200"
                                  />
                                  <button
                                    onClick={() => handleRemoveBudget(index)}
                                    className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-200 font-medium">
                                  ${budget.amount.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${
                                    (budget.amount / totalBudget) * 100
                                  }%`,
                                }}
                                className={`h-full ${category.bgColor.replace(
                                  "/20",
                                  ""
                                )}`}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-slate-400">
                                {((budget.amount / totalBudget) * 100).toFixed(
                                  1
                                )}
                                % of total
                              </span>
                              <span className="text-xs text-slate-400">
                                ${(budget.amount / 30).toFixed(2)} per day
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Add New Budget Category */}
              {editMode && (
                <div className="mt-4">
                  {!isAdding ? (
                    <button
                      onClick={() => setIsAdding(true)}
                      className="flex items-center gap-2 px-4 py-3 w-full bg-slate-800/30 hover:bg-slate-800/50 rounded-xl text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Budget Category
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-800/30 rounded-xl p-4"
                    >
                      <div className="flex gap-4">
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="flex-1 px-4 py-2 bg-slate-700 rounded-lg text-slate-200"
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
                        <input
                          type="number"
                          placeholder="Amount"
                          value={newAmount}
                          onChange={(e) => setNewAmount(e.target.value)}
                          className="w-32 px-4 py-2 bg-slate-700 rounded-lg text-slate-200"
                        />
                        <button
                          onClick={handleAddBudget}
                          disabled={!newCategory || !newAmount}
                          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
          >
            Cancel
          </button>
          {!loading && editMode && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetModal;
