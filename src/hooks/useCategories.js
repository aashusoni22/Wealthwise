import { useEffect, useState } from "react";
import { showToast } from "../components/Toast";
import appService from "../appwrite/config";
import authService from "../appwrite/auth";
import { categoryConfig } from "../utils/categoryConfig";

export const useCategories = (expenses) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategories = async () => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) return;

      const fetchedCategories = await appService.getAllExpenseCategories(
        userId
      );
      const categoriesWithStyles = fetchedCategories.map((category) => {
        const config = categoryConfig[category.name] || categoryConfig.Other;
        const colorName = config.textColor.split("-")[1];
        return {
          ...category,
          color: colorName,
          bgColor: config.bgColor,
          textColor: config.textColor,
          icon: config.icon,
        };
      });
      setCategories(categoriesWithStyles);
    } catch (err) {
      showToast("Failed to fetch categories", "error");
      console.error("Error in getCategories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [expenses]);

  return { categories, loading, refreshCategories: getCategories };
};
