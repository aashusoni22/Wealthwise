// components/goals/GoalCardDropdown.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Share2 } from "lucide-react";

const GoalCardDropdown = ({ isVisible, onEdit, onDelete }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden z-50"
      >
        <button
          onClick={onEdit}
          className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-700/50 text-slate-200 flex items-center gap-2 transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Edit Goal
        </button>

        <button
          onClick={onDelete}
          className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-700/50 text-red-400 flex items-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Goal
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default GoalCardDropdown;
