// src/views/MapEvidence.jsx — COMPLETE REPLACEMENT
// Fixes: (1) Leaflet invalidateSize tile fragmentation, (2) safe MAP_DATA access,
// (3) CSS animation removed from map wrapper, (4) MapResizer component added.

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Rectangle, Popup, useMap } from 'react-leaflet';
import { MAP_DATA, GRID_CELLS, COLLISION_POINTS } from '../data/v2_empirical_data';

// ── Safe fallbacks (in case MAP_DATA keys are undefined) ─────────────────────
const HRM_CENTER   = MAP_DATA?.hrmCenter   ?? [44.685, -63.605];
const HRM_ZOOM     = MAP_DATA?.hrmZoom     ?? 11;
const PROV_CENTER  = MAP_DATA?.center      ?? [45.0,   -63.3];
const PROV_ZOOM    = MAP_DATA?.defaultZoom ?? 7;

// ── Tier colours ─────────────────────────────────────────────────────────────
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

// ── THE CRITICAL FIX: invalidateSize after mount ──────────────────────────────
// Leaflet calculates tile positions synchronously at mount. If the parent
// container has a CSS animation (fadeIn) OR is inside a flex/grid layout
// that hasn't fully settled, Leaflet reads the wrong dimensions and renders
// tile panels in 3 disconnected slabs. invalidateSize() forces a recalculation.
function MapResizer() {
  const map = useRef(useMap());
  useEffect(() => {
    // 50 ms: after React paint
    // 700 ms: after any parent CSS animation (fadeIn is typically 0.5s)
    const t1 = setTimeout(() => map.current.invalidateSize(), 50);
    const t2 = setTimeout(() => map.current.invalidateSize(), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return null;
}

// ── View switcher ─────────────────────────────────────────────────────────────
function ViewSetter({ view }) {
  const map = useMap();
  useEffect(() => {
    if (view === 'hrm') map.setView(HRM_CENTER, HRM_ZOOM);
    else map.setView(PROV_CENTER, PROV_ZOOM);
  }, [view, map]);
  return null;
}

// ── Main component ────────────────────────────────────────────────────────────
const MapEvidence = () => {
  const [activeView, setActiveView]     = useState('hrm');
  const [activeLayers, setActiveLayers] = useState(['grid', 'points', 'corridors', 'hotspots']);

  const toggleLayer = (id) =>
    setActiveLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);

  const cells          = GRID_CELLS   ?? [];
  const points         = COLLISION_POINTS ?? [];
  const corridors      = MAP_DATA?.corridors ?? [];
  const hotspots       = MAP_DATA?.hotspots  ?? [];

  const totalCells    = cells.length;
  const criticalCells = cells.filter(c => c[4] === 'critical').length;
  const elevatedCells = cells.filter(c => c[4] === 'elevated').length;
  const severePoints  = points.filter(p => p[2]).length;

  return (
    // NOTE: No animation on this outer div. Animation was the root cause of
    // Leaflet's tile fragmentation. Apply fade-in on a sibling element if needed.
    <div style={{ maxWidth: '1100px' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.35rem' }}>Geographic Evidence</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          Nova Scotia Highway Corridor Risk Mapping
          · {totalCells} severity zones
          · {points.length} collision points
        </p>
      </header>

      {/* Controls row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.75rem'
      }}>
        {/* View toggle */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { val: 'hrm',      label: 'HRM Zoom' },
            { val: 'province', label: 'Province View' },
          ].map(({ val, label }) => (
            <button key={val} onClick={() => setActiveView(val)} style={{
              padding: '5px 14px', borderRadius: '6px',
              border: '1px solid var(--border-light)',
              background: activeView === val ? 'var(--accent-blue)' : 'var(--bg-surface)',
              color:      activeView === val ? 'white' : 'var(--text-main)',
              fontWeight: activeView === val ? 600 : 400,
              cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.15s ease'
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Layer toggles */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {LAYERS.map(layer => {
            const on = activeLayers.includes(layer.id);
            return (
              <button key={layer.id} onClick={() => toggleLayer(layer.id)} style={{
                padding: '5px 12px', borderRadius: '6px',
                border: `1px solid ${on ? 'var(--accent-blue)' : 'var(--border-light)'}`,
                background: on ? 'rgba(43,108,176,0.10)' : 'var(--bg-surface)',
                color:      on ? 'var(--accent-blue)' : 'var(--text-muted)',
                fontWeight: on ? 600 : 400,
                cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.12s ease'
              }}>
                {layer.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map container — explicit pixel height, no overflow:hidden on direct parent */}
      <div style={{
        height: '520px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-subtle)',
        position: 'relative',   // required for Leaflet z-index stacking
      }}>
        <MapContainer
          center={HRM_CENTER}
          zoom={HRM_ZOOM}
          style={{ height: '520px', width: '100%' }}   // explicit px height, NOT 100%
          scrollWheelZoom={true}
        >
          {/* THE FIX — must be first child inside MapContainer */}
          <MapResizer />

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            maxZoom={19}
          />

          <ViewSetter view={activeView} />

          {/* Severity grid cells */}
          {activeLayers.includes('grid') && cells.map((cell, idx) => {
            const [swLat, swLng, neLat, neLng, tier] = cell;
            const { fill, stroke } = TIER_COLORS[tier] ?? TIER_COLORS.baseline;
            return (
              <Rectangle
                key={`cell-${idx}`}
                bounds={[[swLat, swLng], [neLat, neLng]]}
                pathOptions={{
                  color: stroke, weight: 0.8,
                  fillColor: fill, fillOpacity: 0.45
                }}
              >
                <Popup>
                  <strong style={{ textTransform: 'capitalize' }}>{tier} zone</strong>
                  <br />
                  {TIER_COLORS[tier]?.label}
                </Popup>
              </Rectangle>
            );
          })}

          {/* Individual collision dots */}
          {activeLayers.includes('points') && points.map((pt, idx) => (
            <CircleMarker
              key={`pt-${idx}`}
              center={[pt[0], pt[1]]}
              radius={pt[2] ? 5 : 3.5}
              pathOptions={{
                fillColor:   pt[2] ? '#C53030' : '#2B6CB0',
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
          {activeLayers.includes('corridors') && corridors.map(corridor => (
            <Polyline
              key={corridor.id}
              positions={corridor.coords}
              pathOptions={{ color: corridor.color, weight: 3, opacity: 0.65 }}
            >
              <Popup><strong>{corridor.name}</strong></Popup>
            </Polyline>
          ))}

          {/* Named hotspot markers */}
          {activeLayers.includes('hotspots') && hotspots.map(spot => (
            <CircleMarker
              key={spot.id}
              center={[spot.lat, spot.lng]}
              radius={spot.severity === 'high' ? 13 : 10}
              pathOptions={{
                fillColor:   spot.severity === 'high' ? '#C53030'
                           : spot.severity === 'medium' ? '#DD6B20' : '#38A169',
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

      {/* Legend + live stats */}
      <div style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '1rem',
        alignItems: 'stretch'
      }}>
        {/* Tier legend */}
        <div className="card" style={{
          padding: '1rem 1.25rem',
          display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center'
        }}>
          <div style={{
            fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0
          }}>
            Hotspot Tiers
          </div>
          {Object.entries(TIER_COLORS).map(([key, { fill, label }]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '2px', background: fill, flexShrink: 0 }} />
              {label}
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem', marginLeft: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C53030' }} />
            Severe
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2B6CB0' }} />
            Non-Severe
          </div>
        </div>

        {/* Live stats */}
        <div className="card" style={{
          padding: '1rem 1.25rem',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem', textAlign: 'center', minWidth: '340px'
        }}>
          {[
            { val: criticalCells,          label: 'Critical Zones',  color: '#C53030' },
            { val: elevatedCells,          label: 'Elevated Zones',  color: '#DD6B20' },
            { val: severePoints,           label: 'Severe Points',   color: '#C53030' },
            { val: points.length - severePoints, label: 'PDO Points', color: '#2B6CB0' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>
                {s.val}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapEvidence;
