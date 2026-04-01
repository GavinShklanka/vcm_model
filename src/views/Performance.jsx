import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer, LabelList
} from 'recharts';
import { EMPIRICAL_DATA } from '../data/v2_empirical_data';

const CARD = {
  background: '#FFFFFF',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  border: '1px solid #E2E8F0',
};

const TABS = ['Discrimination', 'Calibration', 'Deployment Role'];

const CalibrationIndicator = ({ slope, label, color, note }) => (
  <div style={{ ...CARD, borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8899AB', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
          Calibration Slope
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
          {slope}
        </div>
      </div>
      <div style={{ background: color + '18', padding: '6px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, color }}>
        {label}
      </div>
    </div>
    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{note}</div>
  </div>
);

const Performance = () => {
  const { models } = EMPIRICAL_DATA;
  const [activeTab, setActiveTab] = useState(0);

  // Normalize RF impurity to 0-1 for side-by-side display
  const maxRF = Math.max(...models.rfImpurity.map(d => d.imp));
  const rfNorm = models.rfImpurity.map(d => ({ ...d, norm: d.imp / maxRF }));

  // Merge XGBoost + RF by feature name for dual chart
  const dualData = models.xgboostGain.map(xg => {
    const rf = rfNorm.find(r => r.name === xg.name) || { norm: 0 };
    return { name: xg.name, xgb: xg.imp, rf: rf.norm };
  });

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>

      {/* ── Header ── */}
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2.2rem', letterSpacing: '-0.03em' }}>
          Scoring Architecture
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          How the Severity Score Is Built · N=2,068 · Temporal Holdout · Train 1,543 / Test 525
        </p>
      </header>

      {/* ── Narrative ── */}
      <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: 1.8, maxWidth: '800px', marginBottom: '2.5rem' }}>
        {models.narrative}
      </p>

      {/* ── AUC Chart ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-heading)' }}>
          AUC-ROC by Model — V2 Results
        </h2>
        <div style={{ ...CARD }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={models.comparison} layout="vertical" margin={{ left: 20, right: 60, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" domain={[0.5, 0.7]} tickFormatter={v => v.toFixed(2)} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#1E3A5F', fontWeight: 500 }} width={135} />
              <Tooltip formatter={(v) => [v.toFixed(4), 'AUC']} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.875rem' }} />
              <Bar dataKey="auc" radius={[0, 6, 6, 0]}>
                <LabelList dataKey="auc" position="right" formatter={v => v.toFixed(4)} style={{ fontSize: 12, fontWeight: 700, fill: '#1E3A5F', fontFamily: 'JetBrains Mono, monospace' }} />
                {models.comparison.map((entry, idx) => (
                  <Cell key={idx} fill={entry.isEnsemble ? '#1A7FA0' : '#8899AB'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#8899AB', textAlign: 'center' }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: '#1A7FA0', marginRight: 6, verticalAlign: 'middle' }} />
            Ensemble (final system)
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: '#8899AB', marginLeft: 16, marginRight: 6, verticalAlign: 'middle' }} />
            Component models
          </div>
        </div>
      </section>

      {/* ── 3-Card Architecture Strip ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-heading)' }}>
          Model Architecture Roles
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {models.architectureCards.map((card, i) => (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: card.isPrimary ? `0 4px 20px rgba(52,184,217,0.18), 0 2px 8px rgba(0,0,0,0.06)` : '0 2px 12px rgba(0,0,0,0.06)',
                border: card.isPrimary ? `2px solid ${card.accent}` : '1px solid #E2E8F0',
                borderTop: `4px solid ${card.accent}`,
                position: 'relative',
              }}
            >
              {card.isPrimary && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: card.accent, color: '#fff', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.8px', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>
                  PRIMARY
                </div>
              )}
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8899AB', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                {card.role}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                {card.name}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: card.accent, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1, marginBottom: '14px' }}>
                {card.auc.toFixed(4)}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {card.bullets.map((b, j) => (
                  <li key={j} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                    <span style={{ color: card.accent, flexShrink: 0 }}>·</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why the Ensemble Works ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-heading)' }}>
          Why the Ensemble Works
        </h2>
        <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '20px 24px', borderRight: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0E3B6B', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '12px' }}>
                Where RF Helps More
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {models.ensembleDisagreement.rfDominates.map((f, i) => (
                  <div key={i} style={{ background: 'rgba(14,59,107,0.06)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#0E3B6B', fontFamily: 'JetBrains Mono, monospace' }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1A7FA0', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '12px' }}>
                Where XGBoost Helps More
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {models.ensembleDisagreement.xgboostDominates.map((f, i) => (
                  <div key={i} style={{ background: 'rgba(26,127,160,0.07)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#1A7FA0', fontFamily: 'JetBrains Mono, monospace' }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ padding: '14px 24px', background: '#F4F7FA', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
            <em style={{ fontSize: '0.88rem', color: '#5A6E85' }}>{models.ensembleDisagreement.tagline}</em>
          </div>
        </div>
      </section>

      {/* ── Calibration / Discrimination / Deployment Tabs ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-heading)' }}>
          Model Evaluation
        </h2>

        {/* Tab strip */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#F4F7FA', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '8px 18px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontSize: '0.85rem', fontWeight: activeTab === i ? 700 : 500,
                color: activeTab === i ? '#1E3A5F' : '#64748B',
                background: activeTab === i ? '#FFFFFF' : 'transparent',
                boxShadow: activeTab === i ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 0 — Discrimination (AUC already shown above, recap here) */}
        {activeTab === 0 && (
          <div style={{ ...CARD }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {models.comparison.map((model, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: model.isEnsemble ? 'rgba(26,127,160,0.05)' : '#F9FAFB', borderRadius: '8px', border: model.isEnsemble ? '1px solid rgba(26,127,160,0.2)' : '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: model.isEnsemble ? '#1A7FA0' : 'var(--text-heading)', fontSize: '0.95rem' }}>{model.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#8899AB', marginTop: '2px' }}>{model.desc}</div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', fontWeight: 700, color: model.isEnsemble ? '#1A7FA0' : 'var(--text-heading)' }}>
                    {model.auc.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1 — Calibration */}
        {activeTab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <CalibrationIndicator slope="0.815" label="Well-calibrated" color="#2EAF6C" note="RF produces reliable probability estimates. A slope near 1.0 means predicted probabilities match observed rates." />
              <CalibrationIndicator slope="3.101" label="Overconfident" color="#E8A838" note="XGBoost overestimates probability magnitudes. Use for ranking, not direct probability interpretation." />
            </div>
            <div style={{ ...CARD, background: '#F4F7FA', borderLeft: '4px solid var(--accent-blue)' }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                <strong style={{ color: 'var(--text-heading)' }}>Interpretation:</strong> RF's well-calibrated slope (0.815) makes it suitable when probability thresholds matter (e.g., dispatch decisions). XGBoost's high slope (3.101) makes it ideal for ranking cases by relative severity. The ensemble combines both signals. <em>Platt scaling is available as a next-step calibration improvement.</em>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 — Deployment Role */}
        {activeTab === 2 && (
          <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F4F7FA', borderBottom: '1px solid #E2E8F0' }}>
                  {['Scenario', 'Use This Model', 'Why'].map((h, i) => (
                    <th key={i} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#8899AB', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {models.deploymentRoles.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < models.deploymentRoles.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                    <td style={{ padding: '14px 20px', fontSize: '0.9rem', color: 'var(--text-main)' }}>{row.scenario}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ background: row.model === 'Ensemble' ? 'rgba(26,127,160,0.1)' : row.model === 'RF' ? 'rgba(14,59,107,0.08)' : 'rgba(232,168,56,0.1)', color: row.model === 'Ensemble' ? '#1A7FA0' : row.model === 'RF' ? '#0E3B6B' : '#B8860B', padding: '3px 10px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700 }}>{row.model}</span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.88rem', color: '#5A6E85' }}>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Defensible Reality ── */}
      <section style={{ ...CARD, padding: '24px 28px', background: '#F4F7FA', borderLeft: '4px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <ShieldCheck size={20} color="var(--accent-blue)" />
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Why 0.6576 Matters in Real Deployment</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.75, margin: 0 }}>
            V2 uses a harder test: temporal holdout (train Jan 2024 – Jul 2025, test Aug 2025 – Jan 2026). Random splits inflate AUC with time-correlated data leakage. Our 0.6576 is conservatively earned.
          </p>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.75, margin: 0 }}>
            Algorithms exceeding 0.75 AUC in this domain frequently suffer from data leakage. An empirical 0.6576 ensemble demonstrates that environmental and behavioral contexts <em>do</em> shift probability distributions — without ECCC weather, which was 100% absent in V2.
          </p>
        </div>
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#8899AB', fontStyle: 'italic' }}>
          V1 reference: XGBoost 0.642 (random 80/20 split — not comparable to temporal holdout)
        </div>
      </section>
    </div>
  );
};

export default Performance;
