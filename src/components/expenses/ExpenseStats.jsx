import React from "react";
import {
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  CreditCard,
} from "lucide-react";

const ExpenseStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      {
        title: "Total Expenses",
        value: "$8,249.54",
        change: "+12.5%",
        trend: "up",
        icon: CircleDollarSign,
        color: "blue",
      },
      {
        title: "Monthly Average",
        value: "$2,749.85",
        change: "-4.3%",
        trend: "down",
        icon: TrendingDown,
        color: "rose",
      },
      {
        title: "Last 7 Days",
        value: "$849.24",
        change: "+8.7%",
        trend: "up",
        icon: TrendingUp,
        color: "emerald",
      },
      {
        title: "Upcoming Bills",
        value: "$1,249.99",
        change: "Due in 5 days",
        trend: "neutral",
        icon: CreditCard,
        color: "violet",
      },
    ].map((stat, index) => (
      <div
        key={index}
        className="bg-slate-900/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-800/50"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-400">{stat.title}</p>
            <p className="text-2xl font-semibold mt-2 text-slate-100">
              {stat.value}
            </p>
          </div>
          <div className={`bg-${stat.color}-500/20 p-2 rounded-xl`}>
            <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1">
          {stat.trend === "up" && (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          )}
          {stat.trend === "down" && (
            <TrendingDown className="w-4 h-4 text-rose-500" />
          )}
          <span
            className={`text-sm ${
              stat.trend === "up"
                ? "text-emerald-500"
                : stat.trend === "down"
                ? "text-rose-500"
                : "text-slate-400"
            }`}
          >
            {stat.change}
          </span>
        </div>
      </div>
    ))}
  </div>
);
