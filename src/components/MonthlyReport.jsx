import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const MonthlyReport = () => {
  const data = [
    { name: "Jan", value: 2000, fill: "#FFC300" },
    { name: "Feb", value: 1200, fill: "#FFB6C1" },
    { name: "Mar", value: 500, fill: "#00FFFF" },
    { name: "Apr", value: 700, fill: "#0088FE" },
    { name: "May", value: 1900, fill: "#ADFF2F" },
    { name: "Jun", value: 800, fill: "#FFE4C4" },
  ];

  return (
    <div className="bg-gray-900/50 rounded-2xl backdrop-blur-sm p-5">
      <h2 className="text-pink-500 font-semibold text-lg mb-2">
        Monthly Report
      </h2>
      <p className="text-gray-400 text-sm mb-4">Team Spending Trend</p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={30}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#333"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#666"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#666"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyReport;
