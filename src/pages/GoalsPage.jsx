import React from "react";
import {
  FiPlus,
  FiTarget,
  FiDollarSign,
  FiBook,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";

const goals = [
  {
    id: 1,
    title: "Save for Down Payment",
    category: "Financial",
    target: 50000,
    current: 35000,
    deadline: "December 2024",
    color: "blue",
    icon: FiDollarSign,
  },
  {
    id: 2,
    title: "Read 24 Books",
    category: "Personal",
    target: 24,
    current: 16,
    deadline: "December 2024",
    color: "purple",
    icon: FiBook,
  },
  {
    id: 3,
    title: "Launch Online Course",
    category: "Career",
    target: 100,
    current: 65,
    deadline: "September 2024",
    color: "green",
    icon: FiAward,
  },
  {
    id: 4,
    title: "Grow Investment Portfolio",
    category: "Financial",
    target: 100000,
    current: 78000,
    deadline: "December 2024",
    color: "orange",
    icon: FiTrendingUp,
  },
];

const GoalCard = ({ goal }) => {
  const progress = (goal.current / goal.target) * 100;
  const IconComponent = goal.icon;

  return (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-full bg-${goal.color}-500/20 flex items-center justify-center`}
        >
          <IconComponent className={`text-${goal.color}-500 text-2xl`} />
        </div>
        <span
          className={`text-${goal.color}-500 text-sm font-medium px-3 py-1 bg-${goal.color}-500/20 rounded-full`}
        >
          {goal.category}
        </span>
      </div>

      <h3 className="text-xl font-semibold mb-2">{goal.title}</h3>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-${goal.color}-500 rounded-full`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between mt-auto text-sm">
        <div>
          <p className="text-gray-400">Current</p>
          <p className="text-white font-medium">
            {typeof goal.current === "number" && goal.current >= 1000
              ? `€${(goal.current / 1000).toFixed(1)}k`
              : goal.current}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-400">Target</p>
          <p className="text-white font-medium">
            {typeof goal.target === "number" && goal.target >= 1000
              ? `€${(goal.target / 1000).toFixed(1)}k`
              : goal.target}
          </p>
        </div>
      </div>

      <p className="text-gray-400 text-sm mt-4">Deadline: {goal.deadline}</p>
    </div>
  );
};

const GoalsPage = () => {
  return (
    <div className="bg-black min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Goals Dashboard</h1>
            <p className="text-gray-400">
              Track your progress across different areas of your life
            </p>
          </div>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-600 transition-colors">
            <FiPlus className="mr-2" />
            Add New Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
