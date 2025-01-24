import React, { useMemo } from "react";

const ExpenseCategories = ({ expenses, categoryConfig, onViewAll }) => {
  const categoryTotals = useMemo(() => {
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
        <h3 className="text-lg font-semibold text-white">
          Expenses by Category
        </h3>
        <button
          onClick={onViewAll}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          View All
        </button>
      </div>
      <div className="space-y-6">
        {categoryTotals
          .slice(0, 5)
          .map(({ category, amount, percentage, config }) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    {React.createElement(config.icon, {
                      className: `w-4 h-4 ${config.textColor}`,
                    })}
                  </div>
                  <span className="text-slate-200">{category}</span>
                </div>
                <span className="text-slate-200">
                  ${amount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2">
                <div
                  className={`h-[6px] rounded-full ${config.textColor.replace(
                    "text-",
                    "bg-"
                  )} opacity-100`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ExpenseCategories;
