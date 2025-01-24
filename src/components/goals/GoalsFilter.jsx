// components/goals/GoalsFilter.jsx
import React from "react";
import { Target, CheckCircle2, Clock, Archive } from "lucide-react";

const FilterButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      active
        ? "bg-primary-500 text-white"
        : "bg-slate-800/40 text-slate-300 hover:bg-slate-800/60"
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

const GoalsFilter = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <FilterButton
        active={activeFilter === "all"}
        onClick={() => onFilterChange("all")}
        icon={Archive}
        label="All Goals"
      />
      <FilterButton
        active={activeFilter === "active"}
        onClick={() => onFilterChange("active")}
        icon={Target}
        label="Active"
      />
      <FilterButton
        active={activeFilter === "completed"}
        onClick={() => onFilterChange("completed")}
        icon={CheckCircle2}
        label="Completed"
      />
      <FilterButton
        active={activeFilter === "due-soon"}
        onClick={() => onFilterChange("due-soon")}
        icon={Clock}
        label="Due Soon"
      />
    </div>
  );
};

export default GoalsFilter;
