// components/expenses/TransactionItem.jsx
import React from "react";
import { MoreHorizontal, Clock } from "lucide-react";

const TransactionItem = ({ transaction }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-800/50 transition-colors group">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl bg-${transaction.color}-500/20 flex items-center justify-center group-hover:scale-105 transition-all`}
        >
          <transaction.icon
            className={`w-6 h-6 text-${transaction.color}-500`}
          />
        </div>
        <div>
          <h3 className="font-medium text-slate-200">{transaction.title}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span
              className={`text-xs px-2 py-1 rounded-lg bg-${transaction.color}-500/20 text-${transaction.color}-500`}
            >
              {transaction.category}
            </span>
            <div className="flex items-center gap-1 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              {transaction.date}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-lg font-medium text-slate-200">
          ${transaction.amount}
        </span>
        <button className="p-2 hover:bg-slate-700 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
          <MoreHorizontal className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
