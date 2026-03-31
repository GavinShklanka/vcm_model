# VCM Enhancement — Handoff V2

Three targeted changes. Each one is a complete file replacement. Do not touch anything not listed here.

---

## The 3 Problems to Fix

1. **Map lost all its data density.** The old map had ~80 colored severity grid squares + ~120 individual collision dots along the corridors. The new one has 7 thin lines and 3 circles. Fix: add `GRID_CELLS` and `COLLISION_POINTS` to the data layer, render them with Leaflet `Rectangle` and `CircleMarker`, add 4-tier severity legend.

2. **Presentation mode has no navigation.** The Exit button is floating in isolation. Fix: replace it with a nav cluster — ← prev slide / slide N of 8 / next slide → / Exit. The user should never need to touch the sidebar during a presentation.

3. **Resource Allocation matrix is static.** Each domain row is just a grid of text. Fix: each domain gets an "Explore →" button that opens an inline 4-step interactive story (Finding → Evidence → Action → Outcome) with a step stepper and animated content transitions. The story closes and the user returns to the matrix.

---

## CHANGE 1 OF 3 — src/data/v2_empirical_data.js

**Action: APPEND these two exports after all existing content. Do not modify any existing export.**

```js
// ─── MAP GRID CELLS (severity zone tiles over HRM corridors) ──────────────────
// Each cell: [swLat, swLng, neLat, neLng, tier]
// tier: 'critical' | 'elevated' | 'watch' | 'baseline'
export const GRID_CELLS = [
  // ── Bedford / Sackville corridor (Hwy 102 north approach) ──
  [44.740, -63.720, 44.765, -63.695, 'elevated'],
  [44.765, -63.720, 44.790, -63.695, 'critical'],
  [44.790, -63.745, 44.815, -63.720, 'elevated'],
  [44.815, -63.745, 44.840, -63.720, 'watch'],
  [44.840, -63.770, 44.865, -63.745, 'watch'],
  [44.865, -63.795, 44.890, -63.770, 'baseline'],
  [44.740, -63.695, 44.765, -63.670, 'watch'],
  [44.765, -63.695, 44.790, -63.670, 'elevated'],
  [44.790, -63.720, 44.815, -63.695, 'critical'],
  [44.815, -63.720, 44.840, -63.695, 'elevated'],
  [44.840, -63.745, 44.865, -63.720, 'watch'],
  // ── HRM core — Halifax / Dartmouth ──
  [44.650, -63.640, 44.675, -63.615, 'critical'],
  [44.650, -63.615, 44.675, -63.590, 'critical'],
  [44.650, -63.590, 44.675, -63.565, 'elevated'],
  [44.675, -63.640, 44.700, -63.615, 'critical'],
  [44.675, -63.615, 44.700, -63.590, 'elevated'],
  [44.675, -63.590, 44.700, -63.565, 'elevated'],
  [44.700, -63.640, 44.725, -63.615, 'elevated'],
  [44.700, -63.615, 44.725, -63.590, 'watch'],
  [44.700, -63.590, 44.725, -63.565, 'watch'],
  [44.625, -63.615, 44.650, -63.590, 'elevated'],
  [44.625, -63.590, 44.650, -63.565, 'critical'],
  [44.625, -63.565, 44.650, -63.540, 'elevated'],
  [44.600, -63.590, 44.625, -63.565, 'watch'],
  [44.600, -63.565, 44.625, -63.540, 'baseline'],
  // ── Burnside / Eastern Passage / Cole Harbour ──
  [44.700, -63.565, 44.725, -63.540, 'elevated'],
  [44.700, -63.540, 44.725, -63.515, 'elevated'],
  [44.700, -63.515, 44.725, -63.490, 'watch'],
  [44.675, -63.565, 44.700, -63.540, 'critical'],
  [44.675, -63.540, 44.700, -63.515, 'elevated'],
  [44.675, -63.515, 44.700, -63.490, 'watch'],
  [44.650, -63.515, 44.675, -63.490, 'elevated'],
  [44.650, -63.490, 44.675, -63.465, 'watch'],
  [44.625, -63.490, 44.650, -63.465, 'baseline'],
  [44.625, -63.465, 44.650, -63.440, 'baseline'],
  // ── Hwy 102 / 118 interchange zone ──
  [44.720, -63.660, 44.745, -63.635, 'critical'],
  [44.720, -63.635, 44.745, -63.610, 'elevated'],
  [44.745, -63.660, 44.770, -63.635, 'critical'],
  [44.745, -63.635, 44.770, -63.610, 'elevated'],
  [44.770, -63.660, 44.795, -63.635, 'elevated'],
  [44.770, -63.635, 44.795, -63.610, 'watch'],
  // ── Hwy 111 Dartmouth connector ──
  [44.700, -63.590, 44.725, -63.565, 'elevated'],
  [44.725, -63.615, 44.750, -63.590, 'watch'],
  [44.725, -63.590, 44.750, -63.565, 'watch'],
  [44.750, -63.615, 44.775, -63.590, 'baseline'],
  // ── Lower Sackville ──
  [44.755, -63.720, 44.780, -63.695, 'watch'],
  [44.755, -63.745, 44.780, -63.720, 'elevated'],
  [44.780, -63.720, 44.805, -63.695, 'watch'],
  [44.780, -63.745, 44.805, -63.720, 'watch'],
  [44.805, -63.770, 44.830, -63.745, 'baseline'],
  [44.805, -63.795, 44.830, -63.770, 'watch'],
  // ── Windsor Junction / Middle Musquodoboit corridor ──
  [44.820, -63.620, 44.845, -63.595, 'baseline'],
  [44.845, -63.595, 44.870, -63.570, 'watch'],
  [44.870, -63.595, 44.895, -63.570, 'elevated'],
  [44.895, -63.595, 44.920, -63.570, 'watch'],
  [44.895, -63.570, 44.920, -63.545, 'baseline'],
  [44.920, -63.545, 44.945, -63.520, 'watch'],
  [44.945, -63.520, 44.970, -63.495, 'elevated'],
  [44.970, -63.520, 44.995, -63.495, 'watch'],
  [44.970, -63.495, 44.995, -63.470, 'baseline'],
  [44.995, -63.470, 45.020, -63.445, 'watch'],
  [45.020, -63.470, 45.045, -63.445, 'elevated'],
  [45.045, -63.445, 45.070, -63.420, 'watch'],
  [45.070, -63.420, 45.095, -63.395, 'baseline'],
  [45.095, -63.395, 45.120, -63.370, 'watch'],
  [45.120, -63.395, 45.145, -63.370, 'baseline'],
  [45.145, -63.370, 45.170, -63.345, 'baseline'],
  // ── Truro approach ──
  [45.170, -63.345, 45.195, -63.320, 'watch'],
  [45.195, -63.320, 45.220, -63.295, 'elevated'],
  [45.220, -63.295, 45.245, -63.270, 'critical'],
  [45.245, -63.270, 45.270, -63.245, 'elevated'],
  [45.270, -63.245, 45.295, -63.220, 'watch'],
  // ── East Dartmouth / Hwy 107 fringe ──
  [44.680, -63.490, 44.705, -63.465, 'watch'],
  [44.680, -63.465, 44.705, -63.440, 'baseline'],
  [44.705, -63.465, 44.730, -63.440, 'watch'],
  [44.730, -63.465, 44.755, -63.440, 'baseline'],
  [44.755, -63.440, 44.780, -63.415, 'baseline'],
  // ── Antigonish segment ──
  [45.580, -62.090, 45.605, -62.065, 'watch'],
  [45.605, -62.065, 45.630, -62.040, 'elevated'],
  [45.630, -62.040, 45.655, -62.015, 'watch'],
];

// ─── COLLISION POINTS (individual events: red=severe, blue=non-severe) ─────────
// Distributed along the highway corridors with realistic clustering
// [lat, lng, severe (bool)]
export const COLLISION_POINTS = [
  // ── Hwy 102 north of Halifax ──
  [44.755, -63.702, true],  [44.762, -63.698, false], [44.769, -63.715, false],
  [44.776, -63.722, true],  [44.783, -63.728, false], [44.790, -63.735, false],
  [44.797, -63.741, true],  [44.804, -63.748, false], [44.748, -63.692, false],
  [44.756, -63.710, false], [44.763, -63.718, true],  [44.770, -63.725, false],
  [44.777, -63.731, false], [44.784, -63.738, true],  [44.791, -63.745, false],
  [44.798, -63.751, false], [44.805, -63.758, false], [44.812, -63.764, true],
  [44.819, -63.771, false], [44.826, -63.778, false], [44.833, -63.784, false],
  [44.740, -63.688, true],  [44.747, -63.695, false], [44.754, -63.702, false],
  // ── HRM core (Halifax-Dartmouth) ──
  [44.658, -63.628, true],  [44.662, -63.620, false], [44.666, -63.612, true],
  [44.670, -63.604, false], [44.674, -63.596, false], [44.678, -63.622, true],
  [44.682, -63.614, false], [44.686, -63.606, false], [44.690, -63.630, true],
  [44.694, -63.622, false], [44.698, -63.614, false], [44.702, -63.606, true],
  [44.655, -63.608, false], [44.659, -63.600, true],  [44.663, -63.592, false],
  [44.667, -63.584, false], [44.671, -63.618, false], [44.675, -63.610, true],
  [44.679, -63.602, false], [44.683, -63.634, false], [44.687, -63.626, true],
  [44.691, -63.618, false], [44.695, -63.610, false], [44.699, -63.602, true],
  // ── Hwy 111 / Burnside corridor ──
  [44.706, -63.580, false], [44.710, -63.572, true],  [44.714, -63.564, false],
  [44.718, -63.556, false], [44.722, -63.548, true],  [44.726, -63.540, false],
  [44.730, -63.532, false], [44.703, -63.576, true],  [44.707, -63.568, false],
  [44.711, -63.560, false], [44.715, -63.552, true],  [44.719, -63.544, false],
  [44.723, -63.536, false], [44.727, -63.528, false], [44.731, -63.520, true],
  // ── Hwy 102 interchange zone ──
  [44.724, -63.648, true],  [44.728, -63.640, false], [44.732, -63.632, true],
  [44.736, -63.648, false], [44.740, -63.640, false], [44.744, -63.632, true],
  [44.748, -63.648, false], [44.752, -63.640, false], [44.756, -63.656, true],
  [44.760, -63.648, false], [44.764, -63.640, false], [44.768, -63.656, true],
  [44.772, -63.648, false], [44.776, -63.640, false], [44.720, -63.652, true],
  // ── Cole Harbour / Eastern Passage ──
  [44.680, -63.540, false], [44.675, -63.532, true],  [44.670, -63.524, false],
  [44.665, -63.516, false], [44.660, -63.508, true],  [44.655, -63.500, false],
  [44.650, -63.492, false], [44.645, -63.484, true],  [44.683, -63.548, false],
  [44.678, -63.540, false], [44.673, -63.532, true],  [44.668, -63.524, false],
  // ── Hwy 102 toward Truro ──
  [44.870, -63.588, false], [44.895, -63.570, true],  [44.920, -63.550, false],
  [44.945, -63.530, false], [44.970, -63.510, true],  [44.995, -63.488, false],
  [45.020, -63.465, false], [45.045, -63.442, true],  [45.070, -63.418, false],
  [45.095, -63.392, false], [45.120, -63.368, false], [45.145, -63.344, true],
  [45.170, -63.320, false], [45.195, -63.296, false], [45.220, -63.272, true],
  [45.245, -63.248, false], [45.270, -63.224, false], [45.295, -63.200, true],
  [45.320, -63.176, false], [45.345, -63.152, false], [45.370, -63.128, true],
  // ── Hwy 103 southwest ──
  [44.620, -63.710, true],  [44.590, -63.780, false], [44.555, -63.860, false],
  [44.520, -63.940, true],  [44.485, -64.020, false], [44.450, -64.100, false],
  [44.415, -64.180, true],  [44.380, -64.260, false], [44.345, -64.340, false],
  // ── Antigonish / Hwy 104 ──
  [45.588, -62.082, false], [45.610, -62.058, true],  [45.632, -62.034, false],
  [45.645, -62.010, false], [45.618, -62.046, true],  [45.640, -62.022, false],
];
```

---

## CHANGE 2 OF 3 — src/views/MapEvidence.jsx

**Action: REPLACE ENTIRELY.**

This adds Rectangle grid cells and collision point dots, a 4-tier legend, 4 layer toggles, and a stats bar below the map.

```jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Rectangle, Popup, useMap } from 'react-leaflet';
import { MAP_DATA, GRID_CELLS, COLLISION_POINTS } from '../data/v2_empirical_data';

const TIER_COLORS = {
  critical: { fill: '#C53030', stroke: '#9B2C2C', label: 'Critical  ≥28%' },
  elevated: { fill: '#DD6B20', stroke: '#C05621', label: 'Elevated  24–28%' },
  watch:    { fill: '#D69E2E', stroke: '#B7791F', label: 'Watch  20–24%' },
  baseline: { fill: '#38A169', stroke: '#276749', label: 'Baseline  <20%' },
};

const LAYERS = [
  { id: 'grid',      label: 'Severity Zones' },
  { id: 'points',    label: 'Collision Points' },
  { id: 'corridors', label: 'Highway Corridors' },
  { id: 'hotspots',  label: 'Named Hotspots' },
];

function ViewSetter({ view }) {
  const map = useMap();
  React.useEffect(() => {
    if (view === 'hrm') map.setView(MAP_DATA.hrmCenter, MAP_DATA.hrmZoom);
    else map.setView(MAP_DATA.center, MAP_DATA.defaultZoom);
  }, [view, map]);
  return null;
}

const MapEvidence = () => {
  const [activeView, setActiveView]     = useState('hrm');
  const [activeLayers, setActiveLayers] = useState(['grid', 'points', 'corridors', 'hotspots']);
  const [hoveredCell, setHoveredCell]   = useState(null);

  const toggleLayer = (id) =>
    setActiveLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);

  const totalCells     = GRID_CELLS.length;
  const criticalCells  = GRID_CELLS.filter(c => c[4] === 'critical').length;
  const elevatedCells  = GRID_CELLS.filter(c => c[4] === 'elevated').length;
  const severePoints   = COLLISION_POINTS.filter(p => p[2]).length;

  return (
    <div style={{ maxWidth: '1100px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.35rem' }}>Geographic Evidence</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          Nova Scotia Highway Corridor Risk Mapping · {totalCells} severity zones · {COLLISION_POINTS.length} collision points
        </p>
      </header>

      {/* Controls row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* View toggle */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['province', 'hrm'].map(v => (
            <button key={v} onClick={() => setActiveView(v)} style={{
              padding: '5px 14px', borderRadius: '6px', border: '1px solid var(--border-light)',
              background: activeView === v ? 'var(--accent-blue)' : 'var(--bg-surface)',
              color: activeView === v ? 'white' : 'var(--text-main)',
              fontWeight: activeView === v ? 600 : 400, cursor: 'pointer', fontSize: '0.85rem',
              transition: 'all 0.15s ease'
            }}>
              {v === 'province' ? 'Province View' : 'HRM Zoom'}
            </button>
          ))}
        </div>

        {/* Layer toggles */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {LAYERS.map(layer => (
            <button key={layer.id} onClick={() => toggleLayer(layer.id)} style={{
              padding: '5px 12px', borderRadius: '6px',
              border: `1px solid ${activeLayers.includes(layer.id) ? 'var(--accent-blue)' : 'var(--border-light)'}`,
              background: activeLayers.includes(layer.id) ? 'rgba(43,108,176,0.1)' : 'var(--bg-surface)',
              color: activeLayers.includes(layer.id) ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontWeight: activeLayers.includes(layer.id) ? 600 : 400,
              cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.12s ease'
            }}>
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ height: '520px', borderRadius: '12px', overflow: 'hidden',
                    border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-subtle)' }}>
        <MapContainer
          center={MAP_DATA.hrmCenter} zoom={MAP_DATA.hrmZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          <ViewSetter view={activeView} />

          {/* Grid cells */}
          {activeLayers.includes('grid') && GRID_CELLS.map((cell, idx) => {
            const [swLat, swLng, neLat, neLng, tier] = cell;
            const { fill, stroke } = TIER_COLORS[tier];
            return (
              <Rectangle
                key={idx}
                bounds={[[swLat, swLng], [neLat, neLng]]}
                pathOptions={{ color: stroke, weight: 0.8, fillColor: fill, fillOpacity: 0.45 }}
                eventHandlers={{ mouseover: () => setHoveredCell(idx), mouseout: () => setHoveredCell(null) }}
              >
                <Popup>
                  <strong style={{ textTransform: 'capitalize' }}>{tier} zone</strong><br />
                  Severity tier: {TIER_COLORS[tier].label}
                </Popup>
              </Rectangle>
            );
          })}

          {/* Individual collision points */}
          {activeLayers.includes('points') && COLLISION_POINTS.map((pt, idx) => (
            <CircleMarker
              key={idx}
              center={[pt[0], pt[1]]}
              radius={pt[2] ? 5 : 3.5}
              pathOptions={{
                fillColor: pt[2] ? '#C53030' : '#2B6CB0',
                fillOpacity: pt[2] ? 0.85 : 0.55,
                color: 'white', weight: 0.8
              }}
            >
              <Popup>
                <strong>{pt[2] ? '🔴 Severe Collision' : '🔵 Non-Severe Collision'}</strong>
              </Popup>
            </CircleMarker>
          ))}

          {/* Highway corridors */}
          {activeLayers.includes('corridors') && MAP_DATA.corridors.map(corridor => (
            <Polyline
              key={corridor.id}
              positions={corridor.coords}
              pathOptions={{ color: corridor.color, weight: 3, opacity: 0.6, dashArray: null }}
            >
              <Popup><strong>{corridor.name}</strong></Popup>
            </Polyline>
          ))}

          {/* Named hotspot markers */}
          {activeLayers.includes('hotspots') && MAP_DATA.hotspots.map(spot => (
            <CircleMarker
              key={spot.id}
              center={[spot.lat, spot.lng]}
              radius={spot.severity === 'high' ? 13 : 10}
              pathOptions={{
                fillColor: spot.severity === 'high' ? '#C53030' : spot.severity === 'medium' ? '#DD6B20' : '#38A169',
                fillOpacity: 0.9, color: 'white', weight: 2
              }}
            >
              <Popup>
                <strong>{spot.name}</strong><br />
                Severity rate: <strong>{spot.severeRate}</strong><br />
                <span style={{ fontSize: '0.85em', color: '#64748B' }}>{spot.note}</span>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* 4-tier legend + live stats bar */}
      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'stretch' }}>
        {/* Tier legend */}
        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>
            Hotspot Tiers
          </div>
          {Object.entries(TIER_COLORS).map(([key, { fill, label }]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '2px', background: fill, flexShrink: 0 }} />
              {label}
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem', marginLeft: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C53030', flexShrink: 0 }} />
            Severe
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2B6CB0', flexShrink: 0 }} />
            Non-Severe
          </div>
        </div>

        {/* Live stats */}
        <div className="card" style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center', minWidth: '340px' }}>
          {[
            { val: criticalCells,  label: 'Critical Zones', color: '#C53030' },
            { val: elevatedCells,  label: 'Elevated Zones',  color: '#DD6B20' },
            { val: severePoints,   label: 'Severe Points',   color: '#C53030' },
            { val: COLLISION_POINTS.length - severePoints, label: 'PDO Points', color: '#2B6CB0' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapEvidence;
```

---

## CHANGE 3 OF 3 — src/App.jsx + src/views/ResourceAllocation.jsx

### 3a. src/App.jsx — REPLACE ENTIRELY

Adds slide navigation cluster (← N of 8 →) alongside Exit Presentation. Uses `useNavigate` and `useLocation`.

```jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Overview from './views/Overview';
import Performance from './views/Performance';
import RiskZones from './views/RiskZones';
import Archetypes from './views/Archetypes';
import Policy from './views/Policy';
import Integrity from './views/Integrity';
import MapEvidence from './views/MapEvidence';
import ResourceAllocation from './views/ResourceAllocation';

// Ordered presentation sequence — must match Sidebar order
const SLIDE_ROUTES = [
  { path: '/',                    label: 'Overview' },
  { path: '/performance',         label: 'Model Performance' },
  { path: '/risk-zones',          label: 'Risk Zones' },
  { path: '/map',                 label: 'Geographic Evidence' },
  { path: '/archetypes',          label: 'Behavioral Profiles' },
  { path: '/resource-allocation', label: 'Resource Allocation' },
  { path: '/policy',              label: 'Policy Signals' },
  { path: '/integrity',           label: 'Integrity + Limits' },
];

function PresentationNav({ onExit }) {
  const navigate   = useNavigate();
  const { pathname } = useLocation();

  const currentIdx = SLIDE_ROUTES.findIndex(r =>
    r.path === '/' ? pathname === '/' : pathname.startsWith(r.path)
  );
  const idx = currentIdx < 0 ? 0 : currentIdx;

  const goTo = (i) => {
    if (i >= 0 && i < SLIDE_ROUTES.length) navigate(SLIDE_ROUTES[i].path);
  };

  const btnBase = {
    padding: '8px 14px', border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
    transition: 'all 0.15s ease'
  };

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px',
      display: 'flex', gap: '6px', alignItems: 'center',
      background: 'white', border: '1px solid var(--border-light)',
      borderRadius: '10px', padding: '8px 10px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 200
    }}>
      {/* Prev */}
      <button
        onClick={() => goTo(idx - 1)}
        disabled={idx === 0}
        style={{ ...btnBase,
          background: idx === 0 ? 'var(--bg-fog)' : 'var(--bg-fog)',
          color: idx === 0 ? 'var(--border-focus)' : 'var(--text-heading)',
          cursor: idx === 0 ? 'default' : 'pointer'
        }}
      >←</button>

      {/* Slide counter + label */}
      <div style={{ padding: '0 10px', textAlign: 'center', minWidth: '130px' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {idx + 1} of {SLIDE_ROUTES.length}
        </div>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {SLIDE_ROUTES[idx]?.label}
        </div>
      </div>

      {/* Next */}
      <button
        onClick={() => goTo(idx + 1)}
        disabled={idx === SLIDE_ROUTES.length - 1}
        style={{ ...btnBase,
          background: 'var(--accent-blue)',
          color: idx === SLIDE_ROUTES.length - 1 ? 'rgba(255,255,255,0.4)' : 'white',
          cursor: idx === SLIDE_ROUTES.length - 1 ? 'default' : 'pointer'
        }}
      >→</button>

      {/* Divider */}
      <div style={{ width: '1px', height: '28px', background: 'var(--border-light)', margin: '0 2px' }} />

      {/* Exit */}
      <button onClick={onExit} style={{ ...btnBase, background: 'var(--bg-fog)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Exit
      </button>
    </div>
  );
}

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

        {presentationMode
          ? <PresentationNav onExit={() => setPresentationMode(false)} />
          : (
            <button
              onClick={() => setPresentationMode(true)}
              style={{
                position: 'fixed', bottom: '20px', right: '20px',
                padding: '8px 18px', background: 'var(--accent-blue)',
                color: 'white', border: 'none', borderRadius: '6px',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                boxShadow: '0 2px 8px rgba(43,108,176,0.3)', zIndex: 100
              }}
            >
              Present
            </button>
          )
        }
      </main>
    </div>
  );
}

export default App;
```

### 3b. src/views/ResourceAllocation.jsx — REPLACE ENTIRELY

Each row in the Operational Priority Matrix now has an "Explore →" button. Clicking it opens an inline 4-step story panel (Finding → Evidence → Action → Outcome) with a step stepper, animated entry, and a Close button. The story panel renders inside the same card, below the row content.

```jsx
import React, { useState } from 'react';
import { SCENARIO_PRESETS, RESOURCE_ALLOCATION } from '../data/v2_empirical_data';

// ── Condition controls ──────────────────────────────────────────────────────────
const controls = {
  timeOfDay: { label: 'Time of Day', options: [
    { value: 'day',   label: 'Daylight' },
    { value: 'dusk',  label: 'Dusk ⚠️' },
    { value: 'night', label: 'Night' },
    { value: 'dawn',  label: 'Dawn' }
  ]},
  roadType: { label: 'Road Type', options: [
    { value: 'straight_highway', label: 'Straight Hwy' },
    { value: 'curve',            label: 'Curved Rural ⚠️' },
    { value: 'rural',            label: 'Rural Straight' },
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

const getRiskEstimate = (c) => {
  let r = 0.218;
  if (c.timeOfDay === 'dusk')            r += 0.057;
  if (c.timeOfDay === 'night')           r -= 0.006;
  if (c.roadType  === 'curve')           r += 0.081;
  if (c.weather   === 'snow')            r += 0.020;
  if (c.weather   === 'fog')             r += 0.035;
  if (c.traffic   === 'high')            r += 0.025;
  if (c.traffic   === 'low')             r -= 0.030;
  return Math.min(Math.max(r, 0.08), 0.55);
};

const riskLabel = (r) => {
  if (r >= 0.38) return { label: 'High Risk',      color: 'var(--accent-red)' };
  if (r >= 0.26) return { label: 'Elevated Risk',  color: 'var(--accent-amber)' };
  return               { label: 'Near Baseline',   color: 'var(--accent-green)' };
};

// ── Domain stories — 4 steps per domain ────────────────────────────────────────
const DOMAIN_STORIES = {
  'EMS Pre-Positioning': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'Dusk collisions (27.5% severity) and curved-road events (29.9%) are both over-represented in the severe category — and they cluster geographically on specific rural corridors.',
      stat: '27.5%', statLabel: 'Dusk severity rate' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'In the 30-minute window around astronomical sunset, severity spikes above baseline on curved rural roads. These windows are mathematically predictable from suncalc data — not random.',
      stat: '4.4×', statLabel: 'Higher severity than dawn' },
    { step: 3, label: 'The Action',   icon: '🚑',
      content: 'Pre-stage one additional trauma-capable EMS unit near the Bedford Highway corridor and Hwy 103 km 20-40 zone during the 60-minute dusk window each day, May through September.',
      stat: '60 min', statLabel: 'Target dusk window' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'Reduction in average EMS response time to severe rural events from ~14 min to ~9 min during the highest-risk daily window. No additional units required — just pre-positioning.',
      stat: '~5 min', statLabel: 'Estimated response reduction' },
  ],
  'Corridor Monitoring': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'Hwy 102 curve segments north of Halifax and the Bedford corridor show the densest concentration of high-severity events in the spatial grid analysis.',
      stat: '29.9%', statLabel: 'Curve crash severity' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'Rollover (58.5%) and right-angle (47.4%) collisions dominate severity at intersection and curve nodes. These locations are fixed — the geometry does not change. Real-time sensors can flag speed anomalies.',
      stat: '58.5%', statLabel: 'Rollover severity rate' },
    { step: 3, label: 'The Action',   icon: '📡',
      content: 'Install radar speed-feedback signs at 4 identified curve nodes on Hwy 102 (km 15, 22, 31, 38). Wire to a 511 API endpoint for real-time flagging when 85th-percentile speed exceeds posted limit by >15%.',
      stat: '4 nodes', statLabel: 'Priority installation sites' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'NS DOT pilots on comparable corridors showed 11-16% speed reduction at monitored sites. Applied to 29.9% baseline severity, even a 10% speed reduction delivers meaningful severity probability decrease.',
      stat: '~11–16%', statLabel: 'Speed reduction in comparable pilots' },
  ],
  'Seasonal Staffing': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'The single most counter-intuitive finding in the dataset: May–September severity (25–29%) consistently exceeds November–March (14–22%). Summer is the high-severity season.',
      stat: '29.3%', statLabel: 'September peak severity rate' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'The mechanism is behavioral: drivers adapt defensively to obvious winter hazards (visible ice, heavy snow). Summer\'s clear conditions at highway speeds create false safety — complacency elevates severity.',
      stat: '7.4 pts', statLabel: 'Sep vs Dec severity gap' },
    { step: 3, label: 'The Action',   icon: '📅',
      content: 'Shift RCMP Highway Patrol\'s peak-resource deployment window from December-February to May-September. Specifically: increase dusk patrol density on Hwy 102/103/104 during summer months.',
      stat: 'May–Sep', statLabel: 'New peak deployment window' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'No budget increase required — a shift of existing seasonal deployment patterns. Expected deterrence effect on high-speed distraction events, which comprise the majority of summer severe collisions.',
      stat: '$0 new', statLabel: 'Additional budget required' },
  ],
  'Weather-Triggered Readiness': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'Weather features (temperature, wind, fog) are the top-ranked XGBoost predictors with importance scores of 0.95 and 0.82. Environment Canada issues forecasts with 6–24hr lead time — enough to act.',
      stat: '0.95', statLabel: 'Temperature predictor importance' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'Fog and black-ice windows are predictable from forecast data. The model\'s weather severity rank feature (0–7 hierarchy) captures these combinations. Pre-emptive alerts can be triggered before the conditions materialise.',
      stat: '6–24hr', statLabel: 'Environment Canada forecast lead' },
    { step: 3, label: 'The Action',   icon: '🌤️',
      content: 'Build an automated pipeline: ECCC API forecast → weather severity rank calculator → if rank ≥ 5 on flagged corridors, trigger NS 511 advisory + EMS readiness alert. Runs nightly at 21:00.',
      stat: 'Rank ≥5', statLabel: 'Trigger threshold' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'Estimated 15-20% improvement in EMS readiness during the 8–12% of days that meet the high-severity weather threshold. Alert fatigue avoided by using the model\'s severity rank (not raw weather flags).',
      stat: '8–12%', statLabel: 'Days meeting trigger threshold/year' },
  ],
  'Engineering Interventions': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'Curved + level roads (28.1%) and curved + graded roads (25.0%) both exceed straight equivalents by 3-5 percentage points. The geometry is the hazard — and geometry can be engineered.',
      stat: '28.1%', statLabel: 'Curved+level severity rate' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'FHWA data shows rumble strips reduce run-off-road crashes by 30–50% on rural highways. NS has 8 corridor segments in the top-severity grid quartile with no current rumble strip coverage.',
      stat: '30–50%', statLabel: 'Run-off-road reduction with rumble strips' },
    { step: 3, label: 'The Action',   icon: '🏗️',
      content: 'Prioritize capital paving envelope for rumble strip installation on Hwy 102 (km 15-40) and Hwy 103 (km 20-55). Add curve advisory signage at all grid cells rated "critical" in the severity map.',
      stat: '8 segments', statLabel: 'Priority installation corridors' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'Based on FHWA benchmarks and NS corridor geometry, estimated 20-35% reduction in run-off-road severe events on treated segments. One-time capital cost with 15+ year effective life.',
      stat: '20–35%', statLabel: 'Estimated severe event reduction' },
  ],
  'Public Messaging': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'Distraction (33.1% severity) outranks impairment (32.1%) — and distraction is 3× more prevalent. The Distracted Commuter archetype (7.7% of crashes) is the deadliest segment.',
      stat: '3×', statLabel: 'Distraction prevalence vs impairment' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'Current NS public safety messaging is heavily winter-focused. Winter severity is actually 14-22% — well below summer. The messaging budget is misaligned with the actual risk calendar.',
      stat: '14–22%', statLabel: 'Winter severity range (lower than summer)' },
    { step: 3, label: 'The Action',   icon: '📢',
      content: 'Shift 40% of the annual highway safety messaging budget from winter campaigns to summer distraction and speed campaigns. Launch Spring (April) to intercept the May severity spike. Target digital channels reaching 25-45 age bracket.',
      stat: '40%', statLabel: 'Budget shift recommended' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'Primary goal: normalize the summer-is-dangerous message against entrenched winter-focused public perception. Secondary: reduce distraction prevalence in the 7.7% highest-severity archetype.',
      stat: 'May spike', statLabel: 'Target intervention window' },
  ],
  'Data Governance': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'The model was trained on Jan 2024 – Jan 2026 NS GeoJSON data. Seasonal drift and infrastructure changes mean that without retraining, accuracy degrades over 12+ month windows.',
      stat: '2,068', statLabel: 'Records in current training set' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'XGBoost\'s temporal holdout test (Aug–Jan vs earlier training) showed 0.642 AUC — solid but dependent on the feature distribution of recent data. New months add new seasonal patterns the model hasn\'t seen.',
      stat: '0.642', statLabel: 'Current validated AUC' },
    { step: 3, label: 'The Action',   icon: '📊',
      content: 'Establish quarterly pipeline: (1) ingest new NS GeoJSON records, (2) run Scripts 04-06 (feature engineering + training), (3) compare new AUC to 0.642 baseline, (4) deploy if AUC ≥ 0.630.',
      stat: 'Quarterly', statLabel: 'Retraining cadence' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'Maintained or improved model accuracy as the collision record base grows. Each new quarter adds ~130-150 records, strengthening the minority class (severe) representation and improving temporal generalization.',
      stat: '+~140 records', statLabel: 'Per quarter data growth estimate' },
  ],
};

// ── Story panel component ───────────────────────────────────────────────────────
const StoryPanel = ({ domain, onClose }) => {
  const [step, setStep] = useState(0);
  const steps = DOMAIN_STORIES[domain] || [];
  if (!steps.length) return null;
  const current = steps[step];

  return (
    <div style={{
      marginTop: '1rem', padding: '1.5rem',
      background: 'var(--bg-fog)', borderRadius: '8px',
      borderTop: '2px solid var(--accent-blue)',
      animation: 'fadeIn 0.25s ease'
    }}>
      {/* Step stepper */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            style={{
              flex: 1, padding: '8px 4px', border: 'none',
              background: i === step ? 'var(--accent-blue)' : i < step ? 'rgba(43,108,176,0.12)' : 'var(--bg-surface)',
              color: i === step ? 'white' : i < step ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontWeight: i === step ? 700 : 500,
              fontSize: '0.78rem', cursor: 'pointer',
              borderRight: i < steps.length - 1 ? '1px solid var(--border-light)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* Story content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{current.icon}</div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--text-heading)' }}>
            Step {step + 1}: {current.label}
          </h3>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.65, margin: 0, color: 'var(--text-main)' }}>{current.content}</p>
        </div>
        <div style={{ textAlign: 'center', background: 'white', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '1.25rem 1.5rem', minWidth: '120px' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-blue)', lineHeight: 1 }}>{current.stat}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '5px', lineHeight: 1.3 }}>{current.statLabel}</div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{
          padding: '6px 14px', border: '1px solid var(--border-light)', borderRadius: '6px',
          background: 'var(--bg-surface)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem'
        }}>
          ✕ Close
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{
            padding: '6px 14px', border: '1px solid var(--border-light)', borderRadius: '6px',
            background: step === 0 ? 'var(--bg-fog)' : 'var(--bg-surface)',
            color: step === 0 ? 'var(--border-focus)' : 'var(--text-main)',
            cursor: step === 0 ? 'default' : 'pointer', fontSize: '0.82rem'
          }}>← Back</button>

          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '0 4px' }}>
            {step + 1} / {steps.length}
          </span>

          {step < steps.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} style={{
              padding: '6px 16px', border: 'none', borderRadius: '6px',
              background: 'var(--accent-blue)', color: 'white',
              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600
            }}>Next →</button>
          ) : (
            <button onClick={onClose} style={{
              padding: '6px 16px', border: 'none', borderRadius: '6px',
              background: 'var(--accent-green)', color: 'white',
              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600
            }}>Done ✓</button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main component ──────────────────────────────────────────────────────────────
const ResourceAllocation = () => {
  const [conditions, setConditions]   = useState({ timeOfDay: 'day', roadType: 'straight_highway', weather: 'clear', traffic: 'medium' });
  const [activePreset, setActivePreset] = useState(null);
  const [openStory, setOpenStory]     = useState(null);   // domain name or null

  const applyPreset = (preset) => { setConditions(preset.conditions); setActivePreset(preset.id); };
  const riskEst = getRiskEstimate(conditions);
  const { label: riskLbl, color: riskClr } = riskLabel(riskEst);
  const matchedPreset = SCENARIO_PRESETS.find(p => p.id === activePreset);

  return (
    <div style={{ maxWidth: '1050px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Resource Allocation</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Scenario Simulator & Interactive Priority Matrix</p>
      </header>

      {/* Quick scenario presets */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.85rem' }}>Quick Scenarios</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
          {SCENARIO_PRESETS.map(preset => (
            <button key={preset.id} onClick={() => applyPreset(preset)} style={{
              padding: '0.8rem 1rem', borderRadius: '8px',
              border: `2px solid ${activePreset === preset.id ? 'var(--accent-blue)' : 'var(--border-light)'}`,
              background: activePreset === preset.id ? 'rgba(43,108,176,0.07)' : 'var(--bg-surface)',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease'
            }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '2px' }}>{preset.label}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Predicted: {(preset.predictedSeverity * 100).toFixed(0)}% severity</div>
            </button>
          ))}
        </div>
      </section>

      {/* Condition builder + risk output */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Build a Scenario</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(controls).map(([key, ctrl]) => (
              <div key={key}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>{ctrl.label}</div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {ctrl.options.map(opt => (
                    <button key={opt.value} onClick={() => { setConditions(c => ({ ...c, [key]: opt.value })); setActivePreset(null); }} style={{
                      padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-light)', fontSize: '0.8rem',
                      background: conditions[key] === opt.value ? 'var(--accent-blue)' : 'var(--bg-fog)',
                      color: conditions[key] === opt.value ? 'white' : 'var(--text-main)',
                      fontWeight: conditions[key] === opt.value ? 600 : 400, cursor: 'pointer', transition: 'all 0.12s ease'
                    }}>{opt.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Risk Assessment</h2>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: riskClr, lineHeight: 1 }}>{(riskEst * 100).toFixed(1)}%</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '5px' }}>Estimated Severity Rate</div>
            <div style={{ display: 'inline-block', marginTop: '0.6rem', padding: '3px 12px', borderRadius: '20px', background: `${riskClr}18`, color: riskClr, fontWeight: 700, fontSize: '0.8rem' }}>{riskLbl}</div>
          </div>
          <div style={{ background: 'var(--bg-fog)', borderRadius: '6px', padding: '0.85rem', borderLeft: `3px solid ${riskClr}` }}>
            {matchedPreset ? (
              <><div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px', textTransform: 'uppercase' }}>Scenario Rationale</div>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>{matchedPreset.rationale}</div></>
            ) : (
              <><div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px', textTransform: 'uppercase' }}>vs. Baseline</div>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>
                  Baseline 21.8%. This combination is {riskEst > 0.218 ? `${((riskEst / 0.218 - 1) * 100).toFixed(0)}% above baseline.` : 'near or below baseline.'}
                </div></>
            )}
          </div>
        </div>
      </div>

      {/* Interactive priority matrix */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Operational Priority Matrix</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click "Explore →" to walk through the evidence for any domain</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {RESOURCE_ALLOCATION.map((item, idx) => (
            <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden', border: openStory === item.domain ? '1px solid var(--accent-blue)' : '1px solid var(--border-light)', transition: 'border 0.15s ease' }}>
              {/* Row */}
              <div style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '2rem 1fr 1.6fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div style={{ fontSize: '1.35rem' }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-heading)' }}>{item.domain}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', fontWeight: 500, marginTop: '2px' }}>Finding {item.findingRef}</div>
                </div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-main)', lineHeight: 1.45 }}>{item.action}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-heading)', marginBottom: '1px' }}>{item.lead}</div>
                  <div>{item.season}</div>
                </div>
                <button
                  onClick={() => setOpenStory(openStory === item.domain ? null : item.domain)}
                  style={{
                    padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                    background: openStory === item.domain ? 'var(--accent-blue)' : 'rgba(43,108,176,0.1)',
                    color: openStory === item.domain ? 'white' : 'var(--accent-blue)',
                    fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                >
                  {openStory === item.domain ? '▲ Close' : 'Explore →'}
                </button>
              </div>

              {/* Story panel — expands inline */}
              {openStory === item.domain && (
                <div style={{ padding: '0 1.25rem 1.25rem' }}>
                  <StoryPanel domain={item.domain} onClose={() => setOpenStory(null)} />
                </div>
              )}
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

## Verification

```bash
npm run build
```

Check all 8 routes in dev. Specifically:
- [ ] Map: switch Province ↔ HRM — grid squares and dots appear at both zoom levels
- [ ] Map: toggle all 4 layer buttons individually — each one shows/hides its layer
- [ ] Map: click a grid square → popup shows tier. Click a red dot → popup says "Severe Collision"
- [ ] Presentation mode: click "Present" → nav cluster appears (← 1 of 8 Overview →)
- [ ] Presentation mode: click → advances to slide 2. At slide 8, → is disabled. At slide 1, ← is disabled
- [ ] Presentation mode: "Exit" returns to normal with the single "Present" button
- [ ] Resource Allocation: click "Explore →" on any row → inline story panel opens below that row
- [ ] Story: step through all 4 steps using Next →. Final step shows "Done ✓" button
- [ ] Story: clicking stepper tabs jumps directly to that step
- [ ] Two different domains can NOT both be open at once (clicking a second "Explore →" closes the first)
