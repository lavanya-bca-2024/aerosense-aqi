import React, { useState } from "react";
import { 
  Info, 
  Flame, 
  Truck, 
  Sun, 
  Wind, 
  ShieldCheck, 
  AlertTriangle,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { POLLUTANT_INFO, getPollutantSeverity } from "../utils/aqiUtils";

export default function PollutantGrid({ currentData }) {
  const metrics = currentData?.metrics || {};
  const [expandedKey, setExpandedKey] = useState(null);

  const mainPollutants = [
    {
      key: "pm2_5",
      icon: Flame,
      value: metrics.pm2_5,
      ...POLLUTANT_INFO.pm2_5,
    },
    {
      key: "pm10",
      icon: Wind,
      value: metrics.pm10,
      ...POLLUTANT_INFO.pm10,
    },
    {
      key: "nitrogen_dioxide",
      icon: Truck,
      value: metrics.nitrogen_dioxide,
      ...POLLUTANT_INFO.nitrogen_dioxide,
    },
    {
      key: "ozone",
      icon: Sun,
      value: metrics.ozone,
      ...POLLUTANT_INFO.ozone,
    },
  ];

  const secondaryPollutants = [
    {
      key: "carbon_monoxide",
      value: metrics.carbon_monoxide,
      ...POLLUTANT_INFO.carbon_monoxide,
    },
    {
      key: "sulphur_dioxide",
      value: metrics.sulphur_dioxide,
      ...POLLUTANT_INFO.sulphur_dioxide,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Real-Time Pollutant Breakdown
          </h2>
          <p className="text-xs text-slate-400">
            Measured in micrograms per cubic meter (µg/m³), compared against WHO health limits
          </p>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span> WHO Safe
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span> Elevated
          <span className="inline-block w-2 h-2 rounded-full bg-rose-400"></span> Hazardous
        </div>
      </div>

      {/* Primary 4 Pollutants Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainPollutants.map((pollutant) => {
          const Icon = pollutant.icon;
          const severity = getPollutantSeverity(pollutant.key, pollutant.value);
          const valDisplay = pollutant.value != null ? Number(pollutant.value).toFixed(1) : "--";
          const ratioToWho = pollutant.value && pollutant.whoSafeLimit 
            ? (pollutant.value / pollutant.whoSafeLimit).toFixed(1) 
            : null;
          const isExpanded = expandedKey === pollutant.key;

          return (
            <div
              key={pollutant.key}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-base leading-tight">
                        {pollutant.name}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-none">
                        {pollutant.fullName}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${severity.badge}`}>
                    {severity.label}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 my-2">
                  <span className={`text-3xl font-extrabold tracking-tight ${severity.color}`}>
                    {valDisplay}
                  </span>
                  <span className="text-xs font-medium text-slate-400">{pollutant.unit}</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>WHO 24h Guideline:</span>
                    <span className="font-semibold text-slate-300">≤ {pollutant.whoSafeLimit} {pollutant.unit}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Indian NAAQS Limit:</span>
                    <span className="font-semibold text-slate-300">≤ {pollutant.indianLimit} {pollutant.unit}</span>
                  </div>
                  {ratioToWho && Number(ratioToWho) > 1 && (
                    <div className="text-[11px] font-medium text-amber-400/90 bg-amber-500/10 px-2 py-1 rounded-lg">
                      ⚠️ {ratioToWho}x above WHO safe limit
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Health & Source Detail */}
              <div className="mt-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExpandedKey(isExpanded ? null : pollutant.key)}
                  className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <Info className="w-3 h-3 text-cyan-400" />
                    Source & Health Effects
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>
                {isExpanded && (
                  <div className="mt-2 text-[11px] bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5 animate-fadeIn">
                    <p className="text-slate-300">
                      <strong className="text-slate-400">Sources:</strong> {pollutant.sources}
                    </p>
                    <p className="text-slate-300">
                      <strong className="text-slate-400">Health Impact:</strong> {pollutant.impact}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Pollutants Strip (CO & SO2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {secondaryPollutants.map((pollutant) => {
          const valDisplay = pollutant.value != null ? Number(pollutant.value).toFixed(1) : "--";
          return (
            <div
              key={pollutant.key}
              className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-200">{pollutant.name} ({pollutant.fullName})</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  WHO Limit: ≤ {pollutant.whoSafeLimit} {pollutant.unit}
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-slate-200">{valDisplay}</span>
                <span className="text-xs text-slate-400 ml-1">{pollutant.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
