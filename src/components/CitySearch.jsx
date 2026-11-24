import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, Loader2, Sparkles } from "lucide-react";
import { searchCities, POPULAR_INDIAN_CITIES } from "../services/openMeteo";

export default function CitySearch({ selectedCity, onSelectCity }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
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

  // Click outside listener to close dropdown
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

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-cyan-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="Search any Indian or global city (e.g. Bengaluru, Delhi, Pune, London)..."
            className="w-full pl-10 pr-10 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 shadow-xl shadow-cyan-950/10 transition-all"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : isSearching ? (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-cyan-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : null}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-72 overflow-y-auto divide-y divide-slate-800">
            {results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-4 py-3 hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/20">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white group-hover:text-cyan-300">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {item.admin1 ? `${item.admin1}, ` : ""}
                      {item.country}
                    </div>
                  </div>
                </div>
                {item.isIndia && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    India
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular Indian Cities Quick Select */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Major Cities:
        </span>
        {POPULAR_INDIAN_CITIES.map((c) => {
          const isCurrent = selectedCity.name.toLowerCase() === c.name.toLowerCase();
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => onSelectCity(c)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 whitespace-nowrap font-medium flex items-center gap-1.5 ${
                isCurrent
                  ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 font-bold"
                  : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800"
              }`}
            >
              <MapPin className={`w-3 h-3 ${isCurrent ? "text-slate-950" : "text-cyan-400"}`} />
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
