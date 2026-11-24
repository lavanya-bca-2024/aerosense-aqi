import React from "react";
import { 
  Wind, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ShieldAlert, 
  OctagonAlert, 
  Activity, 
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import { getAqiCategory } from "../utils/aqiUtils";

export default function AqiHeroCard({
  city,
  currentData,
  onRefresh,
  isRefreshing,
}) {
  const metrics = currentData?.metrics || {};
  const aqi = Math.round(metrics.us_aqi || 0);
  const category = getAqiCategory(aqi);

  // Determine dominant pollutant
  let dominantPollutant = "PM2.5";
  if (metrics.pm10 > 150 && metrics.pm10 > metrics.pm2_5 * 2) {
    dominantPollutant = "PM10 (Dust & Debris)";
  } else if (metrics.ozone > 120) {
    dominantPollutant = "Ozone (O₃ Photochemical Smog)";
  } else if (metrics.nitrogen_dioxide > 80) {
    dominantPollutant = "NO₂ (Traffic Combustion)";
  }

  // Calculate percentage of 300 scale for visual gauge
  const progressPercent = Math.min(100, Math.round((aqi / 300) * 100));

  // Format time of last measurement
  const formattedTime = currentData?.timestamp
    ? new Date(currentData.timestamp).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "Just now";

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-cyan-950/20">
      {/* Background ambient glow based on AQI color */}
      <div
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: category.color }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: City info & Dominant Pollutant */}
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <MapPin className="w-3.5 h-3.5" />
              {city.name}
              {city.admin1 ? `, ${city.admin1}` : ""}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
              {city.country || "India"}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-slate-400 bg-slate-800/60">
              <Clock className="w-3 h-3 text-slate-400" />
              Updated {formattedTime}
            </span>
          </div>

          <div className="pt-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{city.name}</span>
              <span className="text-xl sm:text-2xl font-light text-slate-400">Air Quality</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
              <span className="text-slate-400">Dominant Driver:</span>
              <span className="font-semibold text-slate-200">{dominantPollutant}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
              <span className="text-slate-400">Indian CPCB Equivalent:</span>
              <span className="font-semibold text-cyan-300">{category.cpcbCategory}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Prominent AQI Gauge Score & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-6 lg:border-l lg:border-slate-800 lg:pl-8">
          <div className="text-center sm:text-right">
            <div className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-1">
              Real-Time US AQI
            </div>
            <div className="flex items-baseline justify-center sm:justify-end gap-2">
              <span
                className="text-6xl sm:text-7xl font-black tracking-tight"
                style={{ color: category.color }}
              >
                {aqi}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 500</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                 style={{
                   backgroundColor: `${category.color}15`,
                   borderColor: `${category.color}40`,
                   color: category.color,
                 }}>
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: category.color }} />
              {category.label}
            </div>
          </div>

          {/* Visual Mini Scale */}
          <div className="w-full sm:w-44 flex flex-col gap-2">
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>0 (Good)</span>
              <span>150</span>
              <span>300+</span>
            </div>
            {/* Progress Bar with Gradient */}
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>US EPA Air Index</span>
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                title="Refresh live data"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>{isRefreshing ? "Fetching..." : "Refresh"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
