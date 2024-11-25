import React, { useEffect, useState } from "react";
import {
  Plus,
  DollarSign,
  Trash2,
  Filter,
  Loader2,
  Download,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { ExpenseModal } from "../components";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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

  useEffect(() => {
    filterExpenses();
  }, [categoryFilter, paymentMethodFilter, dateFilter]);

  const uniqueCategories = Array.from(
    new Set(expenses.map((expense) => expense.category))
  );

  const handleCheckBoxChange = (expenseId) => {
    setSelectedExpenses((prev) =>
      prev.includes(expenseId)
        ? prev.filter((id) => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleDeleteExpenses = async () => {
    try {
      const userId = await authService.getCurrentUserId();
      for (const expenseId of selectedExpenses) {
        await appService.deleteExpense(expenseId, userId);
      }
      setSelectedExpenses([]);
      getExpenses();
    } catch (error) {
      console.error("Error deleting expenses:", error);
    }
  };

  const filterExpenses = () => {
    const filtered = expenses.filter((expense) => {
      if (categoryFilter && expense.category !== categoryFilter) return false;
      if (paymentMethodFilter && expense.paymentMethod !== paymentMethodFilter)
        return false;
      if (dateFilter && !expense.date.startsWith(dateFilter)) return false;
      return true;
    });
    setFilteredExpenses(filtered);
  };

  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getTotalAmount = () => {
    return filteredExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              Expenses Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Track and manage your expenses</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-teal-400 to-blue-500 px-4 py-2 rounded-lg flex items-center hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Total Expenses</p>
              <div className="bg-red-500/20 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-2">
              ${getTotalAmount().toFixed(2)}
            </h3>
            <div className="flex items-center mt-2 text-red-500">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm">8% from last month</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Average per Day</p>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <ArrowDown className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-2">
              ${(getTotalAmount() / 30).toFixed(2)}
            </h3>
            <div className="flex items-center mt-2 text-green-500">
              <ArrowDown className="w-4 h-4 mr-1" />
              <span className="text-sm">5% from last month</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Categories</p>
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Filter className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-2">
              {uniqueCategories.length}
            </h3>
            <div className="flex items-center mt-2 text-purple-500">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm">2 new categories</span>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
            <div className="flex flex-wrap gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((category, index) => (
                  <option value={category} key={index}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All Payment Methods</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />

              {(categoryFilter || paymentMethodFilter || dateFilter) && (
                <button
                  onClick={() => {
                    setCategoryFilter("");
                    setPaymentMethodFilter("");
                    setDateFilter("");
                  }}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Expenses Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          {selectedExpenses.length > 0 && (
            <div className="p-4 bg-gray-700 border-b border-gray-600">
              <button
                onClick={handleDeleteExpenses}
                className="bg-red-500/20 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Delete Selected ({selectedExpenses.length})
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="w-8 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={
                        selectedExpenses.length === filteredExpenses.length
                      }
                      onChange={() => {
                        if (
                          selectedExpenses.length === filteredExpenses.length
                        ) {
                          setSelectedExpenses([]);
                        } else {
                          setSelectedExpenses(
                            filteredExpenses.map((e) => e.$id)
                          );
                        }
                      }}
                      className="rounded border-gray-600 bg-transparent"
                    />
                  </th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">
                    Transaction
                  </th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">
                    Payment
                  </th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">
                    Details
                  </th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedExpenses.includes(expense.$id)}
                        onChange={() => handleCheckBoxChange(expense.$id)}
                        className="rounded border-gray-600 bg-transparent"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <DollarSign className="text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{expense.title}</div>
                          <div className="text-sm text-gray-400">
                            {formattedDate(expense.date)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${Number(expense.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{expense.paymentMethod}</td>
                    <td className="px-6 py-4">
                      {expense.description.length > 20
                        ? expense.description.slice(0, 20) + "..."
                        : expense.description || expense.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-lg text-sm bg-teal-500/20 text-teal-500">
                        {expense.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ExpenseModal
          onClose={() => {
            setIsModalOpen(false);
            getExpenses();
          }}
        />
      )}
    </div>
  );
};

export default ExpensesPage;
