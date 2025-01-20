import React from "react";
import { ShoppingCart, Calendar } from "lucide-react";

const QuickActions = ({ onAddExpense, onOpenBudget }) => {
  return (
    <div className="bg-slate-800/40 rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">
        Quick Actions
      </h2>
      <div className="space-y-3">
        <button
          onClick={onAddExpense}
          className="w-full flex items-center gap-3 p-3 bg-primary-500/10 hover:bg-primary-600/20 text-primary-500 rounded-xl transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-medium">Add Expense</p>
            <p className="text-sm text-primary-400">Record new transaction</p>
          </div>
        </button>

        <button
          onClick={onOpenBudget}
          className="w-full flex items-center gap-3 p-3 bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 rounded-xl transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-medium">Budget</p>
            <p className="text-sm text-violet-400">Set monthly limits</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
