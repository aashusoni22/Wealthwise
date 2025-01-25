import React from "react";
import { ArrowRight, TrendingUp } from "lucide-react";

const EmptyCategories = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mb-4">
      <TrendingUp className="w-8 h-8 text-slate-400" />
    </div>
    <h4 className="text-lg font-medium text-white mb-2">No Expenses Yet</h4>
    <p className="text-slate-400 text-sm mb-4">
      Start tracking your expenses to see spending patterns
    </p>
    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
      Add Your First Expense
    </button>
  </div>
);

const ExpenseCategories = ({
  expenses = [],
  categoryConfig = {},
  onViewAll,
}) => {
  const categoryTotals = React.useMemo(() => {
    if (!expenses?.length) return [];

    const totals = {};
    let grandTotal = 0;

    expenses.forEach((expense) => {
      if (expense?.category && expense?.amount) {
        const amount = parseFloat(expense.amount);
        totals[expense.category] = (totals[expense.category] || 0) + amount;
        grandTotal += amount;
      }
    });

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / grandTotal) * 100).toFixed(1),
        config: categoryConfig[category] || categoryConfig.Other,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, categoryConfig]);

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Expenses by Category
          </h3>
          <p className="text-sm text-slate-400">Track your spending patterns</p>
        </div>
        {categoryTotals.length > 0 && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm group"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {categoryTotals.length === 0 ? (
        <EmptyCategories />
      ) : (
        <div className="space-y-6">
          {categoryTotals
            .slice(0, 5)
            .map(({ category, amount, percentage, config }) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${config.bgColor}`}>
                      {React.createElement(config.icon, {
                        className: `w-5 h-5 ${config.textColor}`,
                      })}
                    </div>
                    <div>
                      <span className="text-slate-200 font-medium">
                        {category}
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {percentage}% of total
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-200 font-medium">
                    ${amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ease-out ${config.bgColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseCategories;
