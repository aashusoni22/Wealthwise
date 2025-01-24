import { useEffect, useState } from "react";
import { showToast } from "../components/Toast";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";

export const useBudget = () => {
  const [budgetData, setBudgetData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) return;

      // Fetch both budgets and expenses for the current month
      const [budgetResponse, expenseResponse] = await Promise.all([
        appService.getCurrentBudgets(user.$id),
        appService.getAllExpenses(user.$id),
      ]);

      if (budgetResponse?.documents) {
        setBudgetData(
          budgetResponse.documents.map((doc) => ({
            ...doc,
            amount: parseFloat(doc.amount) || 0,
          }))
        );
      }

      if (expenseResponse?.documents) {
        // Filter expenses for current month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const currentMonthExpenses = expenseResponse.documents.filter(
          (expense) => {
            const expenseDate = new Date(expense.date);
            return (
              expenseDate.getMonth() === currentMonth &&
              expenseDate.getFullYear() === currentYear
            );
          }
        );

        setExpenses(
          currentMonthExpenses.map((exp) => ({
            ...exp,
            amount: parseFloat(exp.amount) || 0,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching budget data:", error);
      showToast("Failed to fetch budget data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Calculate budget metrics including actual spending
  const calculateBudgetMetrics = () => {
    const totalBudget = budgetData.reduce(
      (sum, budget) => sum + budget.amount,
      0
    );
    const totalSpent = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Calculate category-wise spending
    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Calculate utilization for each budget category
    const budgetWithUtilization = budgetData.map((budget) => ({
      ...budget,
      spent: categorySpending[budget.category] || 0,
      utilization:
        ((categorySpending[budget.category] || 0) / budget.amount) * 100,
    }));

    return {
      budgets: budgetWithUtilization,
      totalBudget,
      totalSpent,
      utilization: (totalSpent / totalBudget) * 100,
    };
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  return {
    budgetData,
    expenses,
    loading,
    refreshBudget: fetchBudgetData,
    metrics: calculateBudgetMetrics(),
  };
};
