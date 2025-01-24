import React, { useState, useEffect } from "react";
import { Loader2, Search } from "lucide-react";
import Header from "../components/incomes/Header";
import QuickActions from "../components/incomes/QuickActions";
import SourceList from "../components/incomes/SourceList";
import StatCards from "../components/incomes/StatCards";
import IncomeList from "../components/incomes/IncomeList";
import IncomeModal from "../components/incomes/IncomeModal";
import TransactionModal from "../components/incomes/TransactionModal";
import { useIncomes } from "../hooks/useIncomes";
import { useSources } from "../hooks/useSources";
import { calculateIncomeMetrics } from "../utils/metricCalculations";
import { getFilteredIncomes } from "../utils/filterHelpers";
import { exportToCSV } from "../utils/exportUtils";
import authService from "../appwrite/auth";
import Toast from "../components/Toast";
import SourceModal from "../components/incomes/SourceModal";

const IncomePage = () => {
  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hooks
  const {
    incomes,
    filteredIncomes,
    loading: incomesLoading,
    addIncome,
    setFilteredIncomes,
    refreshIncomes,
  } = useIncomes();

  const { sources } = useSources(incomes);
  const metrics = calculateIncomeMetrics(filteredIncomes, selectedPeriod);
  // Filter Effect
  useEffect(() => {
    const filtered = getFilteredIncomes(
      incomes,
      searchTerm,
      selectedSource,
      selectedPeriod
    );
    setFilteredIncomes(filtered);
  }, [searchTerm, selectedSource, selectedPeriod, incomes, setFilteredIncomes]);

  // Handlers
  const handleIncomeSubmit = async (data) => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) {
        throw new Error("Please login to add income");
      }

      await addIncome({
        ...data,
        userId: user.$id,
        amount: parseFloat(data.amount),
      });

      setIsAddModalOpen(false);
      refreshIncomes();
    } catch (error) {
      console.error("Error adding income:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (incomesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] lg:p-6 bg-surface-900">
      <Toast />
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <Header
          onAddIncome={() => setIsAddModalOpen(true)}
          onExportCSV={() => exportToCSV(incomes)}
        />

        <div className="space-y-6">
          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-800/50 border border-surface-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-surface-50"
              />
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-surface-800/90 border border-surface-700/50 rounded-xl text-surface-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              <QuickActions onAddIncome={() => setIsAddModalOpen(true)} />
              <SourceList
                sources={incomes}
                selectedSource={selectedSource}
                onSourceSelect={setSelectedSource}
                selectedPeriod={selectedPeriod}
                onViewAllSources={() => setIsSourceModalOpen(true)}
              />
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9 space-y-6">
              <StatCards metrics={metrics} selectedPeriod={selectedPeriod} />
              <IncomeList
                transactions={filteredIncomes.slice(0, 6)}
                onViewAll={() => setIsTransactionsModalOpen(true)}
                onAddIncome={() => setIsAddModalOpen(true)}
                onTransactionUpdated={refreshIncomes}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <IncomeModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleIncomeSubmit}
          mode="create"
          loading={loading}
        />
      )}

      {isTransactionsModalOpen && (
        <TransactionModal
          isOpen={isTransactionsModalOpen}
          onClose={() => setIsTransactionsModalOpen(false)}
          transactions={filteredIncomes}
          onExportCSV={() => exportToCSV(incomes)}
        />
      )}

      <SourceModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        sources={incomes}
        onSourceSelect={setSelectedSource}
        selectedSource={selectedSource}
        selectedPeriod={selectedPeriod}
      />
    </div>
  );
};

export default IncomePage;
