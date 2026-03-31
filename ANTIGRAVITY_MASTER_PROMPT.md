# VCM Presentation — Antigravity Master Handoff
**React/Vite app · GitHub Pages · gavinshklanka.github.io/vcm_model/**

This document is a complete, self-contained handoff for fixing the Geographic Evidence map page. Read the diagnosis section first, then apply changes exactly as specified.

---

## AUDIT: What Is Working vs What Is Broken

### ✅ Working
- App builds and deploys to GitHub Pages
- 8-route sidebar navigation
- Presentation mode nav cluster (← N of 8 →) is implemented in App.jsx
- ResourceAllocation.jsx has interactive domain story panels
- MapEvidence.jsx page loads — header, controls, legend, stats bar all render

### ❌ Broken — Two root causes

**Problem A: Map tiles render in 3 disconnected panels (the primary visual bug)**

Root cause: Leaflet measures its container dimensions synchronously at mount to calculate tile positions. The parent `<div>` in MapEvidence.jsx had `animation: 'fadeIn 0.5s ease'` applied to it. While CSS animations run, the element's computed dimensions are transitioning — Leaflet reads an intermediate/wrong width and places tile panels in misaligned slots. The result is 3 separated tile panes with gaps between them.

Secondary cause: The `<MapContainer>` was using `style={{ height: '100%' }}` inside a parent with `height: 520px`. In some flex/grid contexts this collapses to 0px or calculates incorrectly. Leaflet's SVG layer (where Rectangles and CircleMarkers render) misaligns with the tile layer.

Fix: (1) Remove `animation` from the map wrapper div. (2) Give `MapContainer` an explicit pixel height instead of `100%`. (3) Add a `MapResizer` component inside `MapContainer` that calls `map.invalidateSize()` at 50ms and 700ms after mount.

**Problem B: MAP_DATA, GRID_CELLS, COLLISION_POINTS, SCENARIO_PRESETS, RESOURCE_ALLOCATION are all missing from v2_empirical_data.js**

The file `src/data/v2_empirical_data.js` currently exports only `EMPIRICAL_DATA` (103 lines). MapEvidence.jsx imports `MAP_DATA`, `GRID_CELLS`, and `COLLISION_POINTS` from that file — all three resolve to `undefined`. ResourceAllocation.jsx imports `SCENARIO_PRESETS` and `RESOURCE_ALLOCATION` — also undefined. This causes: Leaflet map initialized with `center={undefined}` and `zoom={undefined}` (silent canvas failure), and zero data on the map canvas even if tiles render correctly.

---

## CHANGE 1 OF 2 — src/data/v2_empirical_data.js

**Action: APPEND the entire contents of `v2_empirical_data_APPEND.js` to the bottom of this file. Do not modify any existing code.**

The append file adds these five exports:
- `MAP_DATA` — corridor polylines, named hotspots, and view presets (hrmCenter, hrmZoom, center, defaultZoom)
- `GRID_CELLS` — 80 severity zone rectangles across NS corridors, each `[swLat, swLng, neLat, neLng, tier]`
- `COLLISION_POINTS` — 126 individual collision events, each `[lat, lng, severe(bool)]`
- `SCENARIO_PRESETS` — 4 condition quick-selects for the ResourceAllocation risk calculator
- `RESOURCE_ALLOCATION` — 7 operational domain matrix rows

The file is in the repo root as `v2_empirical_data_APPEND.js`. Copy everything from it and paste it at the end of `src/data/v2_empirical_data.js`.

---

## CHANGE 2 OF 2 — src/views/MapEvidence.jsx

**Action: REPLACE ENTIRELY with the contents of `MapEvidence_FIXED.jsx`.**

The fixed file is in the repo root as `MapEvidence_FIXED.jsx`. Its contents replace `src/views/MapEvidence.jsx` completely.

Key changes from the broken version:

```
BROKEN:  <div style={{ maxWidth: '1100px', animation: 'fadeIn 0.5s ease' }}>
FIXED:   <div style={{ maxWidth: '1100px' }}>
         (animation removed — this was causing Leaflet tile fragmentation)

BROKEN:  <MapContainer center={MAP_DATA.hrmCenter} zoom={MAP_DATA.hrmZoom}
                       style={{ height: '100%', width: '100%' }}>
FIXED:   const HRM_CENTER = MAP_DATA?.hrmCenter ?? [44.685, -63.605];
         const HRM_ZOOM   = MAP_DATA?.hrmZoom   ?? 11;
         <MapContainer center={HRM_CENTER} zoom={HRM_ZOOM}
                       style={{ height: '520px', width: '100%' }}>
         (safe fallbacks + explicit pixel height)

ADDED:   function MapResizer() — calls map.invalidateSize() at 50ms and 700ms after mount
         <MapResizer /> as first child inside MapContainer
```

---

## CHANGE 3 (OPTIONAL) — ResourceAllocation.jsx preset integration

If you want the scenario presets to appear as quick-select buttons in the risk calculator:

In `src/views/ResourceAllocation.jsx`, find the condition controls section near the top of the return statement. Add this block immediately above the condition dropdowns:

```jsx
{/* Scenario quick-selects */}
<div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center', fontWeight: 600 }}>
    PRESETS:
  </span>
  {(SCENARIO_PRESETS ?? []).map((preset, i) => (
    <button
      key={i}
      onClick={() => setConditions(preset.conditions)}
      style={{
        padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem',
        border: '1px solid var(--border-light)', cursor: 'pointer',
        background: 'var(--bg-surface)', color: 'var(--text-main)',
        transition: 'all 0.12s ease'
      }}
    >
      {preset.label}
    </button>
  ))}
</div>
```

This requires `conditions` state to be named `conditions` and `setConditions` to be its setter — check the existing component's useState call and adjust names if different.

---

## BUILD AND DEPLOY

After applying both changes:

```bash
# From the repo root (vcm_github_repo/)
npm run build
```

If build succeeds with no errors, push to GitHub:

```bash
git add src/data/v2_empirical_data.js src/views/MapEvidence.jsx
git commit -m "Fix map tile fragmentation and add missing data exports"
git push
```

GitHub Actions will deploy to gavinshklanka.github.io/vcm_model/ automatically.

---

## EXPECTED RESULT AFTER FIX

The map page should show:
- One continuous, seamless tile layer (no fragmentation)
- 80 colored rectangles layered over HRM corridors (red=critical, orange=elevated, yellow=watch, green=baseline)
- 126 dot markers (red filled circles for severe, blue for non-severe)
- 6 highway polylines (Hwy 102, 101, 103, 104, 111, 118)
- 6 named hotspot circles with popup detail
- Stats bar: 10 Critical Zones / 25 Elevated Zones / 43 Severe Points / 83 PDO Points
- Province View and HRM Zoom toggles both work
- All 4 layer toggles hide/show correctly

---

## FILE INVENTORY

| File (repo root) | Action | Target |
|---|---|---|
| `v2_empirical_data_APPEND.js` | Append contents to → | `src/data/v2_empirical_data.js` |
| `MapEvidence_FIXED.jsx` | Replace → | `src/views/MapEvidence.jsx` |

Do not touch: App.jsx, ResourceAllocation.jsx, Sidebar.jsx, any other views, vite.config.js, index.html.

---

## PROJECT CONTEXT (for LLM orientation)

This is a React/Vite single-page app deployed to GitHub Pages. It presents a Nova Scotia vehicle collision severity model (XGBoost, AUC 0.642, 2,068 records) as an 8-slide interactive presentation.

**Tech stack:** React 18, react-router-dom v7, react-leaflet + leaflet, recharts, lucide-react, Vite, GitHub Pages (base: `/vcm_model/`).

**Data model:** All presentation data lives in `src/data/v2_empirical_data.js`. The app imports named exports from this file into each view component.

**Route structure:**
```
/                    → Overview
/performance         → Model Performance
/risk-zones          → Risk Zones
/map                 → Geographic Evidence   ← the broken page
/archetypes          → Behavioral Profiles
/resource-allocation → Resource Allocation
/policy              → Policy Signals
/integrity           → Integrity + Limits
```

**Leaflet note:** react-leaflet requires the Leaflet default icon fix for Vite bundlers. If map markers show as broken images, add this to main.jsx:
```js
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl:       new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl:     new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});
```
(CircleMarker does not require this fix — only default pin Markers do.)
