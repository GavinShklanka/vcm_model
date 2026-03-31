import React from 'react';
import { Sun, Mountain } from 'lucide-react';
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
