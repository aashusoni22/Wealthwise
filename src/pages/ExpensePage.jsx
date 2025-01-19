import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Utensils,
  Smartphone,
  ShoppingCart,
  TrendingUp,
  Calendar,
  PieChart,
  ArrowUp,
  ArrowDown,
  Dumbbell,
  Music,
  Heart,
  Wifi,
  MoreHorizontal,
  ChevronDown,
  Search,
  Filter,
  Loader2,
  Download,
  Share2,
  Plus,
} from "lucide-react";
import ExpenseModal from "../components/expenses/ExpenseModal";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";

const ExpensePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  // Mock expense categories
  const categories = [
    { name: "Shopping", amount: 850, percentage: 35, color: "blue" },
    { name: "Food & Drink", amount: 620, percentage: 25, color: "amber" },
    { name: "Transport", amount: 480, percentage: 20, color: "emerald" },
    { name: "Housing", amount: 320, percentage: 15, color: "violet" },
    { name: "Entertainment", amount: 150, percentage: 5, color: "pink" },
  ];

  const transactions = [
    {
      id: 1,
      title: "Grocery Shopping",
      amount: "234.56",
      category: "Shopping",
      date: "Today at 2:30 PM",
      icon: ShoppingCart,
      color: "blue",
      description: "Weekly groceries from Walmart",
    },
    {
      id: 2,
      title: "Electric Bill",
      amount: "145.00",
      category: "Utilities",
      date: "Today at 10:00 AM",
      icon: Wifi,
      color: "amber",
      description: "Monthly electricity payment",
    },
    {
      id: 3,
      title: "Gym Membership",
      amount: "50.00",
      category: "Health",
      date: "Yesterday",
      icon: Dumbbell,
      color: "emerald",
      description: "Monthly gym subscription",
    },
    {
      id: 4,
      title: "Rent Payment",
      amount: "1,200.00",
      category: "Housing",
      date: "Yesterday",
      icon: Home,
      color: "violet",
      description: "Monthly apartment rent",
    },
    {
      id: 5,
      title: "Coffee & Breakfast",
      amount: "18.50",
      category: "Food",
      date: "2 days ago",
      icon: Coffee,
      color: "rose",
      description: "Starbucks coffee and sandwich",
    },
  ];

  const monthOptions = [
    "This Month",
    "Last Month",
    "October 2024",
    "September 2024",
    "August 2024",
    "July 2024",
    "June 2024",
    "May 2024",
    "April 2024",
    "March 2024",
    "February 2024",
    "January 2024",
  ];

  const getExpenses = async () => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) return;
      const response = await appService.getAllExpenses(userId);
      const fetchedExpenses = response.documents || [];
      setExpenses(fetchedExpenses);
      setFilteredExpenses(fetchedExpenses);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExpenses();
  }, []);

  const handleExpenseSubmit = (formData) => {
    // Handle the form submission
    console.log("New Expense:", formData);
    // Add your logic here
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setIsMonthDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMonthDropdownOpen && !event.target.closest(".month-dropdown")) {
        setIsMonthDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMonthDropdownOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:py-6 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/50 rounded-2xl backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Expense Overview
          </h1>
          <p className="text-slate-400 mt-1">
            Keep track of your spending patterns and manage your finances
            effectively
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300 transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Category Distribution */}
            <div className="bg-surface-800/20 lg:min-h-[45rem] rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-100">
                  Categories
                </h2>
                <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300 transition-colors">
                  <PieChart className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full bg-${category.color}-500`}
                        ></div>
                        <span className="text-slate-300">{category.name}</span>
                      </div>
                      <span className="text-slate-400">${category.amount}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${category.color}-500 rounded-full`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">
                        {category.percentage}% of total
                      </span>
                      <div className="flex items-center gap-1 text-emerald-500">
                        <ArrowUp className="w-3 h-3" />
                        <span>4.3%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-800/20 rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Monthly Total</p>
                    <p className="text-2xl font-semibold mt-1">$3,249.85</p>
                  </div>
                  <div className="bg-primary-500/20 p-3 rounded-xl">
                    <ShoppingBag className="w-6 h-6 text-primary-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm text-emerald-500">
                  <ArrowUp className="w-4 h-4" />
                  <span>12.5% from last month</span>
                </div>
              </div>

              <div className="bg-surface-800/20 rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Daily Average</p>
                    <p className="text-2xl font-semibold mt-1">$108.33</p>
                  </div>
                  <div className="bg-emerald-500/20 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm text-rose-500">
                  <ArrowDown className="w-4 h-4" />
                  <span>4.3% from last week</span>
                </div>
              </div>

              <div className="bg-surface-800/20 rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Upcoming Bills</p>
                    <p className="text-2xl font-semibold mt-1">$849.99</p>
                  </div>
                  <div className="bg-violet-500/20 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-violet-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm text-slate-400">
                  <span>Due in next 7 days</span>
                </div>
              </div>
            </div>

            {/* Transactions Section */}
            <div className="space-y-4">
              {/* Header */}
              <div className="backdrop-blur-sm border-b border-slate-800/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-slate-200">
                      Recent Transactions
                    </h3>
                    <span className="text-sm text-slate-400">
                      {transactions.length} transactions
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm hover:bg-slate-700/50 transition-colors"
                        onClick={() =>
                          setIsMonthDropdownOpen(!isMonthDropdownOpen)
                        }
                      >
                        {selectedMonth}
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            isMonthDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isMonthDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 py-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700/50 backdrop-blur-sm z-50">
                          <div className="max-h-64 overflow-y-auto">
                            {monthOptions.map((month, index) => (
                              <button
                                key={index}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700/50 text-slate-200 transition-colors"
                                onClick={() => {
                                  setSelectedMonth(month);
                                  setIsMonthDropdownOpen(false);
                                }}
                              >
                                {month}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-48 pl-9 pr-4 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50 text-slate-100 placeholder-slate-400 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <button className="p-1.5 hover:bg-slate-800/70 rounded-lg text-slate-400">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="divide-y divide-slate-800">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-4 hover:bg-slate-800 rounded-xl px-4 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-${transaction.color}-500/20 flex items-center justify-center group-hover:scale-105 transition-transform`}
                      >
                        <transaction.icon
                          className={`w-6 h-6 text-${transaction.color}-500`}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-200">
                          {transaction.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-lg bg-${transaction.color}-500/20 text-${transaction.color}-500`}
                          >
                            {transaction.category}
                          </span>
                          <span className="text-sm text-slate-400">
                            {transaction.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-lg font-medium text-slate-200">
                          ${transaction.amount}
                        </p>
                        <p className="text-sm text-slate-400">
                          {transaction.description}
                        </p>
                      </div>
                      <button className="p-2 hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {isAddModalOpen && (
                <ExpenseModal
                  onClose={() => setIsAddModalOpen(false)}
                  onSubmit={handleExpenseSubmit}
                />
              )}
              {/* Footer */}
              <div className="pt-4 flex justify-center">
                <button className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
                  View All Transactions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
