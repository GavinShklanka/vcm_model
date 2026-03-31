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
