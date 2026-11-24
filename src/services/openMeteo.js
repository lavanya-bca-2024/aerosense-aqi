/**
 * Open-Meteo Air Quality & Geocoding Service
 * Free, no API key required
 */

export const POPULAR_INDIAN_CITIES = [
  {
    name: "Bengaluru",
    admin1: "Karnataka",
    country: "India",
    latitude: 12.9719,
    longitude: 77.5937,
    tag: "Silicon Valley"
  },
  {
    name: "Delhi",
    admin1: "National Capital Territory of Delhi",
    country: "India",
    latitude: 28.6139,
    longitude: 77.2090,
    tag: "NCR Hub"
  },
  {
    name: "Mumbai",
    admin1: "Maharashtra",
    country: "India",
    latitude: 19.0760,
    longitude: 72.8777,
    tag: "Coastal Megacity"
  },
  {
    name: "Hyderabad",
    admin1: "Telangana",
    country: "India",
    latitude: 17.3850,
    longitude: 78.4867,
    tag: "Deccan Capital"
  },
  {
    name: "Chennai",
    admin1: "Tamil Nadu",
    country: "India",
    latitude: 13.0827,
    longitude: 80.2707,
    tag: "Coromandel Coast"
  },
  {
    name: "Kolkata",
    admin1: "West Bengal",
    country: "India",
    latitude: 22.5726,
    longitude: 88.3639,
    tag: "Eastern Metropolis"
  },
  {
    name: "Pune",
    admin1: "Maharashtra",
    country: "India",
    latitude: 18.5204,
    longitude: 73.8567,
    tag: "Cultural & IT Hub"
  },
  {
    name: "Ahmedabad",
    admin1: "Gujarat",
    country: "India",
    latitude: 23.0225,
    longitude: 72.5714,
    tag: "Industrial Center"
  },
  {
    name: "Lucknow",
    admin1: "Uttar Pradesh",
    country: "India",
    latitude: 26.8467,
    longitude: 80.9462,
    tag: "Gangetic Plain"
  },
  {
    name: "Jaipur",
    admin1: "Rajasthan",
    country: "India",
    latitude: 26.9124,
    longitude: 75.7873,
    tag: "Pink City"
  }
];

export const DEFAULT_CITY = POPULAR_INDIAN_CITIES[0]; // Bengaluru

/**
 * Search cities using Open-Meteo Geocoding API
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query.trim()
  )}&count=10&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding HTTP error: ${res.status}`);
    const data = await res.json();
    if (!data.results || !data.results.length) return [];

    const mapped = data.results.map((item) => ({
      id: item.id || `${item.latitude}-${item.longitude}`,
      name: item.name,
      admin1: item.admin1 || "",
      country: item.country || "",
      countryCode: item.country_code || "",
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || "auto",
      isIndia: item.country_code?.toUpperCase() === "IN" || item.country?.toLowerCase() === "india",
    }));

    return mapped.sort((a, b) => {
      if (a.isIndia && !b.isIndia) return -1;
      if (!a.isIndia && b.isIndia) return 1;
      return 0;
    });
  } catch (error) {
    console.error("Failed to search cities:", error);
    return [];
  }
}

/**
 * Reverse geocode latitude and longitude to get town/city and state name
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`;
    const res = await fetch(url, {
      headers: {
        "Accept-Language": "en",
      },
    });
    if (!res.ok) throw new Error("Reverse geocode failed");
    const data = await res.json();
    const addr = data.address || {};
    const name = addr.city || addr.town || addr.village || addr.municipality || addr.suburb || addr.state_district || "Your Location";
    const admin1 = addr.state || "";
    const country = addr.country || "India";
    return {
      id: `gps-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
      name,
      admin1,
      country,
      latitude,
      longitude,
      timezone: "auto",
      isCurrentLocation: true,
      isIndia: addr.country_code?.toUpperCase() === "IN",
    };
  } catch (err) {
    console.warn("Reverse geocode fallback:", err);
    return {
      id: `gps-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
      name: "Detected Location",
      admin1: "",
      country: "India",
      latitude,
      longitude,
      timezone: "auto",
      isCurrentLocation: true,
      isIndia: true,
    };
  }
}

/**
 * Fetch Live Air Quality data and 24-hour trends from Open-Meteo Air Quality API
 */
export async function fetchAirQualityData(latitude, longitude, timezone = "auto") {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,carbon_monoxide,sulphur_dioxide&hourly=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,carbon_monoxide&past_days=1&forecast_days=2&timezone=${encodeURIComponent(
    timezone || "auto"
  )}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Air Quality API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const current = json.current || {};
  const currentUnits = json.current_units || {};
  const hourly = json.hourly || {};

  const nowIso = current.time || new Date().toISOString();
  const timeArray = hourly.time || [];
  
  let currentIndex = 0;
  if (timeArray.length > 0) {
    const nowTime = new Date(nowIso).getTime();
    let minDiff = Infinity;
    timeArray.forEach((t, i) => {
      const diff = Math.abs(new Date(t).getTime() - nowTime);
      if (diff < minDiff) {
        minDiff = diff;
        currentIndex = i;
      }
    });
  }

  const startIndex = Math.max(0, currentIndex - 12);
  const endIndex = Math.min(timeArray.length, currentIndex + 13);

  const trendData = [];
  for (let i = startIndex; i < endIndex; i++) {
    const rawTime = timeArray[i];
    const dateObj = new Date(rawTime);
    const hourFormatted = dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
    
    const isCurrent = i === currentIndex;

    trendData.push({
      rawTime,
      time: hourFormatted,
      isCurrent,
      us_aqi: hourly.us_aqi ? hourly.us_aqi[i] : null,
      pm2_5: hourly.pm2_5 ? Math.round(hourly.pm2_5[i] * 10) / 10 : null,
      pm10: hourly.pm10 ? Math.round(hourly.pm10[i] * 10) / 10 : null,
      nitrogen_dioxide: hourly.nitrogen_dioxide ? Math.round(hourly.nitrogen_dioxide[i] * 10) / 10 : null,
      ozone: hourly.ozone ? Math.round(hourly.ozone[i] * 10) / 10 : null,
      carbon_monoxide: hourly.carbon_monoxide ? Math.round(hourly.carbon_monoxide[i]) : null,
    });
  }

  return {
    raw: json,
    timestamp: current.time || new Date().toISOString(),
    metrics: {
      us_aqi: current.us_aqi ?? (trendData.find(d => d.isCurrent)?.us_aqi ?? 0),
      european_aqi: current.european_aqi ?? null,
      pm2_5: current.pm2_5 ?? 0,
      pm10: current.pm10 ?? 0,
      nitrogen_dioxide: current.nitrogen_dioxide ?? 0,
      ozone: current.ozone ?? 0,
      carbon_monoxide: current.carbon_monoxide ?? 0,
      sulphur_dioxide: current.sulphur_dioxide ?? 0,
    },
    units: currentUnits,
    trends: trendData,
    elevation: json.elevation,
    latitude: json.latitude,
    longitude: json.longitude,
  };
}
