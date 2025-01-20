export const getFilteredExpenses = (
  expenses,
  searchTerm,
  selectedCategory,
  selectedMonth
) => {
  return expenses.filter((expense) => {
    // Search term filter
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory =
      selectedCategory === "all" || expense.category === selectedCategory;

    // Month filter
    const expenseDate = new Date(expense.date);
    let matchesMonth = true;

    if (selectedMonth !== "This Month" && selectedMonth !== "Last Month") {
      const [monthName, year] = selectedMonth.split(" ");
      matchesMonth =
        expenseDate.getFullYear() === parseInt(year) &&
        expenseDate.toLocaleString("default", { month: "long" }) === monthName;
    } else if (selectedMonth === "This Month") {
      const now = new Date();
      matchesMonth =
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear();
    } else if (selectedMonth === "Last Month") {
      const now = new Date();
      now.setMonth(now.getMonth() - 1);
      matchesMonth =
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesCategory && matchesMonth;
  });
};
