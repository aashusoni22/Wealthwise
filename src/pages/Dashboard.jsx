import React, { useState, useMemo } from "react";
import { Wallet, TrendingUp, TrendingDown, Target } from "lucide-react";
import { categoryConfig } from "../utils/categoryConfig";
import { sourceConfig } from "../utils/sourceConfig";
import { useExpenses } from "../hooks/useExpenses";
import { useIncomes } from "../hooks/useIncomes";
import { useGoals } from "../hooks/useGoals";
import { useBudget } from "../hooks/useBudget";
import { useNavigate } from "react-router-dom";
import GoalsInsights from "../components/dashboard/GoalsInsights";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import IncomeExpensesChart from "../components/dashboard/IncomeExpensesChart";
import ExpenseCategories from "../components/dashboard/ExpenseCategories";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import { useAuthState } from "../hooks/useAuthState";
import EmptyDashboard from "../components/dashboard/EmptyDashboard";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuthState();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { incomes, loading: incomesLoading } = useIncomes();
  const { goals, loading: goalsLoading } = useGoals();

  const navigate = useNavigate();

  const stats = useMemo(() => {
    if (!expenses?.length && !incomes?.length) {
      return {
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        savingsGoal: 0,
        currentSavings: 0,
        monthlyTarget: 0,
        trends: {
          balance: 0,
          income: 0,
          expenses: 0,
        },
      };
    }

    const totalIncome =
      incomes?.reduce(
        (sum, income) => sum + parseFloat(income.amount || 0),
        0
      ) || 0;
    const totalExpenses =
      expenses?.reduce(
        (sum, expense) => sum + parseFloat(expense.amount || 0),
        0
      ) || 0;

    const currentMonth = new Date().getMonth();
    const monthlyIncome =
      incomes
        ?.filter((income) => new Date(income.date).getMonth() === currentMonth)
        .reduce((sum, income) => sum + parseFloat(income.amount || 0), 0) || 0;

    const monthlyExpenses =
      expenses
        ?.filter(
          (expense) => new Date(expense.date).getMonth() === currentMonth
        )
        .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0) ||
      0;

    // Calculate previous month's data for trends
    const previousMonth = new Date().getMonth() - 1;
    const previousMonthIncome =
      incomes
        ?.filter((income) => new Date(income.date).getMonth() === previousMonth)
        .reduce((sum, income) => sum + parseFloat(income.amount || 0), 0) || 0;

    const previousMonthExpenses =
      expenses
        ?.filter(
          (expense) => new Date(expense.date).getMonth() === previousMonth
        )
        .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0) ||
      0;

    // Calculate trends
    const incomeTrend = previousMonthIncome
      ? ((monthlyIncome - previousMonthIncome) / previousMonthIncome) * 100
      : 0;
    const expensesTrend = previousMonthExpenses
      ? ((monthlyExpenses - previousMonthExpenses) / previousMonthExpenses) *
        100
      : 0;
    const balanceTrend = previousMonthIncome
      ? ((totalIncome -
          totalExpenses -
          (previousMonthIncome - previousMonthExpenses)) /
          (previousMonthIncome - previousMonthExpenses)) *
        100
      : 0;

    // Calculate current savings (
    const currentSavings = totalIncome - totalExpenses;
    const monthlyTarget = (goals?.[0]?.target || 20000) / 12;

    return {
      totalBalance: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      savingsGoal: goals?.[0]?.target,
      currentSavings: currentSavings > 0 ? currentSavings : 0,
      monthlyTarget,
      trends: {
        balance: balanceTrend,
        income: incomeTrend,
        expenses: expensesTrend,
      },
    };
  }, [expenses, incomes, goals]);

  const isDashboardEmpty = useMemo(() => {
    return !expenses?.length && !incomes?.length && !goals?.length;
  }, [expenses, incomes, goals]);

  if (authLoading || expensesLoading || incomesLoading || goalsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-xl mb-4">Please log in to view your dashboard</h2>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Show empty state for new users
  if (isDashboardEmpty) {
    return (
      <EmptyDashboard
        userName={user?.name}
        onNavigate={(path) => navigate(path)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 lg:p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <DashboardHeader onAddTransaction={() => {}} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Wallet}
            title="Total Balance"
            amount={stats.totalBalance}
            trend={8.2}
            config={sourceConfig.Salary}
          />
          <StatCard
            icon={TrendingUp}
            title="Monthly Income"
            amount={stats.monthlyIncome}
            trend={12.5}
            config={sourceConfig.Business}
          />
          <StatCard
            icon={TrendingDown}
            title="Monthly Expenses"
            amount={stats.monthlyExpenses}
            trend={-4.3}
            config={categoryConfig.Shopping}
          />
          <StatCard
            icon={Target}
            title="Savings Goal"
            amount={stats.savingsGoal}
            config={sourceConfig.Investments}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeExpensesChart incomes={incomes} expenses={expenses} />
          <ExpenseCategories
            onViewAll={() => navigate("/expenses")}
            expenses={expenses}
            categoryConfig={categoryConfig}
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTransactions
            transactions={expenses}
            onViewAll={() => navigate("/expenses")}
          />
          <GoalsInsights goals={goals} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
