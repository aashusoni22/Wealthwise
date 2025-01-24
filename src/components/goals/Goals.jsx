import React, { useState, useMemo } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useGoals } from "../../hooks/useGoals";
import GoalsHeader from "./GoalsHeader";
import GoalsStats from "./GoalsStats";
import GoalsGrid from "./GoalsGrid";
import GoalsFilter from "./GoalsFilter";
import GoalModal from "./GoalModal";
import GoalsEmpty from "./GoalsEmpty";

const Goals = () => {
  const {
    loading,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    calculateGoalStats,
  } = useGoals();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const stats = calculateGoalStats();

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleDeleteGoal = async (goal) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?"
    );
    if (confirmed) {
      try {
        await deleteGoal(goal.$id);
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  const filteredGoals = useMemo(() => {
    // First apply search filter
    let filtered = goals;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = goals.filter(
        (goal) =>
          goal.title.toLowerCase().includes(query) ||
          goal.category.toLowerCase().includes(query) ||
          goal.description?.toLowerCase().includes(query)
      );
    }

    // Then apply category/status filter
    if (filter === "all") return filtered;
    if (filter === "active")
      return filtered.filter(
        (goal) => (goal.Progress / goal.target) * 100 < 100
      );
    if (filter === "completed")
      return filtered.filter(
        (goal) => (goal.Progress / goal.target) * 100 >= 100
      );
    if (filter === "due-soon") {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return filtered.filter(
        (goal) => new Date(goal.duedate) <= thirtyDaysFromNow
      );
    }
    return filtered;
  }, [goals, filter, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          <p className="text-slate-400">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <GoalsHeader
        onNewGoal={() => setIsModalOpen(true)}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />
      <GoalsStats stats={stats} />
      <GoalsFilter activeFilter={filter} onFilterChange={setFilter} />

      {goals.length === 0 ? (
        <GoalsEmpty onNewGoal={() => setIsModalOpen(true)} />
      ) : filteredGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center">
          <p className="text-lg text-slate-400">
            No goals found matching "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 text-primary-500 hover:text-primary-400"
          >
            Clear search
          </button>
        </div>
      ) : (
        <GoalsGrid
          goals={filteredGoals}
          onEdit={handleEditGoal}
          onDelete={handleDeleteGoal}
        />
      )}

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGoal(null);
        }}
        initialGoal={selectedGoal}
        addGoal={addGoal}
        updateGoal={updateGoal}
      />
    </div>
  );
};

export default Goals;
