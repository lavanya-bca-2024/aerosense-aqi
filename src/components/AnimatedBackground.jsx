import React from "react";

// Real Pointed Botanical Leaf SVG with stem, center vein & side veins
function LeafSvg({ color = "#065F46", size = 32, opacity = 0.5 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      style={{ opacity }}
      className="drop-shadow-sm overflow-visible"
    >
      {/* Pointed teardrop botanical leaf blade */}
      <path
        d="M12 2C6.5 7.5 5 13 12 20C19 13 17.5 7.5 12 2Z"
        fill={color}
      />
      {/* Delicate white center vein & stem extending to bottom */}
      <path
        d="M12 3V23"
        stroke="#FFFFFF"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Fine organic side veins */}
      <path
        d="M12 7L8 9M12 11L16 13M12 14L8 16M12 17L15 18.5"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
    </svg>
  );
}

// 14 falling leaves: sizes w-6 h-6 to w-8 h-8 (24px to 36px) colored in #065F46 & #047857 at opacity 0.5
const LEAF_CONFIGS = [
  { id: 1, left: "4%", size: 32, color: "#065F46", delay: "0s", duration: "14s", anim: "leafFall-1" },
  { id: 2, left: "11%", size: 26, color: "#047857", delay: "4s", duration: "17s", anim: "leafFall-2" },
  { id: 3, left: "18%", size: 36, color: "#065F46", delay: "1.5s", duration: "19s", anim: "leafFall-3" },
  { id: 4, left: "26%", size: 28, color: "#047857", delay: "7s", duration: "15s", anim: "leafFall-1" },
  { id: 5, left: "33%", size: 34, color: "#065F46", delay: "2.5s", duration: "18s", anim: "leafFall-2" },
  { id: 6, left: "41%", size: 24, color: "#047857", delay: "9s", duration: "16s", anim: "leafFall-3" },
  { id: 7, left: "49%", size: 36, color: "#065F46", delay: "0.5s", duration: "20s", anim: "leafFall-1" },
  { id: 8, left: "57%", size: 30, color: "#047857", delay: "5.5s", duration: "14s", anim: "leafFall-2" },
  { id: 9, left: "65%", size: 26, color: "#065F46", delay: "3s", duration: "18s", anim: "leafFall-3" },
  { id: 10, left: "73%", size: 34, color: "#047857", delay: "8s", duration: "15s", anim: "leafFall-1" },
  { id: 11, left: "81%", size: 28, color: "#065F46", delay: "2s", duration: "17s", anim: "leafFall-2" },
  { id: 12, left: "88%", size: 32, color: "#047857", delay: "6s", duration: "19s", anim: "leafFall-3" },
  { id: 13, left: "94%", size: 26, color: "#065F46", delay: "4.5s", duration: "13s", anim: "leafFall-1" },
  { id: 14, left: "45%", size: 30, color: "#047857", delay: "10s", duration: "16s", anim: "leafFall-2" },
];

export default function AnimatedBackground({ aqi = 60 }) {
  // Good / Satisfactory: AQI <= 100 (Deep, lush, vibrant botanical gradient)
  // Moderate / Sensitive: 101 <= AQI <= 150 (Warm golden-amber)
  // Poor / Hazardous: AQI > 150 (Rich coral-red smog)
  let mood = "good";
  let gradientClass = "from-[#34D399] via-[#10B981] to-[#047857]";

  if (aqi > 150) {
    mood = "poor";
    gradientClass = "from-[#FECACA] via-[#F87171] to-[#DC2626]/40";
  } else if (aqi > 100) {
    mood = "moderate";
    gradientClass = "from-[#FDE68A] via-[#F59E0B] to-[#D97706]/40";
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br ${gradientClass} transition-all duration-700 ease-in-out`}
    >
      {/* 1. Good / Satisfactory (AQI <= 100): Rich Botanical Green + 14 Falling & Swaying Leaves */}
      {mood === "good" && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Flowing Wind Ribbons */}
          <svg
            className="absolute top-10 left-0 w-full h-64 opacity-25 text-emerald-950 animate-wind-flow"
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
              stroke="#064E3B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="8 8"
            />
          </svg>

          {/* 14 Clearly Visible Pointed Botanical Leaves */}
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
              <LeafSvg color={leaf.color} size={leaf.size} opacity={0.5} />
            </div>
          ))}

          {/* Lush Nature Canopy Glow Accents */}
          <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-emerald-200/25 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-teal-200/20 blur-3xl" />
        </div>
      )}

      {/* 2. Moderate (101 <= AQI <= 150): Warm Golden Sunbeam Motes */}
      {mood === "moderate" && (
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute top-12 left-0 w-full h-64 opacity-30 text-amber-800 animate-wind-flow"
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

          <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-amber-300/40 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-yellow-300/35 blur-3xl" />
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

          <div className="absolute inset-0 bg-gradient-to-t from-rose-950/20 via-transparent to-rose-900/15" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-rose-500/25 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-red-500/20 blur-3xl" />
        </div>
      )}
    </div>
  );
}
