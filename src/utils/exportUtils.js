import Papa from "papaparse";

export const formatDateForCSV = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const exportToCSV = (expenses) => {
  try {
    const exportData = expenses.map((expense) => ({
      Date: formatDateForCSV(expense.date),
      Title: expense.title,
      Category: expense.category,
      Amount: `$${Number(expense.amount).toFixed(2)}`,
      "Payment Method": expense.paymentMethod || "N/A",
      Description: expense.description || "N/A",
      Status: expense.status || "completed",
    }));

    const csv = Papa.unparse(exportData, {
      quotes: true,
      header: true,
      delimiter: ",",
    });

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const fileName = `expenses_${new Date().toISOString().split("T")[0]}.csv`;

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return true;
  } catch (error) {
    console.error("Error exporting expenses:", error);
    return false;
  }
};
