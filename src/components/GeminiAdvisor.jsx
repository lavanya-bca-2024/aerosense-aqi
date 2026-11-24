import React from "react";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  OctagonAlert,
  Clock,
  Home,
  RefreshCw,
  Key,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { hasGeminiApiKey } from "../services/gemini";

export default function GeminiAdvisor({
  city,
  healthProfile,
  activity,
  advice,
  isLoadingAdvice,
  onRefreshAdvice,
  onOpenApiKeyModal,
}) {
  const keyConfigured = hasGeminiApiKey();

  // Verdict style configurations with botanical palette
  const verdictConfig = {
    Safe: {
      bg: "bg-emerald-50/70 border-emerald-200 text-emerald-900",
      badgeBg: "bg-emerald-600 text-white",
      icon: ShieldCheck,
      iconColor: "text-emerald-700",
      label: "Safe to Proceed",
    },
    Caution: {
      bg: "bg-amber-50/70 border-amber-200 text-amber-900",
      badgeBg: "bg-amber-500 text-slate-950",
      icon: AlertTriangle,
      iconColor: "text-amber-700",
      label: "Proceed with Caution",
    },
    Avoid: {
      bg: "bg-rose-50/70 border-rose-200 text-rose-900",
      badgeBg: "bg-rose-600 text-white",
      icon: OctagonAlert,
      iconColor: "text-rose-700",
      label: "Avoid Outdoor Exertion",
    },
  };

  const verdict = advice?.verdict || "Caution";
  const currentVerdict = verdictConfig[verdict] || verdictConfig.Caution;
  const VerdictIcon = currentVerdict.icon;

  return (
    <div className="bg-white border border-emerald-100 rounded-3xl p-5 sm:p-6 shadow-soft space-y-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-emerald-50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-forest-900 font-display">
                Gemini AI Environmental Advisor
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                gemini-2.5-flash
              </span>
            </div>
            <p className="text-[11px] text-forest-500">
              Personalized health assessment for {healthProfile}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefreshAdvice}
          disabled={isLoadingAdvice}
          className="text-xs px-2.5 py-1.5 rounded-xl bg-sage-50 hover:bg-emerald-50 text-forest-700 border border-emerald-100 flex items-center gap-1.5 transition-all disabled:opacity-50"
          title="Re-generate advice with Gemini"
        >
          <RefreshCw className={`w-3 h-3 ${isLoadingAdvice ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isLoadingAdvice ? "Synthesizing..." : "Refresh"}</span>
        </button>
      </div>

      {/* API Key Missing Notice */}
      {!keyConfigured && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px] leading-tight">
              Using heuristic advice. Configure Gemini API key for personalized AI reasoning.
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-bold text-[10px] uppercase tracking-wider shrink-0 transition-all shadow-2xs"
          >
            Add Key
          </button>
        </div>
      )}

      {/* Advisory Body */}
      {isLoadingAdvice ? (
        <div className="py-10 flex flex-col items-center justify-center space-y-2.5">
          <div className="w-8 h-8 rounded-full border-3 border-emerald-200 border-t-emerald-600 animate-spin"></div>
          <div className="text-center">
            <div className="font-bold text-xs text-forest-800">
              Gemini 2.5 Flash is analyzing live air conditions...
            </div>
            <div className="text-[11px] text-forest-500 mt-0.5">
              Correlating PM2.5 & NO₂ for "{activity}"
            </div>
          </div>
        </div>
      ) : advice ? (
        <div className="space-y-3.5">
          {/* Risk Verdict Banner */}
          <div
            className={`rounded-2xl p-4 border shadow-2xs ${currentVerdict.bg} transition-all`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <VerdictIcon className={`w-5 h-5 ${currentVerdict.iconColor}`} />
                <span className="text-[11px] uppercase font-bold tracking-wider text-forest-600">
                  Risk Verdict
                </span>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider shadow-2xs ${currentVerdict.badgeBg}`}
              >
                {advice.verdict}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-forest-900 leading-snug">
              {advice.verdictReason || advice.summary}
            </p>
          </div>

          {/* 3 Actionable Tips Cards */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-forest-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              3 Actionable Precautions
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Tip 1: Mask */}
              <div className="bg-sage-50/70 border border-emerald-100 rounded-2xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-1">
                    <span>🎭</span>
                    <span>{advice.tips?.[0]?.title || "Mask Guide"}</span>
                  </div>
                  <div className="font-bold text-xs text-forest-900 leading-tight mb-1">
                    {advice.tips?.[0]?.action || "Wear N95/KF94 mask"}
                  </div>
                  <div className="text-[10px] text-forest-600 leading-tight">
                    {advice.tips?.[0]?.detail || "Blocks sub-2.5µm combustion soot."}
                  </div>
                </div>
              </div>

              {/* Tip 2: Time Window */}
              <div className="bg-sage-50/70 border border-emerald-100 rounded-2xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{advice.tips?.[1]?.title || "Time Window"}</span>
                  </div>
                  <div className="font-bold text-xs text-forest-900 leading-tight mb-1">
                    {advice.tips?.[1]?.action || "Mid-day or late afternoon"}
                  </div>
                  <div className="text-[10px] text-forest-600 leading-tight">
                    {advice.tips?.[1]?.detail || "Avoid morning temperature inversions."}
                  </div>
                </div>
              </div>

              {/* Tip 3: Indoor Air */}
              <div className="bg-sage-50/70 border border-emerald-100 rounded-2xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-1">
                    <Home className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{advice.tips?.[2]?.title || "Indoor Defense"}</span>
                  </div>
                  <div className="font-bold text-xs text-forest-900 leading-tight mb-1">
                    {advice.tips?.[2]?.action || "Seal street-facing windows"}
                  </div>
                  <div className="text-[10px] text-forest-600 leading-tight">
                    {advice.tips?.[2]?.detail || "Run HEPA filter & wet mop floors."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Urban Insight */}
          {advice.contextualInsight && (
            <div className="pt-2 border-t border-emerald-50 text-[11px] text-forest-600 flex items-start gap-1.5">
              <span className="font-bold text-emerald-700 shrink-0">Urban Microclimate:</span>
              <span className="leading-tight">{advice.contextualInsight}</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
