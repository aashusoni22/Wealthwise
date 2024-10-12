import React from "react";
import { PiPiggyBank } from "react-icons/pi";
import { HiDotsHorizontal } from "react-icons/hi";
import { motion } from "framer-motion";

const GoalProgress = () => {
  const goalsData = [
    { goalName: "New Car", target: 20000, saved: 17563 },
    { goalName: "New Home", target: 350000, saved: 15759 },
    { goalName: "Emergency Fund", target: 5000, saved: 3500 },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-7 shadow-lg w-full h-auto">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl font-semibold text-pink-500">Goal Overview</h2>
        <button className="text-sm text-pink-500 hover:underline">
          + Add Goal
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goalsData.map((goal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 hover:bg-gray-700 duration-300 transition-all ease-in-out cursor-pointer p-5 flex flex-col rounded-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <PiPiggyBank className="bg-teal-500 text-3xl h-10 rounded-lg w-10 p-2" />
                <div>
                  <h3 className="text-lg font-medium text-gray-200">
                    {goal.goalName}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Target: ${goal.target.toLocaleString()}
                  </p>
                </div>
              </div>
              <HiDotsHorizontal className="text-gray-400 cursor-pointer hover:text-gray-200 transition-colors" />
            </div>
            <div className="flex justify-between text-gray-300 text-sm mb-2">
              <span>Saved:</span>
              <span>${goal.saved.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(goal.saved / goal.target) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="bg-pink-500 h-1 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-end py-4">
        <button className="text-white duration-300 transition-all ease-in-out hover:text-pink-500 rounded-lg py-2">
          See All Goals
        </button>
      </div>
    </div>
  );
};

export default GoalProgress;
