// src/components/expenses/ExpenseTable.jsx
import React from "react";
import { DollarSign, Trash2 } from "lucide-react";

const ExpenseTable = ({
  filteredExpenses,
  selectedExpenses,
  handleCheckBoxChange,
  handleDeleteExpenses,
  setSelectedExpenses,
  formattedDate,
}) => {
  const getCategoryColor = (category) => {
    const colors = {
      Food: "bg-emerald-500/20 text-emerald-500",
      Transport: "bg-blue-500/20 text-blue-500",
      Entertainment: "bg-violet-500/20 text-violet-500",
      Shopping: "bg-rose-500/20 text-rose-500",
      Utilities: "bg-amber-500/20 text-amber-500",
      Other: "bg-slate-500/20 text-slate-500",
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="bg-slate-900/50 rounded-xl backdrop-blur-sm overflow-hidden border border-slate-800/50">
      {selectedExpenses.length > 0 && (
        <div className="p-4 bg-slate-800/50 border-b border-slate-700/50">
          <button
            onClick={handleDeleteExpenses}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 text-rose-500 rounded-lg hover:bg-rose-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedExpenses.length})
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="w-8 px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedExpenses.length === filteredExpenses.length}
                  onChange={() => {
                    if (selectedExpenses.length === filteredExpenses.length) {
                      setSelectedExpenses([]);
                    } else {
                      setSelectedExpenses(filteredExpenses.map((e) => e.$id));
                    }
                  }}
                  className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
              </th>
              <th className="text-left px-6 py-4 text-slate-400 font-medium">
                Transaction
              </th>
              <th className="text-left px-6 py-4 text-slate-400 font-medium">
                Amount
              </th>
              <th className="text-left px-6 py-4 text-slate-400 font-medium">
                Payment Method
              </th>
              <th className="text-left px-6 py-4 text-slate-400 font-medium">
                Description
              </th>
              <th className="text-left px-6 py-4 text-slate-400 font-medium">
                Category
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredExpenses.map((expense, index) => (
              <tr
                key={expense.$id}
                className="hover:bg-slate-800/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedExpenses.includes(expense.$id)}
                    onChange={() => handleCheckBoxChange(expense.$id)}
                    className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 mr-3 group-hover:scale-105 transition-transform">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-200">
                        {expense.title}
                      </div>
                      <div className="text-sm text-slate-400">
                        {formattedDate(expense.date)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-200">
                    ${Number(expense.amount).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-300">
                    {expense.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-300">
                    {expense.description.length > 30
                      ? expense.description.slice(0, 30) + "..."
                      : expense.description || "-"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${getCategoryColor(
                      expense.category
                    )}`}
                  >
                    {expense.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No expenses found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTable;
