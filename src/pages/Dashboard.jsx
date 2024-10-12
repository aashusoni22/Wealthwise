import React from "react";
import { useSelector } from "react-redux";

import {
  CategoryOverview,
  RecentExpenses,
  GoalProgress,
  QuickAccess,
  Summary,
  MonthlyReport,
} from "../components";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-950 py-6">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="space-y-6">
          {/* Quick Access and Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <QuickAccess />
            </div>
            <div className="lg:col-span-3">
              <Summary />
            </div>
          </div>

          {/* Monthly Report and Category Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <MonthlyReport />
            </div>
            <div className="lg:col-span-1">
              <CategoryOverview />
            </div>
          </div>

          {/* Recent Expenses and Goals Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <RecentExpenses />
            </div>
            <div className="lg:col-span-1">
              <GoalProgress />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
