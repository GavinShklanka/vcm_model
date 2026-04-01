import React from 'react';
import { Info } from 'lucide-react';
import { EMPIRICAL_DATA } from '../data/v2_empirical_data';

const CARD = {
  background: '#FFFFFF',
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  border: '1px solid #E2E8F0',
};

const riskColor = (severeStr) => {
  const val = parseFloat(severeStr);
  if (val >= 30) return '#D94848';
  if (val >= 22) return '#E8A838';
  return '#2EAF6C';
};

const InterventionProfiles = () => {
  const { archetypes } = EMPIRICAL_DATA;

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2.2rem', letterSpacing: '-0.03em' }}>
          Intervention Profiles
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          Six collision environments, each with distinct policy levers
        </p>
      </header>

      <div style={{ ...CARD, padding: '16px 20px', marginBottom: '2rem', display: 'flex', gap: '12px', borderLeft: '4px solid var(--accent-blue)' }}>
        <Info size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-heading)', fontSize: '0.9rem' }}>Structural Note</h4>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
            These intervention profiles are flag-driven communication heuristics, not statistically proven independent causal clusters. They translate algorithmic findings into human-centered priorities for public health and law enforcement.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '2.5rem' }}>
        {archetypes.map((arch, idx) => {
          const color = riskColor(arch.severe);
          return (
            <div key={idx} className="card-transition" style={{ ...CARD, position: 'relative', overflow: 'hidden', borderTop: `3px solid ${color}`, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>{arch.tag}</div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-heading)' }}>{arch.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: '#8899AB' }}>{arch.pct} of collisions</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color, lineHeight: 1, fontFamily: 'JetBrains Mono, monospace' }}>{arch.severe}</div>
                  <div style={{ fontSize: '0.7rem', color: '#8899AB' }}>Severe Rate</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6 }}>{arch.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Severe vs non-severe contrast */}
      <div style={{ ...CARD, padding: '24px 28px', borderTop: '3px solid var(--accent-blue)' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Severe vs. Non-Severe: What the Split Looks Like</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D94848', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
              Severe Cluster (21.8% · 450 cases)
            </div>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-main)', lineHeight: 2, fontSize: '0.9rem' }}>
              <li>Overrepresented at dusk and in September</li>
              <li>Single-vehicle curve + grade geometry</li>
              <li>Distraction or impairment flag present</li>
              <li>High-speed highway context (Hwy 102/104)</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2EAF6C', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
              Non-Severe Majority (78.2% · 1,618 cases)
            </div>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-main)', lineHeight: 2, fontSize: '0.9rem' }}>
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

export default InterventionProfiles;
