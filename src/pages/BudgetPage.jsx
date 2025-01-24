import React, { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import {
  Header,
  StatCards,
  SpendingTrends,
  CategoryBudgets,
} from "../components/budgets";
import {
  MonthlySummary,
  RecentActivity,
  BudgetTips,
} from "../components/budgets";
import BudgetModal from "../components/expenses/BudgetModal";
import ExpenseModal from "../components/expenses/ExpenseModal";
import TransactionsModal from "../components/expenses/TransactionModal";
import toast from "react-hot-toast";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";
import { categoryConfig } from "../utils/categoryConfig";
import Toast, { showToast } from "../components/Toast";

const BudgetPage = () => {
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("Last 3 Months");
  const [trendData, setTrendData] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all required data
  const fetchData = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) {
        showToast("Please login to view budgets", "error");
        return;
      }

      // Get current month's data
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const [budgetResponse, expenseResponse] = await Promise.all([
        appService.getCurrentBudgets(user.$id),
        appService.getAllExpenses(user.$id),
      ]);

      // Parse budgets with proper number handling
      const parsedBudgets = (budgetResponse?.documents || []).map((budget) => ({
        ...budget,
        amount: parseFloat(budget.amount) || 0,
      }));

      // Parse and filter expenses for current month
      const parsedExpenses = (expenseResponse?.documents || [])
        .map((expense) => ({
          ...expense,
          amount: parseFloat(expense.amount) || 0,
          date: new Date(expense.date),
        }))
        .sort((a, b) => b.date - a.date);

      setBudgets(parsedBudgets);
      setExpenses(parsedExpenses);
      generateTrendData(parsedExpenses, parsedBudgets);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Failed to load budget data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Generate trend data for the chart
  const generateTrendData = (expenses, budgets) => {
    const monthsToShow =
      {
        "Last 3 Months": 3,
        "Last 6 Months": 6,
        "This Year": 12,
      }[selectedTimeframe] || 3;

    const months = Array.from({ length: monthsToShow }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        spent: 0,
        budget: 0,
        monthYear: `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`,
      };
    }).reverse();

    // Calculate expenses for each month
    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      const monthYear = `${expenseDate.getFullYear()}-${String(
        expenseDate.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthData = months.find((m) => m.monthYear === monthYear);

      if (monthData) {
        monthData.spent += expense.amount;
      }
    });

    // Add budgets for each month
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    months.forEach((month) => {
      month.budget = totalBudget;
    });

    setTrendData(
      months.map(({ month, spent, budget }) => ({
        month,
        spent: parseFloat(spent.toFixed(2)),
        budget: parseFloat(budget.toFixed(2)),
      }))
    );
  };

  // Calculate budget metrics using useMemo
  const metrics = useMemo(() => {
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const now = new Date();
    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    });

    const currentMonthTotal = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    const currentDay = now.getDate();
    const dailyBudget = totalBudget / daysInMonth;
    const dailySpent = currentMonthTotal / currentDay;

    return {
      totalBudget,
      currentMonthExpenses: currentMonthTotal,
      remaining: totalBudget - currentMonthTotal,
      percentageUsed:
        totalBudget > 0 ? (currentMonthTotal / totalBudget) * 100 : 0,
      dailyBudget,
      dailySpent,
      daysRemaining: daysInMonth - currentDay,
    };
  }, [budgets, expenses]);

  // Calculate category spending using useMemo
  const calculateCategorySpending = (category) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const categoryExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expense.category === category &&
        expenseDate >= startOfMonth &&
        expenseDate <= endOfMonth
      );
    });

    const spent = categoryExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const budget = budgets.find((b) => b.category === category);
    const budgetAmount = budget ? budget.amount : 0;
    const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

    const currentDay = now.getDate();
    const daysInMonth = endOfMonth.getDate();

    return {
      spent,
      budgetAmount,
      percentage: parseFloat(percentage.toFixed(2)),
      dailyBudget: budgetAmount / daysInMonth,
      dailySpent: spent / currentDay,
      remaining: budgetAmount - spent,
    };
  };

  const handleSaveBudget = async (budgetData) => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) {
        showToast("Please login to save budgets", "error");
        return;
      }

      // Calculate total budget
      const totalBudget = budgetData.reduce(
        (sum, budget) => sum + parseFloat(budget.amount),
        0
      );

      // Save each budget with updated totalBudget value
      await Promise.all(
        budgetData.map((budget) =>
          appService.createBudget({
            userId: user.$id,
            category: budget.category,
            amount: parseFloat(budget.amount),
            totalBudget: totalBudget,
          })
        )
      );

      await fetchData(); // Refresh all data
      showToast("Budget saved successfully", "success");
      setIsBudgetModalOpen(false);
    } catch (error) {
      console.error("Error saving budget:", error);
      showToast("Failed to save budget", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update the handleEditBudget function
  const handleEditBudget = (budget) => {
    setSelectedBudget(budget);
    setIsBudgetModalOpen(true);
  };

  // Update modal close handler to clear selected budget
  const handleCloseModal = () => {
    setSelectedBudget(null);
    setIsBudgetModalOpen(false);
  };

  const handleDeleteBudget = async (budget) => {
    try {
      if (!budget?.$id) {
        showToast("Invalid budget selected", "error");
        return;
      }

      const confirmed = window.confirm(
        `Are you sure you want to delete the ${budget.category} budget?`
      );

      if (!confirmed) return;

      setLoading(true);
      await appService.deleteBudget(budget.$id);
      await fetchData();
      showToast("Budget deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting budget:", error);
      showToast("Failed to delete budget", "error");
    } finally {
      setLoading(false);
    }
  };

  // Effect to regenerate trend data when timeframe changes
  useEffect(() => {
    if (expenses.length && budgets.length) {
      generateTrendData(expenses, budgets);
    }
  }, [selectedTimeframe]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:p-6 text-slate-100">
      <Toast />
      <Header onAddBudget={() => setIsBudgetModalOpen(true)} />

      <div className="max-w-[1600px] mx-auto">
        <StatCards metrics={metrics} />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <SpendingTrends
              trendData={trendData}
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
            />

            <CategoryBudgets
              budgets={budgets}
              categoryConfig={categoryConfig}
              calculateCategorySpending={calculateCategorySpending}
              onAddBudget={() => setIsBudgetModalOpen(true)}
              onEditBudget={handleEditBudget}
              onDeleteBudget={handleDeleteBudget}
              expenses={expenses}
              onViewAllClick={() => setIsTransactionsModalOpen(true)}
            />
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <MonthlySummary
              expenses={expenses}
              categoryConfig={categoryConfig}
            />

            <RecentActivity
              expenses={expenses}
              onViewAll={() => setIsTransactionsModalOpen(true)}
              onAddTransaction={() => setIsExpenseModalOpen(true)}
            />

            <BudgetTips
              expenses={expenses}
              budgets={budgets}
              categoryConfig={categoryConfig}
            />
          </div>
        </div>
      </div>

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        categoryConfig={categoryConfig}
        onBudgetUpdate={async () => {
          await fetchData();
        }}
        expenses={expenses}
      />
      {isExpenseModalOpen && (
        <ExpenseModal
          onClose={() => setIsExpenseModalOpen(false)}
          onSubmit={async (data) => {
            setIsExpenseModalOpen(false);
            await fetchData();
          }}
          categoryConfig={categoryConfig}
        />
      )}

      {isTransactionsModalOpen && (
        <TransactionsModal
          isOpen={isTransactionsModalOpen}
          onClose={() => setIsTransactionsModalOpen(false)}
          transactions={expenses}
          categoryConfig={categoryConfig}
        />
      )}
    </div>
  );
};

export default BudgetPage;
