import React, { useState, useEffect } from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import {
  HomeIcon,
  RefreshCcw,
  ArrowLeft,
  HelpCircle,
  GithubIcon,
  TwitterIcon,
  Linkedin,
} from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const is404 = error?.status === 404;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div
        className={`max-w-4xl w-full transform transition-all duration-700 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Main Content Container */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700/50">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Error Details */}
            <div className="space-y-6">
              {/* Error Status */}
              <div className="space-y-2">
                <div className="relative inline-block">
                  <span className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                    {is404 ? "404" : "500"}
                  </span>
                  <div className="absolute -top-3 -right-3 w-6 h-6">
                    <div className="animate-ping absolute w-full h-full rounded-full bg-blue-400 opacity-75"></div>
                    <div className="relative rounded-full w-full h-full bg-blue-500"></div>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {is404 ? "Page not found" : "Something went wrong"}
                </h1>
              </div>

              {/* Error Message */}
              <p className="text-slate-400 text-lg leading-relaxed">
                {is404
                  ? "The page you're looking for may have been moved, deleted, or possibly never existed."
                  : "We're experiencing some technical difficulties. Our team has been notified and is working on a fix."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="group relative px-6 py-3 bg-primary-500 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                >
                  <span className="flex items-center gap-2">
                    <HomeIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Return Home
                  </span>
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="group px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  Go Back
                </button>
                {!is404 && (
                  <button
                    onClick={() => window.location.reload()}
                    className="group px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-all duration-200 flex items-center gap-2"
                  >
                    <RefreshCcw className="w-5 h-5 transition-transform group-hover:rotate-180" />
                    Try Again
                  </button>
                )}
              </div>

              {/* Support Links */}
              <div className="pt-6 border-t border-slate-700/50">
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <a
                    href="https://github.com/aashusoni22"
                    target="_blank"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <GithubIcon className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/aashutosh-soni-225a12177/"
                    target="_blank"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="hidden lg:flex items-center justify-center">
              <ErrorIllustration />
            </div>
          </div>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && error && (
          <div className="mt-8 p-6 bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50">
            <h3 className="text-slate-200 font-semibold mb-2">Error Details</h3>
            <pre className="text-sm font-mono text-slate-400 overflow-x-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom Error Illustration Component
const ErrorIllustration = () => (
  <div className="relative w-full max-w-sm">
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full fill-current text-blue-500/10"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
        fill="url(#gradient)"
        className="animate-pulse"
      />
      <path
        d="M 100, 100 m -50, 0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0"
        fill="currentColor"
        className="animate-spin-slow"
      />
    </svg>

    {/* Floating Elements */}
    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500 rounded-full animate-float-slow" />
    <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-purple-500 rounded-full animate-float-delay" />
    <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
  </div>
);

export default ErrorPage;
