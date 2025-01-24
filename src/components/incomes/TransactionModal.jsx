import React, { useState, useMemo } from "react";
import {
  X,
  Search,
  Filter,
  FilterX,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  FileDown,
  Calendar,
  ArrowUp,
  ArrowDown,
  Wallet,
} from "lucide-react";
import { sourceConfig } from "../../utils/sourceConfig";

const TransactionsModal = ({ isOpen, onClose, transactions, exportToCSV }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const sortOptions = [
    { label: "Date", key: "date" },
    { label: "Amount", key: "amount" },
    { label: "Title", key: "title" },
    { label: "Source", key: "source" },
  ];

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter((transaction) => {
      const matchesSearch =
        transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.source.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSource =
        selectedSource === "all" || transaction.source === selectedSource;

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

      return matchesSearch && matchesSource && matchesDate;
    });

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
        case "source":
          comparison = a.source.localeCompare(b.source);
          break;
        default:
          comparison = 0;
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [transactions, searchTerm, selectedSource, dateRange, sortConfig]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedSource("all");
    setDateRange("all");
    setShowFilters(false);
    setSortConfig({ key: "date", direction: "desc" });
    onClose();
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full h-[95vh] sm:h-[90vh] max-w-6xl bg-slate-900 sm:rounded-2xl shadow-xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-surface-800">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-surface-100">
              All Income Transactions
            </h2>
            <p className="text-sm text-surface-400 mt-1">
              {filteredAndSortedTransactions.length} transactions found
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden p-2 hover:bg-surface-800 rounded-xl text-surface-400 hover:text-surface-300 transition-colors"
            >
              {showFilters ? (
                <FilterX className="w-5 h-5" />
              ) : (
                <Filter className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={exportToCSV}
              className="p-2 hover:bg-surface-800 rounded-xl text-surface-400 hover:text-surface-300 transition-colors"
            >
              <FileDown className="w-5 h-5" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-surface-800 rounded-xl text-surface-400 hover:text-surface-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div
          className={`px-4 sm:px-8 py-4 sm:py-6 border-b border-surface-800 bg-surface-900/95 sticky top-0 ${
            showFilters ? "block" : "hidden sm:block"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4">
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

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              {/* Source Filter */}
              <select
                className="pl-4 pr-10 py-2 bg-surface-800 rounded-xl border border-surface-700 text-surface-100 appearance-none cursor-pointer"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                <option value="all">All Sources</option>
                {Object.keys(sourceConfig).map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>

              {/* Date Range */}
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
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
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
        <div className="flex-1 overflow-y-auto px-2 sm:px-5 py-3">
          <div className="divide-y divide-surface-800">
            {filteredAndSortedTransactions.length === 0 ? (
              <div className="p-4 text-surface-400 flex items-center justify-center h-[60vh]">
                <Calendar className="w-4 h-4 mr-2" /> No transactions to show
              </div>
            ) : (
              filteredAndSortedTransactions.map((transaction) => {
                const source =
                  sourceConfig[transaction.source] || sourceConfig.Other;
                const IconComponent = source?.icon || Wallet;

                return (
                  <div
                    key={transaction.$id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-surface-800/50 transition-colors group gap-4 sm:gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${
                          source?.bgColor || "bg-slate-600/20"
                        } flex items-center justify-center shrink-0`}
                      >
                        <IconComponent
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            source?.textColor || "text-slate-400"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-surface-200 text-sm sm:text-base truncate">
                          {transaction.title}
                        </h3>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-lg ${
                              source?.bgColor || "bg-slate-600/20"
                            } ${source?.textColor || "text-emerald-500"}`}
                          >
                            {transaction.source}
                          </span>
                          <span className="text-xs sm:text-sm text-surface-400">
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

                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                      <div className="text-left sm:text-right">
                        <p className="text-base sm:text-lg font-medium text-emerald-500">
                          +${parseFloat(transaction.amount).toFixed(2)}
                        </p>
                        {transaction.description && (
                          <p className="text-xs sm:text-sm text-surface-400 truncate max-w-[120px] sm:max-w-[200px]">
                            {transaction.description}
                          </p>
                        )}
                      </div>
                      <button className="p-2 hover:bg-surface-700 rounded-lg sm:opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal className="w-5 h-5 text-surface-400" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsModal;
