export const getFilteredExpenses = (
  expenses,
  searchTerm,
  selectedCategory,
  selectedMonth
) => {
  return expenses.filter((expense) => {
    const matchesSearch =
      !searchTerm ||
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || expense.category === selectedCategory;
    const expenseDate = new Date(expense.date);
    const matchesMonth = getMonthMatch(expenseDate, selectedMonth);

    return matchesSearch && matchesCategory && matchesMonth;
  });
};

export const getFilteredIncomes = (
  incomes,
  searchTerm,
  selectedSource,
  selectedPeriod
) => {
  return incomes.filter((income) => {
    const matchesSearch =
      !searchTerm ||
      income.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSource =
      selectedSource === "all" || income.source === selectedSource;
    const incomeDate = new Date(income.date);
    const matchesPeriod = getMonthMatch(incomeDate, selectedPeriod);

    return matchesSearch && matchesSource && matchesPeriod;
  });
};

const getMonthMatch = (date, selectedPeriod) => {
  const now = new Date();

  switch (selectedPeriod) {
    case "This Month":
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    case "Last Month": {
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return (
        date.getMonth() === lastMonth.getMonth() &&
        date.getFullYear() === lastMonth.getFullYear()
      );
    }
    case "Last 3 Months": {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return date >= threeMonthsAgo && date <= now;
    }
    default:
      if (selectedPeriod?.includes(" ")) {
        const [monthName, year] = selectedPeriod.split(" ");
        return (
          date.getFullYear() === parseInt(year) &&
          date.toLocaleString("default", { month: "long" }) === monthName
        );
      }
      return true;
  }
};
