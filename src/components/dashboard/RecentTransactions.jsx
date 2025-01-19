// RecentTransactions.jsx
import React from "react";
import { ArrowLeftRight, CreditCard, DollarSign } from "lucide-react";

export const RecentTransactions = () => (
  <div className="rounded-2xl bg-surface-800/20 p-6 backdrop-blur-sm">
    <h3 className="text-lg flex items-center font-medium text-surface-200">
      <ArrowLeftRight className="h-5 w-5 mr-2 text-emerald-400" /> Recent
      Transactions
    </h3>
    <div className="mt-4 space-y-4">
      {[
        {
          title: "Grocery Shopping",
          amount: -120,
          date: "Today",
          icon: CreditCard,
        },
        {
          title: "Salary Deposit",
          amount: 3500,
          date: "Yesterday",
          icon: DollarSign,
        },
        {
          title: "Netflix Subscription",
          amount: -15,
          date: "2 days ago",
          icon: CreditCard,
        },
      ].map((transaction, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-xl bg-surface-800/50 p-4"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-surface-600/50 p-2">
              <transaction.icon className="h-5 w-5 text-surface-200" />
            </div>
            <div>
              <p className="font-medium text-surface-200">
                {transaction.title}
              </p>
              <p className="text-sm text-surface-400">{transaction.date}</p>
            </div>
          </div>
          <span
            className={`font-medium ${
              transaction.amount > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            ${Math.abs(transaction.amount)}
          </span>
        </div>
      ))}
    </div>
  </div>
);
