/**
 * AQI standard classifications and botanical color mappings
 * Follows US EPA AQI standard with contextual references to Indian CPCB AQI guidelines.
 */

export const AQI_LEVELS = [
  {
    min: 0,
    max: 50,
    label: "Good",
    cpcbCategory: "Good",
    color: "#059669", // emerald-600
    bgLight: "bg-emerald-50",
    borderLight: "border-emerald-200",
    textLight: "text-emerald-800",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Air quality is fresh and satisfactory. Little to no health risk.",
    generalHealthAdvice: "Ideal conditions for outdoor exercise and recreation.",
    sensitiveHealthAdvice: "Enjoy the clean, crisp outdoor air freely.",
    verdict: "Safe",
  },
  {
    min: 51,
    max: 100,
    label: "Moderate",
    cpcbCategory: "Satisfactory",
    color: "#d97706", // amber-600
    bgLight: "bg-amber-50",
    borderLight: "border-amber-200",
    textLight: "text-amber-800",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    description: "Air quality is acceptable. Very sensitive individuals may experience minor irritation.",
    generalHealthAdvice: "Generally safe for typical outdoor activities.",
    sensitiveHealthAdvice: "Sensitive individuals should observe for coughing or shortness of breath.",
    verdict: "Safe",
  },
  {
    min: 101,
    max: 150,
    label: "Sensitive Groups",
    cpcbCategory: "Moderate",
    color: "#ea580c", // orange-600
    bgLight: "bg-orange-50",
    borderLight: "border-orange-200",
    textLight: "text-orange-800",
    badge: "bg-orange-100 text-orange-800 border-orange-200",
    description: "Children, elderly, and people with respiratory or heart conditions may be affected.",
    generalHealthAdvice: "Healthy individuals can still proceed with moderate precautions.",
    sensitiveHealthAdvice: "Wear an N95 mask during outdoor exertion and keep inhalers handy.",
    verdict: "Caution",
  },
  {
    min: 151,
    max: 200,
    label: "Unhealthy",
    cpcbCategory: "Poor",
    color: "#dc2626", // red-600
    bgLight: "bg-rose-50",
    borderLight: "border-rose-200",
    textLight: "text-rose-800",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    description: "Everyone may begin to experience health effects; sensitive groups experience more serious effects.",
    generalHealthAdvice: "Cut back on prolonged outdoor exertion. Wear an N95 mask in traffic.",
    sensitiveHealthAdvice: "Stay indoors when possible and run an air purifier with a HEPA filter.",
    verdict: "Avoid",
  },
  {
    min: 201,
    max: 300,
    label: "Very Unhealthy",
    cpcbCategory: "Very Poor",
    color: "#7e22ce", // purple-700
    bgLight: "bg-purple-50",
    borderLight: "border-purple-200",
    textLight: "text-purple-800",
    badge: "bg-purple-100 text-purple-800 border-purple-200",
    description: "Health alert: Serious risk of health effects across the urban population.",
    generalHealthAdvice: "Significantly restrict outdoor activities. Commute with sealed windows or N95 masks.",
    sensitiveHealthAdvice: "Strictly avoid outdoor exposure. Keep indoor air sealed and filtered.",
    verdict: "Avoid",
  },
  {
    min: 301,
    max: 500,
    label: "Hazardous",
    cpcbCategory: "Severe",
    color: "#881337", // rose-900 / deep crimson
    bgLight: "bg-red-50",
    borderLight: "border-red-300",
    textLight: "text-red-900",
    badge: "bg-red-100 text-red-900 border-red-300",
    description: "Emergency warning: The entire population is likely to experience serious adverse symptoms.",
    generalHealthAdvice: "Stay strictly indoors with sealed windows and HEPA air purification.",
    sensitiveHealthAdvice: "Medical hazard warning. Completely avoid outdoor physical activity.",
    verdict: "Avoid",
  },
];

export function getAqiCategory(aqiValue) {
  if (aqiValue == null || isNaN(aqiValue)) {
    return AQI_LEVELS[0];
  }
  const val = Math.round(aqiValue);
  for (const level of AQI_LEVELS) {
    if (val >= level.min && val <= level.max) {
      return level;
    }
  }
  return AQI_LEVELS[AQI_LEVELS.length - 1];
}

export const POLLUTANT_INFO = {
  pm2_5: {
    name: "PM2.5",
    fullName: "Fine Inhalable Particles",
    unit: "µg/m³",
    whoSafeLimit: 15,
    indianLimit: 60,
    description: "Microscopic soot & combustion particles ≤2.5µm that penetrate deep into lung alveoli.",
    sources: "Vehicular exhaust, biomass burning, road dust, construction.",
    impact: "Triggers asthma, cardiovascular stress, and airway inflammation."
  },
  pm10: {
    name: "PM10",
    fullName: "Coarse Dust Particles",
    unit: "µg/m³",
    whoSafeLimit: 45,
    indianLimit: 100,
    description: "Inhalable coarse dust ≤10µm that irritates the eyes, throat, and bronchial passages.",
    sources: "Road dust resuspension, construction debris, windborne soil.",
    impact: "Allergic rhinitis, persistent coughing, and bronchitis."
  },
  nitrogen_dioxide: {
    name: "NO₂",
    fullName: "Nitrogen Dioxide",
    unit: "µg/m³",
    whoSafeLimit: 25,
    indianLimit: 80,
    description: "Toxic pungent gas primarily from automotive diesel and petrol combustion engines.",
    sources: "Heavy traffic corridors, diesel generator sets, thermal plants.",
    impact: "Reduces lung defense, increases vulnerability to seasonal respiratory infections."
  },
  ozone: {
    name: "O₃",
    fullName: "Ground-Level Ozone",
    unit: "µg/m³",
    whoSafeLimit: 100,
    indianLimit: 100,
    description: "Secondary photochemical pollutant generated when sunlight bakes vehicle exhaust fumes.",
    sources: "Afternoon sun acting on volatile organic compounds and nitrogen oxides.",
    impact: "Chest tightness, reduced vital capacity, severe coughing in athletes."
  },
  carbon_monoxide: {
    name: "CO",
    fullName: "Carbon Monoxide",
    unit: "µg/m³",
    whoSafeLimit: 4000,
    indianLimit: 2000,
    description: "Colorless, odorless gas from incomplete combustion in congested vehicular traffic.",
    sources: "Idling vehicles, slow-moving traffic jams, combustion.",
    impact: "Reduces oxygen carrying capacity in red blood cells; causes headaches and fatigue."
  },
  sulphur_dioxide: {
    name: "SO₂",
    fullName: "Sulphur Dioxide",
    unit: "µg/m³",
    whoSafeLimit: 40,
    indianLimit: 80,
    description: "Pungent acidic gas from coal power plants, unrefined diesel, and industrial boilers.",
    sources: "Industrial clusters, heavy diesel engines, oil refineries.",
    impact: "Reflex bronchoconstriction, stinging eyes, and throat burning."
  }
};

export function getPollutantSeverity(pollutantKey, value) {
  const info = POLLUTANT_INFO[pollutantKey];
  if (!info || value == null) return { level: "normal", color: "text-slate-600", badge: "bg-slate-100 text-slate-700 border-slate-200" };

  if (value <= info.whoSafeLimit) {
    return { level: "good", label: "WHO Compliant", color: "text-emerald-700", badge: "bg-emerald-100/80 text-emerald-800 border border-emerald-300" };
  } else if (value <= info.indianLimit) {
    return { level: "moderate", label: "Moderate (Indian NAAQS)", color: "text-amber-700", badge: "bg-amber-100/80 text-amber-800 border border-amber-300" };
  } else if (value <= info.indianLimit * 2) {
    return { level: "high", label: "Elevated Intake", color: "text-orange-700", badge: "bg-orange-100/80 text-orange-800 border border-orange-300" };
  } else {
    return { level: "severe", label: "Hazardous Spike", color: "text-rose-700", badge: "bg-rose-100/80 text-rose-800 border border-rose-300" };
  }
}
