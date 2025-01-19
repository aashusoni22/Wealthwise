import React from "react";
import { LineChart } from "lucide-react";

const Logo = ({ textsize = "text-2xl" }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center w-8 h-8">
        <div className="absolute inset-0 bg-primary-500/20 rounded-lg blur" />
        <LineChart className="w-6 h-6 text-primary-500" />
      </div>
      <div className={`${textsize} font-bold flex items-baseline gap-0.5`}>
        <span className="text-slate-100">Wealth</span>
        <span className="text-primary-500">wise</span>
      </div>
    </div>
  );
};

export default Logo;
