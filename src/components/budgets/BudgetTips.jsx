import React, { useMemo } from "react";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  BarChart2,
} from "lucide-react";

const BudgetTips = ({ expenses = [], budgets = [], categoryConfig }) => {
  const analysis = useMemo(() => {
    if (!expenses.length || !budgets.length) return null;

    const now = new Date();
    const currentDay = now.getDate();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    const monthProgress = (currentDay / daysInMonth) * 100;

    // Calculate current month's expenses
    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    });

    // Calculate total budget and spent amount
    const totalBudget = budgets.reduce(
      (sum, budget) => sum + parseFloat(budget.amount),
      0
    );
    const totalSpent = currentMonthExpenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );
    const percentageUsed = (totalSpent / totalBudget) * 100;

    // Category-specific analysis
    const categoryAnalysis = budgets.map((budget) => {
      const categoryExpenses = currentMonthExpenses.filter(
        (expense) => expense.category === budget.category
      );
      const spent = categoryExpenses.reduce(
        (sum, expense) => sum + parseFloat(expense.amount),
        0
      );
      const budgetAmount = parseFloat(budget.amount);
      const percentageUsed = (spent / budgetAmount) * 100;

      return {
        category: budget.category,
        spent,
        budgetAmount,
        percentageUsed,
        isOverBudget: spent > budgetAmount,
        isNearLimit: percentageUsed >= 80,
      };
    });

    // Find categories that need attention
    const overBudgetCategories = categoryAnalysis.filter(
      (cat) => cat.isOverBudget
    );
    const nearLimitCategories = categoryAnalysis.filter(
      (cat) => !cat.isOverBudget && cat.isNearLimit
    );

    // Daily spending rate analysis
    const idealDailyRate = totalBudget / daysInMonth;
    const currentDailyRate = totalSpent / currentDay;
    const isSpendingTooFast = currentDailyRate > idealDailyRate;

    return {
      percentageUsed,
      monthProgress,
      overBudgetCategories,
      nearLimitCategories,
      isSpendingTooFast,
      projectedOverspend: currentDailyRate * daysInMonth - totalBudget,
      daysRemaining: daysInMonth - currentDay,
      hasHighRiskCategories:
        overBudgetCategories.length > 0 || nearLimitCategories.length > 0,
    };
  }, [expenses, budgets]);

  if (!analysis) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-primary-500/20 via-primary-600/10 to-primary-700/20 backdrop-blur-xl rounded-2xl p-6 border border-primary-500/20">
      <h3 className="text-lg font-semibold text-white mb-2">Budget Insights</h3>
      <p className="text-sm text-slate-300 mb-4">
        {analysis.monthProgress.toFixed(0)}% through the month,{" "}
        {analysis.percentageUsed.toFixed(1)}% of budget used
      </p>
      <div className="space-y-4">
        {/* Overall Budget Status */}
        {analysis.percentageUsed >= 90 ? (
          <div className="flex items-start gap-3 text-sm text-slate-300 bg-red-500/10 p-3 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-400">Critical Budget Alert</p>
              <p>
                You've used {analysis.percentageUsed.toFixed(1)}% of your total
                budget with {analysis.daysRemaining} days remaining.
              </p>
            </div>
          </div>
        ) : analysis.percentageUsed >= 75 ? (
          <div className="flex items-start gap-3 text-sm text-slate-300 bg-amber-500/10 p-3 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-400">Budget Warning</p>
              <p>
                You've used {analysis.percentageUsed.toFixed(1)}% of your
                budget. Consider reducing non-essential expenses.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 text-sm text-slate-300 bg-emerald-500/10 p-3 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-emerald-400">On Track</p>
              <p>
                Your spending is well-managed. Keep maintaining this balance!
              </p>
            </div>
          </div>
        )}

        {/* Spending Rate Analysis */}
        {analysis.isSpendingTooFast && analysis.monthProgress < 90 && (
          <div className="flex items-start gap-3 text-sm text-slate-300">
            <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p>
              At your current spending rate, you might exceed your budget by $
              {analysis.projectedOverspend.toFixed(0)}. Try to reduce daily
              expenses to stay within budget.
            </p>
          </div>
        )}

        {/* Category Specific Warnings */}
        {analysis.hasHighRiskCategories && (
          <div className="flex items-start gap-3 text-sm text-slate-300">
            <BarChart2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-violet-400 mb-1">
                Category Alerts:
              </p>
              <ul className="space-y-1">
                {analysis.overBudgetCategories.map((cat) => (
                  <li key={cat.category} className="text-red-400">
                    • {cat.category} is over budget by $
                    {(cat.spent - cat.budgetAmount).toFixed(0)}
                  </li>
                ))}
                {analysis.nearLimitCategories.map((cat) => (
                  <li key={cat.category} className="text-amber-400">
                    • {cat.category} is at {cat.percentageUsed.toFixed(0)}% of
                    budget
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetTips;
