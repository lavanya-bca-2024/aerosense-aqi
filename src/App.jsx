import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import CitySearch from "./components/CitySearch";
import AqiHeroCard from "./components/AqiHeroCard";
import UserContextControls from "./components/UserContextControls";
import GeminiAdvisor from "./components/GeminiAdvisor";
import TabbedAnalytics from "./components/TabbedAnalytics";
import BreezyChatbot from "./components/BreezyChatbot";
import ApiKeyModal from "./components/ApiKeyModal";
import AnimatedBackground from "./components/AnimatedBackground";
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
  const [apiKeyVersion, setApiKeyVersion] = useState(0);

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

  // Request Gemini AI advice with ultra-concise rules
  const consultGeminiAdvisor = useCallback(
    async (city, data, profile, act) => {
      if (!data) return;

      if (!hasGeminiApiKey()) {
        const aqi = data.metrics?.us_aqi || 0;
        const category = getAqiCategory(aqi);
        setAdvice({
          verdict: category.verdict,
          verdictReason: `Current air is ${category.label.toLowerCase()} for your routine.`,
          riskLevel: category.label,
          tips: [
            {
              category: "mask",
              title: "Mask",
              action: aqi > 100 ? "Wear N95 Mask" : "Mask Optional",
              detail: aqi > 100 ? "Filters fine soot particles in traffic." : "Air quality poses minimal inhalation risk.",
            },
            {
              category: "window",
              title: "Best Time",
              action: "Midday 12–3 PM",
              detail: "Avoid morning temperature inversions trapping exhaust.",
            },
            {
              category: "indoor",
              title: "Indoor Air",
              action: "Run HEPA Purifier",
              detail: "Keep street windows sealed and wet mop.",
            },
          ],
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
          verdictReason: `Air quality is ${category.label.toLowerCase()} for your health profile.`,
          tips: [
            {
              category: "mask",
              title: "Mask",
              action: aqi > 100 ? "Wear N95 Mask" : "Mask Optional",
              detail: "Filters microscopic traffic combustion soot.",
            },
            {
              category: "window",
              title: "Best Time",
              action: "Midday 12–3 PM",
              detail: "Avoid morning peak traffic hours.",
            },
            {
              category: "indoor",
              title: "Indoor Air",
              action: "Recirculate Air",
              detail: "Keep street windows closed during traffic.",
            },
          ],
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

  const currentAqi = airData?.metrics?.us_aqi ?? 60;

  return (
    <div className="min-h-screen text-forest-900 flex flex-col font-sans relative selection:bg-emerald-300 selection:text-emerald-950">
      {/* Dynamic Air-Quality Background Animation (morphes with AQI) */}
      <AnimatedBackground aqi={currentAqi} />

      {/* Top Navigation Bar */}
      <Header
        key={apiKeyVersion}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Single-Column Vertical Flow Layout (max-w-4xl mx-auto space-y-6) */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10 pb-28">
        {/* Error Alert if Air API fails */}
        {airError && (
          <div className="p-4 rounded-3xl bg-rose-50/95 backdrop-blur-md border border-rose-200 text-rose-800 flex items-center justify-between gap-3 text-sm shadow-soft">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{airError}</span>
            </div>
            <button
              type="button"
              onClick={handleRefreshData}
              className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* 1. City Search Bar + Use My Location + Quick City Chips */}
        <CitySearch
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
        />

        {/* 2. Current Air Quality Index Card */}
        {airData ? (
          <AqiHeroCard
            city={selectedCity}
            currentData={airData}
            onRefresh={handleRefreshData}
            isRefreshing={isLoadingAir}
          />
        ) : (
          <div className="h-56 rounded-3xl bg-white/95 backdrop-blur-md border border-emerald-200/80 flex items-center justify-center animate-pulse shadow-lg">
            <div className="flex items-center gap-2 text-forest-500">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
              <span className="text-sm font-medium">Fetching air data for {selectedCity.name}...</span>
            </div>
          </div>
        )}

        {/* 3. Health Profile & Planned Activity Card */}
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

        {/* 4. Smart Health Advisor Card (Risk Verdict + 3 Actionable Recommendations) */}
        <GeminiAdvisor
          city={selectedCity}
          healthProfile={healthProfile}
          activity={activity}
          advice={advice}
          isLoadingAdvice={isLoadingAdvice}
          onRefreshAdvice={handleApplyContext}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />

        {/* 5. Deep-Dive Tabs (24-Hour Trend Chart & All Pollutants) */}
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

      {/* Consumer-Friendly Footer */}
      <footer className="border-t border-emerald-200/70 bg-white/85 backdrop-blur-md py-5 mt-6 text-center text-xs text-forest-600 relative z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold text-forest-900 font-display">AeroSense</span>
            <span>•</span>
            <span>Urban Air Quality Assistant for Indian Cities</span>
          </div>
          <div className="flex items-center gap-3 text-forest-600 font-medium text-[11px]">
            <span>Live Sensor Feeds</span>
            <span>•</span>
            <span>WHO & CPCB Standards</span>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => {
          setApiKeyVersion((v) => v + 1);
          if (airData) {
            consultGeminiAdvisor(selectedCity, airData, healthProfile, activity);
          }
        }}
      />
    </div>
  );
}
