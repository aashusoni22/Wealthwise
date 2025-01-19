import React from "react";
import { Search, Calendar, Filter } from "lucide-react";

const ExpenseFilters = ({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onFilterClick,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 text-slate-200 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <select
        value={dateRange}
        onChange={onDateRangeChange}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 text-slate-200 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
      >
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
        <option value="custom">Custom Range</option>
      </select>
    </div>

    <button
      onClick={onFilterClick}
      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
    >
      <Filter className="w-5 h-5" />
      More Filters
    </button>
  </div>
);
