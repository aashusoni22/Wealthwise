import React from "react";
import { Download, Plus } from "lucide-react";

const Header = ({ onAddIncome, onExportCSV }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/50 rounded-2xl backdrop-blur-sm">
      <div>
        <h1 className="text-3xl font-bold text-white">Income Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Track your revenue streams and manage your income sources effectively
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onExportCSV}
          className="p-2 bg-surface-800 hover:bg-surface-700 text-surface-300 rounded-xl border border-surface-700 hover:border-surface-600 transition-all"
        >
          <Download className="w-5 h-5" />
        </button>

        <button
          onClick={onAddIncome}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Income
        </button>
      </div>
    </div>
  );
};

export default Header;
