import React from "react";

const StatCard = ({
  icon: Icon,
  title,
  amount = 0,
  trend,
  config,
  isLoading,
}) => (
  <div className="bg-slate-800/40 rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6 hover:bg-slate-800/50 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${config.bgColor}`}>
        <Icon className={`w-6 h-6 ${config.textColor}`} />
      </div>
      {trend !== undefined && !isLoading && (
        <div
          className={`px-2.5 py-1 rounded-full text-sm flex items-center gap-1
          ${
            trend >= 0
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </div>
      )}
    </div>
    <h3 className="text-slate-400 text-sm mb-1">{title}</h3>
    {isLoading ? (
      <div className="h-8 bg-slate-700/50 rounded-lg animate-pulse" />
    ) : (
      <p className="text-2xl font-semibold text-white">
        ${Number(amount).toLocaleString()}
      </p>
    )}
  </div>
);

export default StatCard;
