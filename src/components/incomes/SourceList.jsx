import React from "react";
import { PieChart, ArrowRight } from "lucide-react";

const SourceList = ({
  sources,
  onSourceSelect,
  selectedSource,
  selectedPeriod,
  onViewAllSources,
}) => {
  // Helper function to filter sources by period
  const filterSourcesByPeriod = (transactions) => {
    if (!Array.isArray(transactions)) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    switch (selectedPeriod) {
      case "This Month":
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          );
        });
      case "Last Month": {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const yearToCheck = currentMonth === 0 ? currentYear - 1 : currentYear;
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getMonth() === lastMonth &&
            transactionDate.getFullYear() === yearToCheck
          );
        });
      }
      case "Last 3 Months": {
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= threeMonthsAgo && transactionDate <= now;
        });
      }
      default:
        return transactions;
    }
  };

  const getPeriodSourceTotals = () => {
    const filteredTransactions = filterSourcesByPeriod(sources);
    const sourceMap = new Map();

    filteredTransactions.forEach((transaction) => {
      const sourceName = transaction.source;
      const currentTotal = sourceMap.get(sourceName) || {
        name: sourceName,
        amount: 0,
        count: 0,
      };

      currentTotal.amount += parseFloat(transaction.amount) || 0;
      currentTotal.count += 1;
      sourceMap.set(sourceName, currentTotal);
    });

    return Array.from(sourceMap.values())
      .filter((source) => source.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  };

  const filteredSources = getPeriodSourceTotals();
  const totalAmount = filteredSources.reduce(
    (sum, source) => sum + source.amount,
    0
  );
  const visibleSources = filteredSources.slice(0, 3);

  const sourceConfig = {
    Salary: { textColor: "text-emerald-500", badgeBg: "bg-emerald-500/10" },
    Business: { textColor: "text-blue-500", badgeBg: "bg-blue-500/10" },
    Investments: { textColor: "text-purple-500", badgeBg: "bg-purple-500/10" },
    Freelance: { textColor: "text-orange-500", badgeBg: "bg-orange-500/10" },
    Gift: { textColor: "text-pink-500", badgeBg: "bg-pink-500/10" },
    "Side Hustle": { textColor: "text-cyan-500", badgeBg: "bg-cyan-500/10" },
    Other: { textColor: "text-slate-500", badgeBg: "bg-slate-500/10" },
  };

  const getColorFromTextColor = (textColorClass) => {
    const colorMap = {
      "text-emerald-500": "#10B981",
      "text-blue-500": "#3B82F6",
      "text-purple-500": "#8B5CF6",
      "text-orange-500": "#F97316",
      "text-pink-500": "#EC4899",
      "text-cyan-500": "#06B6D4",
      "text-red-500": "#EF4444",
      "text-slate-500": "#64748B",
    };
    return colorMap[textColorClass] || colorMap["text-slate-500"];
  };

  const renderSources = () => {
    return visibleSources.map((source) => {
      const config = sourceConfig[source.name] || sourceConfig.Other;
      const sourceColor = getColorFromTextColor(config.textColor);
      const percentage = (source.amount / totalAmount) * 100;
      const isSelected = selectedSource === source.name;

      return (
        <button
          key={source.name}
          onClick={() => onSourceSelect(source.name)}
          className={`w-full space-y-2 p-2 rounded-xl transition-all ${
            isSelected ? "bg-slate-800/60" : "hover:bg-slate-800/40"
          }`}
        >
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: sourceColor }}
              />
              <span className="text-slate-300">{source.name}</span>
            </div>
            <span className={config.textColor}>
              ${source.amount.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                backgroundColor: sourceColor,
                width: `${percentage}%`,
                opacity: isSelected ? 1 : 0.8,
              }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">
              {percentage.toFixed(1)}% of total
            </span>
            <span className="text-slate-400">
              {source.count} transaction{source.count !== 1 ? "s" : ""}
            </span>
          </div>
        </button>
      );
    });
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "Last Month":
        return "Last Month's Sources";
      case "Last 3 Months":
        return "3-Month Sources";
      default:
        return "Income Sources";
    }
  };

  return (
    <div className="bg-slate-800/40 lg:min-h-auto rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">
          {getPeriodLabel()}
        </h2>
        {filteredSources.length > 3 && (
          <button
            onClick={onViewAllSources}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300 transition-colors"
          >
            <PieChart className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filteredSources.length === 0 ? (
          <p className="text-sm text-slate-400 flex items-center justify-center h-40">
            <PieChart className="w-4 h-4 mr-2" /> No sources for this period
          </p>
        ) : (
          <>
            {/* All Sources Option */}
            <button
              onClick={() => onSourceSelect("all")}
              className={`w-full space-y-2 p-2 rounded-xl transition-all ${
                selectedSource === "all"
                  ? "bg-slate-800/60"
                  : "hover:bg-slate-800/40"
              }`}
            >
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">All Sources</span>
                </div>
                <span className="text-emerald-500">
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-emerald-500"
                  style={{
                    width: "100%",
                    opacity: selectedSource === "all" ? 1 : 0.8,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">100% of total</span>
                <span className="text-slate-400">
                  {filteredSources.reduce((sum, src) => sum + src.count, 0)}{" "}
                  transactions
                </span>
              </div>
            </button>

            {/* Visible Sources */}
            {renderSources()}

            {/* View All Button */}
            {filteredSources.length > 3 && (
              <button
                onClick={onViewAllSources}
                className="w-full mt-4 py-2 text-sm text-emerald-500 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1"
              >
                View All Sources
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SourceList;
