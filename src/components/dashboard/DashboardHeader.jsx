import { Plus, Search } from "lucide-react";
import React from "react";

const DashboardHeader = ({ onAddTransaction }) => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-bold text-white">Financial Overview</h1>
      <p className="text-slate-400 mt-1">Track your spending and savings</p>
    </div>
  </div>
);

export default DashboardHeader;
