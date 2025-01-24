import React from "react";
import { BellRing, Settings, Plus } from "lucide-react";

const Header = ({ onAddBudget }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Budget Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Track, analyze, and optimize your spending
        </p>
      </div>

      <div className="flex items-center">
        <button
          onClick={onAddBudget}
          className="flex items-center gap-2 px-4 py-2 bg-violet-500/70 hover:bg-violet-500 text-white rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Budget
        </button>
      </div>
    </div>
  );
};

export default Header;
