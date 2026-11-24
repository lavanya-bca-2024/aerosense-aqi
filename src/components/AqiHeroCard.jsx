import React from "react";
import { 
  Clock, 
  MapPin, 
  RefreshCw,
  Flame,
  Wind,
  ShieldCheck
} from "lucide-react";
import { getAqiCategory, POLLUTANT_INFO } from "../utils/aqiUtils";

export default function AqiHeroCard({
  city,
  currentData,
  onRefresh,
  isRefreshing,
}) {
  const metrics = currentData?.metrics || {};
  const aqi = Math.round(metrics.us_aqi || 0);
  const category = getAqiCategory(aqi);

  // Top 2 pollutants
  const pm25Val = metrics.pm2_5 != null ? Number(metrics.pm2_5).toFixed(1) : "--";
  const pm10Val = metrics.pm10 != null ? Number(metrics.pm10).toFixed(1) : "--";

  const pm25Ratio = metrics.pm2_5 && POLLUTANT_INFO.pm2_5.whoSafeLimit 
    ? (metrics.pm2_5 / POLLUTANT_INFO.pm2_5.whoSafeLimit).toFixed(1) 
    : null;
  const pm10Ratio = metrics.pm10 && POLLUTANT_INFO.pm10.whoSafeLimit 
    ? (metrics.pm10 / POLLUTANT_INFO.pm10.whoSafeLimit).toFixed(1) 
    : null;

  // Visual percentage for AQI progress bar (scale 0-300)
  const progressPercent = Math.min(100, Math.round((aqi / 300) * 100));

  const formattedTime = currentData?.timestamp
    ? new Date(currentData.timestamp).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "Just now";

  return (
    <div className="relative overflow-hidden bg-white/90 backdrop-blur-md border border-emerald-200/80 rounded-3xl p-5 sm:p-6 shadow-soft-lg transition-all">
      {/* Subtle nature gradient background wash */}
      <div
        className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: category.color }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        {/* Top: City & Update time */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {city.name}
              {city.admin1 ? `, ${city.admin1}` : ""}
            </span>
            <span className="text-xs text-forest-500 font-medium">
              {city.country || "India"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-forest-500">
              <Clock className="w-3 h-3 text-emerald-600" />
              {formattedTime}
            </span>
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1 rounded-lg text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors"
              title="Refresh live data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Middle: Prominent AQI Score & Dynamic Category Badge */}
        <div className="flex items-end justify-between gap-4 py-1">
          <div>
            <div className="text-[11px] uppercase font-bold tracking-wider text-forest-500 mb-0.5">
              Current Air Quality Index
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-5xl sm:text-6xl font-black tracking-tight font-display"
                style={{ color: category.color }}
              >
                {aqi}
              </span>
              <span className="text-xs font-bold text-forest-400 uppercase tracking-wider">
                US AQI
              </span>
            </div>
          </div>

          <div className="text-right">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${category.badge}`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.label}
            </div>
            <div className="text-[11px] text-forest-500 mt-1 font-medium">
              CPCB: <span className="font-semibold text-forest-700">{category.cpcbCategory}</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1">
          <div className="h-2 w-full bg-sage-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: category.color,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-forest-500 font-medium px-0.5">
            <span>0 Good</span>
            <span>100 Moderate</span>
            <span>150+ Poor</span>
            <span>300 Severe</span>
          </div>
        </div>

        {/* Top 2 Pollutants Breakdown (PM2.5 & PM10) */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-emerald-50">
          {/* PM2.5 Card */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-white text-emerald-700 shadow-2xs">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-forest-800 leading-none">PM2.5</div>
                <div className="text-[10px] text-forest-500">Fine Particulate</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold text-forest-900">{pm25Val}</span>
              <span className="text-[10px] text-forest-500 ml-0.5">µg/m³</span>
              {pm25Ratio && Number(pm25Ratio) > 1 && (
                <div className="text-[9px] text-amber-700 font-bold">
                  {pm25Ratio}x WHO limit
                </div>
              )}
            </div>
          </div>

          {/* PM10 Card */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-white text-emerald-700 shadow-2xs">
                <Wind className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-forest-800 leading-none">PM10</div>
                <div className="text-[10px] text-forest-500">Coarse Dust</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold text-forest-900">{pm10Val}</span>
              <span className="text-[10px] text-forest-500 ml-0.5">µg/m³</span>
              {pm10Ratio && Number(pm10Ratio) > 1 && (
                <div className="text-[9px] text-amber-700 font-bold">
                  {pm10Ratio}x WHO limit
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
