import { GoogleGenerativeAI } from "@google/generative-ai";

const STORAGE_KEY = "aerosense_gemini_api_key";
const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.1-flash-lite-preview",
];

/**
 * Retrieves the Gemini API key from environment variable or localStorage fallback
 */
export function getGeminiApiKey() {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim() !== "" && envKey !== "your_gemini_api_key_here") {
    return envKey.trim();
  }
  const localKey = localStorage.getItem(STORAGE_KEY);
  if (localKey && localKey.trim() !== "") {
    return localKey.trim();
  }
  return "";
}

/**
 * Persists user-provided fallback key in localStorage
 */
export function setGeminiApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Checks whether an API key is currently available
 */
export function hasGeminiApiKey() {
  const key = getGeminiApiKey();
  return Boolean(key && key.length > 5);
}

/**
 * Checks source of the API key ("env" | "local" | "none")
 */
export function getApiKeySource() {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim() !== "" && envKey !== "your_gemini_api_key_here") {
    return "env";
  }
  const localKey = localStorage.getItem(STORAGE_KEY);
  if (localKey && localKey.trim() !== "") {
    return "local";
  }
  return "none";
}

/**
 * Helper to initialize the Gemini client
 */
function getGenAIClient() {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please configure VITE_GEMINI_API_KEY in .env or provide a key in settings.");
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Session storage cache helpers to preserve free-tier quota
 */
function getCachedAdvice(cacheKey) {
  try {
    const raw = sessionStorage.getItem(cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < 10 * 60 * 1000) {
      return parsed.data;
    }
  } catch (e) {
    // ignore sessionStorage errors
  }
  return null;
}

function setCachedAdvice(cacheKey, data) {
  try {
    sessionStorage.setItem(
      cacheKey,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch (e) {
    // ignore sessionStorage errors
  }
}

/**
 * Generates punchy, ultra-concise AI Advisor recommendations
 * With automatic model fallback across current active models:
 * ['gemini-3.5-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-3.1-flash-lite-preview']
 */
export async function generateAirQualityAdvice({
  city,
  currentData,
  healthProfile,
  activity,
}) {
  const aqi = currentData?.metrics?.us_aqi ?? "Unknown";
  const pm25 = currentData?.metrics?.pm2_5 ?? "Unknown";
  const pm10 = currentData?.metrics?.pm10 ?? "Unknown";
  const no2 = currentData?.metrics?.nitrogen_dioxide ?? "Unknown";
  const o3 = currentData?.metrics?.ozone ?? "Unknown";

  // Check sessionStorage cache first
  const cacheKey = `aerosense_adv_${encodeURIComponent(city?.name || "city")}_${healthProfile}_${activity}_${Math.round(aqi || 0)}`;
  const cached = getCachedAdvice(cacheKey);
  if (cached) {
    return cached;
  }

  const genAI = getGenAIClient();
  const locationStr = `${city?.name || "City"}, ${city?.country || "India"}`;

  const prompt = `
You are AeroSense AI. Analyze live air quality for ${locationStr}:
AQI: ${aqi}, PM2.5: ${pm25} µg/m³, PM10: ${pm10} µg/m³, NO2: ${no2} µg/m³, O3: ${o3} µg/m³.
User Profile: ${healthProfile}.
Activity: ${activity || "Daily routine"}.

STRICT FORMAT RULES:
1. "verdict": "Safe" | "Caution" | "Avoid".
2. "verdictReason": A SINGLE crisp sentence (MAX 15 words).
3. "tips": Array of 3 items (Mask, Best Time, Indoor Air). Each item MUST have:
   - "action": Bold punchy headline (2-4 words, e.g. "Wear N95 Mask" or "Midday 12-3 PM" or "Run HEPA Purifier").
   - "detail": ULTRA-CONCISE sentence (STRICTLY MAXIMUM 10 WORDS). No long text!
4. "contextualInsight": 1 short punchy sentence (max 12 words).

JSON Schema:
{
  "verdict": "Safe" | "Caution" | "Avoid",
  "verdictReason": "Single crisp sentence under 15 words.",
  "tips": [
    {
      "category": "mask",
      "title": "Mask",
      "action": "Wear N95 Mask",
      "detail": "Filters fine combustion soot in traffic."
    },
    {
      "category": "window",
      "title": "Best Time",
      "action": "Midday 12–3 PM",
      "detail": "Avoid morning temperature inversions."
    },
    {
      "category": "indoor",
      "title": "Indoor Air",
      "action": "Run HEPA Purifier",
      "detail": "Keep street-facing windows sealed."
    }
  ],
  "contextualInsight": "PM2.5 levels are elevated from morning traffic."
}
`;

  let lastError = null;

  // Attempt generation with active fallback models
  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);

      // Save to cache
      setCachedAdvice(cacheKey, parsed);
      return parsed;
    } catch (err) {
      console.warn(`Model ${modelName} advice attempt failed, trying fallback:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to generate air advice from all Gemini fallback models.");
}

/**
 * Conducts warm, casual, ultra-short follow-up chat with Breezy
 * Cascades through active fallback models ['gemini-3.5-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-3.1-flash-lite-preview']
 */
export async function sendFollowUpChatMessage({
  chatHistory = [],
  userMessage,
  city,
  currentData,
  healthProfile,
  activity,
}) {
  const genAI = getGenAIClient();

  const systemInstruction = `You are Breezy, a friendly buddy checking Indian city air quality.
Current Location: ${city?.name || "the city"}, ${city?.country || "India"}.
Live Data: US AQI ${currentData?.metrics?.us_aqi}, PM2.5 ${currentData?.metrics?.pm2_5} µg/m³.
User: ${healthProfile} planning "${activity}".

STRICT RULES:
1. Talk like a warm, caring friend.
2. Reply in 2 short sentences max (under 35 words total).
3. Include exactly 1 fitting emoji (🍃, 🏃, 😷, ☀️, or 🏠).
4. No lists, no essays, no technical jargon. Be super punchy!`;

  // Filter chatHistory so it strictly begins with the first 'user' turn (never include initial model greeting)
  const firstUserIndex = chatHistory.findIndex((msg) => msg.role === "user" && !msg.isError);
  
  const validHistory = [];
  if (firstUserIndex !== -1) {
    let expectedRole = "user";
    for (let i = firstUserIndex; i < chatHistory.length; i++) {
      const msg = chatHistory[i];
      if (msg.isError || !msg.content || !msg.content.trim()) continue;
      
      const role = msg.role === "assistant" ? "model" : "user";
      if (role === expectedRole) {
        validHistory.push({
          role,
          parts: [{ text: msg.content.trim() }],
        });
        expectedRole = role === "user" ? "model" : "user";
      }
    }
  }

  // If the last item in validHistory is already userMessage, pop it so chat.sendMessage passes it as the active turn.
  if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === "user") {
    validHistory.pop();
  }

  let lastError = null;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });

      const chat = model.startChat({
        history: validHistory,
      });

      const result = await chat.sendMessage(userMessage);
      return result.response.text();
    } catch (err) {
      console.warn(`Model ${modelName} chat attempt failed, trying fallback:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to connect to Breezy across all fallback models.");
}
