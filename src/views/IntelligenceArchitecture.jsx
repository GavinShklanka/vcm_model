import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
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

const MODULE_ICONS = {
  'Collision Geometry': '◆',
  'Road / Speed':       '▬',
  'Behavior':           '⚠',
  'Time / Exposure':    '◷',
  'Environment':        '☁',
};

const IntelligenceArchitecture = () => {
  const { models, designHardening } = EMPIRICAL_DATA;

  const maxRF = Math.max(...models.rfImpurity.map(d => d.imp));

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>

      {/* ── Header ── */}
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2.2rem', letterSpacing: '-0.03em' }}>
          Intelligence Architecture
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          Final 8-Feature Architecture · Feature Provenance · Design Hardening
        </p>
      </header>

      {/* ── Feature Funnel ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-heading)' }}>
          Feature Reduction Pipeline
        </h2>
        <div style={{ ...CARD, padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0' }}>
            {models.featureFunnel.map((step, i) => (
              <React.Fragment key={i}>
                <div style={{ textAlign: 'center', flex: '0 0 auto', minWidth: '140px' }}>
                  <div style={{
                    fontSize: i === models.featureFunnel.length - 1 ? '3.2rem' : '2.8rem',
                    fontWeight: 800,
                    color: i === models.featureFunnel.length - 1 ? '#1A7FA0' : 'var(--text-heading)',
                    fontFamily: 'JetBrains Mono, monospace',
                    lineHeight: 1,
                    marginBottom: '6px',
                  }}>
                    {step.count}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: i === models.featureFunnel.length - 1 ? '#1A7FA0' : 'var(--text-heading)',
                    marginBottom: '4px',
                  }}>
                    {step.stage}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#8899AB' }}>
                    {step.label}
                  </div>
                </div>
                {i < models.featureFunnel.length - 1 && (
                  <div style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
                    <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, #CBD5E1, #1A7FA0)', borderRadius: '2px' }} />
                    <ArrowRight size={20} color="#1A7FA0" style={{ flexShrink: 0, margin: '0 4px' }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grouped Feature Modules ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-heading)' }}>
          Final 8-Feature Architecture
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {models.featureModules.map((mod, i) => (
            <div key={i} style={{ ...CARD, display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderLeft: `4px solid ${mod.color}` }}>
              <div style={{ width: '160px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem', color: mod.color }}>{MODULE_ICONS[mod.module] || '●'}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: mod.color }}>{mod.module}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {mod.features.map((f, j) => (
                  <span key={j} style={{
                    background: mod.color + '10',
                    border: `1px solid ${mod.color}30`,
                    color: mod.color,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dual Importance Charts ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-heading)' }}>
          Feature Importance — XGBoost vs RF
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* XGBoost Gain */}
          <div style={{ ...CARD }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1A7FA0', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
              XGBoost — Gain (Ranking)
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={models.xgboostGain} layout="vertical" margin={{ left: 10, right: 40, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" domain={[0, 1]} tickFormatter={v => (v * 100).toFixed(0)} tick={{ fontSize: 10, fill: '#8899AB' }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: '#1E3A5F', fontFamily: 'JetBrains Mono, monospace' }} />
                <Tooltip formatter={(v) => [(v * 100).toFixed(1), 'Gain %']} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.82rem' }} />
                <Bar dataKey="imp" radius={[0, 4, 4, 0]} fill="#1A7FA0">
                  <LabelList dataKey="imp" position="right" formatter={v => (v * 100).toFixed(0)} style={{ fontSize: 10, fontWeight: 600, fill: '#1E3A5F' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* RF Impurity */}
          <div style={{ ...CARD }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0E3B6B', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
              Random Forest — Impurity (Probability)
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={models.rfImpurity} layout="vertical" margin={{ left: 10, right: 40, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" domain={[0, maxRF]} tickFormatter={v => v.toFixed(0)} tick={{ fontSize: 10, fill: '#8899AB' }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: '#1E3A5F', fontFamily: 'JetBrains Mono, monospace' }} />
                <Tooltip formatter={(v) => [v.toFixed(1), 'Impurity']} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.82rem' }} />
                <Bar dataKey="imp" radius={[0, 4, 4, 0]} fill="#0E3B6B">
                  <LabelList dataKey="imp" position="right" formatter={v => v.toFixed(1)} style={{ fontSize: 10, fontWeight: 600, fill: '#1E3A5F' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ ...CARD, marginTop: '12px', padding: '14px 20px', background: '#F4F7FA', textAlign: 'center', borderLeft: '4px solid #1A7FA0' }}>
          <em style={{ fontSize: '0.88rem', color: '#5A6E85', lineHeight: 1.6 }}>
            <strong style={{ color: '#1E3A5F' }}>n_vehicles</strong> dominates XGBoost ranking. <strong style={{ color: '#1E3A5F' }}>hour_v2</strong> dominates RF probability scoring. This disagreement is why the ensemble outperforms both.
          </em>
        </div>
      </section>

      {/* ── Design Hardening ── */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <Layers size={20} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-heading)' }}>Design Hardening</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {designHardening.map((card, i) => (
            <div key={i} style={{ ...CARD, borderTop: `4px solid ${card.accent}` }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-heading)', margin: '0 0 12px 0' }}>
                {card.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {card.bullets.map((b, j) => (
                  <li key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    <span style={{ color: card.accent, flexShrink: 0, marginTop: '1px' }}>▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#8899AB', fontStyle: 'italic' }}>
          V1 reference: XGBoost 0.642 (random 80/20 split) — not comparable to temporal holdout
        </div>
      </section>
    </div>
  );
};

export default IntelligenceArchitecture;
