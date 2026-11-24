import React from "react";

export default function AnimatedBackground({ aqi = 60 }) {
  // Determine mood based on AQI:
  // Good: <= 100 (lush botanical green)
  // Moderate: 101 - 150 (warm golden-amber sunlight)
  // Poor: > 150 (hazy coral-terracotta smog)
  let mood = "good";
  let gradientClass = "from-[#BBF7D0] via-[#A7F3D0] to-[#6EE7B7]";
  
  if (aqi > 150) {
    mood = "poor";
    gradientClass = "from-[#FECACA] via-[#FCA5A5] to-[#F87171]/40";
  } else if (aqi > 100) {
    mood = "moderate";
    gradientClass = "from-[#FDE68A] via-[#FCD34D] to-[#F59E0B]/35";
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br ${gradientClass} transition-all duration-700 ease-in-out`}
    >
      {/* 1. Good / Satisfactory Mood: Floating Leaves & Smooth Wind Ribbons */}
      {mood === "good" && (
        <div className="absolute inset-0">
          {/* Flowing Wind Ribbons */}
          <svg
            className="absolute top-10 left-0 w-full h-64 opacity-30 text-emerald-600 animate-wind-flow"
            viewBox="0 0 1200 200"
            fill="none"
          >
            <path
              d="M-100 100 C 200 40, 400 160, 700 80 C 950 10, 1100 120, 1300 90"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="16 12"
            />
            <path
              d="M-50 140 C 250 80, 500 180, 800 110 C 1050 50, 1150 140, 1350 110"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="8 8"
            />
          </svg>

          {/* Drifting Leaves */}
          <div className="leaf-particle leaf-1">🍃</div>
          <div className="leaf-particle leaf-2">🌿</div>
          <div className="leaf-particle leaf-3">🍃</div>
          <div className="leaf-particle leaf-4">🌱</div>
          <div className="leaf-particle leaf-5">🍃</div>

          {/* Translucent Soft Glow Orbs */}
          <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-emerald-300/30 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-teal-300/30 blur-3xl" />
        </div>
      )}

      {/* 2. Moderate Mood: Warm Golden Sunlight Motes */}
      {mood === "moderate" && (
        <div className="absolute inset-0">
          <svg
            className="absolute top-12 left-0 w-full h-64 opacity-25 text-amber-500 animate-wind-flow"
            viewBox="0 0 1200 200"
            fill="none"
          >
            <path
              d="M-100 80 C 300 20, 500 140, 800 70 C 1000 20, 1200 110, 1400 80"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="14 10"
            />
          </svg>

          {/* Floating Sunlight Motes */}
          <div className="sun-mote mote-1">✨</div>
          <div className="sun-mote mote-2">☀️</div>
          <div className="sun-mote mote-3">✨</div>
          <div className="sun-mote mote-4">🍂</div>

          <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-amber-300/40 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-yellow-300/35 blur-3xl" />
        </div>
      )}

      {/* 3. Poor / Hazardous Mood: Drifting Haze & Smog Particles */}
      {mood === "poor" && (
        <div className="absolute inset-0">
          {/* Slower Drifting Smog / Dust Particles */}
          <div className="dust-particle dust-1" />
          <div className="dust-particle dust-2" />
          <div className="dust-particle dust-3" />
          <div className="dust-particle dust-4" />
          <div className="dust-particle dust-5" />

          {/* Heavy Atmospheric Haze Layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-rose-950/10 via-transparent to-rose-900/10" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-rose-400/25 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-orange-400/25 blur-3xl" />
        </div>
      )}
    </div>
  );
}
