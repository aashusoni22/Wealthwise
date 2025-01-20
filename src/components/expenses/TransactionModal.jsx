import React, { useState, useMemo } from "react";
import {
  X,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  CalendarDays,
  ArrowUpDown,
  FileDown,
  Share2,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const TransactionsModal = ({
  isOpen,
  onClose,
  transactions,
  categoryConfig,
  exportToCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // Sort options
  const sortOptions = [
    { label: "Date", key: "date" },
    { label: "Amount", key: "amount" },
    { label: "Title", key: "title" },
    { label: "Category", key: "category" },
  ];

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter((transaction) => {
      const matchesSearch =
        transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || transaction.category === selectedCategory;

      // Date range filtering
      let matchesDate = true;
      const transactionDate = new Date(transaction.date);
      const today = new Date();

      switch (dateRange) {
        case "today":
          matchesDate = transactionDate.toDateString() === today.toDateString();
          break;
        case "week":
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          matchesDate = transactionDate >= weekAgo;
          break;
        case "month":
          matchesDate =
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear();
          break;
        case "year":
          matchesDate = transactionDate.getFullYear() === today.getFullYear();
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesCategory && matchesDate;
    });

    // Sort filtered transactions
    return filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.key) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = parseFloat(a.amount) - parseFloat(b.amount);
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [transactions, searchTerm, selectedCategory, dateRange, sortConfig]);

  // Reset filters and sort on close
  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setDateRange("all");
    setSortConfig({
      key: "",
      direction: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  // Render sort icon based on current sort configuration
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  return (
    <div className="fixed inset-0 -top-4 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl h-[90vh] bg-slate-900 rounded-2xl shadow-xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-surface-800">
          <div>
            <h2 className="text-xl font-semibold text-surface-100">
              All Transactions
            </h2>
            <p className="text-sm text-surface-400 mt-1">
              {filteredAndSortedTransactions.length} transactions found
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="p-2 hover:bg-surface-800 rounded-xl text-surface-400 hover:text-surface-300 transition-colors"
              title="Download Expenses CSV"
            >
              <FileDown className="w-5 h-5" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-slate-800 rounded-xl text-surface-400 hover:text-surface-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="px-8 py-6 border-b border-surface-800 bg-surface-900/95 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-9 pr-4 py-2 bg-surface-800 rounded-xl border border-slate-700 text-surface-100 placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                className="pl-4 pr-10 py-2 bg-surface-800 rounded-xl border border-surface-700 text-surface-100 appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {Object.keys(categoryConfig).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Date Range */}
            <div className="relative">
              <select
                className="pl-4 pr-10 py-2 bg-surface-800 rounded-xl border border-surface-700 text-surface-100 appearance-none cursor-pointer"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              {sortOptions.map(({ label, key }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                    sortConfig.key === key
                      ? "bg-surface-800 text-surface-200"
                      : "text-surface-400 hover:bg-surface-800"
                  }`}
                >
                  {label}
                  {renderSortIcon(key)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          <div className="divide-y divide-surface-800">
            {filteredAndSortedTransactions.length === 0 && (
              <div className="p-4 text-surface-400 flex items-center justify-center h-[60vh]">
                <Calendar className="w-4 h-4 mr-2" /> No transactions to show
              </div>
            )}
            {filteredAndSortedTransactions.map((transaction) => {
              const category =
                categoryConfig[transaction.category] || categoryConfig.Other;
              const IconComponent = category.icon;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${category.textColor}`}
                      />
                    </div>

                    <div>
                      <h3 className="font-medium text-surface-200">
                        {transaction.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-lg ${category.badgeBg} ${category.textColor}`}
                        >
                          {transaction.category}
                        </span>
                        <span className="text-sm text-surface-400">
                          {new Date(transaction.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-medium text-surface-200">
                        ${parseFloat(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-surface-400">
                        {transaction.paymentMethod}
                      </p>
                    </div>
                    <button className="p-2 hover:bg-surface-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal className="w-5 h-5 text-surface-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsModal;
