import { useState, useEffect } from "react";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";

export const useIncomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      const response = await appService.getAllIncomes();
      setIncomes(response.documents);
      setFilteredIncomes(response.documents);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  const addIncome = async (data) => {
    try {
      await appService.createIncome(data);
      await fetchIncomes();
    } catch (error) {
      console.error("Error adding income:", error);
      throw error;
    }
  };

  return {
    incomes,
    filteredIncomes,
    loading,
    addIncome,
    setFilteredIncomes,
    refreshIncomes: fetchIncomes,
  };
};
