import React, { useState } from "react";
import { MoreVertical, Calendar, BarChart3 } from "lucide-react";
import { goalCategories } from "../../utils/goalConfig";
import GoalCardDropdown from "./GoalCardDropdown";

const GoalCard = ({ goal, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const category = goalCategories[goal.category] || goalCategories.Other;
  const progress = (goal.Progress / goal.target) * 100;

  // Calculate days left
  const daysLeft = Math.ceil(
    (new Date(goal.duedate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  // Calculate daily goal
  const dailyGoal =
    daysLeft > 0 ? ((goal.target - goal.Progress) / daysLeft).toFixed(1) : 0;

  const getProgressColor = () => {
    if (!category.bgColor) return "bg-slate-500";
    return category.bgColor.replace("bg-", "bg-opacity-90 bg-");
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${category.bgColor} bg-opacity-20 flex items-center justify-center`}
            >
              {React.createElement(category.icon, {
                className: `w-5 h-5 ${category.textColor}`,
                "aria-hidden": "true",
              })}
            </div>
            <div>
              <h3 className={`text-lg font-medium ${category.textColor}`}>
                {goal.title}
              </h3>
              <p className="text-sm text-slate-400">{goal.category}</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
            <GoalCardDropdown
              isVisible={showDropdown}
              onEdit={() => {
                onEdit(goal);
                setShowDropdown(false);
              }}
              onDelete={() => {
                onDelete(goal);
                setShowDropdown(false);
              }}
            />
          </div>
        </div>

        {/* Status and Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">In Progress</span>
            <span className={`text-sm font-medium ${category.textColor}`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-slate-400">Progress</span>
            <span className="text-sm font-medium text-white">
              {goal.Progress.toLocaleString()} / {goal.target.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Days Left</span>
            </div>
            <p className="text-sm font-medium text-white">
              {daysLeft > 0 ? `${daysLeft} days` : "Due"}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Daily Goal</span>
            </div>
            <p className="text-sm font-medium text-white">
              {dailyGoal > 0 ? dailyGoal : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
