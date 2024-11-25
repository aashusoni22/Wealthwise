import React, { useEffect, useState } from "react";
import {
  Plus,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download,
  Filter,
  Loader2,
  Activity,
  ArrowLeftRight,
} from "lucide-react";
import IncomeModal from "../components/IncomeModal";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState(incomes);
  const [selectedIncomes, setSelectedIncomes] = useState([]);
  const [sourceFilter, setSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getIncomes = async () => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) return;
      const response = await appService.getAllIncomes(userId);
      const fetchedIncomes = response.documents || [];
      setIncomes(fetchedIncomes);
      setFilteredIncomes(fetchedIncomes);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIncomes();
  }, []);

  const totalIncome = filteredIncomes.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const receivedIncome = filteredIncomes
    .filter((item) => item.status === "Received")
    .reduce((sum, item) => sum + item.amount, 0);
  const pendingIncome = filteredIncomes
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + item.amount, 0);

  const uniqueSources = Array.from(
    new Set(incomes.map((income) => income.source))
  );

  const handleCheckBoxChange = (incomeId) => {
    setSelectedIncomes((prev) =>
      prev.includes(incomeId)
        ? prev.filter((id) => id !== incomeId)
        : [...prev, incomeId]
    );
  };

  const handleDeleteIncomes = () => {
    const updatedIncomes = incomes.filter(
      (income) => !selectedIncomes.includes(income.id)
    );
    setIncomes(updatedIncomes);
    setFilteredIncomes(updatedIncomes);
    setSelectedIncomes([]);
  };

  const filterIncomes = () => {
    const filtered = incomes.filter((income) => {
      if (sourceFilter && income.source !== sourceFilter) return false;
      if (statusFilter && income.status !== statusFilter) return false;
      if (dateFilter && !income.date.startsWith(dateFilter)) return false;
      return true;
    });
    setFilteredIncomes(filtered);
  };

  React.useEffect(() => {
    filterIncomes();
  }, [sourceFilter, statusFilter, dateFilter]);

  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              Income Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Track and manage your revenue streams
            </p>
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
              Add Income
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Total Income</p>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-2">
              ${totalIncome.toFixed(2)}
            </h3>
            <div className="flex items-center mt-2 text-green-500">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm">12% from last month</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Average per month</p>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-2">
              ${receivedIncome.toFixed(2)}
            </h3>
            <div className="flex items-center mt-2 text-green-500">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm">8% from last month</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Sources</p>
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <ArrowLeftRight className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-2">
              ${pendingIncome.toFixed(2)}
            </h3>
            <div className="flex items-center mt-2 text-red-500">
              <ArrowDown className="w-4 h-4 mr-1" />
              <span className="text-sm">3% from last month</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
            <div className="flex flex-wrap gap-4">
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sources</option>
                {uniqueSources.map((source, index) => (
                  <option value={source} key={index}>
                    {source}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="Received">Received</option>
                <option value="Pending">Pending</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {(sourceFilter || statusFilter || dateFilter) && (
                <button
                  onClick={() => {
                    setSourceFilter("");
                    setStatusFilter("");
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

        {/* Transactions Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          {selectedIncomes.length > 0 && (
            <div className="p-4 bg-gray-700 border-b border-gray-600">
              <button
                onClick={handleDeleteIncomes}
                className="bg-red-500/20 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Delete Selected ({selectedIncomes.length})
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
                      className="rounded border-gray-600 bg-transparent"
                      checked={
                        selectedIncomes.length === filteredIncomes.length
                      }
                      onChange={() =>
                        selectedIncomes.length === filteredIncomes.length
                          ? setSelectedIncomes([])
                          : setSelectedIncomes(filteredIncomes.map((i) => i.id))
                      }
                    />
                  </th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">
                    Transaction
                  </th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">
                    Details
                  </th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredIncomes.map((income) => (
                  <tr
                    key={income.id}
                    className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIncomes.includes(income.id)}
                        onChange={() => handleCheckBoxChange(income.id)}
                        className="rounded border-gray-600 bg-transparent"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <DollarSign className="text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{income.title}</div>
                          <div className="text-sm text-gray-400">
                            {formattedDate(income.date)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${income.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {income.description.length > 20
                        ? income.description.slice(0, 20) + "..."
                        : income.description || income.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-lg text-sm bg-green-500/20 text-green-500">
                        {income.source}
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
        <IncomeModal
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default IncomePage;
