# AeroSense - Urban Air Quality Assistant for Indian Cities

A responsive React web app built with Vite, Tailwind CSS, Lucide icons, and Recharts. Powered by the free **Open-Meteo Air Quality & Geocoding APIs** (real-time data, no API key required) and **Google Gemini 2.5 Flash** (`@google/generative-ai`) for personalized health risk assessments and follow-up consultation.

---

## 🌟 Key Features

1. **Live Air Quality Data (Real-time, No Mock Data)**:
   - Direct integration with Open-Meteo Air Quality & Geocoding APIs.
   - Real-time US AQI (and Indian CPCB equivalent rating), PM2.5, PM10, NO₂, O₃, CO, and SO₂.
   - Defaults to **Bengaluru**, with instant one-click switching for major Indian hubs (Delhi, Mumbai, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Lucknow, Jaipur) and global city search.
   - Continuous 24-hour pollutant trend chart with WHO guideline threshold markers.

2. **User Context & Vulnerability Controls**:
   - 4 quick-select health profiles:
     - 👥 **General Public** (Healthy adults with standard routine)
     - 🫁 **Asthma / Sensitive** (COPD, allergies, cardiac/respiratory vulnerabilities)
     - ⚡ **Outdoor Runner** (High-ventilation athletes, cyclists, runners)
     - 👶 **Elderly / Kids** (Developing lungs, seniors 65+, infants)
   - Planned outdoor activity input with one-click quick chips (*"Morning jog at 7 AM"*, *"Two-wheeler commute"*, *"Evening walk at 6 PM"*, *"School transit"*).

3. **Gemini AI Environmental Advisor (`gemini-2.5-flash`)**:
   - Integrates `@google/generative-ai` to generate:
     - **Clear Risk Verdict**: Color-coded **Safe**, **Caution**, or **Avoid** with concise medical rationale.
     - **3 Actionable, Hyper-Specific Tips**:
       - 🎭 *Mask Recommendation* (Certified N95/KF94 vs standard masks for PM2.5)
       - ⏰ *Optimal Time Window* (Accounting for thermal inversions & traffic diurnal peaks)
       - 🏠 *Indoor Air Advice* (Ventilation timing, HEPA filtration, avoiding indoor combustion)
     - **Interactive Follow-Up Chat**: Ask custom questions in real-time regarding travel routes, child exposure, indoor mitigation, or morning workout safety.

4. **Security & Deployment-Ready**:
   - Reads `VITE_GEMINI_API_KEY` from `.env`.
   - `.env` included in `.gitignore` to prevent credential exposure.
   - Template provided in `.env.example`.
   - Built-in UI fallback key modal allowing users to paste a Gemini API key into `localStorage` so deployed demos work smoothly.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Add your free Gemini API key from [Google AI Studio](https://aistudio.google.com/):
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If you do not configure `.env`, you can paste your key directly inside the web app using the "Add Gemini Key" button in the header).*

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```
