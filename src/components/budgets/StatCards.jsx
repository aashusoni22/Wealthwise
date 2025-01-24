import React from "react";
import {
  DollarSign,
  CreditCard,
  Wallet,
  Activity,
  ArrowUpRight,
  Circle,
} from "lucide-react";

const StatCard = ({ title, value, icon, bgColor, trend, info }) => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-2xl font-semibold text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 ${bgColor} rounded-xl`}>{icon}</div>
      </div>
      {trend && (
        <div className="flex items-center gap-2 text-sm text-emerald-500">
          <ArrowUpRight className="w-4 h-4" />
          <span>
            {trend.value} {trend.label}
          </span>
        </div>
      )}
      {info && (
        <div className="flex items-center gap-2 text-sm text-violet-500">
          <Circle className="w-2 h-2 fill-current" />
          <span>{info}</span>
        </div>
      )}
    </div>
  );
};

const BudgetProgressCard = ({ title, percentage }) => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-2xl font-semibold text-white mt-1">
            {percentage.toFixed(1)}%
          </h3>
        </div>
        <div className="p-3 bg-amber-500/10 rounded-xl">
          <Activity className="w-6 h-6 text-amber-500" />
        </div>
      </div>
      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden mt-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percentage >= 90
              ? "bg-red-500"
              : percentage >= 75
              ? "bg-amber-500"
              : "bg-emerald-500"
          }`}
          style={{
            width: `${Math.min(100, percentage)}%`,
          }}
        />
      </div>
    </div>
  );
};

const StatCards = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Total Budget"
        value={`$${metrics.totalBudget.toLocaleString()}`}
        icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
        bgColor="bg-emerald-500/10"
        trend={{ value: "12%", label: "from last month", type: "increase" }}
      />
      <StatCard
        title="Spent This Month"
        value={`$${metrics.currentMonthExpenses.toLocaleString()}`}
        icon={<CreditCard className="w-6 h-6 text-blue-500" />}
        bgColor="bg-blue-500/10"
        trend={{ value: "8.2%", label: "vs average", type: "increase" }}
      />
      <StatCard
        title="Remaining"
        value={`$${metrics.remaining.toLocaleString()}`}
        icon={<Wallet className="w-6 h-6 text-violet-500" />}
        bgColor="bg-violet-500/10"
        info={`${30 - new Date().getDate()} days left`}
      />
      <BudgetProgressCard
        title="Budget Used"
        percentage={metrics.percentageUsed}
      />
    </div>
  );
};

export default StatCards;
