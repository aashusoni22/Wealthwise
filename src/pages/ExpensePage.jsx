import React, { useState, useEffect } from "react";
import { Loader2, Search } from "lucide-react";
import Header from "../components/expenses/Header";
import QuickActions from "../components/expenses/QuickActions";
import CategoryList from "../components/expenses/CategoryList";
import StatCards from "../components/expenses/StatCards";
import TransactionList from "../components/expenses/TransactionList";
import ExpenseModal from "../components/expenses/ExpenseModal";
import TransactionsModal from "../components/expenses/TransactionModal";
import BudgetModal from "../components/expenses/BudgetModal";
import Toast, { showToast } from "../components/Toast";
import { categoryConfig } from "../utils/categoryConfig";
import { formatRelativeDate } from "../utils/dateUtils";
import {
  calculatePercentageChanges,
  calculateBudgetMetrics,
} from "../utils/metricCalculations";
import { exportToCSV } from "../utils/exportUtils";
import { getFilteredExpenses } from "../utils/filterHelpers";
import { useExpenses } from "../hooks/useExpenses";
import { useCategories } from "../hooks/useCategories";
import { useBudget } from "../hooks/useBudget";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";
import CategoryModal from "../components/expenses/CategoryModal";

const ExpensePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    expenses,
    filteredExpenses,
    loading: expensesLoading,
    addExpense,
    updateExpense,
    setFilteredExpenses,
    refreshExpenses,
  } = useExpenses();

  const { categories } = useCategories(expenses);
  const { budgetData, refreshBudget } = useBudget();

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

  const handleExpenseSubmit = async (data) => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();

      if (!user) {
        showToast("Please login to add expense", "error");
        return;
      }

      await addExpense({
        ...data,
        userId: user.$id,
        amount: parseFloat(data.amount),
      });

      setIsAddModalOpen(false);

      await refreshBudget();
      showToast("Expense added successfully", "success");
    } catch (error) {
      console.error("Error adding expense:", error);
      showToast("Failed to add expense", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionUpdated = async () => {
    try {
      setLoading(true);
      // Refresh both expenses and budget data
      await Promise.all([refreshExpenses(), refreshBudget()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
      showToast("Failed to refresh data", "error");
    } finally {
      setLoading(false);
    }
  };

  if (expensesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const displayedTransactions = filteredExpenses.slice(0, 6);
  const stats = calculatePercentageChanges(filteredExpenses);
  const budgetMetrics = calculateBudgetMetrics(budgetData, stats);

  return (
    <div className="min-h-[90vh] lg:p-6 text-slate-100">
      <Toast />
      <div className="max-w-[1600px] mx-auto">
        <Header
          onAddExpense={() => setIsAddModalOpen(true)}
          onExportCSV={() => exportToCSV(expenses)}
        />

        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-50"
              />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 bg-slate-800/90 border border-slate-700/50 rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              <QuickActions
                onAddExpense={() => setIsAddModalOpen(true)}
                onOpenBudget={() => setIsBudgetModalOpen(true)}
              />
              <CategoryList
                expenses={expenses}
                categoryConfig={categoryConfig}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
                selectedMonth={selectedMonth}
                onViewAllCategories={() => setIsCategoryModalOpen(true)}
              />
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
                onTransactionUpdated={refreshExpenses}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <ExpenseModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleExpenseSubmit}
          loading={loading}
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
        expenses={expenses}
      />
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        expenses={expenses}
        categoryConfig={categoryConfig}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};

export default ExpensePage;
