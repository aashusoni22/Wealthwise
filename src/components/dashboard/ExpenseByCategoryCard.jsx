import React from "react";

export const ExpenseByCategoryCard = () => (
  <div className="rounded-2xl bg-surface-800/20 p-6 backdrop-blur-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium text-surface-200">
        Expenses by Category
      </h3>
      <button className="text-sm text-primary-500 hover:text-primary-400">
        View All
      </button>
    </div>
    <div className="mt-6 space-y-4">
      {[
        { category: "Housing", amount: 1200, percentage: 35 },
        { category: "Food", amount: 600, percentage: 20 },
        { category: "Transport", amount: 400, percentage: 15 },
        { category: "Entertainment", amount: 300, percentage: 10 },
      ].map((item) => (
        <div key={item.category} className="flex items-center gap-4">
          <div className="min-w-[120px]">
            <p className="text-sm font-medium text-surface-200">
              {item.category}
            </p>
            <p className="text-sm text-surface-400">${item.amount}</p>
          </div>
          <div className="flex-1">
            <div className="h-2 w-full rounded-full bg-surface-700">
              <div
                className="h-2 rounded-full bg-primary-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-surface-400">
            {item.percentage}%
          </span>
        </div>
      ))}
    </div>
  </div>
);
