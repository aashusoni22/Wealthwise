export const calculatePercentageChanges = (expenses) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Monthly calculations
  const thisMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  const lastMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const yearToCheck = currentMonth === 0 ? currentYear - 1 : currentYear;
    return (
      expenseDate.getMonth() === lastMonth &&
      expenseDate.getFullYear() === yearToCheck
    );
  });

  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount),
    0
  );
  const lastMonthTotal = lastMonthExpenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount),
    0
  );

  // Weekly calculations
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const thisWeekExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= oneWeekAgo && expenseDate <= now;
  });

  const lastWeekExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= twoWeeksAgo && expenseDate < oneWeekAgo;
  });

  const thisWeekTotal = thisWeekExpenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount),
    0
  );
  const lastWeekTotal = lastWeekExpenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount),
    0
  );

  return {
    monthlyChange: lastMonthTotal
      ? (((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
      : 0,
    weeklyChange: lastWeekTotal
      ? (((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100).toFixed(1)
      : 0,
    thisWeekTotal,
    thisMonthTotal,
  };
};

export const calculateBudgetMetrics = (budgetData, stats) => {
  try {
    const totalBudget = budgetData.reduce(
      (sum, budget) => sum + budget.amount,
      0
    );

    if (totalBudget === 0) {
      return {
        remaining: "0.00",
        percentageUsed: "0.0",
        totalBudget: "0.00",
        status: "On Track",
      };
    }

    const remaining = totalBudget - stats.thisMonthTotal;
    const percentageUsed = (stats.thisMonthTotal / totalBudget) * 100;

    let status = "On Track";
    if (percentageUsed >= 90) {
      status = "Critical";
    } else if (percentageUsed >= 75) {
      status = "Warning";
    }

    return {
      remaining: remaining.toFixed(2),
      percentageUsed: percentageUsed.toFixed(1),
      totalBudget: totalBudget.toFixed(2),
      status,
    };
  } catch (error) {
    console.error("Error calculating budget metrics:", error);
    return {
      remaining: "0.00",
      percentageUsed: "0.0",
      totalBudget: "0.00",
      status: "On Track",
    };
  }
};
