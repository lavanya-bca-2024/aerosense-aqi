import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, Loader2, Sparkles, Navigation, LocateFixed, AlertCircle } from "lucide-react";
import { searchCities, reverseGeocode, POPULAR_INDIAN_CITIES, DEFAULT_CITY } from "../services/openMeteo";

export default function CitySearch({ selectedCity, onSelectCity }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const hits = await searchCities(query);
        setResults(hits);
        setIsOpen(true);
      } catch (err) {
        console.error("City search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    onSelectCity(city);
    setQuery("");
    setIsOpen(false);
    setResults([]);
  };

  // Browser Geolocation Handler
  const handleUseMyLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      onSelectCity(DEFAULT_CITY);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const detectedCity = await reverseGeocode(lat, lon);
          onSelectCity(detectedCity);
        } catch (err) {
          console.error("Failed to detect location:", err);
          setLocationError("Could not resolve your location name. Reverting to Bengaluru.");
          onSelectCity(DEFAULT_CITY);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn("Geolocation denied or unavailable:", error.message);
        setLocationError("Location access denied or unavailable. Defaulting to Bengaluru.");
        onSelectCity(DEFAULT_CITY);
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-2.5">
      {/* Search Input Bar + Use My Location button */}
      <div className="flex items-center gap-2" ref={dropdownRef}>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="Search any Indian or global city (e.g. Bengaluru, Delhi, Pune, London)..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-emerald-200 rounded-2xl text-sm text-forest-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-500 shadow-soft transition-all"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-forest-900"
            >
              <X className="w-4 h-4" />
            </button>
          ) : isSearching ? (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-600">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : null}

          {/* Search Results Dropdown */}
          {isOpen && results.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-emerald-200 rounded-2xl shadow-soft-xl max-h-72 overflow-y-auto divide-y divide-emerald-50">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-4 py-2.5 hover:bg-emerald-50/70 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-forest-900 group-hover:text-emerald-800">
                        {item.name}
                      </div>
                      <div className="text-xs text-forest-500">
                        {item.admin1 ? `${item.admin1}, ` : ""}
                        {item.country}
                      </div>
                    </div>
                  </div>
                  {item.isIndia && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      India
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Use My Location Button */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs hover:border-emerald-300 disabled:opacity-50 shrink-0"
          title="Detect and view air quality at your current location"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
          ) : (
            <LocateFixed className="w-4 h-4 text-emerald-700" />
          )}
          <span className="hidden sm:inline">
            {isLocating ? "Locating..." : "Use My Location"}
          </span>
          <span className="sm:hidden">Locate</span>
        </button>
      </div>

      {/* Geolocation error feedback if any */}
      {locationError && (
        <div className="text-[11px] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Popular Indian Cities Quick Select */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        <span className="text-xs font-semibold text-forest-600 whitespace-nowrap flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Popular:
        </span>
        {POPULAR_INDIAN_CITIES.map((c) => {
          const isCurrent = selectedCity.name.toLowerCase() === c.name.toLowerCase();
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => onSelectCity(c)}
              className={`text-xs px-2.5 py-1 rounded-xl border transition-all duration-200 whitespace-nowrap font-medium flex items-center gap-1 ${
                isCurrent
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-sm font-bold"
                  : "bg-white text-forest-700 border-emerald-100 hover:border-emerald-300 hover:text-emerald-800 hover:bg-emerald-50/50"
              }`}
            >
              <MapPin className={`w-3 h-3 ${isCurrent ? "text-white" : "text-emerald-600"}`} />
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
