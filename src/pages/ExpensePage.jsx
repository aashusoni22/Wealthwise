import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Header from "../components/expenses/Header";
import QuickActions from "../components/expenses/QuickActions";
import CategoryList from "../components/expenses/CategoryList";
import StatCards from "../components/expenses/StatCards";
import TransactionList from "../components/expenses/TransactionList";
import ExpenseModal from "../components/expenses/ExpenseModal";
import TransactionsModal from "../components/expenses/TransactionModal";
import BudgetModal from "../components/expenses/BudgetModal";
import Toast from "../components/Toast";
import { categoryConfig } from "../utils/categoryConfig";
import { formatRelativeDate } from "../utils/dateUtils";
import {
  calculatePercentageChanges,
  calculateBudgetMetrics,
} from "../utils/calculations";
import { exportToCSV } from "../utils/exportUtils";
import { getFilteredExpenses } from "../utils/filterUtils";
import { useExpenses } from "../hooks/useExpenses";
import { useCategories } from "../hooks/useCategories";
import { useBudget } from "../hooks/useBudget";

const ExpensePage = () => {
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Custom Hooks
  const {
    expenses,
    filteredExpenses,
    loading: expensesLoading,
    addExpense,
    setFilteredExpenses,
  } = useExpenses();

  const { categories } = useCategories(expenses);
  const { budgetData, refreshBudget } = useBudget();

  // Displayed transactions
  const displayedTransactions = filteredExpenses.slice(0, 6);

  // Update filtered expenses when filters change
  useEffect(() => {
    const filtered = getFilteredExpenses(
      expenses,
      searchTerm,
      selectedCategory,
      selectedMonth
    );
    setFilteredExpenses(filtered);
  }, [
    searchTerm,
    selectedCategory,
    selectedMonth,
    expenses,
    setFilteredExpenses,
  ]);

  // Handle expense submission
  const handleExpenseSubmit = async (data) => {
    try {
      await addExpense(data);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error submitting expense:", error);
    }
  };

  if (expensesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const stats = calculatePercentageChanges(filteredExpenses);
  const budgetMetrics = calculateBudgetMetrics(budgetData, stats);

  return (
    <div className="min-h-[90vh] p-6 text-slate-100">
      <Toast />
      <Header
        onAddExpense={() => setIsAddModalOpen(true)}
        onExportCSV={() => exportToCSV(expenses)}
      />

      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <QuickActions
              onAddExpense={() => setIsAddModalOpen(true)}
              onOpenBudget={() => setIsBudgetModalOpen(true)}
            />
            <CategoryList categories={categories} />
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            <StatCards stats={stats} budgetMetrics={budgetMetrics} />
            <TransactionList
              transactions={displayedTransactions}
              categoryConfig={categoryConfig}
              formatRelativeDate={formatRelativeDate}
              onViewAll={() => setIsTransactionsModalOpen(true)}
              onAddExpense={() => setIsAddModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <ExpenseModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleExpenseSubmit}
        />
      )}
      <TransactionsModal
        isOpen={isTransactionsModalOpen}
        onClose={() => setIsTransactionsModalOpen(false)}
        transactions={filteredExpenses}
        categoryConfig={categoryConfig}
        exportToCSV={() => exportToCSV(expenses)}
      />
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        categoryConfig={categoryConfig}
        onBudgetUpdate={refreshBudget}
      />
    </div>
  );
};

export default ExpensePage;
