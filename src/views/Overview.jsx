import React from 'react';
import { ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { EMPIRICAL_DATA } from '../data/v2_empirical_data';

const CARD = {
  background: '#FFFFFF',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  border: '1px solid #E2E8F0',
};

const PILL = {
  display: 'inline-block',
  background: '#F4F7FA',
  borderRadius: '20px',
  padding: '4px 12px',
  fontSize: '12px',
  fontWeight: 500,
  color: '#5A6E85',
  border: '1px solid #E2E8F0',
};

const KPI_CARDS = (meta) => [
  { label: 'Total Collisions',   value: meta.records.toLocaleString(), sub: meta.dateRange },
  { label: 'Severe Collisions',  value: meta.severeCount.toLocaleString(), sub: 'Fatality / major injury' },
  { label: 'Severe Rate',        value: meta.severeRate, sub: 'Baseline class imbalance' },
  { label: 'Final Features',     value: meta.features, sub: `From ${meta.rawFeatures} raw columns` },
  { label: 'Ensemble AUC',       value: meta.auc.toFixed(4), sub: 'Temporal holdout test set', isHero: true },
  { label: 'Train / Test Split',  value: `${meta.trainRecords} / ${meta.testRecords}`, sub: 'Temporal holdout' },
];

const PROVENANCE_TAGS = [
  'NS police-reported collisions',
  'NS GeoJSON',
  'NSRN inferred speed class',
  'Self-reported weather condition',
  'AADT hourly estimate',
  'Behavioral flags',
];

const DOES_DO = [
  'Score severity likelihood of reported collisions',
  'Enable data-driven triage and prioritization',
  'Support corridor monitoring and seasonal planning',
];
const DOES_NOT = [
  'Predict where collisions will occur',
  'Predict whether a collision will happen',
  'Assign causality or blame',
];

const Overview = () => {
  const { meta, question } = EMPIRICAL_DATA;
  const kpis = KPI_CARDS(meta);

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>

      {/* ── Header ── */}
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-block', fontSize: '0.8rem', fontWeight: 700, color: '#1A7FA0', background: 'rgba(26,127,160,0.08)', padding: '4px 12px', borderRadius: '20px', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
          Executive Briefing
        </div>
        <h1 style={{ marginBottom: '0.75rem', fontSize: '2.4rem', letterSpacing: '-0.03em', color: 'var(--text-heading)' }}>
          {question.headline}
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '780px', lineHeight: 1.65, marginBottom: '1.25rem' }}>
          {question.statement}
        </p>

        {/* Model identity card */}
        <div style={{ ...CARD, display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '18px 24px', borderLeft: '4px solid #1A7FA0' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8899AB', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '4px' }}>
              Final Scoring System
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1A7FA0', letterSpacing: '-0.02em' }}>
              RF + XGBoost Ensemble
            </div>
            <div style={{ fontSize: '0.85rem', color: '#5A6E85', marginTop: '4px' }}>
              {meta.modelSubtitle}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1A7FA0', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
              {meta.auc.toFixed(4)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8899AB', marginTop: '4px' }}>Ensemble AUC</div>
          </div>
        </div>
      </header>

      {/* ── KPI Cards ── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '2rem' }}>
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="card-transition"
            style={{
              ...CARD,
              ...(kpi.isHero ? { borderBottom: '3px solid #1A7FA0' } : {}),
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#8899AB', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: kpi.value.toString().length > 6 ? '22px' : '28px', fontWeight: 700, color: kpi.isHero ? '#1A7FA0' : 'var(--text-heading)', lineHeight: 1, marginBottom: '6px', fontFamily: 'JetBrains Mono, monospace' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '12px', color: '#8899AB' }}>{kpi.sub}</div>
          </div>
        ))}
      </section>

      {/* ── Data Provenance Strip ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#8899AB', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Data Sources
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          {PROVENANCE_TAGS.map((tag, i) => (
            <span key={i} style={PILL}>{tag}</span>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: '#8899AB', fontStyle: 'italic' }}>
          ⚠ ECCC station weather pending in this version
        </div>
      </section>

      {/* ── Does / Does Not card ── */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

            {/* Does */}
            <div style={{ padding: '24px 28px', borderRight: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <CheckCircle size={18} color="#2EAF6C" />
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2EAF6C', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  V2 Does
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {DOES_DO.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    <span style={{ color: '#2EAF6C', flexShrink: 0, marginTop: '2px' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Does Not */}
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <XCircle size={18} color="#D94848" />
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D94848', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  V2 Does Not
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {DOES_NOT.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    <span style={{ color: '#D94848', flexShrink: 0, marginTop: '2px' }}>✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom answer strip */}
          <div style={{ background: '#1E3A5F', padding: '14px 28px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
              V2 answers: <strong style={{ color: '#34B8D9' }}>How severe is this collision likely to be?</strong> — after it has been reported.
            </span>
          </div>
        </div>
      </section>

      {/* ── Scope & Methodology ── */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <ShieldCheck size={22} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-heading)' }}>Scope &amp; Methodology</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {question.insights.map((insight, idx) => (
            <div key={idx} style={{ ...CARD, display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 180px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  {insight.label}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-heading)', margin: '0 0 6px 0' }}>{insight.text}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.65, fontSize: '0.92rem' }}>{insight.expand}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Overview;
