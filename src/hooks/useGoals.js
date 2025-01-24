import { useState, useEffect } from "react";
import { showToast } from "../components/Toast";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";

export const useGoals = () => {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);

  const getGoals = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      const response = await appService.getAllGoals(user.$id);
      const fetchedGoals = response.documents || [];
      setGoals(fetchedGoals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      showToast("Failed to fetch goals", "error");
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goalData) => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) throw new Error("User not found");

      const newGoal = await appService.createGoal({
        ...goalData,
        user_id: user.$id,
        Progress: goalData.Progress || 0, // Ensure Progress is set
        duedate: goalData.duedate, // Make sure we're using duedate
        createdAt: new Date().toISOString(),
      });

      setGoals((prev) => [newGoal, ...prev]);
      showToast("Goal created successfully", "success");
      return newGoal;
    } catch (error) {
      console.error("Error adding goal:", error);
      showToast("Failed to create goal", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (goalId, updates) => {
    try {
      setLoading(true);
      const updatedGoal = await appService.updateGoal(goalId, updates);
      setGoals((prev) =>
        prev.map((goal) => (goal.$id === goalId ? updatedGoal : goal))
      );
      showToast("Goal updated successfully", "success");
      return updatedGoal;
    } catch (error) {
      console.error("Error updating goal:", error);
      showToast("Failed to update goal", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      setLoading(true);
      await appService.deleteGoal(goalId);
      setGoals((prev) => prev.filter((goal) => goal.$id !== goalId));
      showToast("Goal deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting goal:", error);
      showToast("Failed to delete goal", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const calculateGoalStats = () => {
    const totalGoals = goals.length;
    const inProgress = goals.filter(
      (g) => (g.Progress / g.target) * 100 < 100
    ).length;
    const completed = goals.filter(
      (g) => (g.Progress / g.target) * 100 >= 100
    ).length;
    const newThisMonth = goals.filter((g) => {
      const goalDate = new Date(g.createdAt);
      const now = new Date();
      return (
        goalDate.getMonth() === now.getMonth() &&
        goalDate.getFullYear() === now.getFullYear()
      );
    }).length;

    return {
      totalGoals,
      inProgress,
      completed,
      newThisMonth,
    };
  };

  useEffect(() => {
    getGoals();
  }, []);

  return {
    loading,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    refreshGoals: getGoals,
    calculateGoalStats,
  };
};
