import { useState, useEffect } from "react";

export const useSources = (incomes) => {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    if (!incomes.length) return;

    const sourceData = incomes.reduce((acc, income) => {
      const source = income.source;
      if (!acc[source]) {
        acc[source] = { name: source, amount: 0, count: 0 };
      }
      acc[source].amount += parseFloat(income.amount);
      acc[source].count += 1;
      return acc;
    }, {});

    setSources(Object.values(sourceData));
  }, [incomes]);

  return { sources };
};
