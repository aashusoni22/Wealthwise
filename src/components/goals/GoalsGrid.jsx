import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import GoalCard from "./GoalCard";

const GoalsGrid = ({ goals, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {goals.map((goal) => (
          <motion.div
            key={goal.$id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <GoalCard goal={goal} onEdit={onEdit} onDelete={onDelete} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GoalsGrid;
