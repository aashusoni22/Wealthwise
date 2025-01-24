import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const SpendingTrends = ({
  trendData,
  selectedTimeframe,
  onTimeframeChange,
}) => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Spending Analysis
          </h2>
          <p className="text-sm text-slate-400">
            Track your monthly spending patterns
          </p>
        </div>
        <select
          value={selectedTimeframe}
          onChange={(e) => onTimeframeChange(e.target.value)}
          className="bg-slate-700/50 text-slate-200 rounded-lg px-3 py-2 text-sm border border-slate-600"
        >
          <option>Last 3 Months</option>
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey="month"
              stroke="#64748B"
              tick={{ fill: "#94A3B8" }}
            />
            <YAxis stroke="#64748B" tick={{ fill: "#94A3B8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                border: "1px solid #1E293B",
                borderRadius: "8px",
                color: "#F8FAFC",
              }}
            />
            <Area
              type="monotone"
              dataKey="budget"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#colorBudget)"
            />
            <Area
              type="monotone"
              dataKey="spent"
              stroke="#06B6D4"
              strokeWidth={2}
              fill="url(#colorSpent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingTrends;
