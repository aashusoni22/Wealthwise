import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const SavingsProgress = ({ data }) => (
  <div className="rounded-2xl bg-surface-800/20 p-6 backdrop-blur-sm">
    <h3 className="mb-6 text-lg font-medium text-surface-200">
      Savings Progress
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
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
        <Area
          type="monotone"
          dataKey="income"
          stackId="1"
          stroke="#0ea5e9"
          fill="#0ea5e9"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
