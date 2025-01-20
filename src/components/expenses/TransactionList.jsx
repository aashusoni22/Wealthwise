import React, { useState } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import TransactionDropdown from "./TransactionDropdown";
import ExpenseModal from "./ExpenseModal";
import appService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import toast from "react-hot-toast";

const TransactionList = ({
  transactions,
  categoryConfig,
  formatRelativeDate,
  onViewAll,
  onAddExpense,
  onTransactionUpdated, // New prop to handle updates
}) => {
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = async (transactionId) => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) return;

      const confirmed = window.confirm(
        "Are you sure you want to delete this transaction?"
      );
      if (!confirmed) return;

      await appService.deleteExpense(transactionId, userId);
      toast.success("Transaction deleted successfully");
      if (onTransactionUpdated) onTransactionUpdated();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  const handleUpdateExpense = async (data) => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) return;

      await appService.updateExpense(
        editingTransaction.$id,
        {
          ...data,
          amount: parseFloat(data.amount),
        },
        userId
      );

      toast.success("Transaction updated successfully");
      setEditingTransaction(null);
      if (onTransactionUpdated) onTransactionUpdated();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    }
  };

  return (
    <div className="space-y-4">
      <div className="backdrop-blur-sm border-b border-slate-800/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-slate-200">
              Recent Transactions
            </h3>
            <span className="text-sm text-slate-400">
              Showing {transactions.length} of {transactions.length}
            </span>
          </div>

          <button
            onClick={onViewAll}
            className="text-sm text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1"
          >
            View All Transactions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-800">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-slate-400 flex items-center py-4">
              <Calendar className="w-4 h-4 mr-2" /> No transactions to show
            </p>
            <Button
              variant="primary"
              className="text-base font-normal"
              onClick={onAddExpense}
            >
              Lets add some
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          transactions.map((expense) => {
            const category =
              categoryConfig[expense.category] || categoryConfig.Other;
            const IconComponent = category.icon;
            const dateInfo = formatRelativeDate(expense.date);

            return (
              <div
                key={expense.$id}
                className="flex items-center justify-between py-4 hover:bg-slate-800/40 rounded-xl px-4 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <IconComponent
                      className={`w-6 h-6 ${category.textColor}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-200">
                      {expense.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-lg ${category.badgeBg} ${category.textColor}`}
                      >
                        {expense.category}
                      </span>
                      <span className="text-sm text-slate-400">
                        {dateInfo.formatted}
                      </span>
                      {dateInfo.isFuture && (
                        <span className="text-xs text-amber-500">Planned</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-medium text-slate-200">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-400 truncate max-w-[200px]">
                      {expense.paymentMethod}
                    </p>
                  </div>
                  <TransactionDropdown
                    onEdit={() => handleEdit(expense)}
                    onDelete={() => handleDelete(expense.$id)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <ExpenseModal
          onClose={() => setEditingTransaction(null)}
          onSubmit={handleUpdateExpense}
          initialData={editingTransaction}
          mode="edit"
        />
      )}
    </div>
  );
};

export default TransactionList;
