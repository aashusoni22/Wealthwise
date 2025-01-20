import React from "react";
import { ShoppingBag, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import BudgetStatusCard from "./BudgetStatusCard";

const StatCards = ({ stats, budgetMetrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-800/40 rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Monthly Total</p>
            <p className="text-2xl font-semibold mt-1">
              ${stats.thisMonthTotal.toFixed(2)}
            </p>
          </div>
          <div className="bg-primary-500/20 p-3 rounded-xl">
            <ShoppingBag className="w-6 h-6 text-primary-500" />
          </div>
        </div>
        <div
          className={`mt-4 flex items-center gap-1 text-sm ${
            stats.monthlyChange > 0 ? "text-amber-500" : "text-emerald-500"
          }`}
        >
          {stats.monthlyChange > 0 ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          <span>{Math.abs(stats.monthlyChange)}% from last month</span>
        </div>
      </div>

      <div className="bg-slate-800/40 rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">This Week</p>
            <p className="text-2xl font-semibold mt-1">
              ${stats.thisWeekTotal.toFixed(2)}
            </p>
          </div>
          <div className="bg-emerald-500/20 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
        <div
          className={`mt-4 flex items-center gap-1 text-sm ${
            stats.weeklyChange > 0 ? "text-amber-500" : "text-emerald-500"
          }`}
        >
          {stats.weeklyChange > 0 ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          <span>{Math.abs(stats.weeklyChange)}% from last week</span>
        </div>
      </div>

      <BudgetStatusCard budgetMetrics={budgetMetrics} />
    </div>
  );
};

export default StatCards;
