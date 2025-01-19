import React, { useState } from "react";
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
  Search,
  Filter,
  X,
  CreditCard,
  Wallet,
  DollarSign,
} from "lucide-react";

// Filter Modal Component
const FilterModal = ({ onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    dateRange: "all",
    category: "all",
    minAmount: "",
    maxAmount: "",
    paymentMethod: "all",
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 rounded-2xl max-w-md w-full shadow-lg border border-slate-700/50">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Filter Transactions
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date Range
              </label>
              <select
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-2.5 text-slate-200"
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters({ ...filters, dateRange: e.target.value })
                }
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <select
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-2.5 text-slate-200"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <option value="all">All Categories</option>
                <option value="shopping">Shopping</option>
                <option value="food">Food & Drinks</option>
                <option value="transport">Transport</option>
                <option value="utilities">Utilities</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Min Amount
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-2.5 text-slate-200"
                  placeholder="0"
                  value={filters.minAmount}
                  onChange={(e) =>
                    setFilters({ ...filters, minAmount: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Amount
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-2.5 text-slate-200"
                  placeholder="1000"
                  value={filters.maxAmount}
                  onChange={(e) =>
                    setFilters({ ...filters, maxAmount: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Payment Method
              </label>
              <select
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-2.5 text-slate-200"
                value={filters.paymentMethod}
                onChange={(e) =>
                  setFilters({ ...filters, paymentMethod: e.target.value })
                }
              >
                <option value="all">All Methods</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => {
                setFilters({
                  dateRange: "all",
                  category: "all",
                  minAmount: "",
                  maxAmount: "",
                  paymentMethod: "all",
                });
              }}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              Reset
            </button>
            <button
              onClick={() => {
                onApplyFilters(filters);
                onClose();
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
