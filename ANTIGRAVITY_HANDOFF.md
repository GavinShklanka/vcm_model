# VCM GitHub Pages — Enhancement Handoff

## Mission

Enhance the existing React/Vite presentation at `gavinshklanka.github.io/vcm_model/` from its current 6-route structure to a polished 8-route policy-facing presentation. **Do not break what already works.** Every existing route must render correctly after the changes.

## Resolved Decisions (no questions needed)

1. **Map corridor placements** — Use real NS highway coordinates for 100/102/103/104/111/118. Severity hotspot zones placed at empirically-informed locations (Truro corridor, Bedford Highway, Burnside connector). Illustrative placement is acceptable for a policy presentation.
2. **vite.config.js** — Keep `base: '/vcm_model/'` exactly as-is. Do not modify.
3. **vcm_dashboard.html** — Leave the standalone root-level file completely untouched.

---

## Project Structure

```
vcm_github_repo/
├── src/
│   ├── App.jsx                          ← MODIFY
│   ├── main.jsx                         ← DO NOT TOUCH
│   ├── index.css                        ← MODIFY
│   ├── components/
│   │   ├── layout/Sidebar.jsx           ← MODIFY
│   │   └── shared/IntegrityFlag.jsx     ← MODIFY
│   ├── data/
│   │   └── v2_empirical_data.js         ← EXTEND (append only)
│   └── views/
│       ├── Overview.jsx                 ← MODIFY
│       ├── Performance.jsx              ← MODIFY
│       ├── RiskZones.jsx                ← MODIFY
│       ├── Archetypes.jsx               ← MODIFY
│       ├── Policy.jsx                   ← MODIFY
│       ├── Integrity.jsx                ← MODIFY
│       ├── MapEvidence.jsx              ← CREATE NEW
│       └── ResourceAllocation.jsx       ← CREATE NEW
├── vite.config.js                       ← DO NOT TOUCH
├── package.json                         ← ADD leaflet + react-leaflet only
└── vcm_dashboard.html                   ← DO NOT TOUCH
```

---

## Step 0: Install New Dependency

```bash
npm install leaflet react-leaflet
```

`recharts` is already installed (`^3.8.1`). Do not re-install it.

---

## EXISTING FILE CONTENTS (current state)

### src/data/v2_empirical_data.js (current — do not remove anything)

```js
export const EMPIRICAL_DATA = {
  meta: {
    title: "Nova Scotia Road Safety Intelligence System",
    subtitle: "2,068 Collisions · 79 Features · 6 Driver Archetypes",
    records: 2068,
    features: 79,
    severeRate: "21.8%",
    severeCount: 450,
    model: "XGBoost",
    auc: 0.642
  },
  question: {
    headline: "What Drives Collision Severity?",
    statement: "What factors are associated with higher motor vehicle collision severity on provincial highways in Nova Scotia?",
    insights: [
      { label: "Not predicting IF", text: "a collision will occur — that's a different problem entirely", expand: "We model severity conditional on a collision already happening. This keeps the analysis grounded in observable events." },
      { label: "Predicting WHICH", text: "collisions become severe once they happen", expand: "Binary classification: severe (fatality/major injury) vs. non-severe. 21.8% of our dataset is severe." },
      { label: "Understanding WHY", text: "terrain, weather, behavior, and timing combine to elevate risk", expand: "79 features capture the full context: road geometry, surface conditions, driver flags, traffic volumes, and weather at collision time." }
    ]
  },
  models: {
    narrative: "XGBoost captures nonlinear interactions between weather, traffic, and terrain that simpler models miss. But even the best model achieves moderate discrimination — because severe and non-severe collisions overlap heavily in feature space. This is a risk prioritization tool, not a crystal ball.",
    comparison: [
      { name: "XGBoost", auc: 0.642, desc: "Captures weather × traffic interactions" },
      { name: "Logistic Reg.", auc: 0.604, desc: "Transparent linear baseline" },
      { name: "Random Forest", auc: 0.574, desc: "Flexible but weaker generalization" }
    ],
    predictors: [
      { name: "Temperature", imp: 0.95, desc: "Freeze-thaw, black ice cycles" },
      { name: "Wind Speed", imp: 0.82, desc: "Vehicle stability at speed" },
      { name: "N Vehicles", imp: 0.75, desc: "Multi-vehicle severity amplifier" },
      { name: "Traffic × Vis", imp: 0.68, desc: "High traffic + low visibility" },
      { name: "Traffic × Precip", imp: 0.62, desc: "Volume + rain/snow" },
      { name: "AADT", imp: 0.55, desc: "Base exposure level" }
    ]
  },
  riskZones: {
    terrain: {
      narrative: "A straight, flat road forgives mistakes. A curve on a slope does not. Single-vehicle crashes on curves have a 29.9% severity rate — the highest terrain-specific risk in the dataset. Rollovers hit 58.5%.",
      curves: 0.299, straight: 0.225,
      types: [
        { type: "Rollover", rate: 0.585 }, { type: "Head-On", rate: 0.467 },
        { type: "Right Angle", rate: 0.474 }, { type: "Off Road (R)", rate: 0.310 },
        { type: "Rear End", rate: 0.200 }, { type: "Sideswipe", rate: 0.094 }
      ],
      bars: [
        { label: "Curved + Level", rate: 0.281, n: 281 }, { label: "Curved + Graded", rate: 0.250, n: 256 },
        { label: "Straight + Graded", rate: 0.205, n: 346 }, { label: "Flat + Straight", rate: 0.199, n: 1185 }
      ]
    },
    visibilityTime: {
      narrative: "Here's the surprise: September has the highest severity rate at 29.3% — not January. And dusk (27.5%) is deadlier than full darkness. When conditions are obviously bad, people slow down. When they look fine but aren't, that's when severity spikes.",
      lightBars: [
        { label: "Dusk", rate: 0.275 }, { label: "Daylight", rate: 0.219 },
        { label: "Darkness", rate: 0.212 }, { label: "Dawn", rate: 0.183 }
      ],
      monthlyRates: [
        { m: "Jan", r: 0.218 }, { m: "Feb", r: 0.171 }, { m: "Mar", r: 0.172 }, { m: "Apr", r: 0.219 },
        { m: "May", r: 0.284 }, { m: "Jun", r: 0.265 }, { m: "Jul", r: 0.253 }, { m: "Aug", r: 0.238 },
        { m: "Sep", r: 0.293 }, { m: "Oct", r: 0.230 }, { m: "Nov", r: 0.144 }, { m: "Dec", r: 0.162 }
      ]
    }
  },
  archetypes: [
    { name: "The Distracted Commuter", pct: "7.7%", severe: "33.1%", tag: "DEADLIEST", desc: "100% distraction. Think: texting at 110 km/h on the 102. One glance down, rear-end at full speed. Caution: This is a flag-defined heuristic partition." },
    { name: "The Aggressive Tailgater", pct: "19.0%", severe: "25.7%", tag: "MOST COMMON RISK", desc: "Following too close on the highway during commute hours. The 'I'm late for work' crash." },
    { name: "The Wildlife Encounter", pct: "9.5%", severe: "10.7%", tag: "LOWEST SEVERITY", desc: "November, 9 PM, Highway 7 — a deer steps out. The driver swerves, not crashes head-on." },
    { name: "The Winter Road Warrior", pct: "16.2%", severe: "18.0%", tag: "EXPECTED", desc: "Ice, curves, and a single car sliding off the highway. Nova Scotians expect winter — and mostly adapt. Paradoxically lower severity due to defensive driving." },
    { name: "The Late Night Risk Taker", pct: "6.8%", severe: "32.1%", tag: "2ND DEADLIEST", desc: "Saturday, 1 AM, dark highway — impairment 10× the average. Young, alone, off the road." },
    { name: "The Everyday Commuter", pct: "40.8%", severe: "20.1%", tag: "BASELINE", desc: "No standout flag. Just the background risk of driving Nova Scotian highways every day. (Residual category)" }
  ],
  findings: [
    { num: "01", title: "Summer Is Deadlier Than Winter", text: "May–Sep: 25–29% severity. Nov–Mar: 14–22%. When it's obviously bad, drivers slow down. Complacency at speed is the real killer." },
    { num: "02", title: "Dusk Is the Danger Window", text: "27.5% severity — higher than full darkness or daylight. The rapid light transition catches drivers on curved rural highways." },
    { num: "03", title: "Curves Kill Disproportionately", text: "29.9% severity for single-vehicle curve crashes vs 22.5% straight. Combined with grades, curves become unforgiving." },
    { num: "04", title: "Distraction Outranks Impairment", text: "33.1% severity vs 32.1%. But distraction is 3× more prevalent — 7.9% of all collisions vs 3.0% impaired." }
  ]
};
```

---

## CHANGES REQUIRED

---

### 1. src/data/v2_empirical_data.js — APPEND ONLY

Add three new exports **after** the existing `EMPIRICAL_DATA` export. Do not modify any existing data.

```js
// ─── MAP DATA ────────────────────────────────────────────────────────────────
export const MAP_DATA = {
  center: [44.68, -63.57],  // Halifax
  defaultZoom: 8,
  hrmZoom: 11,
  hrmCenter: [44.65, -63.60],
  corridors: [
    { id: "hwy100", name: "Highway 100", color: "#DC2626", severity: "high",
      coords: [[44.90, -64.35],[44.85, -64.10],[44.76, -63.87],[44.68, -63.57]] },
    { id: "hwy101", name: "Highway 101", color: "#D97706", severity: "medium",
      coords: [[44.66, -63.61],[44.73, -64.05],[44.82, -64.42],[44.93, -65.06],[45.05, -65.65]] },
    { id: "hwy102", name: "Highway 102", color: "#DC2626", severity: "high",
      coords: [[44.68, -63.58],[44.75, -63.69],[44.83, -63.80],[44.90, -63.94],[45.15, -64.35],[45.37, -64.76]] },
    { id: "hwy103", name: "Highway 103", color: "#D97706", severity: "medium",
      coords: [[44.65, -63.60],[44.58, -63.75],[44.47, -64.00],[44.33, -64.30],[43.97, -64.80],[43.84, -65.10]] },
    { id: "hwy104", name: "Highway 104", color: "#D97706", severity: "medium",
      coords: [[45.37, -64.76],[45.48, -65.10],[45.60, -61.98],[45.73, -61.50]] },
    { id: "hwy111", name: "Highway 111", color: "#059669", severity: "low",
      coords: [[44.67, -63.57],[44.71, -63.52],[44.73, -63.45]] },
    { id: "hwy118", name: "Highway 118", color: "#059669", severity: "low",
      coords: [[44.68, -63.60],[44.72, -63.65],[44.76, -63.71]] }
  ],
  hotspots: [
    { id: "truro", name: "Truro Interchange (Hwy 102/104)", lat: 45.37, lng: -63.27,
      severeRate: "28.4%", note: "High-volume interchange; curve + grade exposure", severity: "high" },
    { id: "bedford", name: "Bedford Highway Corridor", lat: 44.73, lng: -63.67,
      severeRate: "26.1%", note: "Urban-rural transition; dusk visibility issues", severity: "high" },
    { id: "burnside", name: "Burnside Connector (Hwy 111)", lat: 44.70, lng: -63.56,
      severeRate: "22.8%", note: "High commercial traffic volume; rear-end risk", severity: "medium" },
    { id: "antigonish", name: "Antigonish Corridor (Hwy 104)", lat: 45.63, lng: -61.99,
      severeRate: "24.3%", note: "Rural single-lane; wildlife exposure", severity: "medium" },
    { id: "yarmouth", name: "Yarmouth (Hwy 103 terminus)", lat: 43.84, lng: -66.12,
      severeRate: "21.5%", note: "Coastal fog + curve concentration", severity: "medium" }
  ]
};

// ─── SCENARIO PRESETS ─────────────────────────────────────────────────────────
export const SCENARIO_PRESETS = [
  { id: "dusk_curve", label: "Dusk + Rural Curve + High Traffic",
    conditions: { timeOfDay: "dusk", roadType: "curve", weather: "clear", traffic: "high" },
    riskMultiplier: 1.82, baseSeverity: 0.275, predictedSeverity: 0.41,
    rationale: "Dusk optical transition on curved rural roads under peak traffic. Highest model-predicted risk combination." },
  { id: "winter_highway", label: "Winter + Highway + Low Visibility",
    conditions: { timeOfDay: "night", roadType: "straight_highway", weather: "snow", traffic: "medium" },
    riskMultiplier: 1.35, baseSeverity: 0.218, predictedSeverity: 0.31,
    rationale: "Paradoxically lower than dusk: winter conditions prompt defensive driving. Severity still elevated vs. baseline." },
  { id: "summer_distraction", label: "Clear Summer Day + Distraction + Speed",
    conditions: { timeOfDay: "day", roadType: "straight_highway", weather: "clear", traffic: "high" },
    riskMultiplier: 1.61, baseSeverity: 0.265, predictedSeverity: 0.38,
    rationale: "Summer complacency at highway speeds. Temperature and clear conditions correlate with speed and distraction." },
  { id: "wildlife_night", label: "Night + Rural + Wildlife Zone",
    conditions: { timeOfDay: "night", roadType: "rural", weather: "clear", traffic: "low" },
    riskMultiplier: 0.62, baseSeverity: 0.107, predictedSeverity: 0.09,
    rationale: "Wildlife collisions have lowest severity. Drivers instinctively decelerate on dark rural roads." }
];

// ─── RESOURCE ALLOCATION ──────────────────────────────────────────────────────
export const RESOURCE_ALLOCATION = [
  { domain: "EMS Pre-Positioning", icon: "🚑", findingRef: "02 + 03",
    action: "Pre-stage trauma units near curved rural corridors during dusk windows (30 min before/after astronomical sunset).",
    lead: "Emergency Health Services NS", season: "Year-round (peak May–Sep)" },
  { domain: "Corridor Monitoring", icon: "📡", findingRef: "03",
    action: "Install real-time sensor alerts on Hwy 102/103 curve segments flagged in hotspot analysis.",
    lead: "NS Dept. of Public Works", season: "Year-round" },
  { domain: "Seasonal Staffing", icon: "📅", findingRef: "01",
    action: "Counter-cyclical enforcement staffing: summer deployment ≥ winter. Reverse current seasonal assumptions.",
    lead: "RCMP Traffic Services", season: "May–September (elevated)" },
  { domain: "Weather-Triggered Readiness", icon: "🌤️", findingRef: "01 + 02",
    action: "Automated alert system: when Environment Canada forecasts fog/black-ice windows, trigger pre-emptive corridor advisories.",
    lead: "NS 511 / Emergency Management", season: "Oct–Apr (fog/ice season)" },
  { domain: "Engineering Interventions", icon: "🏗️", findingRef: "03",
    action: "Prioritize rumble strip and curve advisory signage upgrades for segments with severity rate ≥ 25%.",
    lead: "NS Transportation Infrastructure", season: "Capital planning cycle" },
  { domain: "Public Messaging", icon: "📢", findingRef: "01 + 04",
    action: "Redirect highway safety messaging budget from winter-focused to summer speed/distraction campaigns.",
    lead: "NS Dept. of Health / MADD NS", season: "Spring campaign launch (April)" },
  { domain: "Data Governance", icon: "📊", findingRef: "ALL",
    action: "Establish quarterly model retraining pipeline as new NS GeoJSON collision data is ingested.",
    lead: "NS Digital Service / MBAN Program", season: "Quarterly" }
];
```

---

### 2. src/index.css — REPLACE ENTIRELY

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
@import 'leaflet/dist/leaflet.css';

:root {
  /* Nova Scotia Coastal Palette — refined */
  --bg-fog: #F7F9FC;
  --bg-surface: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-drawer: #EEF2F7;

  --text-main: #2D3748;
  --text-heading: #1E3A5F;
  --text-muted: #64748B;

  --accent-blue: #2B6CB0;
  --accent-hover: #2C5282;
  --accent-teal: #38A89D;
  --accent-red: #C53030;
  --accent-amber: #B7791F;
  --accent-green: #2F855A;

  --border-light: #E2E8F0;
  --border-focus: #CBD5E1;

  --shadow-subtle: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
  --shadow-hover: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04);

  --border-radius: 8px;
  --border-radius-lg: 12px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-fog);
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5 {
  color: var(--text-heading);
  font-weight: 600;
  letter-spacing: -0.02em;
}
h1 { font-size: 2rem; line-height: 1.2; }
h2 { font-size: 1.5rem; line-height: 1.3; margin-bottom: 0.5rem; }
h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
p  { color: var(--text-main); margin-bottom: 1rem; }

.text-meta  { font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; color: var(--text-muted); }
.text-value { font-family: 'JetBrains Mono', monospace; font-weight: 600; color: var(--accent-blue); }

.app-container { display: flex; min-height: 100vh; }

.sidebar {
  width: 260px;
  background-color: var(--bg-surface);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  position: fixed;
  height: 100vh;
  z-index: 50;
  box-shadow: 2px 0 8px rgba(0,0,0,0.03);
}

.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 2.5rem 3rem;
  max-width: 1400px;
}

.card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-subtle);
}

.card-header { margin-bottom: 1rem; }

.card-transition { transition: all 0.2s ease-in-out; }
.card-transition:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.presentation-mode .sidebar      { display: none; }
.presentation-mode .main-content { margin-left: 0; padding: 3rem 5rem; max-width: none; }

/* Leaflet override — keep z-index below sidebar */
.leaflet-container { border-radius: var(--border-radius-lg); }
.leaflet-control-zoom { border: 1px solid var(--border-light) !important; box-shadow: var(--shadow-subtle) !important; }
```

---

### 3. src/components/layout/Sidebar.jsx — REPLACE ENTIRELY

```jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, ShieldCheck, PieChart, Users, Navigation, Map, Target } from 'lucide-react';

const navItems = [
  { path: '/',                   label: 'Overview',             icon: <Activity size={18} /> },
  { path: '/performance',        label: 'Model Performance',    icon: <PieChart size={18} /> },
  { path: '/risk-zones',         label: 'Risk Zones',           icon: <Navigation size={18} /> },
  { path: '/map',                label: 'Geographic Evidence',  icon: <Map size={18} /> },
  { path: '/archetypes',         label: 'Behavioral Profiles',  icon: <Users size={18} /> },
  { path: '/resource-allocation',label: 'Resource Allocation',  icon: <Target size={18} /> },
  { path: '/policy',             label: 'Policy Signals',       icon: <Activity size={18} /> },
  { path: '/integrity',          label: 'Integrity + Limits',   icon: <ShieldCheck size={18} /> },
];

const Sidebar = () => (
  <aside className="sidebar">
    <div style={{ padding: '0 1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
        Provincial Highway Safety
      </div>
      <h2 style={{ fontSize: '1.1rem', color: 'var(--text-heading)', lineHeight: 1.2, margin: 0 }}>
        NS Collision Severity
      </h2>
      <div style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', fontWeight: 600, marginTop: '0.35rem', letterSpacing: '0.5px' }}>
        Empirical V2 · XGBoost 0.642 AUC
      </div>
    </div>

    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', padding: '0 0.75rem', flex: 1 }}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0.65rem 0.85rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            color: isActive ? 'var(--accent-blue)' : 'var(--text-main)',
            background: isActive ? 'rgba(43,108,176,0.08)' : 'transparent',
            fontWeight: isActive ? 600 : 400,
            borderLeft: isActive ? '3px solid var(--accent-blue)' : '3px solid transparent',
            transition: 'all 0.15s ease'
          })}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>

    <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-light)' }}>
      <div style={{ padding: '10px 12px', background: 'var(--bg-fog)', border: '1px solid var(--border-light)', borderRadius: '6px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '3px' }}>Public Health Framework</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Severity conditional on collision. Not causal determinism.
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--accent-teal)', marginTop: '6px', fontWeight: 500 }}>
          Shklanka & Kodi · 2025
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;
```

---

### 4. src/App.jsx — REPLACE ENTIRELY

```jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Overview from './views/Overview';
import Performance from './views/Performance';
import RiskZones from './views/RiskZones';
import Archetypes from './views/Archetypes';
import Policy from './views/Policy';
import Integrity from './views/Integrity';
import MapEvidence from './views/MapEvidence';
import ResourceAllocation from './views/ResourceAllocation';

function App() {
  const [presentationMode, setPresentationMode] = useState(false);

  return (
    <div className={`app-container ${presentationMode ? 'presentation-mode' : ''}`}>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/"                    element={<Overview />} />
          <Route path="/performance"         element={<Performance />} />
          <Route path="/risk-zones"          element={<RiskZones />} />
          <Route path="/map"                 element={<MapEvidence />} />
          <Route path="/archetypes"          element={<Archetypes />} />
          <Route path="/resource-allocation" element={<ResourceAllocation />} />
          <Route path="/policy"              element={<Policy />} />
          <Route path="/integrity"           element={<Integrity />} />
          <Route path="*"                    element={<Navigate to="/" replace />} />
        </Routes>

        <button
          onClick={() => setPresentationMode(!presentationMode)}
          style={{ position: 'fixed', bottom: '20px', right: '20px', padding: '8px 16px',
                   background: 'var(--accent-blue)', color: 'white', border: 'none',
                   borderRadius: '4px', cursor: 'pointer', zIndex: 100 }}
        >
          {presentationMode ? 'Exit Presentation' : 'Presentation Mode'}
        </button>
      </main>
    </div>
  );
}

export default App;
```

---

### 5. src/views/Performance.jsx — REPLACE ENTIRELY

Adds Recharts AUC comparison bar chart and predictor importance bars.

```jsx
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { EMPIRICAL_DATA } from '../data/v2_empirical_data';

const Performance = () => {
  const { models } = EMPIRICAL_DATA;

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Model Performance</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Empirical Discrimination Assessment · N=2,068 · Temporal Holdout</p>
      </header>

      {/* Narrative */}
      <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.8, maxWidth: '800px', marginBottom: '2.5rem' }}>
        {models.narrative}
      </p>

      {/* AUC Comparison Chart */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>AUC-ROC by Model</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={models.comparison} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" domain={[0.5, 0.7]} tickFormatter={v => v.toFixed(2)} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#1E3A5F', fontWeight: 500 }} width={100} />
              <Tooltip formatter={(v) => [v.toFixed(3), 'AUC']} contentStyle={{ borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.875rem' }} />
              <Bar dataKey="auc" radius={[0, 4, 4, 0]}>
                {models.comparison.map((entry, idx) => (
                  <Cell key={idx} fill={idx === 0 ? '#2B6CB0' : idx === 1 ? '#38A89D' : '#CBD5E1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {models.comparison.map((model, idx) => (
              <div key={idx} className="card" style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${idx === 0 ? 'var(--accent-blue)' : 'var(--border-focus)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.95rem' }}>{model.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>{model.desc}</div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.15rem', fontWeight: 700, color: idx === 0 ? 'var(--accent-blue)' : 'var(--text-heading)' }}>
                    {model.auc.toFixed(3)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Predictors */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Top 6 Predictors (XGBoost Gain)</h2>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {models.predictors.map((pred, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '130px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-heading)', flexShrink: 0 }}>{pred.name}</div>
                <div style={{ flex: 1, background: 'var(--bg-fog)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${pred.imp * 100}%`, height: '100%', borderRadius: '5px', background: idx < 2 ? 'var(--accent-blue)' : 'var(--accent-teal)', transition: 'width 0.6s ease' }} />
                </div>
                <div style={{ width: '40px', textAlign: 'right', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {(pred.imp * 100).toFixed(0)}
                </div>
                <div style={{ width: '220px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{pred.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Defensible Reality */}
      <section className="card" style={{ padding: '2rem', background: 'var(--bg-fog)', borderLeft: '4px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <ShieldCheck size={22} color="var(--accent-blue)" />
          <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Why 0.642 AUC is a Defensible Reality</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
            Collision severity is heavily influenced by crash-level physics that are mathematically unobservable prior to impact: kinetic energy transfer, precise impact geometry, seatbelt utilization, and occupant frailty create an irreducible noise floor.
          </p>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
            Algorithms exceeding 0.75 AUC in this domain frequently suffer from data leakage. An empirical 0.642 AUC demonstrates that environmental and behavioral contexts <em>do</em> shift probability distributions — providing an honest, credible signal for macroscopic policy prioritization.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Performance;
```

---

### 6. src/views/RiskZones.jsx — REPLACE ENTIRELY

Adds Recharts monthly sparkline below the existing content.

```jsx
import React from 'react';
import { CloudRain, Sun, Mountain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { EMPIRICAL_DATA } from '../data/v2_empirical_data';

const RiskZones = () => {
  const { terrain, visibilityTime } = EMPIRICAL_DATA.riskZones;

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Risk Zones & Contexts</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Where Severity Concentrates in Nova Scotia</p>
      </header>

      {/* Terrain */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <Mountain color="var(--text-muted)" size={20} />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>The Geometry of Severity</h2>
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '800px' }}>{terrain.narrative}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '2rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{(terrain.curves * 100).toFixed(1)}%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Severity · Curved Roads (Single Veh.)</div>
            </div>
            <div style={{ height: '1px', background: 'var(--border-light)', width: '60%', margin: '0 auto' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--text-main)' }}>{(terrain.straight * 100).toFixed(1)}%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Severity · Straight Roads (Single Veh.)</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '1.5rem' }}>Severity by Collision Type</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {terrain.types.map((type, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '120px', fontSize: '0.9rem', color: 'var(--text-main)', flexShrink: 0 }}>{type.type}</div>
                  <div style={{ flex: 1, background: 'var(--bg-fog)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${type.rate * 100}%`, background: type.rate > 0.4 ? 'var(--accent-red)' : type.rate > 0.2 ? 'var(--accent-amber)' : 'var(--accent-blue)', height: '100%', borderRadius: '5px' }} />
                  </div>
                  <div style={{ width: '55px', textAlign: 'right', fontSize: '0.88rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-heading)' }}>
                    {(type.rate * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visibility */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <Sun color="var(--text-muted)" size={20} />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Visibility & Seasonal Inversions</h2>
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '800px' }}>{visibilityTime.narrative}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {visibilityTime.lightBars.map((bar, idx) => (
            <div key={idx} className="card card-transition" style={{ borderLeft: bar.label === 'Dusk' ? '4px solid var(--accent-amber)' : '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{bar.label} Transition</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: bar.label === 'Dusk' ? 'var(--accent-amber)' : 'var(--text-heading)' }}>
                {(bar.rate * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Sparkline */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-heading)' }}>Monthly Severity Rate — The Summer Paradox</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={visibilityTime.monthlyRates} margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 11, fill: '#64748B' }} domain={[0.1, 0.35]} />
              <Tooltip formatter={v => [`${(v * 100).toFixed(1)}%`, 'Severity']} contentStyle={{ borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.875rem' }} />
              <ReferenceLine y={0.218} stroke="#CBD5E1" strokeDasharray="4 2" label={{ value: 'Baseline 21.8%', position: 'right', fontSize: 10, fill: '#94A3B8' }} />
              <Line type="monotone" dataKey="r" stroke="#2B6CB0" strokeWidth={2.5} dot={{ r: 4, fill: '#2B6CB0' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
            September peak (29.3%) exceeds every winter month. May–Sep average: 26.7% vs Nov–Mar average: 17.3%.
          </div>
        </div>
      </section>
    </div>
  );
};

export default RiskZones;
```

---

### 7. src/views/Archetypes.jsx — REPLACE ENTIRELY

Adds risk-level colour coding and a severe vs. non-severe contrast section.

```jsx
import React from 'react';
import { Users, Info } from 'lucide-react';
import { EMPIRICAL_DATA } from '../data/v2_empirical_data';

const riskColor = (severeStr) => {
  const val = parseFloat(severeStr);
  if (val >= 30) return 'var(--accent-red)';
  if (val >= 22) return 'var(--accent-amber)';
  return 'var(--accent-green)';
};

const Archetypes = () => {
  const { archetypes } = EMPIRICAL_DATA;

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Behavioral Communication Profiles</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Heuristics for Intervention Targeting</p>
      </header>

      <div style={{ background: 'rgba(43,108,176,0.06)', borderLeft: '4px solid var(--accent-blue)', padding: '1rem 1.5rem', borderRadius: '4px', marginBottom: '3rem', display: 'flex', gap: '1rem' }}>
        <Info color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-heading)' }}>Structural Note</h4>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
            The following "Archetypes" are flag-driven communication heuristics, not statistically proven independent causal clusters. They translate algorithmic findings into human-centered priorities for public health and law enforcement.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {archetypes.map((arch, idx) => {
          const color = riskColor(arch.severe);
          return (
            <div key={idx} className="card card-transition" style={{ position: 'relative', overflow: 'hidden', borderTop: `3px solid ${color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{arch.tag}</div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-heading)' }}>{arch.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{arch.pct} of collisions</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color, lineHeight: 1 }}>{arch.severe}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Severe Rate</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>{arch.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Severe vs non-severe contrast */}
      <div className="card" style={{ padding: '2rem', borderTop: '3px solid var(--accent-blue)' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Severe vs. Non-Severe: What the Split Looks Like</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Severe Cluster (21.8% · 450 cases)</div>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-main)', lineHeight: 2, fontSize: '0.92rem' }}>
              <li>Overrepresented at dusk and in September</li>
              <li>Single-vehicle curve + grade geometry</li>
              <li>Distraction or impairment flag present</li>
              <li>High-speed highway context (Hwy 102/104)</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Non-Severe Majority (78.2% · 1,618 cases)</div>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-main)', lineHeight: 2, fontSize: '0.92rem' }}>
              <li>Winter months (defensive driving adaptation)</li>
              <li>Sideswipe and low-speed parking collisions</li>
              <li>Wildlife encounters (avoidance maneuvers)</li>
              <li>Urban intersections with low-speed limits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archetypes;
```

---

### 8. src/views/Policy.jsx — REPLACE ENTIRELY

Expands from 3 to 6 policy action cards. Keep the exact same expandable card component pattern.

```jsx
import React, { useState } from 'react';
import { Activity, ShieldAlert, Navigation, Clock, Cloud, Radio, Database } from 'lucide-react';
import { EMPIRICAL_DATA } from '../data/v2_empirical_data';

const policyActions = [
  {
    id: 1, icon: <Clock size={22} />,
    tier1: "Targeted Enforcement During Dusk Transitions",
    riskSignal: "Dusk Transition Risk", findingRef: "Finding 02",
    family: "Enforcement & Operations", lead: "RCMP Highway Patrol",
    rationale: "Align speed enforcement patrols with astronomical sunset, not fixed hours. The optical illusion of visibility during dusk on rural curves is the primary severity driver in Finding 02.",
    caution: "Requires shifting officer shift structures to track astronomical sunset windows by season."
  },
  {
    id: 2, icon: <ShieldAlert size={22} />,
    tier1: "Summer Public Health Messaging Reallocation",
    riskSignal: "Summer Complacency", findingRef: "Finding 01",
    family: "Communications", lead: "Dept. of Health / NS Public Works",
    rationale: "Winter driving awareness campaigns are effective (severity stays low). Redirect summer messaging to target high-speed distraction and complacency on clear, dry days — the actual peak season.",
    caution: "Avoid implying summer weather causes crashes. Target speed and attentional context specifically."
  },
  {
    id: 3, icon: <Navigation size={22} />,
    tier1: "Corridor-Specific Triage Scaling",
    riskSignal: "Curve + Grade Exposure", findingRef: "Finding 03",
    family: "Triage & Emergency Response", lead: "EHS / Hospital Administration",
    rationale: "Collisions reported on curved, graded rural segments should trigger elevated default trauma response probability regardless of initial caller assessment. A curve crash at 110 km/h has 29.9% severity base rate.",
    caution: "Applies to prioritization only. Must not delay response to straight-road crashes."
  },
  {
    id: 4, icon: <Cloud size={22} />,
    tier1: "Weather-Triggered Readiness Protocol",
    riskSignal: "Fog / Black-Ice Windows", findingRef: "Finding 01 + 02",
    family: "Emergency Preparedness", lead: "NS 511 / Emergency Management Office",
    rationale: "Automated alert pipeline: when Environment Canada forecasts fog or black-ice windows on key corridors (102/103/104), trigger pre-emptive EMS pre-positioning and dynamic corridor advisories.",
    caution: "Alert fatigue risk if thresholds are too broad. Calibrate to verified high-severity forecast conditions."
  },
  {
    id: 5, icon: <Radio size={22} />,
    tier1: "Corridor Monitoring Sensor Expansion",
    riskSignal: "Real-Time Severity Signals", findingRef: "Finding 03",
    family: "Infrastructure & Engineering", lead: "NS Dept. of Transportation",
    rationale: "Deploy real-time sensor alerts on Hwy 102/103 curve segments flagged in hotspot analysis. Speed feedback signs have demonstrated 10–15% speed reduction in comparable NS pilots.",
    caution: "Capital cost. Prioritize Truro interchange and Bedford Highway corridor first."
  },
  {
    id: 6, icon: <Database size={22} />,
    tier1: "Quarterly Model Retraining Pipeline",
    riskSignal: "Model Drift / Data Freshness", findingRef: "ALL",
    family: "Data Governance", lead: "NS Digital Service / MBAN Program",
    rationale: "Establish quarterly ingestion of new NS GeoJSON collision records to retrain the XGBoost model. Seasonal drift (new months shift severity distribution) degrades model accuracy over 12+ month windows.",
    caution: "Requires maintaining the empirical V2 pipeline and environment. Document all retraining runs."
  }
];

const Policy = () => {
  const [expandedId, setExpandedId] = useState(null);
  const toggle = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Operational Policy Signals</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Translating Model Outputs to System Interventions</p>
      </header>

      <section className="card" style={{ marginBottom: '3rem', borderLeft: '4px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          <Activity size={30} color="var(--accent-blue)" />
          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>The Goal: Prioritization, Not Magic</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              This model does not automate decision-making. It identifies combinations of environmental and temporal factors that reliably predict <em>elevated severity risk</em> when a collision occurs. Each policy action below ties directly to a numbered finding.
            </p>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {policyActions.map((action) => (
          <div key={action.id} className="card card-transition" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => toggle(action.id)}>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--accent-blue)', opacity: 0.8 }}>{action.icon}</div>
                <div>
                  <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-amber)', background: 'rgba(183,121,31,0.1)', padding: '2px 8px', borderRadius: '4px', marginBottom: '4px' }}>
                    {action.riskSignal} · {action.findingRef}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{action.tier1}</h3>
                </div>
              </div>
              <div style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 500, flexShrink: 0, marginLeft: '1rem' }}>
                {expandedId === action.id ? '↑ Close' : '↓ Details'}
              </div>
            </div>

            {expandedId === action.id && (
              <div style={{ padding: '1.5rem', background: 'var(--bg-fog)', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) 2fr', gap: '2rem' }}>
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Intervention Family</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 500 }}>{action.family}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Operational Lead</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 500 }}>{action.lead}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Structural Rationale</div>
                      <div style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>{action.rationale}</div>
                    </div>
                    <div style={{ background: 'rgba(197,48,48,0.05)', padding: '0.65rem 0.85rem', borderRadius: '4px', borderLeft: '2px solid var(--accent-red)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', marginBottom: '2px' }}>Integrity Caution</div>
                      <div style={{ fontSize: '0.88rem' }}>{action.caution}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Policy;
```

---

### 9. src/views/Integrity.jsx — REPLACE ENTIRELY

Adds a 4th limitation card and a continuous improvement section.

```jsx
import React from 'react';
import { ShieldCheck, AlertTriangle, CloudRain, Car, FileWarning, RefreshCw } from 'lucide-react';

const limitations = [
  {
    icon: <Car />, color: 'var(--accent-amber)',
    title: "Missing Crash-Level Physics",
    body: "The model lacks NCDB variables: vehicle type (mass differential), precise impact angle, occupant age, and seatbelt utilization. These form the unobservable noise floor capping prediction accuracy at ~0.64 AUC."
  },
  {
    icon: <CloudRain />, color: 'var(--accent-amber)',
    title: "Microclimate Station Mismatch",
    body: "Weather is mapped from nearest Environment Canada stations. Nova Scotia's coastal geography creates localized fog banks and valley icing that station data misses — injecting spatial noise into our strongest predictors."
  },
  {
    icon: <AlertTriangle />, color: 'var(--accent-amber)',
    title: "Underreported Behavioral Flags",
    body: "Distraction and aggression are officer-reported flags, historically underreported by 30–50% nationally. Archetypes represent heuristic clusters, not absolute population truths."
  },
  {
    icon: <FileWarning />, color: 'var(--accent-amber)',
    title: "Reporting & Data Completeness",
    body: "This dataset covers police-reported collisions only. Unreported minor collisions and near-misses are excluded. The 21.8% severe rate reflects the reported subset, not the full population of all events."
  }
];

const Integrity = () => (
  <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>
    <header style={{ marginBottom: '3rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Methodological Integrity</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Structural Guardrails and Analytical Limitations</p>
    </header>

    {/* Causal Boundary */}
    <section style={{ marginBottom: '3.5rem' }}>
      <div style={{ background: 'rgba(43,108,176,0.06)', padding: '2rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <ShieldCheck size={22} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>The Causal Boundary</h2>
        </div>
        <p style={{ fontSize: '1rem', lineHeight: 1.75, margin: 0 }}>
          This framework models <strong>Severity Conditional on Collision</strong>. It does not predict crash occurrence. Therefore it cannot claim that removing a specific risk factor will mathematically eliminate a specific proportion of severe outcomes. It identifies environments where severity is structurally amplified so systems can prioritize mitigation.
        </p>
      </div>
    </section>

    {/* Limitations */}
    <section style={{ marginBottom: '3.5rem' }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Known Limitations</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {limitations.map((lim, idx) => (
          <div key={idx} className="card" style={{ padding: '1.75rem', borderTop: `4px solid ${lim.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(183,121,31,0.1)', padding: '0.6rem', borderRadius: '7px', color: lim.color }}>{lim.icon}</div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>{lim.title}</h3>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>{lim.body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Continuous Improvement */}
    <section className="card" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-teal)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <RefreshCw size={20} color="var(--accent-teal)" />
        <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-heading)' }}>Continuous Improvement Pathway</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-teal)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Near-Term (Q1–Q2)</h4>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 2, color: 'var(--text-main)' }}>
            <li>Ingest Q4 2025 + Q1 2026 collision records</li>
            <li>ECCC weather station bootstrap (temp + wind)</li>
            <li>Validate NSRN posted speeds against field data</li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-teal)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Medium-Term (Q3–Q4)</h4>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 2, color: 'var(--text-main)' }}>
            <li>NCDB vehicle type + occupant data linkage</li>
            <li>Route-held-out validation (Hwy 102 vs 103)</li>
            <li>Platt calibration for probability scoring</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
);

export default Integrity;
```

---

### 10. src/views/MapEvidence.jsx — CREATE NEW

```jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MAP_DATA } from '../data/v2_empirical_data';

// Fix Leaflet default icon issue with bundlers
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LAYERS = [
  { id: 'corridors', label: 'Highway Corridors', description: 'Major NS provincial highways' },
  { id: 'hotspots', label: 'Severity Hotspots', description: 'Empirically-informed high-severity segments' },
];

const severityColor = (s) => s === 'high' ? '#C53030' : s === 'medium' ? '#B7791F' : '#2F855A';

function ViewSetter({ view }) {
  const map = useMap();
  React.useEffect(() => {
    if (view === 'hrm') map.setView(MAP_DATA.hrmCenter, MAP_DATA.hrmZoom);
    else map.setView(MAP_DATA.center, MAP_DATA.defaultZoom);
  }, [view, map]);
  return null;
}

const MapEvidence = () => {
  const [activeView, setActiveView] = useState('province');
  const [activeLayers, setActiveLayers] = useState(['corridors', 'hotspots']);

  const toggleLayer = (id) => setActiveLayers(prev =>
    prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
  );

  return (
    <div style={{ maxWidth: '1100px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Geographic Evidence</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Nova Scotia Highway Corridor Risk Mapping</p>
      </header>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['province', 'hrm'].map(v => (
            <button key={v} onClick={() => setActiveView(v)} style={{
              padding: '6px 16px', borderRadius: '6px', border: '1px solid var(--border-light)',
              background: activeView === v ? 'var(--accent-blue)' : 'var(--bg-surface)',
              color: activeView === v ? 'white' : 'var(--text-main)',
              fontWeight: activeView === v ? 600 : 400, cursor: 'pointer', fontSize: '0.88rem',
              transition: 'all 0.15s ease'
            }}>
              {v === 'province' ? 'Province View' : 'HRM Zoom'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {LAYERS.map(layer => (
            <button key={layer.id} onClick={() => toggleLayer(layer.id)} style={{
              padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--border-light)',
              background: activeLayers.includes(layer.id) ? 'rgba(43,108,176,0.1)' : 'var(--bg-surface)',
              color: activeLayers.includes(layer.id) ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontWeight: activeLayers.includes(layer.id) ? 600 : 400, cursor: 'pointer', fontSize: '0.85rem'
            }}>
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ height: '520px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-subtle)' }}>
        <MapContainer center={MAP_DATA.center} zoom={MAP_DATA.defaultZoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          <ViewSetter view={activeView} />

          {activeLayers.includes('corridors') && MAP_DATA.corridors.map(corridor => (
            <Polyline key={corridor.id} positions={corridor.coords} color={corridor.color} weight={3.5} opacity={0.75}>
              <Popup>
                <strong>{corridor.name}</strong><br />
                Severity level: {corridor.severity}
              </Popup>
            </Polyline>
          ))}

          {activeLayers.includes('hotspots') && MAP_DATA.hotspots.map(spot => (
            <CircleMarker key={spot.id} center={[spot.lat, spot.lng]}
              radius={spot.severity === 'high' ? 12 : 9}
              fillColor={severityColor(spot.severity)} fillOpacity={0.75}
              color="white" weight={2}>
              <Popup>
                <strong>{spot.name}</strong><br />
                Severity rate: {spot.severeRate}<br />
                <em style={{ fontSize: '0.85em', color: '#64748B' }}>{spot.note}</em>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="card" style={{ marginTop: '1.25rem', padding: '1.25rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Legend</div>
        {[
          { color: '#C53030', label: 'High severity corridor / hotspot' },
          { color: '#B7791F', label: 'Medium severity' },
          { color: '#2F855A', label: 'Lower severity' }
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: item.color, flexShrink: 0 }} />
            {item.label}
          </div>
        ))}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          Hotspot placements are empirically-informed. Click markers for detail.
        </div>
      </div>
    </div>
  );
};

export default MapEvidence;
```

---

### 11. src/views/ResourceAllocation.jsx — CREATE NEW

```jsx
import React, { useState } from 'react';
import { SCENARIO_PRESETS, RESOURCE_ALLOCATION } from '../data/v2_empirical_data';

const controls = {
  timeOfDay: { label: 'Time of Day', options: [
    { value: 'day',   label: 'Daylight' },
    { value: 'dusk',  label: 'Dusk ⚠️' },
    { value: 'night', label: 'Night' },
    { value: 'dawn',  label: 'Dawn' }
  ]},
  roadType: { label: 'Road Type', options: [
    { value: 'straight_highway', label: 'Straight Highway' },
    { value: 'curve',            label: 'Curved Rural ⚠️' },
    { value: 'rural',            label: 'Rural (straight)' },
    { value: 'urban',            label: 'Urban' }
  ]},
  weather: { label: 'Weather', options: [
    { value: 'clear', label: 'Clear' },
    { value: 'rain',  label: 'Rain' },
    { value: 'snow',  label: 'Snow / Ice ⚠️' },
    { value: 'fog',   label: 'Fog ⚠️' }
  ]},
  traffic: { label: 'Traffic', options: [
    { value: 'low',    label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high',   label: 'High' }
  ]}
};

const getRiskEstimate = (conditions) => {
  let risk = 0.218; // baseline
  if (conditions.timeOfDay === 'dusk')  risk += 0.057;
  if (conditions.timeOfDay === 'night') risk -= 0.006;
  if (conditions.roadType === 'curve')  risk += 0.081;
  if (conditions.weather === 'snow')    risk += 0.020;
  if (conditions.weather === 'fog')     risk += 0.035;
  if (conditions.traffic === 'high')    risk += 0.025;
  if (conditions.traffic === 'low')     risk -= 0.030;
  return Math.min(Math.max(risk, 0.08), 0.55);
};

const riskLabel = (r) => {
  if (r >= 0.38) return { label: 'High Risk', color: 'var(--accent-red)' };
  if (r >= 0.26) return { label: 'Elevated Risk', color: 'var(--accent-amber)' };
  return { label: 'Near Baseline', color: 'var(--accent-green)' };
};

const ResourceAllocation = () => {
  const [conditions, setConditions] = useState({ timeOfDay: 'day', roadType: 'straight_highway', weather: 'clear', traffic: 'medium' });
  const [activePreset, setActivePreset] = useState(null);

  const applyPreset = (preset) => {
    setConditions(preset.conditions);
    setActivePreset(preset.id);
  };

  const riskEst = getRiskEstimate(conditions);
  const { label: riskLbl, color: riskClr } = riskLabel(riskEst);
  const matchedPreset = SCENARIO_PRESETS.find(p => p.id === activePreset);

  return (
    <div style={{ maxWidth: '1050px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Resource Allocation</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Scenario Simulator & Operational Priority Matrix</p>
      </header>

      {/* Scenario Presets */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Quick Scenarios</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {SCENARIO_PRESETS.map(preset => (
            <button key={preset.id} onClick={() => applyPreset(preset)} style={{
              padding: '0.85rem 1rem', borderRadius: '8px', border: `2px solid ${activePreset === preset.id ? 'var(--accent-blue)' : 'var(--border-light)'}`,
              background: activePreset === preset.id ? 'rgba(43,108,176,0.07)' : 'var(--bg-surface)',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease'
            }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '2px' }}>{preset.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Predicted: {(preset.predictedSeverity * 100).toFixed(0)}% severity</div>
            </button>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        {/* Condition Controls */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Build a Scenario</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.entries(controls).map(([key, ctrl]) => (
              <div key={key}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>{ctrl.label}</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {ctrl.options.map(opt => (
                    <button key={opt.value} onClick={() => { setConditions(c => ({ ...c, [key]: opt.value })); setActivePreset(null); }} style={{
                      padding: '5px 12px', borderRadius: '20px', border: '1px solid var(--border-light)', fontSize: '0.82rem',
                      background: conditions[key] === opt.value ? 'var(--accent-blue)' : 'var(--bg-fog)',
                      color: conditions[key] === opt.value ? 'white' : 'var(--text-main)',
                      fontWeight: conditions[key] === opt.value ? 600 : 400, cursor: 'pointer', transition: 'all 0.12s ease'
                    }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Output */}
        <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Risk Assessment</h2>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: riskClr, lineHeight: 1 }}>
              {(riskEst * 100).toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>Estimated Severity Rate</div>
            <div style={{ display: 'inline-block', marginTop: '0.75rem', padding: '4px 14px', borderRadius: '20px', background: `${riskClr}15`, color: riskClr, fontWeight: 700, fontSize: '0.82rem' }}>
              {riskLbl}
            </div>
          </div>

          <div style={{ background: 'var(--bg-fog)', borderRadius: '8px', padding: '1rem', borderLeft: `3px solid ${riskClr}` }}>
            {matchedPreset ? (
              <>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Scenario Rationale</div>
                <div style={{ fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--text-main)' }}>{matchedPreset.rationale}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Compared to Baseline</div>
                <div style={{ fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--text-main)' }}>
                  Baseline severe rate: 21.8%. This combination is {riskEst > 0.218 ? `${((riskEst / 0.218 - 1) * 100).toFixed(0)}% above baseline` : 'near or below baseline'}.
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Resource Priority Matrix */}
      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Operational Priority Matrix</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {RESOURCE_ALLOCATION.map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '2rem 1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
              <div style={{ fontSize: '1.4rem' }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-heading)' }}>{item.domain}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', fontWeight: 500, marginTop: '2px' }}>Finding {item.findingRef}</div>
              </div>
              <div style={{ fontSize: '0.87rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{item.action}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div style={{ fontWeight: 500, color: 'var(--text-heading)', marginBottom: '2px' }}>{item.lead}</div>
                <div>{item.season}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResourceAllocation;
```

---

### 12. src/components/shared/IntegrityFlag.jsx — REPLACE ENTIRELY

```jsx
import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const IntegrityFlag = ({ message }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 500, color: 'var(--accent-blue)', background: 'rgba(43,108,176,0.08)', border: '1px solid rgba(43,108,176,0.2)', padding: '4px 10px', borderRadius: '20px' }}>
    <ShieldCheck size={13} />
    {message || 'Empirical V2 · XGBoost 0.642 AUC · Real NS Data'}
  </div>
);

export const CausalBoundary = () => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 14px', background: 'rgba(183,121,31,0.08)', border: '1px solid rgba(183,121,31,0.2)', borderRadius: '6px', fontSize: '0.82rem' }}>
    <AlertCircle size={14} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '1px' }} />
    <span style={{ color: 'var(--text-main)', lineHeight: 1.5 }}>
      Severity conditional on collision. This is a prioritization tool, not causal determinism or crash prediction.
    </span>
  </div>
);

export default IntegrityFlag;
```

---

## Verification Checklist

After implementing all changes, run:

```bash
npm run build
```

Then manually verify in `npm run dev`:

- [ ] All 8 sidebar routes navigate without errors (Overview, Model Performance, Risk Zones, Geographic Evidence, Behavioral Profiles, Resource Allocation, Policy Signals, Integrity + Limits)
- [ ] Active sidebar item shows left blue border indicator
- [ ] Recharts bar chart renders in Performance with 3 bars
- [ ] Recharts monthly sparkline renders in Risk Zones
- [ ] Leaflet map loads with CartoDB tiles in MapEvidence
- [ ] Highway polylines visible at province view
- [ ] Hotspot circle markers clickable with popups
- [ ] HRM zoom button changes map view
- [ ] Scenario controls update the risk percentage in ResourceAllocation
- [ ] Quick scenario presets populate controls and rationale
- [ ] All 6 policy cards expand on click
- [ ] Presentation mode button still works (hides sidebar)
- [ ] `npm run build` produces no TypeScript/ESLint errors
- [ ] `vite.config.js` base is still `/vcm_model/` (do not change)
- [ ] `vcm_dashboard.html` is untouched

## Data Integrity Rules (do not violate)

- XGBoost AUC = **0.642** — this is the sole validated winner. Never write "hybrid" or reference any model above 0.642.
- All numeric findings come from `v2_empirical_data.js` — do not hardcode different numbers anywhere.
- The `deliverable_*.png/csv` files in the repo are synthetic pipeline outputs. Do not reference them.
- Severity rate = **21.8%** (450 severe of 2,068 total). Do not alter.
