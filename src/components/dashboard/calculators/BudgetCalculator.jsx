import React, { useState, useMemo } from "react";
import {
  Calculator,
  PiggyBank,
  Target,
  Calendar,
  DollarSign,
  X,
  TrendingUp,
  Clock,
  ChevronRight,
  BadgeDollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  Legend,
} from "recharts";

const BudgetCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(5000);

  const budgetBreakdown = useMemo(() => {
    const needs = monthlyIncome * 0.5;
    const wants = monthlyIncome * 0.3;
    const savings = monthlyIncome * 0.2;

    return [
      { name: "Needs", value: needs, color: "#10b981", percentage: 50 },
      { name: "Wants", value: wants, color: "#3b82f6", percentage: 30 },
      { name: "Savings", value: savings, color: "#8b5cf6", percentage: 20 },
    ];
  }, [monthlyIncome]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-sm text-slate-300">
            ${Math.round(payload[0].value).toLocaleString()}
          </p>
          <p className="text-sm text-slate-400">
            {payload[0].payload.percentage}% of income
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs"
      >
        {name}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Monthly After-Tax Income
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-500/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-emerald-400 font-medium">Needs (50%)</h4>
            <span className="text-white font-semibold">
              ${Math.round(monthlyIncome * 0.5)}
            </span>
          </div>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Rent/Mortgage</li>
            <li>• Utilities</li>
            <li>• Groceries</li>
            <li>• Insurance</li>
          </ul>
        </div>

        <div className="bg-blue-500/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-blue-400 font-medium">Wants (30%)</h4>
            <span className="text-white font-semibold">
              ${Math.round(monthlyIncome * 0.3)}
            </span>
          </div>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Entertainment</li>
            <li>• Dining Out</li>
            <li>• Shopping</li>
            <li>• Hobbies</li>
          </ul>
        </div>

        <div className="bg-purple-500/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-purple-400 font-medium">Savings (20%)</h4>
            <span className="text-white font-semibold">
              ${Math.round(monthlyIncome * 0.2)}
            </span>
          </div>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Emergency Fund</li>
            <li>• Retirement</li>
            <li>• Investments</li>
            <li>• Debt Payment</li>
          </ul>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={budgetBreakdown}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              innerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {budgetBreakdown.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  strokeWidth={2}
                  stroke="rgba(30, 41, 59, 0.5)"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-slate-300">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetCalculator;
