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

const RetirementCalculator = () => {
  const [values, setValues] = useState({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    monthlyContribution: 1000,
    expectedReturn: 7,
    inflationRate: 2.5,
    desiredIncome: 80000,
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: Number(e.target.value) });
  };

  const results = useMemo(() => {
    const {
      currentAge,
      retirementAge,
      currentSavings,
      monthlyContribution,
      expectedReturn,
      inflationRate,
      desiredIncome,
    } = values;

    const yearsToRetirement = retirementAge - currentAge;
    const realReturn =
      (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1;
    const monthlyRate = realReturn / 12;

    let futureBalance = currentSavings;
    for (let month = 0; month < yearsToRetirement * 12; month++) {
      futureBalance = (futureBalance + monthlyContribution) * (1 + monthlyRate);
    }

    const requiredNestegg = desiredIncome * 25; // Using 4% rule
    const isOnTrack = futureBalance >= requiredNestegg;
    const percentageToGoal = (futureBalance / requiredNestegg) * 100;

    return {
      futureBalance,
      requiredNestegg,
      isOnTrack,
      percentageToGoal,
      monthlyNeeded: isOnTrack
        ? monthlyContribution
        : ((requiredNestegg - currentSavings) * monthlyRate) /
          (Math.pow(1 + monthlyRate, yearsToRetirement * 12) - 1),
    };
  }, [values]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Personal Info */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Current Age
          </label>
          <input
            type="number"
            name="currentAge"
            value={values.currentAge}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Retirement Age
          </label>
          <input
            type="number"
            name="retirementAge"
            value={values.retirementAge}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
          />
        </div>

        {/* Financial Info */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Current Savings
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              name="currentSavings"
              value={values.currentSavings}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
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
              name="monthlyContribution"
              value={values.monthlyContribution}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>
        </div>

        {/* Rate Assumptions */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Expected Return (%)
          </label>
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              name="expectedReturn"
              value={values.expectedReturn}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              step="0.1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Inflation Rate (%)
          </label>
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              name="inflationRate"
              value={values.inflationRate}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-slate-700/30 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-400 mb-1">
              Projected Retirement Savings
            </p>
            <p className="text-2xl font-semibold text-white">
              ${Math.round(results.futureBalance).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Required Nest Egg</p>
            <p className="text-2xl font-semibold text-white">
              ${Math.round(results.requiredNestegg).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Progress to Goal</span>
            <span className="text-sm text-white">
              {Math.min(100, Math.round(results.percentageToGoal))}%
            </span>
          </div>
          <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                results.isOnTrack ? "bg-emerald-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(100, results.percentageToGoal)}%` }}
            />
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <h4
            className={`text-lg font-medium ${
              results.isOnTrack ? "text-emerald-400" : "text-blue-400"
            }`}
          >
            {results.isOnTrack ? "You are on Track! 🎉" : "Adjustment Needed"}
          </h4>
          <p className="text-slate-300 mt-2">
            {results.isOnTrack
              ? `Your current savings plan is sufficient to meet your retirement goals.`
              : `Consider increasing your monthly contribution to $${Math.round(
                  results.monthlyNeeded
                ).toLocaleString()} 
                 to reach your retirement goal.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculator;
