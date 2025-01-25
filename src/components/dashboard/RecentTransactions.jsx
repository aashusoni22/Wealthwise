import React, { useMemo } from "react";
import {
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Receipt,
} from "lucide-react";
import { categoryConfig } from "../../utils/categoryConfig";
import { formatRelativeDate } from "../../utils/dateUtils";

const EmptyTransactions = ({ onAddTransaction }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mb-4">
      <Receipt className="w-8 h-8 text-slate-400" />
    </div>
    <h4 className="text-lg font-medium text-white mb-2">No Transactions Yet</h4>
    <p className="text-slate-400 text-center mb-6 max-w-sm">
      Start tracking your expenses and income to get insights into your spending
      patterns
    </p>
    <button
      onClick={onAddTransaction}
      className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
    >
      <Plus className="w-4 h-4" />
      Add Your First Transaction
    </button>
  </div>
);

const RecentTransactions = ({
  transactions = [],
  onViewAll,
  onAddTransaction,
}) => {
  const transactionMetrics = useMemo(() => {
    if (!transactions?.length) return null;

    const today = new Date();
    const todaysTotal = transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        return tDate.toDateString() === today.toDateString();
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const yesterdayTotal = transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return tDate.toDateString() === yesterday.toDateString();
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const trend = yesterdayTotal
      ? ((todaysTotal - yesterdayTotal) / yesterdayTotal) * 100
      : 0;

    return {
      todaysTotal,
      trend,
    };
  }, [transactions]);

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl">
      {/* Header Section */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Recent Transactions
            </h3>
            <p className="text-sm text-slate-400">Track your daily spending</p>
          </div>
          {transactions?.length > 0 && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {transactionMetrics && (
          <div className="flex items-center justify-between mt-4 bg-slate-700/20 rounded-xl p-4">
            <div>
              <p className="text-sm text-slate-400">Today's Spending</p>
              <p className="text-xl font-semibold text-white mt-1">
                ${transactionMetrics.todaysTotal.toLocaleString()}
              </p>
            </div>
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                transactionMetrics.trend > 0
                  ? "bg-red-500/10 text-red-400"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {transactionMetrics.trend > 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm">
                {Math.abs(transactionMetrics.trend).toFixed(1)}% from yesterday
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      {!transactions?.length ? (
        <EmptyTransactions onAddTransaction={onAddTransaction} />
      ) : (
        <>
          <div className="divide-y divide-slate-700/50">
            {transactions.slice(0, 4).map((transaction, index) => {
              const category =
                categoryConfig[transaction.category] || categoryConfig.Other;
              const { formatted: dateStr, isFuture } = formatRelativeDate(
                transaction.date
              );

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors"
                >
                  {/* Transaction content */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${category.bgColor} bg-opacity-20 flex items-center justify-center`}
                    >
                      {React.createElement(category.icon, {
                        className: `w-5 h-5 ${category.textColor}`,
                      })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-200">{transaction.title}</p>
                        {isFuture && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-500/10 text-blue-400 rounded-full">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs ${category.textColor}`}>
                          {category.label || transaction.category}
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400">
                          {dateStr}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-red-400">
                      -${Number(transaction.amount).toLocaleString()}
                    </span>
                    {transaction.paymentMethod && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {transaction.paymentMethod}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-700/50 md:hidden">
            <button
              onClick={onViewAll}
              className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors text-center"
            >
              View All Transactions
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentTransactions;
