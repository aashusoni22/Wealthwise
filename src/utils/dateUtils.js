export const formatRelativeDate = (dateString) => {
  try {
    if (!dateString) {
      return { formatted: "Invalid date", isFuture: false };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDate = new Date(dateString);
    const expenseDate = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate()
    );

    if (isNaN(expenseDate.getTime())) {
      return { formatted: "Invalid date", isFuture: false };
    }

    if (expenseDate > today) {
      return {
        formatted: expenseDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        isFuture: true,
      };
    }

    const diffTime = today.getTime() - expenseDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { formatted: "Today", isFuture: false };
    if (diffDays === 1) return { formatted: "Yesterday", isFuture: false };
    if (diffDays < 7)
      return { formatted: `${diffDays} days ago`, isFuture: false };

    return {
      formatted: expenseDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      isFuture: false,
    };
  } catch (error) {
    console.error("Error formatting date:", error, "Date string:", dateString);
    return { formatted: "Invalid date", isFuture: false };
  }
};
