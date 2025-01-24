import React from "react";

const StatCard = ({ icon: Icon, title, amount, trend, config }) => (
  <div className="bg-slate-800/40 rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6 hover:bg-slate-800/50 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${config.bgColor}`}>
        <Icon className={`w-6 h-6 ${config.textColor}`} />
      </div>
      {trend !== undefined && (
        <span
          className={`text-sm ${
            trend >= 0 ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-sm mb-1">{title}</h3>
    <p className="text-2xl font-semibold text-white">
      ${Number(amount || 0).toLocaleString()}
    </p>
  </div>
);

export default StatCard;
