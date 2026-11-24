import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import CitySearch from "./components/CitySearch";
import AqiHeroCard from "./components/AqiHeroCard";
import UserContextControls from "./components/UserContextControls";
import PollutantGrid from "./components/PollutantGrid";
import TrendChart from "./components/TrendChart";
import GeminiAdvisor from "./components/GeminiAdvisor";
import ApiKeyModal from "./components/ApiKeyModal";
import { DEFAULT_CITY, fetchAirQualityData } from "./services/openMeteo";
import { generateAirQualityAdvice, hasGeminiApiKey } from "./services/gemini";
import { getAqiCategory } from "./utils/aqiUtils";
import { AlertTriangle, RefreshCw, Sparkles, Heart } from "lucide-react";

export default function App() {
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
  const [airData, setAirData] = useState(null);
  const [isLoadingAir, setIsLoadingAir] = useState(true);
  const [airError, setAirError] = useState(null);

  // User Context state
  const [healthProfile, setHealthProfile] = useState("General Public");
  const [activity, setActivity] = useState("Morning jog at 7 AM");

  // Gemini AI state
  const [advice, setAdvice] = useState(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Fetch air quality data for the city
  const loadAirQuality = useCallback(async (city) => {
    setIsLoadingAir(true);
    setAirError(null);
    try {
      const data = await fetchAirQualityData(
        city.latitude,
        city.longitude,
        city.timezone
      );
      setAirData(data);
      return data;
    } catch (err) {
      console.error("Air quality fetch error:", err);
      setAirError(err.message || "Failed to load live air quality data");
      return null;
    } finally {
      setIsLoadingAir(false);
    }
  }, []);

  // Request Gemini AI advice
  const consultGeminiAdvisor = useCallback(
    async (city, data, profile, act) => {
      if (!data) return;

      if (!hasGeminiApiKey()) {
        // Fallback local heuristic advice until user inputs their Gemini key
        const aqi = data.metrics?.us_aqi || 0;
        const category = getAqiCategory(aqi);
        setAdvice({
          verdict: category.verdict,
          verdictReason: `Current US AQI is ${aqi} (${category.label}) in ${city.name}. For "${act}" with ${profile} profile, observe standard precautionary measures.`,
          riskLevel: category.label,
          dominantPollutant: data.metrics?.pm2_5 > 40 ? "PM2.5" : "PM10",
          tips: [
            {
              category: "mask",
              title: "Mask Recommendation",
              action: aqi > 100 ? "Wear a well-fitted N95 or KF94 respirator" : "Standard mask optional depending on traffic density",
              detail: "Standard surgical or cloth masks filter less than 30% of sub-2.5µm combustion soot.",
            },
            {
              category: "window",
              title: "Optimal Time Window",
              action: "Prefer late mornings or afternoons (11 AM - 4 PM)",
              detail: "Early morning thermal inversions in Indian cities trap ground emissions close to breathing zones.",
            },
            {
              category: "indoor",
              title: "Indoor Air Defense",
              action: "Seal street-facing windows & use HEPA air purifier",
              detail: "Wet-mop floors to capture settled coarse particulate matter without creating airborne dust.",
            },
          ],
          contextualInsight: `Open-Meteo live feed indicates primary pollutant concentrations reflect current urban vehicular & meteorological patterns in ${city.name}.`,
        });
        return;
      }

      setIsLoadingAdvice(true);
      try {
        const aiResult = await generateAirQualityAdvice({
          city,
          currentData: data,
          healthProfile: profile,
          activity: act,
        });
        setAdvice(aiResult);
      } catch (err) {
        console.error("Gemini advice error:", err);
        // Fallback if call fails
        const aqi = data.metrics?.us_aqi || 0;
        const category = getAqiCategory(aqi);
        setAdvice({
          verdict: category.verdict,
          verdictReason: `Advisory based on current AQI ${aqi} (${category.label}) for ${profile}. (Gemini API error: ${err.message})`,
          tips: [
            {
              category: "mask",
              title: "Mask Recommendation",
              action: aqi > 100 ? "Wear certified N95 mask" : "Mask optional outdoors",
              detail: "Ensure nose clip is pressed firmly against facial contours.",
            },
            {
              category: "window",
              title: "Best Time Window",
              action: "Avoid early morning peak traffic hours (7:30 - 10:30 AM)",
              detail: "Shifting workouts by 2 hours reduces toxic particulate inhalation by up to 40%.",
            },
            {
              category: "indoor",
              title: "Indoor Air Advice",
              action: "Recirculate indoor air and avoid indoor combustion",
              detail: "Avoid incense sticks and open frying in unventilated kitchen areas.",
            },
          ],
          contextualInsight: `Live sensor data for ${city.name} indicates PM2.5 at ${data.metrics?.pm2_5} µg/m³.`,
        });
      } finally {
        setIsLoadingAdvice(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    loadAirQuality(selectedCity).then((data) => {
      if (data) {
        consultGeminiAdvisor(selectedCity, data, healthProfile, activity);
      }
    });
  }, [selectedCity, loadAirQuality]);

  // When city changes
  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  // Re-trigger advisory when user explicitly clicks Assess or changes context
  const handleApplyContext = () => {
    if (airData) {
      consultGeminiAdvisor(selectedCity, airData, healthProfile, activity);
    }
  };

  const handleRefreshData = () => {
    loadAirQuality(selectedCity).then((data) => {
      if (data) {
        consultGeminiAdvisor(selectedCity, data, healthProfile, activity);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Header onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* City Search & Quick Select */}
        <CitySearch
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
        />

        {/* Error Alert if Air API fails */}
        {airError && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{airError}</span>
            </div>
            <button
              type="button"
              onClick={handleRefreshData}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Air Quality Hero Card */}
        {airData ? (
          <AqiHeroCard
            city={selectedCity}
            currentData={airData}
            onRefresh={handleRefreshData}
            isRefreshing={isLoadingAir}
          />
        ) : (
          <div className="h-64 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center animate-pulse">
            <div className="flex items-center gap-3 text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
              <span className="text-sm">Fetching live air data for {selectedCity.name}...</span>
            </div>
          </div>
        )}

        {/* User Context Controls (Health Profile & Activity) */}
        <UserContextControls
          selectedProfile={healthProfile}
          onSelectProfile={(p) => {
            setHealthProfile(p);
            if (airData) consultGeminiAdvisor(selectedCity, airData, p, activity);
          }}
          activity={activity}
          onActivityChange={setActivity}
          onApplyContext={handleApplyContext}
          isGeneratingAi={isLoadingAdvice}
        />

        {/* Gemini AI Advisor & Interactive Follow-Up Chat */}
        <GeminiAdvisor
          city={selectedCity}
          currentData={airData}
          healthProfile={healthProfile}
          activity={activity}
          advice={advice}
          isLoadingAdvice={isLoadingAdvice}
          onRefreshAdvice={handleApplyContext}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />

        {/* 24-Hour Trend Chart */}
        <TrendChart currentData={airData} />

        {/* Detailed Pollutants Breakdown Grid */}
        <PollutantGrid currentData={airData} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">AeroSense</span>
            <span>•</span>
            <span>Urban Air Quality Assistant for Indian Cities</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Open-Meteo & Gemini 2.5 Flash</span>
            <span>•</span>
            <span>WHO & CPCB Standards</span>
          </div>
        </div>
      </footer>

      {/* Fallback API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => {
          if (airData) {
            consultGeminiAdvisor(selectedCity, airData, healthProfile, activity);
          }
        }}
      />
    </div>
  );
}
