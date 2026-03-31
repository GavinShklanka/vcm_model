import React from 'react';
import { ShieldCheck, AlertTriangle, CloudRain, Car, FileWarning, RefreshCw } from 'lucide-react';

const limitations = [
  {
    icon: <Car />, color: 'var(--accent-amber)',
    title: "Missing Crash-Level Physics",
    body: "The model lacks NCDB variables: vehicle type (mass differential), precise impact angle, occupant age, and seatbelt utilization. These form the unobservable noise floor capping prediction accuracy at ~0.64 AUC."
  },
  {
    icon: <CloudRain />, color: 'var(--accent-amber)',
    title: "Microclimate Station Mismatch",
    body: "Weather is mapped from nearest Environment Canada stations. Nova Scotia's coastal geography creates localized fog banks and valley icing that station data misses — injecting spatial noise into our strongest predictors."
  },
  {
    icon: <AlertTriangle />, color: 'var(--accent-amber)',
    title: "Underreported Behavioral Flags",
    body: "Distraction and aggression are officer-reported flags, historically underreported by 30–50% nationally. Archetypes represent heuristic clusters, not absolute population truths."
  },
  {
    icon: <FileWarning />, color: 'var(--accent-amber)',
    title: "Reporting & Data Completeness",
    body: "This dataset covers police-reported collisions only. Unreported minor collisions and near-misses are excluded. The 21.8% severe rate reflects the reported subset, not the full population of all events."
  }
];

const Integrity = () => (
  <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>
    <header style={{ marginBottom: '3rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Methodological Integrity</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Structural Guardrails and Analytical Limitations</p>
    </header>

    {/* Causal Boundary */}
    <section style={{ marginBottom: '3.5rem' }}>
      <div style={{ background: 'rgba(43,108,176,0.06)', padding: '2rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <ShieldCheck size={22} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>The Causal Boundary</h2>
        </div>
        <p style={{ fontSize: '1rem', lineHeight: 1.75, margin: 0 }}>
          This framework models <strong>Severity Conditional on Collision</strong>. It does not predict crash occurrence. Therefore it cannot claim that removing a specific risk factor will mathematically eliminate a specific proportion of severe outcomes. It identifies environments where severity is structurally amplified so systems can prioritize mitigation.
        </p>
      </div>
    </section>

    {/* Limitations */}
    <section style={{ marginBottom: '3.5rem' }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Known Limitations</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {limitations.map((lim, idx) => (
          <div key={idx} className="card" style={{ padding: '1.75rem', borderTop: `4px solid ${lim.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(183,121,31,0.1)', padding: '0.6rem', borderRadius: '7px', color: lim.color }}>{lim.icon}</div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>{lim.title}</h3>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>{lim.body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Continuous Improvement */}
    <section className="card" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-teal)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <RefreshCw size={20} color="var(--accent-teal)" />
        <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-heading)' }}>Continuous Improvement Pathway</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-teal)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Near-Term (Q1–Q2)</h4>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 2, color: 'var(--text-main)' }}>
            <li>Ingest Q4 2025 + Q1 2026 collision records</li>
            <li>ECCC weather station bootstrap (temp + wind)</li>
            <li>Validate NSRN posted speeds against field data</li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-teal)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Medium-Term (Q3–Q4)</h4>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 2, color: 'var(--text-main)' }}>
            <li>NCDB vehicle type + occupant data linkage</li>
            <li>Route-held-out validation (Hwy 102 vs 103)</li>
            <li>Platt calibration for probability scoring</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
);

export default Integrity;
