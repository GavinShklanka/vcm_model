// src/views/MapEvidence.jsx — Static geographic evidence summary
// Replaces broken Leaflet map (fragmented tiles) with clean data presentation.
// Preserves: route, sidebar link, data imports, page structure, all intelligence.

import React from 'react';
import { MAP_DATA, GRID_CELLS, COLLISION_POINTS } from '../data/v2_empirical_data';

// ── Tier colours ─────────────────────────────────────────────────────────────
const TIER_COLORS = {
  critical: { fill: '#C53030', label: 'Critical  ≥28%' },
  elevated: { fill: '#DD6B20', label: 'Elevated  24–28%' },
  watch:    { fill: '#D69E2E', label: 'Watch  20–24%' },
  baseline: { fill: '#38A169', label: 'Baseline  <20%' },
};

const MapEvidence = () => {
  const cells     = GRID_CELLS ?? [];
  const points    = COLLISION_POINTS ?? [];
  const corridors = MAP_DATA?.corridors ?? [];
  const hotspots  = MAP_DATA?.hotspots ?? [];

  const totalCells    = cells.length;
  const criticalCells = cells.filter(c => c[4] === 'critical').length;
  const elevatedCells = cells.filter(c => c[4] === 'elevated').length;
  const watchCells    = cells.filter(c => c[4] === 'watch').length;
  const baselineCells = cells.filter(c => c[4] === 'baseline').length;
  const severePoints  = points.filter(p => p[2]).length;

  return (
    <div style={{ maxWidth: '1100px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.35rem' }}>Geographic Evidence</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          Nova Scotia Highway Corridor Risk Mapping
          · {totalCells} severity zones
          · {points.length} collision points
        </p>
      </header>

      {/* Summary statistics */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem', marginBottom: '2rem'
      }}>
        {[
          { val: criticalCells, label: 'Critical Zones', color: '#C53030' },
          { val: elevatedCells, label: 'Elevated Zones', color: '#DD6B20' },
          { val: severePoints,  label: 'Severe Collisions', color: '#C53030' },
          { val: points.length - severePoints, label: 'Non-Severe Collisions', color: '#2B6CB0' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Severity zone distribution */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Severity Zone Distribution</h2>
        <div style={{ display: 'flex', gap: '0', borderRadius: '8px', overflow: 'hidden', height: '32px', marginBottom: '1rem' }}>
          {[
            { count: criticalCells, tier: 'critical' },
            { count: elevatedCells, tier: 'elevated' },
            { count: watchCells,    tier: 'watch' },
            { count: baselineCells, tier: 'baseline' },
          ].map(({ count, tier }) => (
            <div key={tier} style={{
              flex: count, background: TIER_COLORS[tier].fill,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '0.72rem', fontWeight: 700,
              minWidth: count > 0 ? '30px' : '0'
            }}>
              {count > 0 && count}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {Object.entries(TIER_COLORS).map(([key, { fill, label }]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '2px', background: fill, flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Highway corridors */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Highway Corridor Analysis</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {corridors.map(corridor => (
            <div key={corridor.id} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.85rem 1rem', background: 'var(--bg-fog)',
              borderRadius: '8px', borderLeft: `4px solid ${corridor.color}`
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-heading)' }}>{corridor.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                  {corridor.coords?.length || 0} coordinate points mapped
                </div>
              </div>
              <div style={{
                padding: '3px 10px', borderRadius: '20px',
                background: `${corridor.color}18`, color: corridor.color,
                fontWeight: 600, fontSize: '0.78rem'
              }}>
                Active Corridor
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Named hotspots */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Named Hotspot Intelligence</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {hotspots.map(spot => {
            const color = spot.severity === 'high' ? '#C53030'
                        : spot.severity === 'medium' ? '#DD6B20' : '#38A169';
            return (
              <div key={spot.id} style={{
                padding: '1rem 1.25rem', background: 'var(--bg-fog)',
                borderRadius: '8px', borderLeft: `4px solid ${color}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-heading)' }}>{spot.name}</div>
                  <div style={{
                    padding: '2px 10px', borderRadius: '20px',
                    background: `${color}18`, color: color,
                    fontWeight: 700, fontSize: '0.78rem', textTransform: 'capitalize'
                  }}>
                    {spot.severity}
                  </div>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: color, marginBottom: '4px' }}>{spot.severeRate}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{spot.note}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapEvidence;
