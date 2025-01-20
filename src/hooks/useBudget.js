import { useEffect, useState } from "react";
import { showToast } from "../components/Toast";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";

export const useBudget = () => {
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgetData = async () => {
    try {
      const userId = await authService.getCurrentUser();
      if (!userId) return;

      const response = await appService.getCurrentBudgets(userId.$id);
      if (response?.documents) {
        setBudgetData(response.documents);
      }
    } catch (error) {
      console.error("Error fetching budget data:", error);
      showToast("Failed to fetch budget data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  return {
    budgetData,
    loading,
    refreshBudget: fetchBudgetData,
  };
};
