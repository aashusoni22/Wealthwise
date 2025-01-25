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

const TaxCalculator = () => {
  const [values, setValues] = useState({
    income: 50000,
    allowances: 0,
    otherIncome: 0,
    deductions: 0,
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: Number(e.target.value) });
  };

  const calculateTax = () => {
    const { income, allowances, otherIncome, deductions } = values;
    const taxableIncome = income + otherIncome - deductions;

    // Example tax brackets (modify according to your country's tax rules)
    const brackets = [
      { limit: 10000, rate: 0.1 },
      { limit: 40000, rate: 0.15 },
      { limit: 85000, rate: 0.25 },
      { limit: 165000, rate: 0.28 },
      { limit: 250000, rate: 0.33 },
      { limit: Infinity, rate: 0.35 },
    ];

    let tax = 0;
    let remainingIncome = taxableIncome;
    let previousLimit = 0;

    for (const bracket of brackets) {
      const taxableInBracket = Math.min(
        Math.max(remainingIncome, 0),
        bracket.limit - previousLimit
      );
      tax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
      previousLimit = bracket.limit;
      if (remainingIncome <= 0) break;
    }

    const effectiveRate = (tax / taxableIncome) * 100;
    const takeHome = taxableIncome - tax;

    return {
      tax: Math.round(tax),
      effectiveRate: effectiveRate.toFixed(1),
      takeHome: Math.round(takeHome),
      taxableIncome: Math.round(taxableIncome),
    };
  };

  const results = useMemo(() => calculateTax(), [values]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Income Inputs */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Annual Income
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              name="income"
              value={values.income}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Other Income
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              name="otherIncome"
              value={values.otherIncome}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Deductions
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              name="deductions"
              value={values.deductions}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Allowances
          </label>
          <input
            type="number"
            name="allowances"
            value={values.allowances}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/30 rounded-xl p-4 col-span-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Take-Home Pay</p>
            <p className="text-xl font-semibold text-emerald-400">
              ${results.takeHome.toLocaleString()}
            </p>
          </div>
          <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${100 - results.effectiveRate}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Estimated Tax</p>
          <p className="text-lg font-semibold text-rose-400">
            ${results.tax.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Effective Rate: {results.effectiveRate}%
          </p>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Taxable Income</p>
          <p className="text-lg font-semibold text-blue-400">
            ${results.taxableIncome.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
