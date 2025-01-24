import React from "react";
import { ChevronRight, Plus, Target } from "lucide-react";
import { categoryConfig } from "../../utils/categoryConfig";

const RecentActivity = ({ expenses = [], onViewAll, onAddTransaction }) => {
  const hasMoreTransactions = expenses.length > 4;

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          {hasMoreTransactions && (
            <p className="text-sm text-slate-400">
              Showing 4 most recent transactions
            </p>
          )}
        </div>
        {hasMoreTransactions && (
          <button
            onClick={onViewAll}
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Show only the 4 most recent transactions */}
        {expenses
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 4)
          .map((expense) => (
            <ActivityItem key={expense.$id} expense={expense} />
          ))}

        {expenses.length === 0 && (
          <div className="text-center py-4 text-slate-400">
            No recent transactions
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityItem = ({ expense }) => {
  const category = categoryConfig[expense.category] || categoryConfig.Other;
  const IconComponent = category.icon;

  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-700/30 rounded-xl transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg ${category.badgeBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          <IconComponent className={`w-5 h-5 ${category.textColor}`} />
        </div>
        <div>
          <p className="font-medium text-white">{expense.title}</p>
          <p className="text-sm text-slate-400">{expense.category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-white">
          ${Number(expense.amount).toLocaleString()}
        </p>
        <p className="text-sm text-slate-400">
          {new Date(expense.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default RecentActivity;
