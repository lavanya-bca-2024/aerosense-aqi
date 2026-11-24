import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Send, 
  Sparkles, 
  Key
} from "lucide-react";
import { sendFollowUpChatMessage, hasGeminiApiKey } from "../services/gemini";

// Cute Custom Leaf Mascot SVG for Breezy
export function BreezyMascot({ className = "w-6 h-6", isWaving = false }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} ${isWaving ? "animate-wiggle" : ""}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 50C15 35 30 35 45 42C60 48 75 45 85 35"
        stroke="#A7F3D0"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="2 6"
      />
      <path
        d="M20 75C30 65 50 68 65 60C78 52 82 40 90 42"
        stroke="#6EE7B7"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M50 12C30 20 20 42 24 64C28 80 44 92 64 88C82 84 92 66 86 44C82 26 68 12 50 12Z"
        fill="url(#breezyGradient)"
      />
      <path
        d="M50 12C38 32 38 60 64 88"
        stroke="#047857"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
      <circle cx="43" cy="48" r="4.5" fill="#064E3B" />
      <circle cx="41.5" cy="46.5" r="1.5" fill="white" />
      <circle cx="63" cy="48" r="4.5" fill="#064E3B" />
      <circle cx="61.5" cy="46.5" r="1.5" fill="white" />
      <circle cx="36" cy="56" r="4" fill="#FCA5A5" fillOpacity="0.6" />
      <circle cx="70" cy="56" r="4" fill="#FCA5A5" fillOpacity="0.6" />
      <path
        d="M48 57C51 61 55 61 58 57"
        stroke="#064E3B"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="50" cy="14" r="3" fill="#D1FAE5" />
      <defs>
        <linearGradient
          id="breezyGradient"
          x1="20"
          y1="12"
          x2="88"
          y2="88"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function BreezyChatbot({
  city,
  currentData,
  healthProfile,
  activity,
  onOpenApiKeyModal,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const keyConfigured = hasGeminiApiKey();

  // Casual 1-line greeting
  const initialGreeting = `Hey! I’m Breezy 🍃 Checking ${city?.name || "your city"}’s air for you—what’s your plan today?`;

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: initialGreeting,
      timestamp: "Just now",
      isWelcome: true,
    },
  ]);

  // Update greeting when city changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].isWelcome) {
        return [
          {
            role: "assistant",
            content: `Hey! I’m Breezy 🍃 Checking ${city?.name || "your city"}’s air for you—what’s your plan today?`,
            timestamp: "Just now",
            isWelcome: true,
          },
        ];
      }
      return prev;
    });
  }, [city?.name]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isSending]);

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isSending) return;

    if (!keyConfigured) {
      onOpenApiKeyModal();
      return;
    }

    const userMessage = {
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsSending(true);

    try {
      const response = await sendFollowUpChatMessage({
        chatHistory: messages,
        userMessage: textToSend.trim(),
        city,
        currentData,
        healthProfile,
        activity,
      });

      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Breezy chat error:", err);
      const errorMsg = {
        role: "assistant",
        content: `Oops! Couldn't reach Breezy: ${err.message || "Please check your API key."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const sampleQuestions = [
    "Need an N95 today?",
    "Best time for my jog?",
    "Can I open windows tonight?",
    "Safe for kids outside?",
  ];

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 pl-3 pr-4 py-2 bg-white/95 hover:bg-emerald-50 border border-emerald-300 rounded-full shadow-breezy transition-all duration-300 hover:scale-105 backdrop-blur-md"
            title="Chat with Breezy • Air Assistant"
          >
            <div className="relative w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <BreezyMascot className="w-6 h-6 group-hover:scale-110 transition-transform" isWaving={true} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold text-forest-900 leading-none">Ask Breezy</div>
              <div className="text-[10px] text-emerald-700 font-semibold leading-tight">Air Quality AI</div>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Popup Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-88 sm:w-96 max-w-[calc(100vw-2rem)] h-[460px] bg-white rounded-3xl border border-emerald-200 shadow-soft-xl flex flex-col overflow-hidden animate-popupIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-3.5 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center p-1 border border-white/30">
                <BreezyMascot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5 font-display">
                  <span>Breezy</span>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                    Smart Air Assistant
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Live for {city?.name || "your location"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {!keyConfigured && (
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="p-1 rounded-lg hover:bg-white/20 text-emerald-100 hover:text-white transition-colors"
                  title="Configure API Key"
                >
                  <Key className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-emerald-100 hover:text-white transition-colors"
                title="Close chat window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Missing Key Warning Pill */}
          {!keyConfigured && (
            <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-xs text-amber-900">
              <span className="text-[10px] font-medium leading-tight">
                AI Key missing. Tap to paste free key.
              </span>
              <button
                type="button"
                onClick={onOpenApiKeyModal}
                className="text-[10px] uppercase font-bold text-amber-800 underline ml-2 whitespace-nowrap"
              >
                Add Key
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-[#F6FAF7]">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-2.5 text-xs leading-relaxed shadow-2xs ${
                      isUser
                        ? "bg-emerald-600 text-white font-medium rounded-tr-none"
                        : msg.isError
                        ? "bg-rose-50 border border-rose-200 text-rose-800 rounded-tl-none"
                        : "bg-white border border-emerald-100 text-forest-900 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                  <span className="text-[9px] text-forest-400 px-1 mt-0.5">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            {isSending && (
              <div className="flex items-center gap-1.5 text-forest-600 text-xs py-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>Breezy is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Chips */}
          <div className="px-3 py-1.5 bg-white border-t border-emerald-50 flex items-center gap-1 overflow-x-auto scrollbar-none">
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q)}
                disabled={isSending}
                className="text-[10px] px-2.5 py-1 rounded-xl bg-sage-50 hover:bg-emerald-50 text-forest-700 hover:text-emerald-900 border border-emerald-100 whitespace-nowrap transition-colors font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-emerald-100 flex items-center gap-1.5"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Breezy anything..."
              disabled={isSending}
              className="flex-1 px-3 py-1.5 bg-sage-50/70 border border-emerald-100 rounded-xl text-xs text-forest-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
              title="Send to Breezy"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
