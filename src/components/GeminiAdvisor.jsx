import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  OctagonAlert,
  Clock,
  Home,
  MessageSquare,
  Send,
  RefreshCw,
  Key,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { sendFollowUpChatMessage, hasGeminiApiKey } from "../services/gemini";

export default function GeminiAdvisor({
  city,
  currentData,
  healthProfile,
  activity,
  advice,
  isLoadingAdvice,
  onRefreshAdvice,
  onOpenApiKeyModal,
}) {
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I'm your Gemini Air Quality Advisor. I've analyzed the live pollutant readings for **${city?.name}** tailored for **${healthProfile}** planning **"${activity}"**.\n\nAsk me anything about mask suitability, travel timings, child safety, or indoor ventilation!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatEndRef = useRef(null);

  const keyConfigured = hasGeminiApiKey();

  // Scroll to bottom of chat on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isSendingMessage]);

  const handleSendMessage = async (customPrompt) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isSendingMessage) return;

    if (!keyConfigured) {
      onOpenApiKeyModal();
      return;
    }

    const userMsg = {
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsSendingMessage(true);

    try {
      const response = await sendFollowUpChatMessage({
        chatHistory: chatMessages,
        userMessage: textToSend.trim(),
        city,
        currentData,
        healthProfile,
        activity,
      });

      const assistantMsg = {
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = {
        role: "assistant",
        content: `⚠️ Unable to reach Gemini: ${err.message || "Please check your Gemini API key in settings."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isError: true,
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Preset question prompt pills
  const sampleQuestions = [
    "Is an N95 mask needed on my scooter commute?",
    "When will PM2.5 levels be lowest today?",
    "Can I open windows for cross-ventilation tonight?",
    "Are morning walks safe for elderly individuals right now?",
  ];

  // Verdict style configurations
  const verdictConfig = {
    Safe: {
      bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      badgeBg: "bg-emerald-500 text-slate-950",
      icon: ShieldCheck,
      borderGlow: "border-emerald-500/30 shadow-emerald-500/10",
      label: "Safe to Proceed",
    },
    Caution: {
      bg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      badgeBg: "bg-amber-500 text-slate-950",
      icon: AlertTriangle,
      borderGlow: "border-amber-500/30 shadow-amber-500/10",
      label: "Proceed with Caution",
    },
    Avoid: {
      bg: "bg-rose-500/15 border-rose-500/30 text-rose-400",
      badgeBg: "bg-rose-500 text-white",
      icon: OctagonAlert,
      borderGlow: "border-rose-500/30 shadow-rose-500/10",
      label: "Avoid Outdoor Exertion",
    },
  };

  const verdict = advice?.verdict || "Caution";
  const currentVerdict = verdictConfig[verdict] || verdictConfig.Caution;
  const VerdictIcon = currentVerdict.icon;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 lg:p-7 shadow-2xl space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Gemini AI Environmental Advisor
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                gemini-2.5-flash
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live epidemiological advisory matching your health profile & activity in {city?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!keyConfigured && (
            <button
              type="button"
              onClick={onOpenApiKeyModal}
              className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-semibold flex items-center gap-1.5 transition-all"
            >
              <Key className="w-3.5 h-3.5" />
              Configure API Key
            </button>
          )}
          <button
            type="button"
            onClick={onRefreshAdvice}
            disabled={isLoadingAdvice}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Re-generate advisory with Gemini"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAdvice ? "animate-spin" : ""}`} />
            <span>{isLoadingAdvice ? "Synthesizing..." : "Refresh Advisory"}</span>
          </button>
        </div>
      </div>

      {/* API Key Missing Notice if needed */}
      {!keyConfigured && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">
                Gemini API Key is not yet configured
              </p>
              <p className="text-amber-200/80 mt-0.5">
                Add <code className="bg-amber-900/60 px-1 py-0.5 rounded font-mono text-[11px]">VITE_GEMINI_API_KEY</code> in your <code className="bg-amber-900/60 px-1 py-0.5 rounded font-mono text-[11px]">.env</code> file, or click below to paste a free Gemini key.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-all shadow-md"
          >
            Paste API Key
          </button>
        </div>
      )}

      {/* Advisory Content */}
      {isLoadingAdvice ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
            <Sparkles className="w-5 h-5 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="text-center">
            <div className="font-bold text-sm text-slate-200">
              Gemini 2.5 Flash is analyzing live air conditions...
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Correlating {city?.name}'s PM2.5 & NO₂ with "{activity}" for {healthProfile}
            </div>
          </div>
        </div>
      ) : advice ? (
        <div className="space-y-6">
          {/* Risk Verdict Banner */}
          <div
            className={`rounded-2xl p-5 border shadow-lg ${currentVerdict.bg} ${currentVerdict.borderGlow} transition-all`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <VerdictIcon className="w-6 h-6 stroke-[2.5]" />
                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                  Risk Verdict for {healthProfile}
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${currentVerdict.badgeBg}`}
              >
                {advice.verdict}
              </span>
            </div>
            <p className="text-base font-semibold text-slate-100 leading-snug">
              {advice.verdictReason || advice.summary}
            </p>
            {advice.contextualInsight && (
              <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-300 flex items-start gap-2">
                <span className="font-semibold text-cyan-400 shrink-0">Urban Insight:</span>
                <span>{advice.contextualInsight}</span>
              </div>
            )}
          </div>

          {/* 3 Actionable Tips Cards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              3 Hyper-Specific Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tip 1: Mask Recommendation */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <span className="text-lg">🎭</span>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {advice.tips?.[0]?.title || "Mask Recommendation"}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-slate-200 mb-1.5 leading-snug">
                    {advice.tips?.[0]?.action || "Wear N95/KF94 mask in traffic"}
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {advice.tips?.[0]?.detail || "Standard cloth masks do not block sub-2.5 micron particles."}
                  </div>
                </div>
              </div>

              {/* Tip 2: Best Time Window */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 mb-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {advice.tips?.[1]?.title || "Optimal Time Window"}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-slate-200 mb-1.5 leading-snug">
                    {advice.tips?.[1]?.action || "Plan outdoor activities for mid-afternoon"}
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {advice.tips?.[1]?.detail || "Avoid early mornings when thermal inversions trap ground-level exhaust."}
                  </div>
                </div>
              </div>

              {/* Tip 3: Indoor Air Advice */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Home className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {advice.tips?.[2]?.title || "Indoor Air Defense"}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-slate-200 mb-1.5 leading-snug">
                    {advice.tips?.[2]?.action || "Keep windows closed and run HEPA filter"}
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {advice.tips?.[2]?.detail || "Wet mop floors instead of sweeping to prevent resuspension of dust."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Interactive Follow-Up Chat Pane */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            Interactive Follow-Up Assistant
          </h3>
          <span className="text-xs text-slate-400">Contextual Chat with Gemini</span>
        </div>

        {/* Chat History Box */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 h-64 overflow-y-auto space-y-3 scrollbar-thin">
          {chatMessages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-cyan-600 text-slate-950 font-medium rounded-tr-none shadow-md shadow-cyan-600/20"
                      : msg.isError
                      ? "bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-tl-none"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 px-1 mt-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
          {isSendingMessage && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Gemini is formulating advice...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none">
          <span className="text-[11px] text-slate-400 whitespace-nowrap mr-1">Ask:</span>
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(q)}
              disabled={isSendingMessage}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/60 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask Gemini about air quality in ${city?.name}...`}
            disabled={isSendingMessage}
            className="flex-1 bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSendingMessage}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
