import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

const CategoryOverview = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const categories = [
    {
      name: "Marketing",
      amount: 270.0,
      percentage: 27,
      trend: "up",
      trendValue: "+12%",
      color: "#FF6B6B",
    },
    {
      name: "Sales",
      amount: 75.5,
      percentage: 8,
      trend: "down",
      trendValue: "-5%",
      color: "#4ECDC4",
    },
    {
      name: "Operations",
      amount: 450.25,
      percentage: 45,
      trend: "up",
      trendValue: "+18%",
      color: "#45B7D1",
    },
    {
      name: "Finance",
      amount: 275.75,
      percentage: 27,
      trend: "up",
      trendValue: "+7%",
      color: "#FFBE0B",
    },
  ];

  return (
    <div className="bg-gray-900/50 rounded-2xl backdrop-blur-sm p-5">
      <h2 className="text-pink-500 font-semibold text-lg mb-4">
        Category Overview
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-xl p-4 cursor-pointer hover:bg-gray-800/80"
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-white font-medium">{category.name}</h3>
                <p className="text-gray-400 text-sm">
                  {category.percentage}% of total
                </p>
              </div>
              {category.trend === "up" ? (
                <span className="text-green-400 text-sm">
                  {category.trendValue}
                </span>
              ) : (
                <span className="text-red-400 text-sm">
                  {category.trendValue}
                </span>
              )}
            </div>
            <div className="flex items-center text-xl font-semibold text-white">
              <DollarSign className="h-5 w-5 text-gray-400" />
              {category.amount.toFixed(2)}
            </div>
            <div className="mt-2 w-full bg-gray-700/50 rounded-full h-1">
              <motion.div
                className="bg-blue-500 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${category.percentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryOverview;
