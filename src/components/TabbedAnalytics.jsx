import React, { useState } from "react";
import { TrendingUp, Layers, Wind, Sparkles } from "lucide-react";
import TrendChart from "./TrendChart";
import PollutantGrid from "./PollutantGrid";

export default function TabbedAnalytics({ currentData }) {
  const [activeTab, setActiveTab] = useState("trends");

  return (
    <div className="bg-white/95 backdrop-blur-md border border-emerald-200/80 rounded-3xl p-5 sm:p-6 shadow-lg space-y-5">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-50">
        <div>
          <h2 className="text-base font-bold text-forest-900 flex items-center gap-2 font-display">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Atmospheric Analytics & Pollutant Deep-Dive
          </h2>
          <p className="text-xs text-forest-500 mt-0.5">
            Switch between 24-hour diurnal progression and the 6-pollutant ambient breakdown
          </p>
        </div>

        {/* Clean Pill Toggle */}
        <div className="inline-flex p-1 rounded-2xl bg-sage-50 border border-emerald-100 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("trends")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "trends"
                ? "bg-white text-emerald-800 shadow-xs border border-emerald-200"
                : "text-forest-600 hover:text-emerald-800"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>24-Hour Trends</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pollutants")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "pollutants"
                ? "bg-white text-emerald-800 shadow-xs border border-emerald-200"
                : "text-forest-600 hover:text-emerald-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>6-Pollutant Breakdown</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === "trends" ? (
          <TrendChart currentData={currentData} />
        ) : (
          <PollutantGrid currentData={currentData} />
        )}
      </div>
    </div>
  );
}
