import React from "react";
import { TrendingUp, TrendingDown, Wallet, PieChart } from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import { ExpenseByCategoryCard } from "../components/dashboard/ExpenseByCategoryCard";
import { IncomeExpensesChart } from "../components/dashboard/IncomeExpensesChart";
import { RecentTransactions } from "../components/dashboard/RecentTransactions";
import { SavingsProgress } from "../components/dashboard/SavingsProgress";

const monthlyData = [
  { month: "Jan", income: 4500, expenses: 3200 },
  { month: "Feb", income: 5200, expenses: 3800 },
  { month: "Mar", income: 4800, expenses: 3600 },
  { month: "Apr", income: 6000, expenses: 4200 },
  { month: "May", income: 5500, expenses: 3900 },
  { month: "Jun", income: 5800, expenses: 4100 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen space-y-8 lg:py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-50">
          Financial Overview
        </h1>
        <p className="text-surface-400">Track your spending and savings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={12500}
          change={8.2}
          icon={Wallet}
        />
        <StatCard
          title="Monthly Income"
          value={5800}
          change={12.5}
          icon={TrendingUp}
        />
        <StatCard
          title="Monthly Expenses"
          value={4100}
          change={-4.3}
          icon={TrendingDown}
        />
        <StatCard
          title="Savings Goal"
          value={20000}
          change={15.8}
          icon={PieChart}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <IncomeExpensesChart data={monthlyData} />
        <ExpenseByCategoryCard />
      </div>

      {/* Transactions and Savings Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentTransactions />
        <SavingsProgress data={monthlyData} />
      </div>
    </div>
  );
};

export default Dashboard;
