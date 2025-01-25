import { useState, useEffect } from "react";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";
import { showToast } from "../components/Toast";

export const useIncomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncomes = async () => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) {
        setIncomes([]);
        setFilteredIncomes([]);
        return;
      }

      const response = await appService.getAllIncomes(userId); // Pass userId here
      setIncomes(response.documents || []);
      setFilteredIncomes(response.documents || []);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      showToast("Failed to fetch incomes", "error");
      setIncomes([]);
      setFilteredIncomes([]);
    } finally {
      setLoading(false);
    }
  };

  const addIncome = async (data) => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) throw new Error("No user ID found");

      await appService.createIncome({
        ...data,
        userId: userId, // Ensure userId is included
      });
      await fetchIncomes(); // Refresh the list after adding
      return true;
    } catch (error) {
      console.error("Error adding income:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  return {
    incomes,
    filteredIncomes,
    loading,
    addIncome,
    setFilteredIncomes,
    refreshIncomes: fetchIncomes,
  };
};
