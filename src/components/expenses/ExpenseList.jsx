import React from "react";
import { MoreHorizontal, Tag, Clock } from "lucide-react";

const ExpenseList = ({ expenses }) => (
  <div className="bg-slate-900/50 rounded-2xl backdrop-blur-sm border border-slate-800/50">
    <div className="divide-y divide-slate-800">
      {expenses.map((expense, index) => (
        <div
          key={index}
          className="p-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl bg-${expense.color}-500/20 flex items-center justify-center`}
            >
              <expense.icon className={`w-6 h-6 text-${expense.color}-500`} />
            </div>
            <div>
              <h3 className="font-medium text-slate-200">{expense.title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <Tag className="w-4 h-4" />
                  {expense.category}
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <Clock className="w-4 h-4" />
                  {expense.date}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`text-lg font-medium ${
                expense.type === "expense"
                  ? "text-rose-500"
                  : "text-emerald-500"
              }`}
            >
              {expense.type === "expense" ? "-" : "+"}${expense.amount}
            </span>
            <button className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
