import React, { useState, useMemo } from "react";
import { Target, CreditCard } from "lucide-react";
import { format, isSameMonth, subMonths, parseISO } from "date-fns";

const MonthlySummary = ({ expenses = [], categoryConfig }) => {
  const [selectedMonth, setSelectedMonth] = useState("This Month");

  // Calculate summary data based on selected month
  const summaryData = useMemo(() => {
    const now = new Date();
    const lastMonth = subMonths(now, 1);

    // Filter expenses for selected month
    const currentMonthExpenses = expenses.filter((expense) => {
      try {
        const expenseDate = new Date(expense.date);
        if (selectedMonth === "This Month") {
          return isSameMonth(expenseDate, now);
        }
        return isSameMonth(expenseDate, lastMonth);
      } catch (error) {
        return false;
      }
    });

    // Rest of your existing code remains the same
    const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = {
          total: 0,
          count: 0,
          category,
        };
      }
      acc[category].total += parseFloat(expense.amount);
      acc[category].count += 1;
      return acc;
    }, {});

    const topCategory =
      Object.values(categoryTotals).sort((a, b) => b.total - a.total)[0] ||
      null;

    const largestTransaction =
      currentMonthExpenses.sort(
        (a, b) => parseFloat(b.amount) - parseFloat(a.amount)
      )[0] || null;

    const lastMonthExpenses = expenses.filter((expense) => {
      try {
        const expenseDate = new Date(expense.date);
        if (selectedMonth === "This Month") {
          return isSameMonth(expenseDate, lastMonth);
        }
        return isSameMonth(expenseDate, subMonths(lastMonth, 1));
      } catch (error) {
        return false;
      }
    });

    const lastMonthCategoryTotals = lastMonthExpenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = {
          total: 0,
          count: 0,
          category,
        };
      }
      acc[category].total += parseFloat(expense.amount);
      acc[category].count += 1;
      return acc;
    }, {});

    let percentageChange = 0;
    if (topCategory) {
      const lastMonthTotal =
        lastMonthCategoryTotals[topCategory.category]?.total || 0;
      if (lastMonthTotal > 0) {
        percentageChange =
          ((topCategory.total - lastMonthTotal) / lastMonthTotal) * 100;
      }
    }

    return {
      topCategory,
      largestTransaction,
      percentageChange,
    };
  }, [expenses, selectedMonth]);

  const { topCategory, largestTransaction, percentageChange } = summaryData;

  // Helper function for safe date formatting
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d");
    } catch (error) {
      return "N/A";
    }
  };
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Monthly Summary</h2>
        <select
          className="bg-slate-700/50 text-slate-200 rounded-lg px-3 py-1.5 text-sm border border-slate-600"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      <div className="space-y-4">
        {topCategory ? (
          <div className="p-4 bg-slate-700/30 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Top Spending</span>
              <span
                className={`text-sm font-medium ${
                  percentageChange > 0 ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {percentageChange === 0
                  ? "New Category"
                  : `${
                      percentageChange > 0 ? "+" : ""
                    }${percentageChange.toFixed(1)}%`}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {topCategory.category}
                  </p>
                  <p className="text-sm text-slate-400">
                    {topCategory.count} transaction
                    {topCategory.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-white">
                ${topCategory.total.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-700/30 rounded-xl">
            <p className="text-center text-slate-400">
              No spending data available
            </p>
          </div>
        )}

        {largestTransaction ? (
          <div className="p-4 bg-slate-700/30 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Largest Transaction
              </span>
              {largestTransaction && (
                <span className="text-xs text-slate-500">
                  {formatDate(largestTransaction.date)}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {largestTransaction.title}
                  </p>
                  <p className="text-sm text-slate-400">
                    via {largestTransaction.paymentMethod}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-white">
                ${parseFloat(largestTransaction.amount).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-700/30 rounded-xl">
            <p className="text-center text-slate-400">
              No transactions available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlySummary;
