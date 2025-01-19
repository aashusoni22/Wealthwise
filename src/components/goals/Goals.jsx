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
import appService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import GoalModal from "./GoalModal";

const GoalCard = ({ goal }) => {
  const progress = (goal.current / goal.target) * 100;
  const IconComponent = goal.icon;
  const daysLeft = Math.ceil(
    (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-surface-800/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl hover:bg-slate-800/50 transition-all group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-3 text-${goal.color}-500`}>
            <div
              className={`w-10 h-10 rounded-xl bg-${goal.color}-500/20 flex items-center justify-center`}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 bg-${goal.color}-500/20 rounded-lg`}
            >
              {goal.category}
            </span>
          </div>
          <button className="p-2 hover:bg-slate-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Title and Progress */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-100">{goal.title}</h3>

          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Progress</p>
                <div className="text-2xl font-bold text-slate-100">
                  {typeof goal.current === "number" && goal.current >= 1000
                    ? `${(goal.current / 1000).toFixed(1)}k`
                    : goal.current}
                  <span className="text-sm text-slate-400 ml-1">
                    /{" "}
                    {typeof goal.target === "number" && goal.target >= 1000
                      ? `${(goal.target / 1000).toFixed(1)}k`
                      : goal.target}
                  </span>
                </div>
              </div>
              <div className={`text-lg font-semibold text-${goal.color}-500`}>
                {Math.round(progress)}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full bg-${goal.color}-500 rounded-full transition-all`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <CalendarRange className="w-4 h-4" />
          <span>{daysLeft} days left</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <ChevronUp className={`w-4 h-4 text-${goal.color}-500`} />
          <span className={`text-${goal.color}-500`}>+2.5%</span>
          <span className="text-slate-400">this week</span>
        </div>
      </div>
    </div>
  );
};

const Goals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState([]);

  const getGoals = async () => {
    try {
      const userId = await authService.getCurrentUserId();
      if (!userId) return;
      const response = await appService.getAllGoals(userId);
      const fetchedGoals = response.documents || [];
      setGoals(fetchedGoals);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGoals();
  }, []);

  const goalsTemp = [
    {
      id: 1,
      title: "Save for Down Payment",
      category: "Financial",
      target: 50000,
      current: 35000,
      deadline: "December 2024",
      color: "blue",
      icon: DollarSign,
    },
    {
      id: 2,
      title: "Read 24 Books",
      category: "Personal",
      target: 24,
      current: 16,
      deadline: "December 2024",
      color: "purple",
      icon: BookA,
    },
    {
      id: 3,
      title: "Launch Online Course",
      category: "Career",
      target: 100,
      current: 65,
      deadline: "September 2024",
      color: "green",
      icon: AwardIcon,
    },
    {
      id: 4,
      title: "Grow Investment Portfolio",
      category: "Financial",
      target: 100000,
      current: 78000,
      deadline: "December 2024",
      color: "orange",
      icon: TrendingUp,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto lg:py-6 space-y-6">
      {/* Goals Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Goals Overview
          </h1>
          <p className="text-slate-400 mt-1">
            Track and manage your objectives
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-800/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Goals</p>
              <p className="text-2xl font-semibold mt-1">{goals.length}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-xl">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm text-emerald-500">
            <ChevronUp className="w-4 h-4" />
            <span>3 new this month</span>
          </div>
        </div>

        <div className="bg-surface-800/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">In Progress</p>
              <p className="text-2xl font-semibold mt-1">
                {goals.filter((g) => (g.current / g.target) * 100 < 100).length}
              </p>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm text-emerald-500">
            <ChevronUp className="w-4 h-4" />
            <span>On track</span>
          </div>
        </div>

        <div className="bg-surface-800/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Completed</p>
              <p className="text-2xl font-semibold mt-1">
                {
                  goals.filter((g) => (g.current / g.target) * 100 >= 100)
                    .length
                }
              </p>
            </div>
            <div className="bg-violet-500/20 p-3 rounded-xl">
              <Award className="w-6 h-6 text-violet-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm text-violet-500">
            <Award className="w-4 h-4" />
            <span>Great progress!</span>
          </div>
        </div>
      </div>

      {isModalOpen && <GoalModal onClose={() => setIsModalOpen(false)} />}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {goalsTemp.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
};

export default Goals;
