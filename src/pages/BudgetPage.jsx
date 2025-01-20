import React, { useState, useEffect } from "react";
import {
  Target,
  Download,
  Share2,
  Plus,
  Wallet,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  AlertTriangle,
  ChevronRight,
  Loader2,
  DollarSign,
  Activity,
  CreditCard,
  Settings,
  ArrowUpRight,
  BellRing,
  Circle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";
import toast from "react-hot-toast";
import BudgetModal from "../components/expenses/BudgetModal";
import ExpenseModal from "../components/expenses/ExpenseModal";
import TransactionsModal from "../components/expenses/TransactionModal";
import { categoryConfig } from "../utils/categoryConfig";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Month");
  const [trendData, setTrendData] = useState([]);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [categoryColors] = useState({
    Shopping: { color: "violet", icon: Target },
    Food: { color: "amber", icon: Target },
    Transport: { color: "emerald", icon: Target },
    Entertainment: { color: "blue", icon: Target },
    Housing: { color: "rose", icon: Target },
    Other: { color: "slate", icon: Target },
  });

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
        toast.error("Please login to view budgets");
        return;
      }

      const [budgetResponse, expenseResponse] = await Promise.all([
        appService.getCurrentBudgets(user.$id),
        appService.getAllExpenses(user.$id),
      ]);

      setBudgets(budgetResponse?.documents || []);
      setExpenses(expenseResponse?.documents || []);
      generateTrendData(
        expenseResponse?.documents || [],
        budgetResponse?.documents || []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load budget data");
    } finally {
      setLoading(false);
    }
  };

  // Generate trend data for the chart
  const generateTrendData = (expenses, budgets) => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        spent: 0,
        budget: 0,
      };
    }).reverse();

    // Calculate expenses for each month
    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      const monthIndex = last6Months.findIndex(
        (m) =>
          m.month ===
            expenseDate.toLocaleString("default", { month: "short" }) &&
          m.year === expenseDate.getFullYear()
      );
      if (monthIndex !== -1) {
        last6Months[monthIndex].spent += Number(expense.amount);
      }
    });

    // Add current budget as reference line
    const totalBudget = budgets.reduce(
      (sum, budget) => sum + Number(budget.amount),
      0
    );
    last6Months.forEach((month) => {
      month.budget = totalBudget;
    });

    setTrendData(last6Months);
  };

  // Calculate budget metrics
  const calculateMetrics = () => {
    const totalBudget = budgets.reduce(
      (sum, budget) => sum + Number(budget.amount),
      0
    );
    const currentMonthExpenses = expenses.reduce((sum, expense) => {
      const expenseDate = new Date(expense.date);
      const currentDate = new Date();
      if (
        expenseDate.getMonth() === currentDate.getMonth() &&
        expenseDate.getFullYear() === currentDate.getFullYear()
      ) {
        return sum + Number(expense.amount);
      }
      return sum;
    }, 0);

    const remaining = totalBudget - currentMonthExpenses;
    const percentageUsed =
      totalBudget > 0 ? (currentMonthExpenses / totalBudget) * 100 : 0;

    return {
      totalBudget,
      currentMonthExpenses,
      remaining,
      percentageUsed,
    };
  };

  const metrics = calculateMetrics();

  // Calculate category spending
  const calculateCategorySpending = (category) => {
    const categoryExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const currentDate = new Date();
      return (
        expense.category === category &&
        expenseDate.getMonth() === currentDate.getMonth() &&
        expenseDate.getFullYear() === currentDate.getFullYear()
      );
    });

    const spent = categoryExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
    const budget = budgets.find((b) => b.category === category);
    const budgetAmount = budget ? Number(budget.amount) : 0;
    const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

    return { spent, budgetAmount, percentage };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-slate-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Budget Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Track, analyze, and optimize your spending
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300 transition-colors">
            <BellRing className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create Budget
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Budget
                </p>
                <h3 className="text-2xl font-semibold text-white mt-1">
                  ${metrics.totalBudget.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
              <span>12% from last month</span>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Spent This Month
                </p>
                <h3 className="text-2xl font-semibold text-white mt-1">
                  ${metrics.currentMonthExpenses.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <CreditCard className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
              <span>8.2% vs average</span>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-400">Remaining</p>
                <h3 className="text-2xl font-semibold text-white mt-1">
                  ${metrics.remaining.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-violet-500/10 rounded-xl">
                <Wallet className="w-6 h-6 text-violet-500" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-violet-500">
              <Circle className="w-2 h-2 fill-current" />
              <span>{30 - new Date().getDate()} days left</span>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Budget Used
                </p>
                <h3 className="text-2xl font-semibold text-white mt-1">
                  {metrics.percentageUsed.toFixed(1)}%
                </h3>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Activity className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  metrics.percentageUsed >= 90
                    ? "bg-red-500"
                    : metrics.percentageUsed >= 75
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.min(100, metrics.percentageUsed)}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Spending Trends Chart */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Spending Analysis
                  </h2>
                  <p className="text-sm text-slate-400">
                    Track your monthly spending patterns
                  </p>
                </div>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="bg-slate-700/50 text-slate-200 rounded-lg px-3 py-2 text-sm border border-slate-600"
                >
                  <option>Last 3 Months</option>
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient
                        id="colorBudget"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8B5CF6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorSpent"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#06B6D4"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#06B6D4"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis
                      dataKey="month"
                      stroke="#64748B"
                      tick={{ fill: "#94A3B8" }}
                    />
                    <YAxis stroke="#64748B" tick={{ fill: "#94A3B8" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        border: "1px solid #1E293B",
                        borderRadius: "8px",
                        color: "#F8FAFC",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="budget"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      fill="url(#colorBudget)"
                    />
                    <Area
                      type="monotone"
                      dataKey="spent"
                      stroke="#06B6D4"
                      strokeWidth={2}
                      fill="url(#colorSpent)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Budgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((budget) => {
                const category =
                  categoryColors[budget.category] || categoryColors.Other;
                const spending = calculateCategorySpending(budget.category);
                const Icon = category.icon;
                const isOverBudget = spending.percentage > 100;

                return (
                  <div
                    key={budget.$id}
                    className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-5 border border-slate-700/30 hover:bg-slate-800/60 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-${category.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <Icon
                            className={`w-6 h-6 text-${category.color}-500`}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {budget.category}
                          </h3>
                          <p className="text-sm text-slate-400">
                            Budget: ${Number(budget.amount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">
                          Spent: ${spending.spent.toLocaleString()}
                        </span>
                        <span
                          className={`font-medium ${
                            isOverBudget
                              ? "text-red-400"
                              : spending.percentage >= 90
                              ? "text-amber-400"
                              : `text-${category.color}-400`
                          }`}
                        >
                          {spending.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOverBudget
                              ? "bg-red-500"
                              : spending.percentage >= 90
                              ? "bg-amber-500"
                              : `bg-${category.color}-500`
                          }`}
                          style={{
                            width: `${Math.min(100, spending.percentage)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {spending.percentage >= 90 && (
                      <div className="mt-3 p-2 bg-red-500/10 rounded-lg flex items-center gap-2 text-sm text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>
                          Budget limit{" "}
                          {isOverBudget ? "exceeded" : "nearly reached"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add New Budget Card */}
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-5 border border-dashed border-slate-700/30 hover:bg-slate-800/60 transition-all duration-300 group flex flex-col items-center justify-center min-h-[180px] text-slate-400 hover:text-slate-300"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="font-medium">Create New Budget</p>
                <p className="text-sm opacity-60">
                  Set up a budget for a new category
                </p>
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Monthly Summary Card */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Monthly Summary
                </h2>
                <select className="bg-slate-700/50 text-slate-200 rounded-lg px-3 py-1.5 text-sm border border-slate-600">
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Top Spending</span>
                    <span className="text-sm font-medium text-emerald-400">
                      -12.4%
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Housing</p>
                        <p className="text-sm text-slate-400">5 transactions</p>
                      </div>
                    </div>
                    <p className="font-semibold text-white">$2,854</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Largest Transaction
                    </span>
                    <span className="text-xs text-slate-500">Today</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-violet-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Rent Payment</p>
                        <p className="text-sm text-slate-400">
                          via Bank Transfer
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-white">$1,500</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Recent Activity
                </h2>
                <button
                  onClick={() => setIsTransactionsModalOpen(true)}
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {expenses.slice(0, 5).map((expense) => {
                  const category =
                    categoryColors[expense.category] || categoryColors.Other;
                  return (
                    <div
                      key={expense.$id}
                      className="flex items-center justify-between p-3 hover:bg-slate-700/30 rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-${category.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <Target
                            className={`w-5 h-5 text-${category.color}-500`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {expense.title}
                          </p>
                          <p className="text-sm text-slate-400">
                            {expense.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">
                          ${Number(expense.amount).toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-400">
                          {new Date(expense.date).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Quick Add Button */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full py-3 px-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Transaction
                </button>
              </div>
            </div>

            {/* Budget Tips Card */}
            <div className="bg-gradient-to-br from-primary-500/20 via-primary-600/10 to-primary-700/20 backdrop-blur-xl rounded-2xl p-6 border border-primary-500/20">
              <h3 className="text-lg font-semibold text-white mb-2">
                Budget Tips
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                Based on your spending patterns, here are some suggestions to
                optimize your budget:
              </p>
              <div className="space-y-3">
                {metrics.percentageUsed >= 75 ? (
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p>
                      You've used {metrics.percentageUsed.toFixed(1)}% of your
                      budget. Consider reducing non-essential expenses for the
                      rest of the month.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <TrendingUp className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p>
                      You're on track with your budget this month. Keep up the
                      good work!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={async (budgetData) => {
          try {
            setLoading(true);
            const user = await authService.getCurrentUser();
            if (!user) {
              toast.error("Please login to save budgets");
              return;
            }

            await appService.createBudget({
              ...budgetData,
              userId: user.$id,
            });

            await fetchData();
            toast.success("Budget saved successfully");
            setIsBudgetModalOpen(false);
          } catch (error) {
            console.error("Error saving budget:", error);
            toast.error("Failed to save budget");
          } finally {
            setLoading(false);
          }
        }}
        categories={Object.keys(categoryColors)}
      />

      {isTransactionsModalOpen && (
        <TransactionsModal
          isOpen={isTransactionsModalOpen}
          onClose={() => setIsTransactionsModalOpen(false)}
          transactions={expenses}
          categoryConfig={categoryConfig}
          exportToCSV={() => {
            /* Add your export logic here */
          }}
        />
      )}
    </div>
  );
};

export default BudgetPage;
