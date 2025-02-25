import React, { useMemo } from "react";
import { DollarSign, TrendingUp, BadgeCheck } from "lucide-react";
import { goalCategories } from "../../utils/goalConfig";
import { useNavigate } from "react-router-dom";
import { Target, Rocket, ChevronRight } from "lucide-react";

const EmptyGoals = ({ onNavigate }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mb-4">
      <Target className="w-8 h-8 text-slate-400" />
    </div>
    <h4 className="text-lg font-medium text-white mb-2">
      Set Your Financial Goals
    </h4>
    <p className="text-slate-400 text-center mb-6 max-w-sm">
      Define and track your financial targets to stay motivated and achieve your
      dreams
    </p>
    <button
      onClick={() => onNavigate("/goals")}
      className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
    >
      <Rocket className="w-4 h-4" />
      Create Your First Goal
    </button>
  </div>
);

const GoalsInsights = ({ goals = [], onNavigate }) => {
  const insights = useMemo(() => {
    if (!goals?.length) return null;

    const topGoals = [...goals]
      .sort((a, b) => b.Progress / b.target - a.Progress / a.target)
      .slice(0, 4);

    const completedCount = goals.filter(
      (g) => (g.Progress / g.target) * 100 >= 100
    ).length;
    const completionRate = ((completedCount / goals.length) * 100).toFixed(0);

    const categoryCount = goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1;
      return acc;
    }, {});

    const topCategory = Object.entries(categoryCount).sort(
      ([, a], [, b]) => b - a
    )[0][0];

    return {
      topGoals,
      completedCount,
      completionRate,
      topCategory,
      totalAmount: goals.reduce((sum, goal) => sum + goal.target, 0),
    };
  }, [goals]);

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl">
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white">Goals Overview</h3>
            <p className="text-sm text-slate-400">
              Track your financial targets
            </p>
          </div>
          {goals?.length > 0 && (
            <button
              onClick={() => onNavigate("/goals")}
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
            >
              View Goals
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {!goals?.length || !insights ? (
        <EmptyGoals onNavigate={onNavigate} />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-0.5 p-1 lg:p-5">
            <div className="text-center p-3">
              <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
                <BadgeCheck className="w-5 h-5" />
                <span className="text-base">Completion</span>
              </div>
              <p className="text-sm lg:text-2xl font-semibold text-white">
                {insights.completionRate}%
              </p>
            </div>

            <div className="text-center p-3 border-x border-slate-700/50">
              <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                <TrendingUp className="w-5 h-5" />
                <span className="text-base">Active Goals</span>
              </div>
              <p className="text-sm lg:text-2xl font-semibold text-white">
                {goals.length - insights.completedCount}
              </p>
            </div>

            <div className="text-center p-3">
              <div className="flex items-center justify-center gap-1 text-violet-500 mb-1">
                <DollarSign className="w-5 h-5" />
                <span className="text-base">Total Value</span>
              </div>
              <p className="text-sm lg:text-2xl font-semibold text-white">
                ${(insights.totalAmount / 1000).toFixed(1)}k
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 p-4 gap-2">
            {insights.topGoals.map((goal) => {
              const progress = (goal.Progress / goal.target) * 100;
              const category =
                goalCategories[goal.category] || goalCategories.Other;

              return (
                <div key={goal.$id} className="p-4 rounded-xl bg-slate-800/40">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-8 h-8 rounded-lg ${category.bgColor} bg-opacity-20 flex items-center justify-center`}
                    >
                      {React.createElement(category.icon, {
                        className: `w-4 h-4 ${category.textColor}`,
                      })}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {goal.title}
                      </p>
                      <p className={`text-xs ${category.textColor}`}>
                        {category.label || goal.category}
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-700/30 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${category.bgColor} transition-all duration-300`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={category.textColor}>
                      {Math.round(progress)}%
                    </span>
                    <span className="text-slate-400">
                      ${goal.Progress.toLocaleString()} of $
                      {goal.target.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default GoalsInsights;
