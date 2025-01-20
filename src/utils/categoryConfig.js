import {
  ShoppingBag,
  Coffee,
  Home,
  ShoppingCart,
  Bus,
  Film,
  Wallet,
  Stethoscope,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";

export const categoryConfig = {
  Shopping: {
    icon: ShoppingBag,
    bgColor: "bg-indigo-500/20",
    textColor: "text-indigo-500",
    badgeBg: "bg-indigo-500/10",
  },
  "Food & Drink": {
    icon: Coffee,
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-500",
    badgeBg: "bg-amber-500/10",
  },
  Groceries: {
    icon: ShoppingCart,
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-500",
    badgeBg: "bg-emerald-500/10",
  },
  Transport: {
    icon: Bus,
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-500",
    badgeBg: "bg-blue-500/10",
  },
  Housing: {
    icon: Home,
    bgColor: "bg-violet-500/20",
    textColor: "text-violet-500",
    badgeBg: "bg-violet-500/10",
  },
  Entertainment: {
    icon: Film,
    bgColor: "bg-pink-500/20",
    textColor: "text-pink-500",
    badgeBg: "bg-pink-500/10",
  },
  Utilities: {
    icon: Wallet,
    bgColor: "bg-orange-500/20",
    textColor: "text-orange-500",
    badgeBg: "bg-orange-500/10",
  },
  Medical: {
    icon: Stethoscope,
    bgColor: "bg-red-500/20",
    textColor: "text-red-500",
    badgeBg: "bg-red-500/10",
  },
  "Personal Care": {
    icon: Sparkles,
    bgColor: "bg-teal-500/20",
    textColor: "text-teal-500",
    badgeBg: "bg-teal-500/10",
  },
  Other: {
    icon: MoreHorizontal,
    bgColor: "bg-slate-500/20",
    textColor: "text-slate-500",
    badgeBg: "bg-slate-500/10",
  },
};
