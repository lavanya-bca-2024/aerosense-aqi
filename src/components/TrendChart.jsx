import React, { useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Clock, AlertCircle } from "lucide-react";

export default function TrendChart({ currentData }) {
  const trends = currentData?.trends || [];
  const [activeMetric, setActiveMetric] = useState("us_aqi");

  const metricConfigs = {
    us_aqi: {
      label: "US AQI",
      unit: "Index",
      color: "#06b6d4", // cyan
      fillColor: "#06b6d4",
      whoLimit: 50,
      limitLabel: "Good (≤ 50)",
      dataKey: "us_aqi",
    },
    pm2_5: {
      label: "PM2.5 (Fine Particulate)",
      unit: "µg/m³",
      color: "#f43f5e", // rose
      fillColor: "#f43f5e",
      whoLimit: 15,
      limitLabel: "WHO Safe Limit (15 µg/m³)",
      dataKey: "pm2_5",
    },
    pm10: {
      label: "PM10 (Dust)",
      unit: "µg/m³",
      color: "#f59e0b", // amber
      fillColor: "#f59e0b",
      whoLimit: 45,
      limitLabel: "WHO Safe Limit (45 µg/m³)",
      dataKey: "pm10",
    },
    nitrogen_dioxide: {
      label: "NO₂ (Traffic Gas)",
      unit: "µg/m³",
      color: "#8b5cf6", // purple
      fillColor: "#8b5cf6",
      whoLimit: 25,
      limitLabel: "WHO Safe Limit (25 µg/m³)",
      dataKey: "nitrogen_dioxide",
    },
    ozone: {
      label: "Ozone (O₃)",
      unit: "µg/m³",
      color: "#10b981", // emerald
      fillColor: "#10b981",
      whoLimit: 100,
      limitLabel: "WHO Safe Limit (100 µg/m³)",
      dataKey: "ozone",
    },
  };

  const currentConfig = metricConfigs[activeMetric] || metricConfigs.us_aqi;

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-semibold text-slate-300 flex items-center justify-between gap-4 border-b border-slate-800 pb-1">
            <span>{dataPoint.time}</span>
            {dataPoint.isCurrent && (
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">
                Current Hour
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="text-slate-400">{currentConfig.label}:</span>
            <span className="font-bold text-sm" style={{ color: currentConfig.color }}>
              {payload[0].value} {currentConfig.unit}
            </span>
          </div>
          {currentConfig.whoLimit && (
            <div className="text-[11px] text-slate-400">
              {payload[0].value > currentConfig.whoLimit ? (
                <span className="text-amber-400">
                  ⚠️ {Math.round((payload[0].value / currentConfig.whoLimit) * 10) / 10}x WHO benchmark
                </span>
              ) : (
                <span className="text-emerald-400">✓ Within safe guidelines</span>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            24-Hour Diurnal Pollutant Trend
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hourly progression showing morning rush-hour spikes, afternoon photochemical ozone, and night settling
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-wrap">
          {Object.entries(metricConfigs).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveMetric(key)}
              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                activeMetric === key
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              style={{
                color: activeMetric === key ? config.color : undefined,
              }}
            >
              {config.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        {trends.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Loading trend data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.fillColor} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={currentConfig.fillColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={["auto", "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />
              {currentConfig.whoLimit && (
                <ReferenceLine
                  y={currentConfig.whoLimit}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: currentConfig.limitLabel,
                    fill: "#10b981",
                    fontSize: 10,
                    position: "insideTopRight",
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey={currentConfig.dataKey}
                stroke={currentConfig.color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#gradient-${activeMetric})`}
                activeDot={{ r: 6, fill: currentConfig.color, stroke: "#0f172a", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 mt-2">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Showing 24h continuous window centered on current local time
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-0.5 bg-emerald-400 inline-block"></span> Green dashed line: WHO Reference
        </span>
      </div>
    </div>
  );
}
