import { GoogleGenerativeAI } from "@google/generative-ai";

const STORAGE_KEY = "aerosense_gemini_api_key";
const MODEL_NAME = "gemini-2.5-flash";

/**
 * Retrieves the Gemini API key from environment variable or localStorage fallback
 */
export function getGeminiApiKey() {
  // Check Vite environment variable
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim() !== "" && envKey !== "your_gemini_api_key_here") {
    return envKey.trim();
  }
  // Check local storage fallback
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
    throw new Error("Gemini API Key is missing. Please configure VITE_GEMINI_API_KEY in .env or provide a key in the settings.");
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Generates structured AI Advisor recommendations
 * Returns: { verdict: 'Safe'|'Caution'|'Avoid', verdictReason, riskLevel, tips: [...], contextualInsight }
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

  const cityName = city?.name || "the city";
  const region = city?.admin1 ? `${city.admin1}, ` : "";
  const locationStr = `${cityName}, ${region}${city?.country || "India"}`;

  const aqi = currentData?.metrics?.us_aqi ?? "Unknown";
  const pm25 = currentData?.metrics?.pm2_5 ?? "Unknown";
  const pm10 = currentData?.metrics?.pm10 ?? "Unknown";
  const no2 = currentData?.metrics?.nitrogen_dioxide ?? "Unknown";
  const o3 = currentData?.metrics?.ozone ?? "Unknown";
  const so2 = currentData?.metrics?.sulphur_dioxide ?? "Unknown";
  const co = currentData?.metrics?.carbon_monoxide ?? "Unknown";

  const prompt = `
You are AeroSense AI, an expert environmental epidemiologist and urban air quality advisor specializing in Indian urban microclimates (traffic corridors, dust suspension, stubble/thermal inversions, and photochemical smog).

Current Live Air Quality Data for ${locationStr}:
- US AQI: ${aqi}
- PM2.5 (Fine Particulate): ${pm25} µg/m³ (WHO safe threshold is 15 µg/m³, CPCB limit is 60 µg/m³)
- PM10 (Coarse Dust): ${pm10} µg/m³ (WHO threshold 45 µg/m³, CPCB limit 100 µg/m³)
- NO₂ (Nitrogen Dioxide from traffic/diesel): ${no2} µg/m³ (WHO threshold 25 µg/m³)
- O₃ (Ground-level Ozone): ${o3} µg/m³ (WHO threshold 100 µg/m³)
- SO₂: ${so2} µg/m³
- CO: ${co} µg/m³

User Health Profile: ${healthProfile}
Planned Activity: ${activity || "Standard daily urban routine"}

Task:
Analyze this exact user context against the live pollutant concentrations and generate a hyper-specific, actionable health advisory in JSON format.

JSON Schema:
{
  "verdict": "Safe" | "Caution" | "Avoid",
  "verdictReason": "Concise 1-2 sentence punchy rationale combining their exact activity, health risk, and dominant pollutant.",
  "riskLevel": "Low" | "Moderate" | "High" | "Severe",
  "dominantPollutant": "PM2.5" | "PM10" | "NO2" | "Ozone",
  "tips": [
    {
      "category": "mask",
      "title": "Mask Recommendation",
      "action": "Specific mask guidance (e.g., No mask needed / Well-fitted N95 or KF94 respirator / Avoid cloth masks as they fail on PM2.5 / Exhaust valve vs non-valve advice).",
      "detail": "1-2 sentences on how to wear it and why."
    },
    {
      "category": "window",
      "title": "Best Time Window",
      "action": "Concrete recommended time window for their planned activity (or when to reschedule, e.g. midday vs early morning inversion vs late night).",
      "detail": "1-2 sentences explaining diurnal pollutant patterns in Indian cities."
    },
    {
      "category": "indoor",
      "title": "Indoor Air Advice",
      "action": "Specific indoor air quality mitigation (e.g. cross-ventilation vs keeping windows closed, HEPA purifier fan speed, avoiding agarbatti/incense/frying, wet mopping).",
      "detail": "1-2 sentences with practical Indian household tips."
    }
  ],
  "contextualInsight": "A sharp urban insight (e.g. regarding Bangalore/Delhi/Mumbai local weather, elevation, peak traffic hours, or thermal inversion trapping exhaust near ground level)."
}

Ensure the verdict strictly adheres to medical standards:
- If US AQI > 150 or PM2.5 > 75 for Sensitive/Asthma/Kids/Elderly: Verdict must be "Avoid" or strong "Caution".
- If activity is heavy aerobic (Outdoor Runner) and AQI > 120: Recommend indoor alternatives or shifting hours.
- Return ONLY valid JSON.
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
 * Initializes and conducts interactive follow-up chat with Gemini
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
    systemInstruction: `You are AeroSense AI, a knowledgeable, empathetic, and scientifically rigorous air quality advisor for Indian cities.
You are chatting with a user in ${city?.name || "an Indian city"}, ${city?.country || "India"}.
Live Context:
- Current US AQI: ${currentData?.metrics?.us_aqi}
- PM2.5: ${currentData?.metrics?.pm2_5} µg/m³
- PM10: ${currentData?.metrics?.pm10} µg/m³
- NO2: ${currentData?.metrics?.nitrogen_dioxide} µg/m³
- Ozone: ${currentData?.metrics?.ozone} µg/m³
- User Profile: ${healthProfile}
- Planned Activity: ${activity}

Respond concisely, with actionable medical and environmental clarity. Reference specific pollutants, Indian daily realities (traffic, humidity, ventilation, air purifiers, masks like N95), and offer practical solutions. Keep answers within 2-4 focused paragraphs or clean bullet points.`,
  });

  // Build history format compatible with Gemini SDK
  const formattedHistory = chatHistory.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: formattedHistory,
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
