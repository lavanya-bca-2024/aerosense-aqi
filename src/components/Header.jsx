import React from "react";
import { Wind, Key, ShieldCheck, Sparkles, Activity } from "lucide-react";
import { getApiKeySource, hasGeminiApiKey } from "../services/gemini";

export default function Header({ onOpenApiKeyModal }) {
  const isKeyReady = hasGeminiApiKey();
  const source = getApiKeySource();

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
            <Wind className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                AeroSense
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                India Urban AQI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Live Air Quality Intelligence & Gemini AI Health Advisor
            </p>
          </div>
        </div>

        {/* Status Indicators & Settings Button */}
        <div className="flex items-center gap-2.5">
          {/* Live Data Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Open-Meteo Live API
          </div>

          {/* Gemini AI Status / Settings Trigger */}
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 shadow-sm ${
              isKeyReady
                ? "bg-slate-900 border-slate-700 hover:border-cyan-500/50 text-slate-200"
                : "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 animate-pulse"
            }`}
            title="Configure Gemini API Key"
          >
            <Key className={`w-3.5 h-3.5 ${isKeyReady ? "text-cyan-400" : "text-amber-400"}`} />
            <span className="hidden sm:inline">
              {isKeyReady ? (source === "env" ? "Gemini (.env)" : "Gemini (Custom)") : "Add Gemini Key"}
            </span>
            <span className="sm:hidden">API Key</span>
            {isKeyReady && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
