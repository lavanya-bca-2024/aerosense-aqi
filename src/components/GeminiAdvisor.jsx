import React from "react";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  OctagonAlert,
  Clock,
  Home,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { hasGeminiApiKey } from "../services/gemini";

// Helper to keep strings strictly within maximum words
function limitWords(str = "", maxWords = 10) {
  if (!str) return "";
  const words = str.trim().split(/\s+/);
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(" ") + ".";
}

export default function GeminiAdvisor({
  healthProfile,
  activity,
  advice,
  isLoadingAdvice,
  onRefreshAdvice,
  onOpenApiKeyModal,
}) {
  const keyConfigured = hasGeminiApiKey();

  const verdictConfig = {
    Safe: {
      bg: "bg-emerald-50/90 border-emerald-300 text-emerald-950",
      badgeBg: "bg-emerald-600 text-white",
      icon: ShieldCheck,
      iconColor: "text-emerald-700",
      label: "Safe to Proceed",
    },
    Caution: {
      bg: "bg-amber-50/90 border-amber-300 text-amber-950",
      badgeBg: "bg-amber-500 text-slate-950",
      icon: AlertTriangle,
      iconColor: "text-amber-700",
      label: "Proceed with Caution",
    },
    Avoid: {
      bg: "bg-rose-50/90 border-rose-300 text-rose-950",
      badgeBg: "bg-rose-600 text-white",
      icon: OctagonAlert,
      iconColor: "text-rose-700",
      label: "Avoid Outdoor Exertion",
    },
  };

  const verdict = advice?.verdict || "Caution";
  const currentVerdict = verdictConfig[verdict] || verdictConfig.Caution;
  const VerdictIcon = currentVerdict.icon;

  // Crisp, max 15 words verdict
  const verdictReasonClean = limitWords(advice?.verdictReason || advice?.summary || "Conditions require standard outdoor precautions for your health profile.", 15);

  // Ultra-short 3 tips (max 10 words detail)
  const tip1Action = advice?.tips?.[0]?.action || "Wear N95 Mask";
  const tip1Detail = limitWords(advice?.tips?.[0]?.detail || "Filters microscopic combustion soot in traffic.", 10);

  const tip2Action = advice?.tips?.[1]?.action || "Midday 12–3 PM";
  const tip2Detail = limitWords(advice?.tips?.[1]?.detail || "Avoid morning temperature inversions trapping exhaust.", 10);

  const tip3Action = advice?.tips?.[2]?.action || "Run HEPA Purifier";
  const tip3Detail = limitWords(advice?.tips?.[2]?.detail || "Keep street-facing windows sealed and wet mop.", 10);

  return (
    <div className="bg-white/85 backdrop-blur-md border border-emerald-200/80 rounded-3xl p-5 shadow-soft-lg space-y-3.5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-forest-900 font-display leading-tight">
              Smart Health Advisor
            </h2>
            <p className="text-[10px] text-forest-600">
              Personalized for {healthProfile}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefreshAdvice}
          disabled={isLoadingAdvice}
          className="text-xs px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-forest-800 border border-emerald-200 flex items-center gap-1.5 transition-all disabled:opacity-50"
          title="Refresh advice"
        >
          <RefreshCw className={`w-3 h-3 ${isLoadingAdvice ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isLoadingAdvice ? "Analyzing..." : "Refresh"}</span>
        </button>
      </div>

      {/* API Key Missing Notice */}
      {!keyConfigured && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-2.5 flex items-center justify-between gap-2 text-xs text-amber-900">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[10px] leading-tight">
              Using smart heuristic advice.
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-bold text-[9px] uppercase tracking-wider shrink-0 transition-all"
          >
            Add Key
          </button>
        </div>
      )}

      {/* Advisory Body */}
      {isLoadingAdvice ? (
        <div className="py-8 flex flex-col items-center justify-center space-y-2">
          <div className="w-7 h-7 rounded-full border-3 border-emerald-200 border-t-emerald-600 animate-spin"></div>
          <div className="text-xs font-bold text-forest-800">
            Checking air conditions...
          </div>
        </div>
      ) : advice ? (
        <div className="space-y-3">
          {/* Risk Verdict Banner (Crisp single sentence max 15 words) */}
          <div
            className={`rounded-2xl p-3 border shadow-2xs ${currentVerdict.bg} transition-all`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <VerdictIcon className={`w-4 h-4 ${currentVerdict.iconColor}`} />
                <span className="text-[10px] uppercase font-bold tracking-wider text-forest-700">
                  Risk Verdict
                </span>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-2xs ${currentVerdict.badgeBg}`}
              >
                {advice.verdict}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-forest-900 leading-snug">
              {verdictReasonClean}
            </p>
          </div>

          {/* 3 Actionable Tips Cards (1 bold headline + max 10 words detail) */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-forest-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Actionable Recommendations
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Tip 1: Mask */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-emerald-800 text-[11px] font-bold mb-0.5">
                    <span>🎭</span>
                    <span>Mask</span>
                  </div>
                  <div className="font-bold text-xs text-forest-900 leading-tight mb-1">
                    {tip1Action}
                  </div>
                  <div className="text-[10px] text-forest-600 leading-tight">
                    {tip1Detail}
                  </div>
                </div>
              </div>

              {/* Tip 2: Time Window */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-800 text-[11px] font-bold mb-0.5">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Best Time</span>
                  </div>
                  <div className="font-bold text-xs text-forest-900 leading-tight mb-1">
                    {tip2Action}
                  </div>
                  <div className="text-[10px] text-forest-600 leading-tight">
                    {tip2Detail}
                  </div>
                </div>
              </div>

              {/* Tip 3: Indoor Air */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-emerald-800 text-[11px] font-bold mb-0.5">
                    <Home className="w-3 h-3 text-emerald-600" />
                    <span>Indoor Air</span>
                  </div>
                  <div className="font-bold text-xs text-forest-900 leading-tight mb-1">
                    {tip3Action}
                  </div>
                  <div className="text-[10px] text-forest-600 leading-tight">
                    {tip3Detail}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
