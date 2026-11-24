import React from "react";

// Real Pointed Botanical Leaf SVG Component with stem, center vein & side veins
function LeafSvg({ color = "#16A34A", size = 28, opacity = 0.4 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      style={{ opacity }}
      className="drop-shadow-xs overflow-visible"
    >
      {/* Pointed botanical leaf blade */}
      <path
        d="M12 2C6.5 7.5 5 13 12 20C19 13 17.5 7.5 12 2Z"
        fill={color}
      />
      {/* Delicate center vein & stem extending to bottom */}
      <path
        d="M12 3V23"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Delicate organic side veins */}
      <path
        d="M12 7L8 9M12 11L16 13M12 14L8 16M12 17L15 18.5"
        stroke="#FFFFFF"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />
    </svg>
  );
}

// 14 falling leaves with natural pointed leaf shades: #16A34A, #15803D, #22C55E
const LEAF_CONFIGS = [
  { id: 1, left: "3%", size: 30, color: "#16A34A", delay: "0s", duration: "14s", anim: "leafFall-1" },
  { id: 2, left: "11%", size: 24, color: "#15803D", delay: "4s", duration: "17s", anim: "leafFall-2" },
  { id: 3, left: "19%", size: 34, color: "#22C55E", delay: "1.5s", duration: "19s", anim: "leafFall-3" },
  { id: 4, left: "27%", size: 26, color: "#16A34A", delay: "7s", duration: "15s", anim: "leafFall-1" },
  { id: 5, left: "35%", size: 32, color: "#15803D", delay: "2.5s", duration: "18s", anim: "leafFall-2" },
  { id: 6, left: "43%", size: 22, color: "#22C55E", delay: "9s", duration: "16s", anim: "leafFall-3" },
  { id: 7, left: "51%", size: 36, color: "#16A34A", delay: "0.5s", duration: "20s", anim: "leafFall-1" },
  { id: 8, left: "59%", size: 28, color: "#15803D", delay: "5.5s", duration: "14s", anim: "leafFall-2" },
  { id: 9, left: "67%", size: 24, color: "#22C55E", delay: "3s", duration: "18s", anim: "leafFall-3" },
  { id: 10, left: "75%", size: 32, color: "#16A34A", delay: "8s", duration: "15s", anim: "leafFall-1" },
  { id: 11, left: "83%", size: 26, color: "#15803D", delay: "2s", duration: "17s", anim: "leafFall-2" },
  { id: 12, left: "89%", size: 30, color: "#22C55E", delay: "6s", duration: "19s", anim: "leafFall-3" },
  { id: 13, left: "95%", size: 22, color: "#16A34A", delay: "4.5s", duration: "13s", anim: "leafFall-1" },
  { id: 14, left: "47%", size: 28, color: "#15803D", delay: "10s", duration: "16s", anim: "leafFall-2" },
];

export default function AnimatedBackground({ aqi = 60 }) {
  // Good / Satisfactory: AQI <= 100
  // Moderate / Sensitive: 101 <= AQI <= 150
  // Poor / Hazardous: AQI > 150
  let mood = "good";
  let gradientClass = "from-[#A7F3D0] via-[#6EE7B7] to-[#34D399]/60";

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
      {/* 1. Good / Satisfactory (AQI <= 100): 14 Pointed Botanical Falling Leaves */}
      {mood === "good" && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle flowing wind ribbons */}
          <svg
            className="absolute top-10 left-0 w-full h-64 opacity-25 text-emerald-700 animate-wind-flow"
            viewBox="0 0 1200 200"
            fill="none"
          >
            <path
              d="M-100 100 C 200 40, 400 160, 700 80 C 950 10, 1100 120, 1300 90"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="16 12"
            />
            <path
              d="M-50 140 C 250 80, 500 180, 800 110 C 1050 50, 1150 140, 1350 110"
              stroke="#047857"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="8 8"
            />
          </svg>

          {/* 14 Pointed Botanical Leaves gently falling & swaying */}
          {LEAF_CONFIGS.map((leaf) => (
            <div
              key={leaf.id}
              className={`leaf-falling ${leaf.anim}`}
              style={{
                left: leaf.left,
                animationDelay: leaf.delay,
                animationDuration: leaf.duration,
              }}
            >
              <LeafSvg color={leaf.color} size={leaf.size} opacity={0.4} />
            </div>
          ))}

          {/* Lush Nature Glow Orbs */}
          <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl" />
        </div>
      )}

      {/* 2. Moderate (101 <= AQI <= 150): Warm Golden Sunbeam Motes */}
      {mood === "moderate" && (
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute top-12 left-0 w-full h-64 opacity-25 text-amber-600 animate-wind-flow"
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

          <div className="sun-mote mote-1">✨</div>
          <div className="sun-mote mote-2">☀️</div>
          <div className="sun-mote mote-3">✨</div>
          <div className="sun-mote mote-4">🍂</div>
          <div className="sun-mote mote-5">✨</div>

          <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-amber-400/35 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-yellow-400/30 blur-3xl" />
        </div>
      )}

      {/* 3. Poor / Hazardous (AQI > 150): Drifting Smoky Haze Particles */}
      {mood === "poor" && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="dust-particle dust-1" />
          <div className="dust-particle dust-2" />
          <div className="dust-particle dust-3" />
          <div className="dust-particle dust-4" />
          <div className="dust-particle dust-5" />

          <div className="absolute inset-0 bg-gradient-to-t from-rose-950/15 via-transparent to-rose-900/10" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-rose-500/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl" />
        </div>
      )}
    </div>
  );
}
