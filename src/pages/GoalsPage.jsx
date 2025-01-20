import React, { useEffect, useState } from "react";
import {
  Target,
  Plus,
  TrendingUp,
  Book,
  Award,
  DollarSign,
  MoreVertical,
  ChevronUp,
  CalendarRange,
  BookA,
  AwardIcon,
  TrendingDown,
  Loader2,
} from "lucide-react";
import Goals from "../components/goals/Goals";

const GoalsPage = () => {
  return (
    <div className="min-h-[90vh] p-6 text-slate-100">
      <Goals />
    </div>
  );
};

export default GoalsPage;
