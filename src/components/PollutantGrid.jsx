import React, { useState } from "react";
import { 
  Info, 
  Flame, 
  Truck, 
  Sun, 
  Wind, 
  ChevronDown,
  Layers
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
      {/* 4 Main Pollutants Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
              className="bg-white border border-emerald-100/90 rounded-2xl p-4 transition-all hover:border-emerald-300 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-forest-900 text-sm leading-tight">
                        {pollutant.name}
                      </div>
                      <div className="text-[10px] text-forest-500 leading-none">
                        {pollutant.fullName}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${severity.badge}`}>
                    {severity.label}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 my-2">
                  <span className={`text-2xl font-black tracking-tight ${severity.color}`}>
                    {valDisplay}
                  </span>
                  <span className="text-xs font-semibold text-forest-500">{pollutant.unit}</span>
                </div>

                <div className="space-y-1 pt-2 border-t border-emerald-50 text-[11px]">
                  <div className="flex justify-between items-center text-forest-600">
                    <span>WHO 24h Guideline:</span>
                    <span className="font-bold text-forest-900">≤ {pollutant.whoSafeLimit} {pollutant.unit}</span>
                  </div>
                  <div className="flex justify-between items-center text-forest-600">
                    <span>Indian NAAQS Limit:</span>
                    <span className="font-bold text-forest-900">≤ {pollutant.indianLimit} {pollutant.unit}</span>
                  </div>
                  {ratioToWho && Number(ratioToWho) > 1 && (
                    <div className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      ⚠️ {ratioToWho}x above WHO safe limit
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Health & Source Detail */}
              <div className="mt-2.5 pt-2 border-t border-emerald-50">
                <button
                  type="button"
                  onClick={() => setExpandedKey(isExpanded ? null : pollutant.key)}
                  className="w-full flex items-center justify-between text-[11px] text-emerald-700 font-semibold hover:text-emerald-900 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <Info className="w-3 h-3 text-emerald-600" />
                    Sources & Impact
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>
                {isExpanded && (
                  <div className="mt-2 text-[11px] bg-sage-50/80 p-2.5 rounded-xl border border-emerald-100 space-y-1 animate-fadeIn">
                    <p className="text-forest-700">
                      <strong className="text-forest-900">Source:</strong> {pollutant.sources}
                    </p>
                    <p className="text-forest-700">
                      <strong className="text-forest-900">Impact:</strong> {pollutant.impact}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Pollutants: CO and SO2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {secondaryPollutants.map((pollutant) => {
          const valDisplay = pollutant.value != null ? Number(pollutant.value).toFixed(1) : "--";
          return (
            <div
              key={pollutant.key}
              className="bg-white border border-emerald-100 rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xs"
            >
              <div>
                <div className="font-bold text-xs text-forest-900">{pollutant.name} ({pollutant.fullName})</div>
                <div className="text-[10px] text-forest-500 mt-0.5">
                  WHO 24h Threshold: ≤ {pollutant.whoSafeLimit} {pollutant.unit}
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-forest-900">{valDisplay}</span>
                <span className="text-xs text-forest-500 ml-1">{pollutant.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
