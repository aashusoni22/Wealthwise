import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export const StatCard = ({ title, value, change, icon: Icon }) => {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl bg-surface-800/20 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10">
          <Icon className="h-6 w-6 text-primary-500" />
        </div>
        <span
          className={`flex items-center text-sm font-medium ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          <TrendIcon className="h-4 w-4" />
          {Math.abs(change)}%
        </span>
      </div>
      <h3 className="mt-4 text-lg font-medium text-surface-200">{title}</h3>
      <p className="mt-1 text-2xl font-semibold text-surface-50">
        ${value.toLocaleString()}
      </p>
    </motion.div>
  );
};
