import React from "react";
import { motion } from "framer-motion";
import { FaHandHoldingUsd } from "react-icons/fa";
import { BiSolidShoppingBags } from "react-icons/bi";
import { GiTakeMyMoney } from "react-icons/gi";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const Summary = () => {
  const summaryItems = [
    {
      title: "Total Income",
      amount: "$5,500",
      trend: "up",
      bgColor: "bg-gradient-to-br from-teal-600 to-teal-700",
    },
    {
      title: "Total Expense",
      amount: "$7,500",
      trend: "down",
      bgColor: "bg-gradient-to-br from-red-600 to-red-700",
    },
    {
      title: "Net Income",
      amount: "$3,500",
      trend: "up",
      bgColor: "bg-gradient-to-br from-yellow-600 to-yellow-700",
    },
  ];

  return (
    <div className="bg-gray-900/50 rounded-2xl backdrop-blur-sm p-5">
      <h2 className="text-pink-500 font-semibold text-lg mb-4">Summary</h2>
      <div className="grid grid-cols-3 gap-4">
        {summaryItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400">{item.title}</h3>
              {item.trend === "up" ? (
                <ArrowUpRight className="text-green-400 h-4 w-4" />
              ) : (
                <ArrowDownRight className="text-red-400 h-4 w-4" />
              )}
            </div>
            <div className="text-xl font-semibold text-white">
              {item.amount}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
