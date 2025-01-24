export const calculatePercentageChange = (current, previous) => {
  // If there's no previous value, return 0% change
  if (!previous || previous === 0) return 0;

  // Calculate the percentage change
  const change = ((current - previous) / Math.abs(previous)) * 100;

  // Round to 1 decimal place and cap at ±999.9%
  const roundedChange = Math.round(change * 10) / 10;

  // Cap extremely large values
  if (roundedChange > 999.9) return 999.9;
  if (roundedChange < -999.9) return -999.9;

  return roundedChange;
};

export const calculatePercentageChanges = (expenses) => {
  if (!Array.isArray(expenses)) return defaultStats();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDay = now.getDate();

  // Filter this month's expenses
  const thisMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  // Filter last month's expenses
  const lastMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const yearToCheck = currentMonth === 0 ? currentYear - 1 : currentYear;
    return (
      expenseDate.getMonth() === lastMonth &&
      expenseDate.getFullYear() === yearToCheck
    );
  });

  // Calculate totals
  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0),
    0
  );
  const lastMonthTotal = lastMonthExpenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0),
    0
  );

  // Calculate weekly totals
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(now.getDate() - 14);

  const thisWeekExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= oneWeekAgo && expenseDate <= now;
  });

  const lastWeekExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= twoWeeksAgo && expenseDate < oneWeekAgo;
  });

  const thisWeekTotal = thisWeekExpenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0),
    0
  );
  const lastWeekTotal = lastWeekExpenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0),
    0
  );

  // Calculate averages and projections
  const dailyAverage = thisMonthTotal / currentDay;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const projectedMonthly = dailyAverage * daysInMonth;

  return {
    monthlyChange: calculatePercentageChange(thisMonthTotal, lastMonthTotal),
    weeklyChange: calculatePercentageChange(thisWeekTotal, lastWeekTotal),
    thisWeekTotal: roundToTwoDecimals(thisWeekTotal),
    thisMonthTotal: roundToTwoDecimals(thisMonthTotal),
    dailyAverage: roundToTwoDecimals(dailyAverage),
    projectedMonthly: roundToTwoDecimals(projectedMonthly),
  };
};

export const calculateIncomeMetrics = (
  incomes,
  selectedPeriod = "This Month"
) => {
  if (!Array.isArray(incomes)) return defaultIncomeStats();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDay = now.getDate();

  // Define the getPeriodIncomes function first
  const getPeriodIncomes = () => {
    switch (selectedPeriod) {
      case "This Month":
        return incomes.filter((income) => {
          const incomeDate = new Date(income.date);
          return (
            incomeDate.getMonth() === currentMonth &&
            incomeDate.getFullYear() === currentYear
          );
        });
      case "Last Month": {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const yearToCheck = currentMonth === 0 ? currentYear - 1 : currentYear;
        return incomes.filter((income) => {
          const incomeDate = new Date(income.date);
          return (
            incomeDate.getMonth() === lastMonth &&
            incomeDate.getFullYear() === yearToCheck
          );
        });
      }
      case "Last 3 Months": {
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return incomes.filter((income) => {
          const incomeDate = new Date(income.date);
          return incomeDate >= threeMonthsAgo && incomeDate <= now;
        });
      }
      default:
        return incomes;
    }
  };

  // Define getComparisonTotal function
  const getComparisonTotal = () => {
    switch (selectedPeriod) {
      case "This Month": {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const yearToCheck = currentMonth === 0 ? currentYear - 1 : currentYear;
        const lastMonthIncomes = incomes.filter((income) => {
          const incomeDate = new Date(income.date);
          return (
            incomeDate.getMonth() === lastMonth &&
            incomeDate.getFullYear() === yearToCheck
          );
        });
        return lastMonthIncomes.reduce(
          (sum, income) => sum + parseFloat(income.amount),
          0
        );
      }
      case "Last Month": {
        const twoMonthsAgo =
          currentMonth <= 1 ? 11 - (1 - currentMonth) : currentMonth - 2;
        const yearToCheck = currentMonth <= 1 ? currentYear - 1 : currentYear;
        const previousMonthIncomes = incomes.filter((income) => {
          const incomeDate = new Date(income.date);
          return (
            incomeDate.getMonth() === twoMonthsAgo &&
            incomeDate.getFullYear() === yearToCheck
          );
        });
        return previousMonthIncomes.reduce(
          (sum, income) => sum + parseFloat(income.amount),
          0
        );
      }
      case "Last 3 Months": {
        const sixMonthsAgo = new Date(now);
        const threeMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const previousPeriodIncomes = incomes.filter((income) => {
          const incomeDate = new Date(income.date);
          return incomeDate >= sixMonthsAgo && incomeDate < threeMonthsAgo;
        });
        return previousPeriodIncomes.reduce(
          (sum, income) => sum + parseFloat(income.amount),
          0
        );
      }
      default:
        return 0;
    }
  };

  // Now we can use the functions
  const periodIncomes = getPeriodIncomes();
  const periodTotal = periodIncomes.reduce(
    (sum, income) => sum + parseFloat(income.amount),
    0
  );

  const comparisonTotal = getComparisonTotal();
  const monthlyChange =
    comparisonTotal === 0
      ? 0
      : ((periodTotal - comparisonTotal) / Math.abs(comparisonTotal)) * 100;

  // Calculate daily average
  const getDailyAverage = () => {
    if (selectedPeriod === "Last 3 Months") {
      return periodTotal / 90; // Approximate for 3 months
    }
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return periodTotal / daysInMonth;
  };

  // Calculate top income source
  const getTopSource = () => {
    const sourceMap = new Map();

    // Group by source
    periodIncomes.forEach((income) => {
      const current = sourceMap.get(income.source) || { amount: 0, count: 0 };
      current.amount += parseFloat(income.amount);
      current.count += 1;
      sourceMap.set(income.source, current);
    });

    // Find the top source
    let topSource = { name: "No Source", amount: 0, count: 0, percentage: 0 };
    sourceMap.forEach((value, source) => {
      if (value.amount > topSource.amount) {
        topSource = {
          name: source,
          amount: value.amount,
          count: value.count,
          percentage: (value.amount / periodTotal) * 100,
        };
      }
    });

    return topSource;
  };

  return {
    totalIncome: roundToTwoDecimals(periodTotal),
    monthlyChange: roundToTwoDecimals(monthlyChange),
    dailyAverage: roundToTwoDecimals(getDailyAverage()),
    totalTransactions: periodIncomes.length,
    topSource: getTopSource(),
  };
};

export const calculateBudgetMetrics = (budgetData, stats) => {
  if (!Array.isArray(budgetData) || !stats) return defaultMetrics();

  try {
    const totalBudget = budgetData.reduce(
      (sum, budget) => sum + (parseFloat(budget.amount) || 0),
      0
    );

    if (totalBudget === 0) return defaultMetrics();

    const monthlySpent = parseFloat(stats.thisMonthTotal) || 0;
    const remaining = totalBudget - monthlySpent;
    const percentageUsed = (monthlySpent / totalBudget) * 100;

    const currentDate = new Date();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const currentDay = currentDate.getDate();

    const dailyBudget = totalBudget / daysInMonth;
    const dailySpent = monthlySpent / currentDay;
    const dailyRemaining = remaining / (daysInMonth - currentDay);

    let status = "On Track";
    if (percentageUsed >= 90) {
      status = "Critical";
    } else if (percentageUsed >= 75) {
      status = "Warning";
    }

    return {
      remaining: roundToTwoDecimals(remaining),
      percentageUsed: roundToTwoDecimals(percentageUsed),
      totalBudget: roundToTwoDecimals(totalBudget),
      dailyBudget: roundToTwoDecimals(dailyBudget),
      dailySpent: roundToTwoDecimals(dailySpent),
      dailyRemaining: roundToTwoDecimals(dailyRemaining),
      status,
    };
  } catch (error) {
    console.error("Error calculating budget metrics:", error);
    return defaultMetrics();
  }
};

const roundToTwoDecimals = (number) => {
  return Math.round((number + Number.EPSILON) * 100) / 100;
};

const defaultStats = () => ({
  monthlyChange: 0,
  weeklyChange: 0,
  thisWeekTotal: 0,
  thisMonthTotal: 0,
  dailyAverage: 0,
  projectedMonthly: 0,
});

const defaultIncomeStats = () => ({
  totalIncome: 0,
  monthlyChange: 0,
  averageTransaction: 0,
  totalTransactions: 0,
  projectedMonthly: 0,
});

const defaultMetrics = () => ({
  remaining: 0,
  percentageUsed: 0,
  totalBudget: 0,
  dailyBudget: 0,
  dailySpent: 0,
  dailyRemaining: 0,
  status: "On Track",
});

export const calculateMonthlyTrends = (incomes) => {
  if (!Array.isArray(incomes)) return defaultTrends();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthIncomes = incomes.filter((income) => {
    const incomeDate = new Date(income.date);
    return (
      incomeDate.getMonth() === currentMonth &&
      incomeDate.getFullYear() === currentYear
    );
  });

  const lastMonthIncomes = incomes.filter((income) => {
    const incomeDate = new Date(income.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const yearToCheck = currentMonth === 0 ? currentYear - 1 : currentYear;
    return (
      incomeDate.getMonth() === lastMonth &&
      incomeDate.getFullYear() === yearToCheck
    );
  });

  const thisMonthTotal = thisMonthIncomes.reduce(
    (sum, income) => sum + parseFloat(income.amount),
    0
  );
  const lastMonthTotal = lastMonthIncomes.reduce(
    (sum, income) => sum + parseFloat(income.amount),
    0
  );

  const monthOverMonth = calculatePercentageChange(
    thisMonthTotal,
    lastMonthTotal
  );

  return {
    monthOverMonth: roundToTwoDecimals(monthOverMonth),
    thisMonthTotal: roundToTwoDecimals(thisMonthTotal),
    lastMonthTotal: roundToTwoDecimals(lastMonthTotal),
  };
};

const defaultTrends = () => ({
  monthOverMonth: 0,
  thisMonthTotal: 0,
  lastMonthTotal: 0,
});
