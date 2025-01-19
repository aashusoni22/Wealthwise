import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const IncomeExpensesChart = ({ data }) => (
  <div className="rounded-2xl bg-surface-800/20 p-6 backdrop-blur-sm">
    <h3 className="mb-6 text-lg font-medium text-surface-200">
      Income vs Expenses
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
        <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "none",
            borderRadius: "8px",
            color: "#f8fafc",
          }}
        />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#0ea5e9"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#f43f5e"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
