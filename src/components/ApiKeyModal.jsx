import React, { useState } from "react";
import { Key, X, Check, ExternalLink, ShieldCheck, Trash2 } from "lucide-react";
import { getGeminiApiKey, setGeminiApiKey, getApiKeySource } from "../services/gemini";

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const currentKey = getGeminiApiKey();
  const source = getApiKeySource();
  const [inputKey, setInputKey] = useState(currentKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setGeminiApiKey(inputKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onKeySaved();
      onClose();
    }, 700);
  };

  const handleClear = () => {
    setGeminiApiKey("");
    setInputKey("");
    onKeySaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-emerald-100 rounded-3xl p-6 shadow-soft-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-xl text-forest-400 hover:text-forest-900 hover:bg-emerald-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-2xs">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-forest-900 font-display">Gemini API Key Setup</h3>
            <p className="text-xs text-forest-500">
              Powers real-time air quality risk verdicts & Breezy AI chat
            </p>
          </div>
        </div>

        {source === "env" && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Currently loaded from <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200">.env</code> (VITE_GEMINI_API_KEY).</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
              Paste Gemini API Key (Fallback or Custom)
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-sage-50/70 border border-emerald-200 rounded-xl text-sm text-forest-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-500 font-mono transition-all"
            />
            <p className="text-[11px] text-forest-500 mt-1.5">
              Saved securely in your browser's <code className="text-forest-700 font-mono">localStorage</code> for deployed demo testing.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 font-semibold transition-colors"
            >
              <span>Get free key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {inputKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-forest-600 hover:text-forest-900 hover:bg-emerald-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm shadow-emerald-600/20 flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
