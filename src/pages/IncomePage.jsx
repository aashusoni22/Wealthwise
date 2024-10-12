import React from "react";
import { Plus, DollarSign, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const incomeData = [
  {
    id: 1,
    date: "11/11/2022",
    details: "Client Project A",
    source: "Tech Corp",
    amount: 3500.0,
    report: "November_2022",
    status: "Received",
  },
  {
    id: 2,
    date: "11/11/2022",
    details: "Consulting Services",
    source: "StartUp Inc",
    amount: 1800.0,
    report: "November_2022",
    status: "Pending",
  },
  {
    id: 3,
    date: "11/11/2022",
    details: "Workshop Session",
    source: "EduCenter",
    amount: 750.0,
    report: "November_2022",
    status: "Received",
  },
  {
    id: 4,
    date: "11/11/2022",
    details: "Freelance Work",
    source: "DesignHub",
    amount: 2200.25,
    report: "November_2022",
    status: "Pending",
  },
];

const IncomePage = () => {
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const pendingIncome = incomeData
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + item.amount, 0);
  const receivedIncome = incomeData
    .filter((item) => item.status === "Received")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Income Dashboard
          </h1>
          <div className="flex gap-4">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Income
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{totalIncome.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Received</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{receivedIncome.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{pendingIncome.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 font-medium">Details</th>
                    <th className="text-left py-4 font-medium">Source</th>
                    <th className="text-left py-4 font-medium">Amount</th>
                    <th className="text-left py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeData.map((income) => (
                    <tr key={income.id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="font-medium">{income.details}</div>
                            <div className="text-sm text-gray-500">
                              {income.date}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">{income.source}</td>
                      <td className="py-4">€{income.amount.toFixed(2)}</td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            income.status === "Received"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {income.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncomePage;
