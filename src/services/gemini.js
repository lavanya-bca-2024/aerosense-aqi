import { GoogleGenerativeAI } from "@google/generative-ai";

const STORAGE_KEY = "aerosense_gemini_api_key";
const MODEL_NAME = "gemini-2.5-flash";

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
 * Generates punchy, ultra-concise AI Advisor recommendations (scannable, no fluff!)
 */
export async function generateAirQualityAdvice({
  city,
  currentData,
  healthProfile,
  activity,
}) {
  const genAI = getGenAIClient();
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const locationStr = `${city?.name || "City"}, ${city?.country || "India"}`;
  const aqi = currentData?.metrics?.us_aqi ?? "Unknown";
  const pm25 = currentData?.metrics?.pm2_5 ?? "Unknown";
  const pm10 = currentData?.metrics?.pm10 ?? "Unknown";
  const no2 = currentData?.metrics?.nitrogen_dioxide ?? "Unknown";
  const o3 = currentData?.metrics?.ozone ?? "Unknown";

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
  "contextualInsight": "PM2.5 levels are elevated from morning urban traffic."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);
    return parsed;
  } catch (err) {
    console.error("Gemini advice generation failed:", err);
    throw err;
  }
}

/**
 * Conducts warm, casual, ultra-short follow-up chat with Breezy
 * Breezy always replies in 1-2 short sentences max (under 35 words) with 1 emoji!
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
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: `You are Breezy, a warm, cheerful, and helpful friend checking Indian city air quality.
Current Location: ${city?.name || "the city"}, ${city?.country || "India"}.
Live Data: US AQI ${currentData?.metrics?.us_aqi}, PM2.5 ${currentData?.metrics?.pm2_5} µg/m³.
User: ${healthProfile} planning "${activity}".

STRICT RESPONSE RULES:
1. Talk like a friendly, caring companion—warm, casual, and encouraging.
2. STRICT LENGTH: Reply in EXACTLY 1 or 2 short sentences max (under 35 words total).
3. Include exactly 1 fitting emoji (🍃, 🏃, 😷, ☀️, or 🏠).
4. NEVER write long paragraphs, technical jargon, or bullet lists. Be super concise, punchy, and actionable!`,
  });

  // Filter chatHistory so it strictly begins with the first 'user' turn (omits initial welcome greeting)
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

  // If the last item in validHistory is already a user message, pop it so chat.sendMessage passes it as the active turn.
  if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === "user") {
    validHistory.pop();
  }

  const chat = model.startChat({
    history: validHistory,
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
