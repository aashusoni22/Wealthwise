import React from "react";
import { motion } from "framer-motion";

const RecentExpenses = () => {
  const expenses = [
    {
      subject: "Office Supplies",
      employee: "John Smith",
      team: "Marketing",
      teamColor: "bg-red-500",
      amount: "€150.00",
    },
    {
      subject: "Business Lunch",
      employee: "Sarah Jade",
      team: "Sales",
      teamColor: "bg-purple-500",
      amount: "€75.50",
    },
    {
      subject: "Travel Expenses",
      employee: "Mike Brown",
      team: "Operations",
      teamColor: "bg-blue-500",
      amount: "€450.25",
    },
    {
      subject: "Client Dinner",
      employee: "Jennifer Lee",
      team: "Marketing",
      teamColor: "bg-red-500",
      amount: "€120.00",
    },
  ];

  return (
    <div className="bg-gray-900/50 rounded-2xl backdrop-blur-sm p-5">
      <h2 className="text-pink-500 font-semibold text-lg mb-4">
        Recent Expenses
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="text-left pb-4">Subject</th>
              <th className="text-left pb-4">Employee</th>
              <th className="text-left pb-4">Team</th>
              <th className="text-left pb-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <td className="py-3 px-2">{expense.subject}</td>
                <td className="py-3 px-2">{expense.employee}</td>
                <td className="py-3 px-2">
                  <span
                    className={`${expense.teamColor} px-3 py-1 rounded-full text-xs`}
                  >
                    {expense.team}
                  </span>
                </td>
                <td className="py-3 px-2">{expense.amount}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentExpenses;
