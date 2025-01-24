import React from "react";
import { goalCategories } from "../../utils/goalConfig";

const GoalCategoryBadge = ({ category }) => {
  const categoryConfig = goalCategories[category] || goalCategories.Other;
  const Icon = categoryConfig.icon;

  return (
    <div className="flex items-center gap-2">
      <div className={`p-2 rounded-lg ${categoryConfig.bgColor}`}>
        <Icon className={`w-4 h-4 ${categoryConfig.textColor}`} />
      </div>
      <span className={`text-sm font-medium ${categoryConfig.textColor}`}>
        {category}
      </span>
    </div>
  );
};

export default GoalCategoryBadge;
