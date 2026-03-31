import React from 'react';
import { Info } from 'lucide-react';
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
