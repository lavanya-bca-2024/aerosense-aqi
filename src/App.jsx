import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import CitySearch from "./components/CitySearch";
import AqiHeroCard from "./components/AqiHeroCard";
import UserContextControls from "./components/UserContextControls";
import GeminiAdvisor from "./components/GeminiAdvisor";
import TabbedAnalytics from "./components/TabbedAnalytics";
import BreezyChatbot from "./components/BreezyChatbot";
import ApiKeyModal from "./components/ApiKeyModal";
import { DEFAULT_CITY, fetchAirQualityData } from "./services/openMeteo";
import { generateAirQualityAdvice, hasGeminiApiKey } from "./services/gemini";
import { getAqiCategory } from "./utils/aqiUtils";
import { AlertTriangle, RefreshCw, Leaf } from "lucide-react";

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
        const aqi = data.metrics?.us_aqi || 0;
        const category = getAqiCategory(aqi);
        setAdvice({
          verdict: category.verdict,
          verdictReason: `Current US AQI is ${aqi} (${category.label}) in ${city.name}. For "${act}" with ${profile} profile, standard precautions are advised.`,
          riskLevel: category.label,
          dominantPollutant: data.metrics?.pm2_5 > 40 ? "PM2.5" : "PM10",
          tips: [
            {
              category: "mask",
              title: "Mask Recommendation",
              action: aqi > 100 ? "Wear a well-fitted N95 or KF94 respirator" : "Standard mask optional based on traffic density",
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
        const aqi = data.metrics?.us_aqi || 0;
        const category = getAqiCategory(aqi);
        setAdvice({
          verdict: category.verdict,
          verdictReason: `Advisory based on AQI ${aqi} (${category.label}) for ${profile}. (Gemini API error: ${err.message})`,
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
              title: "Indoor Air Defense",
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

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

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
    <div className="min-h-screen bg-[#F3F9F5] text-forest-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Error Alert if Air API fails */}
        {airError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{airError}</span>
            </div>
            <button
              type="button"
              onClick={handleRefreshData}
              className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* ABOVE THE FOLD: 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT COLUMN: Search, Hero Card, Context Controls */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            {/* 1. City Search + Use My Location */}
            <CitySearch
              selectedCity={selectedCity}
              onSelectCity={handleCitySelect}
            />

            {/* 2. Live AQI Hero Card (Score, Status, PM2.5 & PM10) */}
            {airData ? (
              <AqiHeroCard
                city={selectedCity}
                currentData={airData}
                onRefresh={handleRefreshData}
                isRefreshing={isLoadingAir}
              />
            ) : (
              <div className="h-56 rounded-3xl bg-white border border-emerald-100 flex items-center justify-center animate-pulse">
                <div className="flex items-center gap-2.5 text-forest-500">
                  <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
                  <span className="text-sm font-medium">Fetching air data for {selectedCity.name}...</span>
                </div>
              </div>
            )}

            {/* 3. User Context Controls (Health Profile + Activity Input) */}
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
          </div>

          {/* RIGHT COLUMN: Gemini Risk Verdict & 3 Actionable Tips */}
          <div className="lg:col-span-6">
            <GeminiAdvisor
              city={selectedCity}
              healthProfile={healthProfile}
              activity={activity}
              advice={advice}
              isLoadingAdvice={isLoadingAdvice}
              onRefreshAdvice={handleApplyContext}
              onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            />
          </div>
        </div>

        {/* BELOW THE FOLD: Clean Tabbed Section (24h Trends & 6-Pollutant Breakdown) */}
        <TabbedAnalytics currentData={airData} />
      </main>

      {/* Cute Floating Chatbot: Breezy */}
      <BreezyChatbot
        city={selectedCity}
        currentData={airData}
        healthProfile={healthProfile}
        activity={activity}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-emerald-100/90 bg-white/70 py-5 mt-10 text-center text-xs text-forest-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold text-forest-900 font-display">AeroSense</span>
            <span>•</span>
            <span>Fresh Urban Air Quality Intelligence for Indian Cities</span>
          </div>
          <div className="flex items-center gap-3 text-forest-500 font-medium">
            <span>Powered by Open-Meteo & Gemini 2.5 Flash</span>
            <span>•</span>
            <span>WHO & CPCB NAAQS Standards</span>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
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
