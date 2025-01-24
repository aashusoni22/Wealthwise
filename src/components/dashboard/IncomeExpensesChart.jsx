// components/dashboard/IncomeExpensesChart.jsx
import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const TIME_PERIODS = {
  LAST_6_MONTHS: "Last 6 Months",
  THIS_YEAR: "This Year",
  LAST_YEAR: "Last Year",
};

const IncomeExpensesChart = ({ incomes = [], expenses = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(
    TIME_PERIODS.LAST_6_MONTHS
  );

  const chartData = useMemo(() => {
    const currentDate = new Date();
    let startDate = new Date();
    let monthsToShow = 6;
    let dataPoints = [];

    switch (selectedPeriod) {
      case TIME_PERIODS.THIS_YEAR:
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        monthsToShow = currentDate.getMonth() + 1;
        break;
      case TIME_PERIODS.LAST_YEAR:
        startDate = new Date(currentDate.getFullYear() - 1, 0, 1);
        monthsToShow = 12;
        break;
      default: // LAST_6_MONTHS
        startDate.setMonth(currentDate.getMonth() - 5);
        monthsToShow = 6;
        break;
    }

    // Generate months array
    for (let i = 0; i < monthsToShow; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + i);
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      // Calculate income for the month
      const monthIncome = incomes
        .filter((income) => {
          const incomeDate = new Date(income.date);
          return (
            incomeDate.getMonth() === date.getMonth() &&
            incomeDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, income) => sum + parseFloat(income.amount || 0), 0);

      // Calculate expenses for the month
      const monthExpenses = expenses
        .filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === date.getMonth() &&
            expenseDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

      dataPoints.push({
        name: monthYear,
        income: monthIncome,
        expenses: monthExpenses,
        savings: monthIncome - monthExpenses,
      });
    }

    return dataPoints;
  }, [incomes, expenses, selectedPeriod]);

  const yAxisFormatter = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  const tooltipFormatter = (value) => `$${value.toLocaleString()}`;

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Income vs Expenses
          </h3>
          <p className="text-sm text-slate-400">Track your monthly cash flow</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {Object.values(TIME_PERIODS).map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
            <YAxis
              stroke="#64748b"
              tickFormatter={yAxisFormatter}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              labelStyle={{ color: "#e2e8f0", marginBottom: "4px" }}
              formatter={tooltipFormatter}
            />
            <Line
              name="Income"
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2 }}
            />
            <Line
              name="Expenses"
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-6 border-t border-slate-700/50">
        <div>
          <p className="text-sm text-slate-400">Total Income</p>
          <p className="text-lg font-semibold text-emerald-500 mt-1">
            ${chartData.reduce((sum, d) => sum + d.income, 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Total Expenses</p>
          <p className="text-lg font-semibold text-red-500 mt-1">
            $
            {chartData.reduce((sum, d) => sum + d.expenses, 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Net Savings</p>
          <p className="text-lg font-semibold text-blue-500 mt-1">
            ${chartData.reduce((sum, d) => sum + d.savings, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpensesChart;
