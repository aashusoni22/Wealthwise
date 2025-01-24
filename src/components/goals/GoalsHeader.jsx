import React from "react";
import { Plus, Search, X } from "lucide-react";

const GoalsHeader = ({ onNewGoal, onSearch, searchQuery }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Goals Dashboard</h1>
        <p className="text-slate-400 mt-1">Track and manage your objectives</p>
      </div>

      <div className="flex items-center gap-3 w-full lg:w-auto">
        <div className="relative flex-1 lg:flex-initial lg:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search goals..."
            className="w-full pl-10 pr-10 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700/50 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
        <button
          onClick={onNewGoal}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Create Goal
        </button>
      </div>
    </div>
  );
};

export default GoalsHeader;
