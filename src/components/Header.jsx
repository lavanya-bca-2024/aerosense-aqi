import React from "react";
import { Wind, Key, Sparkles, CheckCircle2 } from "lucide-react";
import { getApiKeySource, hasGeminiApiKey } from "../services/gemini";

export default function Header({ onOpenApiKeyModal }) {
  const isKeyReady = hasGeminiApiKey();
  const source = getApiKeySource();

  return (
    <header className="border-b border-emerald-100/90 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 text-white">
            <svg
              className="w-5 h-5 stroke-[2.5]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-forest-900 font-display">
                AeroSense
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Indian Urban AQI
              </span>
            </div>
            <p className="text-[11px] text-forest-600 font-medium hidden sm:block">
              Fresh Air Quality Intelligence & Gemini AI Advisor
            </p>
          </div>
        </div>

        {/* Status Indicators & Settings Button */}
        <div className="flex items-center gap-2.5">
          {/* Live Data Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Open-Meteo Live API
          </div>

          {/* Gemini AI Status / Settings Trigger */}
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 shadow-xs ${
              isKeyReady
                ? "bg-white border-emerald-200 hover:border-emerald-400 text-forest-800 hover:bg-emerald-50/50"
                : "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 animate-pulse"
            }`}
            title="Configure Gemini API Key"
          >
            <Key className={`w-3.5 h-3.5 ${isKeyReady ? "text-emerald-600" : "text-amber-600"}`} />
            <span className="hidden sm:inline">
              {isKeyReady ? (source === "env" ? "Gemini (.env)" : "Gemini (Custom)") : "Add Gemini Key"}
            </span>
            <span className="sm:hidden">API Key</span>
            {isKeyReady && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
