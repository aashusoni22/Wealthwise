import React, { useState } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import TransactionDropdown from "./TransactionDropdown";
import ExpenseModal from "./ExpenseModal";
import appService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import { showToast } from "../Toast";

const TransactionList = ({
  transactions,
  categoryConfig,
  formatRelativeDate,
  onViewAll,
  onAddExpense,
  onTransactionUpdated,
}) => {
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = async (transactionId) => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) {
        showToast("Please login to delete transactions", "error");
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to delete this transaction?"
      );
      if (!confirmed) return;

      await appService.deleteExpense(transactionId, userId);
      showToast("Transaction deleted successfully", "success");
      if (onTransactionUpdated) {
        await onTransactionUpdated();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showToast("Failed to delete transaction", "error");
    }
  };

  const handleUpdateExpense = async (data) => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) {
        showToast("Please login to update transactions", "error");
        return;
      }

      await appService.updateExpense(
        editingTransaction.$id,
        {
          ...data,
          amount: parseFloat(data.amount),
        },
        userId
      );

      showToast("Transaction updated successfully", "success");
      setEditingTransaction(null);
      if (onTransactionUpdated) {
        await onTransactionUpdated();
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      showToast("Failed to update transaction", "error");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="backdrop-blur-sm border-b border-slate-800/50 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h3 className="text-lg font-medium text-slate-200">
              Recent Transactions
            </h3>
            <span className="text-sm text-slate-400">
              Showing {transactions.length} of {transactions.length}
            </span>
          </div>

          <button
            onClick={onViewAll}
            className="text-sm text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1 self-end sm:self-auto"
          >
            View All Transactions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transactions List */}
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
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 hover:bg-slate-800/40 rounded-xl px-4 transition-colors group gap-4 sm:gap-6"
              >
                {/* Left Section - Icon and Details */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${category.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}
                  >
                    <IconComponent
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${category.textColor}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-200 text-sm sm:text-base truncate">
                      {expense.title}
                    </h3>
                    <div className="flex items-center flex-wrap gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-lg ${category.badgeBg} ${category.textColor}`}
                      >
                        {expense.category}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-400">
                        {dateInfo.formatted}
                      </span>
                      {dateInfo.isFuture && (
                        <span className="text-xs text-amber-500">Planned</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section - Amount and Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-2 sm:mt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-base sm:text-lg font-medium text-slate-200">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </p>
                    {expense.paymentMethod && (
                      <p className="text-xs sm:text-sm text-slate-400 truncate max-w-[120px] sm:max-w-[200px]">
                        {expense.paymentMethod}
                      </p>
                    )}
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
