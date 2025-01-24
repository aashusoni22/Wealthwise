import React from "react";
import { PieChart, ArrowRight } from "lucide-react";

const CategoryList = ({
  expenses,
  categoryConfig,
  onCategorySelect,
  selectedCategory,
  selectedMonth,
  onViewAllCategories,
}) => {
  const filterExpensesByPeriod = (expenses) => {
    if (!Array.isArray(expenses)) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    switch (selectedMonth) {
      case "This Month":
        return expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
          );
        });

      case "Last Month": {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const yearToCheck = currentMonth === 0 ? currentYear - 1 : currentYear;
        return expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === lastMonth &&
            expenseDate.getFullYear() === yearToCheck
          );
        });
      }

      case "Last 3 Months": {
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= threeMonthsAgo && expenseDate <= now;
        });
      }

      default:
        return expenses;
    }
  };

  // Calculate category totals from filtered expenses
  const getPeriodCategoryTotals = () => {
    const filteredExpenses = filterExpensesByPeriod(expenses);
    const categoryMap = new Map();

    // Group expenses by category
    filteredExpenses.forEach((expense) => {
      const categoryName = expense.category;
      const currentTotal = categoryMap.get(categoryName) || {
        name: categoryName,
        amount: 0,
        count: 0,
      };

      currentTotal.amount += parseFloat(expense.amount) || 0;
      currentTotal.count += 1;
      categoryMap.set(categoryName, currentTotal);
    });

    // Convert to array and calculate percentages
    const totalAmount = Array.from(categoryMap.values()).reduce(
      (sum, cat) => sum + cat.amount,
      0
    );

    return Array.from(categoryMap.values())
      .map((category) => ({
        ...category,
        percentage: totalAmount > 0 ? (category.amount / totalAmount) * 100 : 0,
        textColor: categoryConfig[category.name]?.textColor || "text-slate-500",
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const categories = getPeriodCategoryTotals();
  const totalAmount = categories.reduce(
    (sum, category) => sum + category.amount,
    0
  );
  const totalCount = categories.reduce(
    (sum, category) => sum + category.count,
    0
  );

  const visibleCategories = categories.slice(0, 3);

  const renderCategories = () => {
    return visibleCategories.map((category, index) => {
      const config = categoryConfig[category.name] || categoryConfig.Other;
      const colorName = config.textColor.split("-")[1];
      const colorMap = {
        indigo: "rgb(99, 102, 241)",
        amber: "rgb(245, 158, 11)",
        emerald: "rgb(16, 185, 129)",
        blue: "rgb(59, 130, 246)",
        violet: "rgb(139, 92, 246)",
        pink: "rgb(236, 72, 153)",
        orange: "rgb(249, 115, 22)",
        red: "rgb(239, 68, 68)",
        teal: "rgb(20, 184, 166)",
        slate: "rgb(100, 116, 139)",
      };

      const color = colorMap[colorName] || colorMap.slate;
      const isSelected = selectedCategory === category.name;

      return (
        <div
          key={index}
          onClick={() => onCategorySelect(category.name)}
          className={`space-y-2 p-2 rounded-xl cursor-pointer transition-all ${
            isSelected ? "bg-slate-800/60" : "hover:bg-slate-800/40"
          }`}
        >
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-slate-300">{category.name}</span>
            </div>
            <span className="text-slate-400">
              ${category.amount.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                backgroundColor: color,
                width: `${category.percentage}%`,
                opacity: isSelected ? 1 : 0.8,
              }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">
              {category.percentage.toFixed(1)}% of total
            </span>
            <span className="text-slate-400">
              {category.count} transaction{category.count !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      );
    });
  };

  // Get the period label
  const getPeriodLabel = () => {
    switch (selectedMonth) {
      case "Last Month":
        return "Last Month's Categories";
      case "Last 3 Months":
        return "3-Month Categories";
      default:
        return "Categories";
    }
  };

  return (
    <div className="bg-slate-800/40 lg:min-h-auto rounded-2xl backdrop-blur-sm border border-slate-800/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">
          {getPeriodLabel()}
        </h2>
        {categories.length > 3 && (
          <button
            onClick={onViewAllCategories}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300 transition-colors"
          >
            <PieChart className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {categories.length === 0 ? (
          <p className="text-sm text-slate-400 flex items-center justify-center h-40">
            <PieChart className="w-4 h-4 mr-2" /> No categories for this period
          </p>
        ) : (
          <>
            {/* All Categories Option */}
            <div
              onClick={() => onCategorySelect("all")}
              className={`space-y-2 p-2 rounded-xl cursor-pointer transition-all ${
                selectedCategory === "all"
                  ? "bg-slate-800/60"
                  : "hover:bg-slate-800/40"
              }`}
            >
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                  <span className="text-slate-300">All Categories</span>
                </div>
                <span className="text-slate-400">
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-primary-500"
                  style={{
                    width: "100%",
                    opacity: selectedCategory === "all" ? 1 : 0.8,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">100% of total</span>
                <span className="text-slate-400">
                  {totalCount} transaction{totalCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Visible Categories */}
            {renderCategories()}

            {/* View All Button */}
            {categories.length > 3 && (
              <button
                onClick={onViewAllCategories}
                className="w-full mt-4 py-2 text-sm text-primary-500 hover:text-primary-400 transition-colors flex items-center justify-center gap-1"
              >
                View All Categories
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
