import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMoneyBills, FaPiggyBank } from "react-icons/fa6";
import { FaMoneyCheckAlt } from "react-icons/fa";

const QuickAccess = () => {
  const quickActions = [
    {
      title: "New Expense",
      description: "Record a new expense",
      icon: FaMoneyBills,
      bgColor: "bg-gradient-to-br from-red-600 to-red-700",
    },
    {
      title: "New Income",
      description: "Add a new income",
      icon: FaMoneyCheckAlt,
      bgColor: "bg-gradient-to-br from-emerald-600 to-emerald-700",
    },
    {
      title: "New Goal",
      description: "Set a financial goal",
      icon: FaPiggyBank,
      bgColor: "bg-gradient-to-br from-purple-600 to-purple-700",
    },
  ];

  return (
    <div className="bg-gray-900/50 rounded-2xl backdrop-blur-sm p-5">
      <h2 className="text-pink-500 font-semibold text-lg mb-4">Quick Access</h2>
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-xl p-4 cursor-pointer hover:bg-gray-800/80 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className={`${action.bgColor} p-3 rounded-lg`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;
