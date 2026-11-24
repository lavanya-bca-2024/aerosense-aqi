import React from "react";
import { Users, HeartPulse, Zap, Baby, Check, Sparkles, Navigation } from "lucide-react";

export const HEALTH_PROFILES = [
  {
    id: "General Public",
    label: "General Public",
    subtitle: "Healthy adults, normal routine",
    icon: Users,
    badge: "Standard",
  },
  {
    id: "Asthma / Sensitive",
    label: "Asthma / Sensitive",
    subtitle: "Respiratory / cardiac sensitivity",
    icon: HeartPulse,
    badge: "High Risk",
  },
  {
    id: "Outdoor Runner",
    label: "Outdoor Runner",
    subtitle: "High-ventilation athletes & cyclists",
    icon: Zap,
    badge: "High Intake",
  },
  {
    id: "Elderly / Kids",
    label: "Elderly / Kids",
    subtitle: "Developing lungs, seniors 65+",
    icon: Baby,
    badge: "Vulnerable",
  },
];

export const ACTIVITY_PRESETS = [
  "Morning jog at 7 AM",
  "Two-wheeler commute",
  "Evening walk at 6 PM",
  "School transit for kids",
  "Outdoor sports",
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
    <div className="bg-white/90 backdrop-blur-md border border-emerald-200/80 rounded-3xl p-5 shadow-soft-lg space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-forest-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Health Profile & Planned Activity
          </h2>
          <p className="text-xs text-forest-500">
            Adapts Gemini AI thresholds for your exposure level
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          {selectedProfile}
        </span>
      </div>

      {/* 4 Health Profile buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {HEALTH_PROFILES.map((profile) => {
          const Icon = profile.icon;
          const isSelected = selectedProfile === profile.id;
          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelectProfile(profile.id)}
              className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                  : "bg-sage-50/70 border-emerald-100/70 hover:border-emerald-200 hover:bg-white text-forest-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`p-1.5 rounded-xl ${
                    isSelected ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 shadow-2xs"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                ) : (
                  <span className="text-[9px] font-medium text-forest-500 bg-white px-1.5 py-0.5 rounded-md border border-emerald-100">
                    {profile.badge}
                  </span>
                )}
              </div>
              <div>
                <div className="font-bold text-xs text-forest-900 leading-tight">
                  {profile.label}
                </div>
                <div className="text-[10px] text-forest-500 leading-tight mt-0.5 line-clamp-1">
                  {profile.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Activity Input & Presets */}
      <div className="space-y-2 pt-1">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={activity}
              onChange={(e) => onActivityChange(e.target.value)}
              placeholder="e.g. Morning jog at 7 AM, Two-wheeler commute..."
              className="w-full pl-9 pr-3 py-2 bg-sage-50/70 border border-emerald-100 rounded-xl text-xs text-forest-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-500 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={onApplyContext}
            disabled={isGeneratingAi}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 disabled:opacity-50 whitespace-nowrap"
          >
            <Sparkles className={`w-3 h-3 ${isGeneratingAi ? "animate-spin" : ""}`} />
            <span>{isGeneratingAi ? "Assessing..." : "Assess Risk"}</span>
          </button>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-[10px] text-forest-500 mr-0.5 whitespace-nowrap">Presets:</span>
          {ACTIVITY_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onActivityChange(preset)}
              className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all whitespace-nowrap ${
                activity === preset
                  ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold"
                  : "bg-white border-emerald-100 text-forest-600 hover:border-emerald-200 hover:text-emerald-800"
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
