import React, { useState } from "react";
import {
  Wallet,
  TrendingUp,
  Receipt,
  Target,
  BarChart3,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  PiggyBank,
  BadgeDollarSign,
  LayoutDashboard,
  BellRing,
  HelpCircle,
  PlayCircle,
  Rocket,
  Calculator,
  Calendar,
  DollarSign,
  X,
  BookOpen,
} from "lucide-react";
import Toast, { showToast } from "../Toast";
import QuickTour from "../QuickTour";
import BudgetCalculator from "./calculators/BudgetCalculator";
import CompoundCalculator from "./calculators/CompoundCalculator";
import LoanCalculator from "./calculators/LoanCalculator";
import RetirementCalculator from "./calculators/RetirementCalculator";
import TaxCalculator from "./calculators/TaxCalculator";

const calculatorResources = [
  {
    icon: Calculator,
    title: "Compound Interest",
    description: "Calculate the growth of your investments",
    modalType: "compoundCalculator",
    bgColor: "bg-primary-500/20",
    textColor: "text-primary-500",
  },
  {
    icon: PiggyBank,
    title: "Loan Calculator",
    description: "Calculate EMI and total interest",
    modalType: "loanCalculator",
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-500",
  },
  {
    icon: Target,
    title: "Retirement Planner",
    description: "Plan your retirement savings",
    modalType: "retirementCalculator",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-500",
  },
  {
    icon: Calendar,
    title: "50/30/20 Budget",
    description: "Calculate ideal budget allocation",
    modalType: "budgetCalculator",
    bgColor: "bg-rose-500/20",
    textColor: "text-rose-500",
  },
  {
    icon: BadgeDollarSign,
    title: "Tax Calculator",
    description: "Estimate your income tax and take-home pay",
    modalType: "taxCalculator",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-500",
  },
];

const ResourceModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const getModalContent = () => {
    switch (type) {
      case "compoundCalculator":
        return <CompoundCalculator />;
      case "loanCalculator":
        return <LoanCalculator />;
      case "retirementCalculator":
        return <RetirementCalculator />;
      case "budgetCalculator":
        return <BudgetCalculator />;
      case "taxCalculator":
        return <TaxCalculator />;
      default:
        return <div className="text-slate-400">Calculator coming soon...</div>;
    }
  };

  const modalTitle =
    calculatorResources.find((r) => r.modalType === type)?.title || "";

  const modalDescription =
    calculatorResources.find((r) => r.modalType === type)?.description || "";

  return (
    <div className="fixed -top-8 inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative bg-slate-800/40 backdrop-blur border border-slate-700 rounded-2xl w-full max-w-3xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900/40 backdrop-blur rounded-t-2xl">
          <span className="space-y-1">
            <h3 className="text-xl font-semibold text-white">{modalTitle}</h3>
            <p className="text-sm text-slate-400">{modalDescription}</p>
          </span>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {getModalContent()}
        </div>
      </div>
    </div>
  );
};

const EmptyDashboard = ({ userName = "", onNavigate }) => {
  const [showTour, setShowTour] = useState(false);
  const [activeCalculator, setActiveCalculator] = useState(null);

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="min-h-[90vh]  space-y-8 bg-slate-900">
      <Toast />

      <ResourceModal
        isOpen={!!activeCalculator}
        onClose={() => setActiveCalculator(null)}
        type={activeCalculator}
      />

      {/* Welcome Banner */}
      <div className="relative py-3 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden"></div>
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300">
                Get Started
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Welcome to Wealth<span className="text-primary-500">Wise</span>
              {userName ? `, ${userName}` : ""}
            </h1>
            <p className="text-slate-300">
              Start your journey to financial success with these simple steps.
            </p>
          </div>
          <button
            onClick={() => setShowTour(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors group"
          >
            <Rocket className="w-5 h-5" />
            <span>Quick Tour</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Action Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            <ActionCard
              title="Add Income"
              description="Track your earnings and income sources"
              icon={BadgeDollarSign}
              iconBg="bg-gradient-to-br from-emerald-500 to-teal-500"
              onClick={() => handleNavigation("/income")}
            />
            <ActionCard
              title="Track Expenses"
              description="Monitor and categorize your spending"
              icon={Receipt}
              iconBg="bg-gradient-to-br from-rose-500 to-pink-500"
              onClick={() => handleNavigation("/expenses")}
            />
          </div>

          {/* Setup Progress */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700">
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-medium text-white">
                    Setup Guide
                  </h3>
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-700/50">
              {setupSteps.map((step, index) => (
                <SetupStep
                  key={index}
                  {...step}
                  onClick={() => handleNavigation(step.path)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Side Content */}
        <div className="space-y-6">
          {/* Quick Tips */}
          {/* <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <BellRing className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-medium text-white">Pro Tips</h3>
            </div>
            <div className="space-y-5">
              {tips.map((tip, index) => (
                <Tip key={index} {...tip} />
              ))}
            </div>
          </div> */}

          {/* Resources */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-medium text-white">
                Financial Tools
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {calculatorResources.map((calculator, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCalculator(calculator.modalType)}
                  className="flex items-center gap-4 p-2 w-full rounded-xl hover:bg-slate-700/30 transition-colors group"
                >
                  <div className={`p-2.5 rounded-xl ${calculator.bgColor}`}>
                    <calculator.icon
                      className={`w-5 h-5 ${calculator.textColor}`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-white">
                      {calculator.title}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {calculator.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <QuickTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={() => {
          setShowTour(false);
          showToast("Tour completed!", "success");
          console.log("Tour completed!");
        }}
      />
    </div>
  );
};

// Sub-components
const ActionCard = ({ title, description, icon: Icon, iconBg, onClick }) => (
  <button
    onClick={onClick}
    className="group relative bg-slate-800/50 hover:bg-slate-800 backdrop-blur rounded-2xl p-6 border border-slate-700 transition-all duration-300 w-full"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transform group-hover:translate-x-1 transition-all" />
    </div>
  </button>
);

const SetupStep = ({
  title,
  description,
  icon: Icon,
  iconColor,
  bgColor,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="w-full p-4 hover:bg-slate-700/30 transition-colors flex items-center gap-4"
  >
    <div className={`p-2 rounded-xl ${bgColor}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div className="flex-1 text-left">
      <h4 className="font-medium text-white">{title}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-400" />
  </button>
);

const Tip = ({ title, description }) => (
  <div className="flex gap-4">
    <div className="w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
    <div>
      <h4 className="font-medium text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  </div>
);

// Data
const setupSteps = [
  {
    title: "Add Monthly Income",
    description: "Set up your income sources",
    icon: Wallet,
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    path: "/income",
  },
  {
    title: "Create Budget",
    description: "Plan your monthly spending",
    icon: BarChart3,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    path: "/budgets",
  },
  {
    title: "Set Goals",
    description: "Define your financial targets",
    icon: Target,
    iconColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
    path: "/goals",
  },
  {
    title: "Emergency Fund",
    description: "Start your safety net",
    icon: PiggyBank,
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    path: "/goals",
  },
];

const tips = [
  {
    title: "Daily Updates",
    description: "Update your transactions daily for better tracking",
  },
  {
    title: "Categorize Expenses",
    description: "Use categories to understand spending patterns",
  },
  {
    title: "Review Weekly",
    description: "Take time each week to review your finances",
  },
];

export default EmptyDashboard;
