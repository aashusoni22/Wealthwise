import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  X,
  PieChart,
  Wallet,
  Target,
  Receipt,
  Bell,
  ArrowRight,
  HelpCircle,
  Settings,
  BadgeDollarSign,
} from "lucide-react";

const tourSteps = [
  {
    title: "Welcome to Wealthwise",
    description:
      "Let's take a quick tour of your new financial dashboard and get you started on your journey to financial success.",
    icon: Wallet,
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-500",
    placement: "center",
  },
  {
    title: "Track Your Expenses",
    description:
      "Monitor your spending by categories, set budgets, and stay on top of your daily transactions.",
    icon: Receipt,
    bgColor: "bg-rose-500/20",
    textColor: "text-rose-500",
    placement: "right",
  },
  {
    title: "Manage Income",
    description:
      "Record and categorize your income sources to understand your cash flow better.",
    icon: BadgeDollarSign,
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-500",
    placement: "left",
  },
  {
    title: "Set Financial Goals",
    description:
      "Create and track your financial goals, whether it's saving for a vacation or building an emergency fund.",
    icon: Target,
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-500",
    placement: "bottom",
  },
  {
    title: "View Analytics",
    description:
      "Get insights into your spending patterns and track your progress with detailed charts and reports.",
    icon: PieChart,
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-500",
    placement: "top",
  },
  {
    title: "Stay Updated",
    description:
      "Enable notifications to get alerts for bill payments, budget limits, and goal achievements.",
    icon: Bell,
    bgColor: "bg-indigo-500/20",
    textColor: "text-indigo-500",
    placement: "right",
  },
];

const QuickTour = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep === tourSteps.length - 1) {
        onComplete?.();
        onClose();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevious = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setIsAnimating(false);
    }, 300);
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 -top-8 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <div className="text-sm text-slate-300">
          Step {currentStep + 1} of {tourSteps.length}
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div
        className={`w-full max-w-2xl bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden 
          transform transition-all duration-300 ${
            isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
      >
        {/* Progress Bar */}
        <div className="h-1 bg-slate-700/50">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${((currentStep + 1) / tourSteps.length) * 100}%`,
            }}
          />
        </div>

        <div className="p-8">
          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-xl ${currentTourStep.bgColor}`}>
              {React.createElement(currentTourStep.icon, {
                className: `w-6 h-6 ${currentTourStep.textColor}`,
              })}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {currentTourStep.title}
              </h3>
              <p className="text-slate-300">{currentTourStep.description}</p>
            </div>
          </div>

          {/* Pro Tips */}
          {currentStep > 0 && (
            <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Pro Tip</span>
              </div>
              <p className="text-sm text-slate-400">{getProTip(currentStep)}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            <div>
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Skip Tour
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Help Button */}
      <button
        onClick={onClose}
        className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 
          text-slate-300 rounded-lg transition-colors border border-slate-700"
      >
        <Settings className="w-4 h-4" />
        <span>Customize Later</span>
      </button>
    </div>
  );
};

// Helper function to get pro tips based on the current step
function getProTip(step) {
  const tips = [
    "Use categories to organize your expenses and get better insights into your spending habits.",
    "Set up recurring income entries for your salary and other regular payments to save time.",
    "Break down large financial goals into smaller monthly targets to make them more achievable.",
    "Check your analytics weekly to spot trends and adjust your spending habits accordingly.",
    "Enable browser notifications to stay on top of your financial tasks and deadlines.",
  ];
  return tips[step - 1] || tips[0];
}

export default QuickTour;
