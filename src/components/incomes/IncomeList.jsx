import React, { useState } from "react";
import { Calendar, ArrowRight, Wallet } from "lucide-react";
import Button from "../ui/Button";
import TransactionDropdown from "./TransactionDropdown";
import IncomeModal from "./IncomeModal";
import { sourceConfig } from "../../utils/sourceConfig";
import appService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import { showToast } from "../Toast";

const IncomeList = ({
  transactions,
  onViewAll,
  onAddIncome,
  onTransactionUpdated,
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

      await appService.deleteIncome(transactionId);
      showToast("Transaction deleted successfully", "success");
      if (onTransactionUpdated) onTransactionUpdated();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showToast("Failed to delete transaction", "error");
    }
  };

  const handleUpdateIncome = async (data) => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) return;

      await appService.updateIncome(editingTransaction.$id, {
        ...data,
        amount: parseFloat(data.amount),
      });

      setEditingTransaction(null);
      if (onTransactionUpdated) onTransactionUpdated();
    } catch (error) {
      console.error("Error updating transaction:", error);
      showToast("Failed to update transaction", "error");
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
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
            className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1 self-end sm:self-auto"
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
              variant="emerald"
              className="text-base font-normal"
              onClick={onAddIncome}
            >
              Let's add some
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          transactions.map((income) => {
            const source = sourceConfig[income.source] || sourceConfig.Other;
            const IconComponent = source?.icon || Wallet;

            return (
              <div
                key={income.$id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 hover:bg-slate-800/40 rounded-xl px-4 transition-colors group gap-4 sm:gap-6"
              >
                {/* Left Section - Icon and Details */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${
                      source?.bgColor || "bg-slate-600/20"
                    } flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}
                  >
                    <IconComponent
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        source?.textColor || "text-slate-400"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-200 text-sm sm:text-base truncate">
                      {income.title}
                    </h3>
                    <div className="flex items-center flex-wrap gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-lg ${
                          source?.badgeBg || "bg-slate-600/10"
                        } ${source?.textColor || "text-slate-400"}`}
                      >
                        {income.source}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-400">
                        {formatDate(income.date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Amount and Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-2 sm:mt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-base sm:text-lg font-medium text-emerald-500">
                      +${parseFloat(income.amount).toFixed(2)}
                    </p>
                    {income.description && (
                      <p className="text-xs sm:text-sm text-slate-400 truncate max-w-[120px] sm:max-w-[200px]">
                        {income.description}
                      </p>
                    )}
                  </div>
                  <TransactionDropdown
                    onEdit={() => handleEdit(income)}
                    onDelete={() => handleDelete(income.$id)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <IncomeModal
          onClose={() => setEditingTransaction(null)}
          onSubmit={handleUpdateIncome}
          initialData={editingTransaction}
          mode="edit"
        />
      )}
    </div>
  );
};

export default IncomeList;
