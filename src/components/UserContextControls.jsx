import React from "react";
import { Users, HeartPulse, Zap, Baby, Check, Sparkles, Navigation } from "lucide-react";

export const HEALTH_PROFILES = [
  {
    id: "General Public",
    label: "General Public",
    subtitle: "Healthy adults with normal daily routine",
    icon: Users,
    color: "cyan",
    badge: "Standard",
  },
  {
    id: "Asthma / Sensitive",
    label: "Asthma / Sensitive",
    subtitle: "Allergies, COPD, cardiac, or respiratory conditions",
    icon: HeartPulse,
    color: "rose",
    badge: "High Risk",
  },
  {
    id: "Outdoor Runner",
    label: "Outdoor Runner",
    subtitle: "High-ventilation athletes, cyclists, runners",
    icon: Zap,
    color: "amber",
    badge: "Elevated Intake",
  },
  {
    id: "Elderly / Kids",
    label: "Elderly / Kids",
    subtitle: "Developing lungs, seniors aged 65+, infants",
    icon: Baby,
    color: "emerald",
    badge: "Vulnerable",
  },
];

export const ACTIVITY_PRESETS = [
  "Morning jog at 7 AM",
  "Two-wheeler commute",
  "Evening walk at 6 PM",
  "School transit for kids",
  "Outdoor sports / Cricket",
  "Outdoor dining & street market",
];

export default function UserContextControls({
  selectedProfile,
  onSelectProfile,
  activity,
  onActivityChange,
  onApplyContext,
  isGeneratingAi,
}) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl shadow-cyan-950/10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            User Context & Exposure Controls
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Personalize air pollution risk thresholds and Gemini AI health recommendations
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 self-start md:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Active Profile: {selectedProfile}
        </span>
      </div>

      {/* Health Profile Grid */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          1. Select Health & Vulnerability Profile
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {HEALTH_PROFILES.map((profile) => {
            const Icon = profile.icon;
            const isSelected = selectedProfile === profile.id;
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => onSelectProfile(profile.id)}
                className={`group relative text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-800/90 border-cyan-500 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-slate-800 text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected ? (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500 text-slate-950">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                      {profile.badge}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-0.5 flex items-center justify-between">
                    {profile.label}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight">
                    {profile.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Planned Activity Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            2. Planned Outdoor Activity / Route
          </label>
          <span className="text-[11px] text-slate-400">
            Helps Gemini assess exposure duration & timing
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Navigation className="w-4 h-4 text-cyan-400" />
            </div>
            <input
              type="text"
              value={activity}
              onChange={(e) => onActivityChange(e.target.value)}
              placeholder="e.g. Morning jog at 7 AM, Two-wheeler commute, Evening market walk..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={onApplyContext}
            disabled={isGeneratingAi}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? "animate-spin" : ""}`} />
            {isGeneratingAi ? "Consulting Gemini..." : "Assess Health Risk"}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 mr-1">Quick Presets:</span>
          {ACTIVITY_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onActivityChange(preset)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                activity === preset
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-medium"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
