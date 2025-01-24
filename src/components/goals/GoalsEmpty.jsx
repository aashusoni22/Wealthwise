// components/goals/GoalsEmpty.jsx
import React from "react";
import { Target, Plus } from "lucide-react";

const GoalsEmpty = ({ onNewGoal }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center">
      <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
        <Target className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No Goals Yet</h3>
      <p className="text-slate-400 mb-6 max-w-md">
        Start by creating your first goal. Track your progress and achieve your
        objectives step by step.
      </p>
      <button
        onClick={onNewGoal}
        className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
      >
        <Plus className="w-5 h-5" />
        Create Your First Goal
      </button>
    </div>
  );
};

export default GoalsEmpty;
