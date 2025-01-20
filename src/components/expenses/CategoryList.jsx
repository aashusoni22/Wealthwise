import React from "react";
import { PieChart } from "lucide-react";

const CategoryList = ({ categories }) => {
  const renderCategories = () => {
    return categories.map((category, index) => {
      const colorName = category.textColor.split("-")[1];
      const colorMap = {
        indigo: "rgb(99, 102, 241)",
        amber: "rgb(245, 158, 11)",
        emerald: "rgb(16, 185, 129)",
        blue: "rgb(59, 130, 246)",
        violet: "rgb(139, 92, 246)",
        pink: "rgb(236, 72, 153)",
        orange: "rgb(249, 115, 22)",
        red: "rgb(239, 68, 68)",
        teal: "rgb(20, 184, 166)",
        slate: "rgb(100, 116, 139)",
      };

      const color = colorMap[colorName] || colorMap.slate;

      return (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-slate-300">{category.name}</span>
            </div>
            <span className="text-slate-400">
              ${category.amount.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                backgroundColor: color,
                width: `${category.percentage}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">
              {category.percentage.toFixed(1)}% of total
            </span>
            <span className="text-slate-400">
              {category.count} transaction{category.count !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-slate-800/40 lg:min-h-auto rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Categories</h2>
        <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300 transition-colors">
          <PieChart className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {categories.length === 0 ? (
          <p className="text-sm text-slate-400 flex items-center justify-center h-80">
            <PieChart className="w-4 h-4 mr-2" /> Categories will appear here
          </p>
        ) : (
          renderCategories()
        )}
      </div>
    </div>
  );
};

export default CategoryList;
