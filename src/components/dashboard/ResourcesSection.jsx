import React, { useState } from "react";
import {
  Calculator,
  PiggyBank,
  Target,
  Calendar,
  DollarSign,
  X,
  TrendingUp,
  Clock,
  ChevronRight,
  BadgeDollarSign,
} from "lucide-react";
import BudgetCalculator from "./calculators/BudgetCalculator";
import CompoundCalculator from "./calculators/CompoundCalculator.jsx";
import LoanCalculator from "./calculators/LoanCalculator";
import RetirementCalculator from "./calculators/RetirementCalculator";
import TaxCalculator from "./calculators/TaxCalculator";

// ResourceLink Component
const ResourceLink = ({
  icon: Icon,
  title,
  description,
  bgColor,
  textColor,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 p-4 w-full rounded-xl hover:bg-slate-700/30 transition-colors group"
  >
    <div className={`p-2.5 rounded-xl ${bgColor}`}>
      <Icon className={`w-5 h-5 ${textColor}`} />
    </div>
    <div className="flex-1 text-left">
      <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">
        {title}
      </h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
  </button>
);

// Updated resources with practical calculators
const resources = [
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

// Main ResourceModal Component - Update this part in your ResourcesSection.jsx
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

  const modalTitle = resources.find((r) => r.modalType === type)?.title || "";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-3xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800 rounded-t-2xl">
          <h3 className="text-xl font-semibold text-white">{modalTitle}</h3>
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

// Main Resources Section Component
const ResourcesSection = () => {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur rounded-2xl border border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-medium text-white">Financial Tools</h3>
      </div>
      <div className="space-y-2">
        {resources.map((resource, index) => (
          <ResourceLink
            key={index}
            {...resource}
            onClick={() => setActiveModal(resource.modalType)}
          />
        ))}
      </div>
      <ResourceModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        type={activeModal}
      />
    </div>
  );
};

export default ResourcesSection;
