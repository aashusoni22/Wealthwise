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

const CompoundCalculator = () => {
  const [values, setValues] = useState({
    principal: 10000,
    rate: 8,
    time: 10,
    contribution: 1000,
    frequency: 12, // monthly
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: Number(e.target.value) });
  };

  const { principal, rate, time, contribution, frequency } = values;

  const results = useMemo(() => {
    const yearlyData = [];
    let balance = principal;
    const monthlyRate = rate / 100 / 12;

    for (let year = 0; year <= time; year++) {
      yearlyData.push({
        year,
        balance: Math.round(balance),
        interest:
          year > 0
            ? Math.round(balance - principal - contribution * 12 * year)
            : 0,
        contributions: year > 0 ? Math.round(contribution * 12 * year) : 0,
      });

      for (let month = 0; month < 12; month++) {
        balance = (balance + contribution) * (1 + monthlyRate);
      }
    }

    return yearlyData;
  }, [principal, rate, time, contribution]);

  return (
    <div className="space-y-6">
      {/* Form Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Initial Investment
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              name="principal"
              value={principal}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              placeholder="10000"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Monthly Contribution
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              name="contribution"
              value={contribution}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              placeholder="1000"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Annual Interest Rate (%)
          </label>
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              name="rate"
              value={rate}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              placeholder="8"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Time Period (Years)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              name="time"
              value={time}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              placeholder="10"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-700/30 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Final Balance</p>
          <p className="text-xl font-semibold text-white">
            ${results[time].balance.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Total Contributions</p>
          <p className="text-xl font-semibold text-emerald-400">
            ${results[time].contributions.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Total Interest</p>
          <p className="text-xl font-semibold text-blue-400">
            ${results[time].interest.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={results}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#64748b" />
            <YAxis
              stroke="#64748b"
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "0.5rem",
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, ""]}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="contributions"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="interest"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompoundCalculator;
