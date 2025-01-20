import { useState, useEffect } from "react";
import { showToast } from "../components/Toast";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";

export const useExpenses = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const getExpenses = async () => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) return;

      const response = await appService.getAllExpenses(userId);
      const fetchedExpenses = response.documents || [];
      setExpenses(fetchedExpenses);
      setFilteredExpenses(fetchedExpenses);
    } catch (err) {
      showToast("Failed to fetch expenses", "error");
      console.error("Error in getExpenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (data) => {
    try {
      setLoading(true);
      const userId = await authService.getCurrentUserId();
      if (!userId) throw new Error("No user ID found");

      const submissionDate = data.date;
      const today = new Date().toISOString().split("T")[0];

      const newExpense = await appService.createExpense({
        ...data,
        status: submissionDate > today ? "planned" : "completed",
        userId: userId,
      });

      setExpenses((prev) => [newExpense, ...prev]);
      setFilteredExpenses((prev) => [newExpense, ...prev]);
      showToast("Expense added successfully", "success");
      return newExpense;
    } catch (error) {
      showToast(error.message || "Failed to add expense", "error");
      console.error("Error in addExpense:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExpenses();
  }, []);

  return {
    loading,
    expenses,
    filteredExpenses,
    setFilteredExpenses,
    addExpense,
    refreshExpenses: getExpenses,
  };
};
