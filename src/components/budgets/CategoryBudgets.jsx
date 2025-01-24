import React, { useState } from "react";
import {
  AlertTriangle,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  ArrowRight,
  LayoutGrid, // Default icon for fallback
} from "lucide-react";
import { motion } from "framer-motion";

// Default category configuration as fallback
const defaultCategoryConfig = {
  Other: {
    icon: LayoutGrid,
    bgColor: "bg-slate-500",
    textColor: "text-slate-100",
  },
};

// Safe category getter with fallback
const getCategoryConfig = (categoryConfig, category) => {
  if (!categoryConfig || !category) return defaultCategoryConfig.Other;
  return categoryConfig[category] || defaultCategoryConfig.Other;
};

const BudgetCardDropdown = ({ onEdit, onDelete, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute right-2 top-12 w-48 bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden z-50">
      <button
        onClick={onEdit}
        className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
      >
        <Pencil className="w-4 h-4" />
        Edit Budget
      </button>
      <button
        onClick={onDelete}
        className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Delete Budget
      </button>
    </div>
  );
};

const SpendingHistory = ({ transactions = [], onViewAllClick }) => {
  if (!transactions?.length) return null;

  return (
    <div className="mt-4 border-t border-slate-700/50 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-slate-300">
          Recent Transactions
        </h4>
        <button
          onClick={onViewAllClick}
          className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-2">
        {transactions.slice(0, 3).map((transaction) => (
          <div
            key={transaction.$id || transaction.id}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-300">{transaction.title}</span>
            </div>
            <span className="text-slate-400">
              $
              {parseFloat(transaction.amount || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryBudgetCard = ({
  budget,
  categorySpending,
  categoryConfig,
  onEdit,
  onDelete,
  recentTransactions = [],
  onViewAllClick,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const category = getCategoryConfig(categoryConfig, budget.category);
  const Icon = category.icon;

  const now = new Date();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  const currentDay = now.getDate();
  const dailyBudget = parseFloat(budget.amount || 0) / daysInMonth;
  const spent = parseFloat(categorySpending?.spent || 0);
  const dailySpent = spent / currentDay;
  const spentPercentage = (spent / parseFloat(budget.amount || 1)) * 100;
  const isOverBudget = spentPercentage > 100;
  const isDailyOverBudget = dailySpent > dailyBudget;

  return (
    <div
      className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-5 border border-slate-700/30 
      hover:bg-slate-800/60 transition-all duration-300 group cursor-pointer relative"
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
          >
            <Icon className={`w-6 h-6 ${category.textColor}`} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{budget.category}</h3>
            <div className="flex items-baseline gap-2 text-sm">
              <span className="text-slate-400">
                $
                {spent.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                of $
                {parseFloat(budget.amount || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            className="p-2 hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
          >
            <MoreHorizontal className="w-5 h-5 text-slate-400" />
          </button>
          <BudgetCardDropdown
            isVisible={showDropdown}
            onEdit={(e) => {
              e.stopPropagation();
              onEdit(budget);
              setShowDropdown(false);
            }}
            onDelete={(e) => {
              e.stopPropagation();
              onDelete(budget);
              setShowDropdown(false);
            }}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-2">
          <span
            className={`font-medium ${
              isOverBudget
                ? "text-red-400"
                : spentPercentage >= 90
                ? "text-amber-400"
                : "text-slate-400"
            }`}
          >
            {spentPercentage.toFixed(1)}% used
          </span>
          <span
            className={isDailyOverBudget ? "text-red-400" : "text-emerald-400"}
          >
            ${dailySpent.toFixed(2)}/day avg
          </span>
        </div>

        <div className="mt-2 h-1.5 bg-slate-700/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(100, spentPercentage)}%`,
            }}
            className={`h-full rounded-full ${
              isOverBudget
                ? "bg-red-500"
                : spentPercentage >= 90
                ? "bg-amber-500"
                : category.textColor.replace("text-", "bg-")
            } opacity-100`}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>Daily Budget: ${dailyBudget.toFixed(2)}</span>
          <span>
            ${Math.max(0, (budget.amount || 0) - spent).toFixed(2)} remaining
          </span>
        </div>
      </div>

      {spentPercentage >= 90 && (
        <div className="mt-3 p-2 bg-red-500/10 rounded-lg flex items-center gap-2 text-sm text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <span>
            Budget limit {isOverBudget ? "exceeded" : "nearly reached"}
          </span>
        </div>
      )}

      {showDetails && (
        <SpendingHistory
          onViewAllClick={onViewAllClick}
          transactions={recentTransactions}
        />
      )}
    </div>
  );
};

const AddBudgetCard = ({ onAdd }) => {
  return (
    <button
      onClick={onAdd}
      className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-5 border border-dashed border-slate-700/30 hover:bg-slate-800/60 transition-all duration-300 group flex flex-col items-center justify-center min-h-[180px] text-slate-400 hover:text-slate-300"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <Plus className="w-6 h-6" />
      </div>
      <p className="font-medium">Create New Budget</p>
      <p className="text-sm opacity-60">Set up a budget for a new category</p>
    </button>
  );
};

const CategoryBudgets = ({
  budgets = [],
  categoryConfig = defaultCategoryConfig,
  calculateCategorySpending,
  onAddBudget,
  onEditBudget,
  onDeleteBudget,
  expenses = [],
  onViewAllClick,
}) => {
  if (!Array.isArray(budgets)) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {budgets.map((budget) => {
        if (!budget?.category) return null;

        const categorySpending = calculateCategorySpending?.(
          budget.category
        ) || { spent: 0 };
        const categoryTransactions = expenses
          .filter((exp) => exp?.category === budget.category)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);

        return (
          <CategoryBudgetCard
            key={budget.$id || budget.id}
            budget={budget}
            categorySpending={categorySpending}
            categoryConfig={categoryConfig}
            onEdit={() => onEditBudget?.(budget)}
            onDelete={() => onDeleteBudget?.(budget)}
            recentTransactions={categoryTransactions}
            onViewAllClick={onViewAllClick}
          />
        );
      })}

      <AddBudgetCard onAdd={onAddBudget} />
    </div>
  );
};

export default CategoryBudgets;
