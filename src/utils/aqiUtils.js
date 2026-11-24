/**
 * AQI standard classifications and color mappings
 * Follows US EPA AQI standard with contextual references to Indian CPCB AQI guidelines.
 */

export const AQI_LEVELS = [
  {
    min: 0,
    max: 50,
    label: "Good",
    cpcbCategory: "Good",
    color: "#10b981", // emerald-500
    bgLight: "bg-emerald-500/10",
    borderLight: "border-emerald-500/30",
    textLight: "text-emerald-400",
    description: "Air quality is satisfactory, and air pollution poses little or no risk.",
    generalHealthAdvice: "Ideal conditions for outdoor exercise and recreation.",
    sensitiveHealthAdvice: "Enjoy the clean air safely outdoors.",
    verdict: "Safe",
  },
  {
    min: 51,
    max: 100,
    label: "Moderate",
    cpcbCategory: "Satisfactory",
    color: "#eab308", // yellow-500
    bgLight: "bg-yellow-500/10",
    borderLight: "border-yellow-500/30",
    textLight: "text-yellow-400",
    description: "Air quality is acceptable; however, some pollutants may cause moderate health concern for unusually sensitive individuals.",
    generalHealthAdvice: "Generally safe for outdoor activities.",
    sensitiveHealthAdvice: "Sensitive groups should monitor symptoms like coughing or shortness of breath.",
    verdict: "Safe",
  },
  {
    min: 101,
    max: 150,
    label: "Unhealthy for Sensitive Groups",
    cpcbCategory: "Moderate",
    color: "#f97316", // orange-500
    bgLight: "bg-orange-500/10",
    borderLight: "border-orange-500/30",
    textLight: "text-orange-400",
    description: "Members of sensitive groups (asthma, children, elderly) may experience health effects. General public not likely affected.",
    generalHealthAdvice: "Take standard precautions; cut back on prolonged outdoor exertion.",
    sensitiveHealthAdvice: "Wear an N95 mask during heavy exertion and keep rescue inhalers handy.",
    verdict: "Caution",
  },
  {
    min: 151,
    max: 200,
    label: "Unhealthy",
    cpcbCategory: "Poor",
    color: "#ef4444", // red-500
    bgLight: "bg-red-500/10",
    borderLight: "border-red-500/30",
    textLight: "text-red-400",
    description: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.",
    generalHealthAdvice: "Avoid prolonged outdoor exertion. Wear an N95 mask if commuting in traffic.",
    sensitiveHealthAdvice: "Stay indoors when possible and run an air purifier with HEPA filters.",
    verdict: "Avoid",
  },
  {
    min: 201,
    max: 300,
    label: "Very Unhealthy",
    cpcbCategory: "Very Poor",
    color: "#a855f7", // purple-500
    bgLight: "bg-purple-500/10",
    borderLight: "border-purple-500/30",
    textLight: "text-purple-400",
    description: "Health alert: The risk of health effects is substantially increased for everyone in the urban area.",
    generalHealthAdvice: "Significantly restrict outdoor activities. Commute with sealed windows or N95 masks.",
    sensitiveHealthAdvice: "Strictly avoid outdoor exposure. Keep indoor air sealed and filtered.",
    verdict: "Avoid",
  },
  {
    min: 301,
    max: 500,
    label: "Hazardous",
    cpcbCategory: "Severe",
    color: "#7f1d1d", // red-900 / dark crimson
    bgLight: "bg-rose-950/40",
    borderLight: "border-rose-700/50",
    textLight: "text-rose-400",
    description: "Health warning of emergency conditions: The entire population is more likely to be seriously affected.",
    generalHealthAdvice: "Stay strictly indoors with sealed windows and HEPA air purification.",
    sensitiveHealthAdvice: "Medical emergency risk. Completely avoid outdoor physical activity.",
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
  // Above 500
  return AQI_LEVELS[AQI_LEVELS.length - 1];
}

/**
 * WHO and Indian National Ambient Air Quality Standards (NAAQS) benchmark thresholds
 */
export const POLLUTANT_INFO = {
  pm2_5: {
    name: "PM2.5",
    fullName: "Fine Particulate Matter",
    unit: "µg/m³",
    whoSafeLimit: 15, // WHO 24h limit
    indianLimit: 60, // CPCB 24h limit
    description: "Inhalable particles ≤2.5 micrometers that penetrate deep into the lungs and bloodstream.",
    sources: "Vehicular exhaust, biomass burning, road dust, construction.",
    impact: "Aggravates asthma, causes cardiovascular stress and respiratory infections."
  },
  pm10: {
    name: "PM10",
    fullName: "Coarse Particulate Matter",
    unit: "µg/m³",
    whoSafeLimit: 45, // WHO 24h limit
    indianLimit: 100, // CPCB 24h limit
    description: "Inhalable particles ≤10 micrometers that irritate eyes, nose, and respiratory tracts.",
    sources: "Road dust resuspension, construction debris, industrial emissions.",
    impact: "Bronchitis, allergic rhinitis, coughing, and wheezing."
  },
  nitrogen_dioxide: {
    name: "NO₂",
    fullName: "Nitrogen Dioxide",
    unit: "µg/m³",
    whoSafeLimit: 25, // WHO 24h limit
    indianLimit: 80, // CPCB 24h limit
    description: "Toxic reddish-brown gas produced primarily from diesel and petrol combustion.",
    sources: "Heavy vehicular traffic, power plants, diesel generator sets.",
    impact: "Severe airway inflammation and increased susceptibility to respiratory viruses."
  },
  ozone: {
    name: "O₃",
    fullName: "Ground-Level Ozone",
    unit: "µg/m³",
    whoSafeLimit: 100, // WHO 8h limit
    indianLimit: 100, // CPCB 8h limit
    description: "Secondary pollutant formed when sunlight reacts with vehicular NOx and VOCs.",
    sources: "Photochemical reaction during hot sunny afternoons in heavy traffic areas.",
    impact: "Deep chest tightness, reduced lung volume, trigger for severe asthma attacks."
  },
  carbon_monoxide: {
    name: "CO",
    fullName: "Carbon Monoxide",
    unit: "µg/m³",
    whoSafeLimit: 4000,
    indianLimit: 2000,
    description: "Colorless, odorless gas from incomplete combustion in vehicular engines.",
    sources: "Congested urban traffic, idling vehicles.",
    impact: "Reduces oxygen carrying capacity of red blood cells; causes headaches and fatigue."
  },
  sulphur_dioxide: {
    name: "SO₂",
    fullName: "Sulphur Dioxide",
    unit: "µg/m³",
    whoSafeLimit: 40,
    indianLimit: 80,
    description: "Pungent gas generated from coal power plants, diesel fuel, and industrial boilers.",
    sources: "Industrial clusters, unrefined diesel fuels.",
    impact: "Reflex constriction of bronchial airways and burning sensation in throat."
  }
};

export function getPollutantSeverity(pollutantKey, value) {
  const info = POLLUTANT_INFO[pollutantKey];
  if (!info || value == null) return { level: "normal", color: "text-slate-300", badge: "bg-slate-800 text-slate-300" };

  if (value <= info.whoSafeLimit) {
    return { level: "good", label: "WHO Compliant", color: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" };
  } else if (value <= info.indianLimit) {
    return { level: "moderate", label: "Moderate (Indian Standard)", color: "text-amber-400", badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30" };
  } else if (value <= info.indianLimit * 2) {
    return { level: "high", label: "Elevated", color: "text-orange-400", badge: "bg-orange-500/20 text-orange-300 border border-orange-500/30" };
  } else {
    return { level: "severe", label: "Hazardous Spike", color: "text-rose-400", badge: "bg-rose-500/20 text-rose-300 border border-rose-500/30" };
  }
}
