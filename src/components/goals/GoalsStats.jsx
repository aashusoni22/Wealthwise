// components/goals/GoalsStats.jsx
import React from "react";
import {
  Target,
  TrendingUp,
  Award,
  ArrowUpRight,
  BadgeCheck,
  ChevronUp,
} from "lucide-react";

const StatCard = ({ icon: Icon, title, value, trend, color }) => (
  <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-500/20`}>
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm text-${color}-400`}>
          {trend.icon}
          <span>{trend.text}</span>
        </div>
      )}
    </div>
    <p className="text-sm text-slate-400">{title}</p>
    <p className="text-2xl font-semibold text-white mt-1">{value}</p>
  </div>
);

const GoalsStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={Target}
        title="Total Goals"
        value={stats.totalGoals}
        trend={{
          icon: <ArrowUpRight className="w-4 h-4" />,
          text: `${stats.newThisMonth} new`,
        }}
        color="blue"
      />

      <StatCard
        icon={TrendingUp}
        title="In Progress"
        value={stats.inProgress}
        trend={{
          icon: <BadgeCheck className="w-4 h-4" />,
          text: "On Track",
        }}
        color="emerald"
      />

      <StatCard
        icon={Award}
        title="Completed"
        value={stats.completed}
        trend={{
          icon: <ChevronUp className="w-4 h-4" />,
          text: "Success",
        }}
        color="violet"
      />

      <StatCard
        icon={Target}
        title="Completion Rate"
        value={`${((stats.completed / stats.totalGoals) * 100).toFixed(1)}%`}
        trend={{
          icon: <TrendingUp className="w-4 h-4" />,
          text: "Overall",
        }}
        color="amber"
      />
    </div>
  );
};

export default GoalsStats;
