import React from "react";
import { Target } from "lucide-react";

const BudgetStatusCard = ({ budgetMetrics }) => {
  const getStatusColors = (status) => {
    switch (status) {
      case "Critical":
        return {
          bg: "bg-red-500/20",
          text: "text-red-500",
          border: "border-red-500/20",
          alert: "bg-red-500",
        };
      case "Warning":
        return {
          bg: "bg-amber-500/20",
          text: "text-amber-500",
          border: "border-amber-500/20",
          alert: "bg-amber-500",
        };
      default:
        return {
          bg: "bg-violet-500/20",
          text: "text-violet-500",
          border: "border-violet-500/20",
          alert: "bg-violet-500",
        };
    }
  };

  const colors = getStatusColors(budgetMetrics.status);
  const showWarning =
    budgetMetrics.percentageUsed > 75 && budgetMetrics.totalBudget > 0;

  return (
    <div className="relative bg-slate-800/40 rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
      {/* Budget Info */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Monthly Budget</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold mt-1">
              ${Number(budgetMetrics.remaining).toLocaleString()}
            </p>
            <p className="text-sm text-slate-400">
              of ${Number(budgetMetrics.totalBudget).toLocaleString()}
            </p>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          <Target className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-400">Budget Used</span>
          <span className={`font-medium ${colors.text}`}>
            {budgetMetrics.percentageUsed}%
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${colors.alert}`}
            style={{ width: `${Math.min(100, budgetMetrics.percentageUsed)}%` }}
          />
        </div>
      </div>

      {/* Floating Alert */}
      {showWarning && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-surface-900 border border-slate-800 shadow-lg flex items-center gap-1.5 whitespace-nowrap">
          <div className={`w-1.5 h-1.5 rounded-full ${colors.alert}`} />
          <span className="text-slate-300">
            {budgetMetrics.status === "Critical"
              ? "Over 90% of budget used"
              : "Over 75% of budget used"}
          </span>
        </div>
      )}
    </div>
  );
};

export default BudgetStatusCard;
