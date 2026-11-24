import React, { useState } from "react";
import {
  AreaChart,
  Area,
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
      color: "#059669", // emerald-600
      fillColor: "#10b981",
      whoLimit: 50,
      limitLabel: "Good (≤ 50)",
      dataKey: "us_aqi",
    },
    pm2_5: {
      label: "PM2.5 (Fine Particulate)",
      unit: "µg/m³",
      color: "#e11d48", // rose-600
      fillColor: "#f43f5e",
      whoLimit: 15,
      limitLabel: "WHO Safe Limit (15 µg/m³)",
      dataKey: "pm2_5",
    },
    pm10: {
      label: "PM10 (Dust)",
      unit: "µg/m³",
      color: "#d97706", // amber-600
      fillColor: "#f59e0b",
      whoLimit: 45,
      limitLabel: "WHO Safe Limit (45 µg/m³)",
      dataKey: "pm10",
    },
    nitrogen_dioxide: {
      label: "NO₂ (Traffic Gas)",
      unit: "µg/m³",
      color: "#7c3aed", // violet-600
      fillColor: "#8b5cf6",
      whoLimit: 25,
      limitLabel: "WHO Safe Limit (25 µg/m³)",
      dataKey: "nitrogen_dioxide",
    },
    ozone: {
      label: "Ozone (O₃)",
      unit: "µg/m³",
      color: "#0d9488", // teal-600
      fillColor: "#14b8a6",
      whoLimit: 100,
      limitLabel: "WHO Safe Limit (100 µg/m³)",
      dataKey: "ozone",
    },
  };

  const currentConfig = metricConfigs[activeMetric] || metricConfigs.us_aqi;

  // Custom Botanical Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white border border-emerald-200 p-3 rounded-2xl shadow-soft-lg text-xs space-y-1">
          <div className="font-bold text-forest-900 flex items-center justify-between gap-4 border-b border-emerald-50 pb-1">
            <span>{dataPoint.time}</span>
            {dataPoint.isCurrent && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Current Hour
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="text-forest-600 font-medium">{currentConfig.label}:</span>
            <span className="font-black text-sm" style={{ color: currentConfig.color }}>
              {payload[0].value} {currentConfig.unit}
            </span>
          </div>
          {currentConfig.whoLimit && (
            <div className="text-[11px] font-medium">
              {payload[0].value > currentConfig.whoLimit ? (
                <span className="text-amber-700">
                  ⚠️ {Math.round((payload[0].value / currentConfig.whoLimit) * 10) / 10}x WHO benchmark
                </span>
              ) : (
                <span className="text-emerald-700">✓ Within WHO safe limit</span>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Metric Selector Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-forest-800">Select Pollutant Curve:</span>
        </div>
        <div className="flex items-center gap-1 bg-sage-50 p-1 rounded-2xl border border-emerald-100 flex-wrap">
          {Object.entries(metricConfigs).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveMetric(key)}
              className={`text-xs px-3 py-1 rounded-xl font-bold transition-all ${
                activeMetric === key
                  ? "bg-white text-forest-900 shadow-xs border border-emerald-200"
                  : "text-forest-600 hover:text-emerald-800"
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
      <div className="h-64 sm:h-72 w-full pt-2">
        {trends.length === 0 ? (
          <div className="h-full flex items-center justify-center text-forest-400 text-sm">
            Loading 24-hour diurnal trends...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.fillColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={currentConfig.fillColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2ECE5" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748B"
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={{ stroke: "#CBD5E1" }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748B"
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={["auto", "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />
              {currentConfig.whoLimit && (
                <ReferenceLine
                  y={currentConfig.whoLimit}
                  stroke="#059669"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: currentConfig.limitLabel,
                    fill: "#059669",
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
                activeDot={{ r: 5, fill: currentConfig.color, stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-forest-500 pt-2 border-t border-emerald-50">
        <span>Continuous 24-hour progression centered on current time</span>
        <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <span className="w-2.5 h-0.5 bg-emerald-600 inline-block"></span> Green Dashed Line: WHO Threshold
        </span>
      </div>
    </div>
  );
}
