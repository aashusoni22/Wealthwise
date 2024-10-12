import React, { useEffect, useState } from "react";
import { FiPlus, FiDollarSign } from "react-icons/fi";
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

  const getExpenses = async () => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) {
        console.log("User not logged in");
        return;
      }
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    getExpenses();
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
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <div className="bg-black text-white p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <button
          onClick={openModal}
          className="bg-teal-600 px-4 py-2 rounded-md flex items-center"
        >
          <FiPlus className="mr-2" />
          New expense
        </button>
      </div>

      {isModalOpen && <ExpenseModal onClose={closeModal} />}

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded-md"
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
          className="bg-gray-700 text-white p-2 rounded-md"
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
          className="bg-gray-700 text-white p-2 rounded-md"
        />

        {(paymentMethodFilter || categoryFilter || dateFilter) && (
          <button
            onClick={() => {
              setCategoryFilter("");
              setPaymentMethodFilter("");
              setDateFilter("");
            }}
            className="bg-gray-700 text-white p-2 rounded-md duration-200 transition-all ease-in-out hover:bg-rose-600"
          >
            Reset Filters
          </button>
        )}
      </div>

      {selectedExpenses.length > 0 && (
        <button
          onClick={handleDeleteExpenses}
          className="bg-teal-600 px-4 py-2 rounded-md mb-4"
        >
          Delete Selected
        </button>
      )}

      <div className="border border-gray-700 rounded-lg overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="w-8 px-4 py-3"></th>
                <th className="text-gray-400 font-normal text-left px-4 py-3">
                  TITLE
                </th>
                <th className="text-gray-400 font-normal text-left px-4 py-3">
                  AMOUNT
                </th>
                <th className="text-gray-400 font-normal text-left px-4 py-3">
                  PAYMENT
                </th>
                <th className="text-gray-400 font-normal text-left px-4 py-3">
                  DETAILS
                </th>
                <th className="text-gray-400 font-normal text-left px-4 py-3">
                  CATEGORY
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedExpenses.includes(expense.$id)}
                      onChange={() => handleCheckBoxChange(expense.$id)}
                      className="rounded border-gray-700 bg-transparent w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                        <FiDollarSign className="text-black" />
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">
                          {formattedDate(expense.date)}
                        </div>
                        <div>{expense.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">${expense.amount}</td>
                  <td className="px-4 py-4">{expense.paymentMethod}</td>
                  <td className="px-4 py-4">
                    {expense.description.length > 20
                      ? expense.description.slice(0, 20) + "..."
                      : expense.description}
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-teal-600">
                      {expense.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
