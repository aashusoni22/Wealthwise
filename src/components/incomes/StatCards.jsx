import React from "react";
import {
  Wallet,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Clock,
  BarChart,
} from "lucide-react";

const StatCards = ({ metrics, selectedPeriod }) => {
  // Format helper for numbers
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Helper to get period-specific label
  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "Last Month":
        return "Last Month's Total";
      case "Last 3 Months":
        return "3-Month Total";
      default:
        return "Monthly Total";
    }
  };

  // Get color class for the top source
  const getSourceColor = (sourceName) => {
    const colorMap = {
      Salary: "text-emerald-500",
      Freelance: "text-blue-500",
      Investments: "text-purple-500",
      Business: "text-orange-500",
      Rental: "text-pink-500",
      "Side Gig": "text-cyan-500",
      Other: "text-slate-500",
    };
    return colorMap[sourceName] || "text-slate-500";
  };

  // Get background color class for the top source
  const getSourceBgColor = (sourceName) => {
    const colorMap = {
      Salary: "bg-emerald-500/20",
      Freelance: "bg-blue-500/20",
      Investments: "bg-purple-500/20",
      Business: "bg-orange-500/20",
      Rental: "bg-pink-500/20",
      "Side Gig": "bg-cyan-500/20",
      Other: "bg-slate-500/20",
    };
    return colorMap[sourceName] || "bg-slate-500/20";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Income Card */}
      <div className="bg-slate-800/40 rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{getPeriodLabel()}</p>
            <p className="text-2xl font-semibold mt-1">
              {formatCurrency(metrics.totalIncome)}
            </p>
          </div>
          <div className="bg-primary-500/20 p-3 rounded-xl">
            <Wallet className="w-6 h-6 text-primary-500" />
          </div>
        </div>
        <div
          className={`mt-4 flex items-center gap-1 text-sm ${
            metrics.monthlyChange > 0 ? "text-emerald-500" : "text-amber-500"
          }`}
        >
          {metrics.monthlyChange > 0 ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          <span>
            {Math.abs(metrics.monthlyChange).toFixed(1)}% from previous period
          </span>
        </div>
      </div>

      {/* Daily Average Card */}
      <div className="bg-slate-800/40 rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Daily Average</p>
            <p className="text-2xl font-semibold mt-1">
              {formatCurrency(metrics.dailyAverage)}
            </p>
          </div>
          <div className="bg-violet-500/20 p-3 rounded-xl">
            <Clock className="w-6 h-6 text-violet-500" />
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-400">
          Over {metrics.totalTransactions} transactions
        </div>
      </div>

      {/* Top Income Source Card */}
      <div className="bg-slate-800/40 rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Top Income Source</p>
            <p className="text-2xl font-semibold mt-1">
              <span className={getSourceColor(metrics.topSource.name)}>
                {metrics.topSource.name}
              </span>
            </p>
          </div>
          <div
            className={`${getSourceBgColor(
              metrics.topSource.name
            )} p-3 rounded-xl`}
          >
            <BarChart
              className={`w-6 h-6 ${getSourceColor(metrics.topSource.name)}`}
            />
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-400">
          {formatCurrency(metrics.topSource.amount)} (
          {metrics.topSource.percentage.toFixed(1)}% of total)
        </div>
      </div>
    </div>
  );
};

export default StatCards;
