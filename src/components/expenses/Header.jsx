import React from "react";
import { Download, Plus } from "lucide-react";

const Header = ({ onAddExpense, onExportCSV }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/50 rounded-2xl backdrop-blur-sm">
      <div>
        <h1 className="text-3xl font-bold text-white">Expense Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Keep track of your spending patterns and manage your finances
          effectively
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onExportCSV}
          className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300 transition-colors"
          title="Download Expenses CSV"
        >
          <Download className="w-5 h-5" />
        </button>

        <button
          onClick={onAddExpense}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default Header;
