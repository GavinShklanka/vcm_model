import React from 'react';
import { ShieldCheck, AlertTriangle, CloudRain, Car, FileWarning, RefreshCw, Rocket } from 'lucide-react';
import { EMPIRICAL_DATA } from '../data/v2_empirical_data';

const CARD = {
  background: '#FFFFFF',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  border: '1px solid #E2E8F0',
};

const limitations = [
  {
    icon: <Car />, color: '#E8A838',
    title: "Missing Crash-Level Physics",
    body: "The model lacks NCDB variables: vehicle type (mass differential), precise impact angle, occupant age, and seatbelt utilization. These form the unobservable noise floor."
  },
  {
    icon: <CloudRain />, color: '#E8A838',
    title: "ECCC Weather Unavailable",
    body: "ECCC station weather was 100% unavailable in V2. Self-reported weather conditions and surface severity rank are included as partial proxies."
  },
  {
    icon: <AlertTriangle />, color: '#E8A838',
    title: "Underreported Behavioral Flags",
    body: "Distraction and aggression are officer-reported flags, historically underreported by 30–50% nationally. Intervention profiles represent heuristic partitions."
  },
  {
    icon: <FileWarning />, color: '#E8A838',
    title: "Reporting & Data Completeness",
    body: "This dataset covers police-reported collisions only. The 21.8% severe rate reflects the reported subset, not the full population of all road events."
  }
];

const Integrity = () => {
  const { v3Roadmap } = EMPIRICAL_DATA;

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2.2rem', letterSpacing: '-0.03em' }}>Methodological Integrity</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Structural Guardrails and Analytical Limitations</p>
      </header>

      {/* Causal Boundary */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ ...CARD, padding: '24px 28px', background: '#F4F7FA', borderLeft: '4px solid var(--accent-blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <ShieldCheck size={20} color="var(--accent-blue)" />
            <h2 style={{ fontSize: '1.15rem', margin: 0 }}>The Causal Boundary</h2>
          </div>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.75, margin: 0 }}>
            This framework models <strong>Severity Conditional on Collision</strong>. It identifies environments where severity is structurally amplified so systems can prioritize mitigation — it does not predict crash occurrence.
          </p>
        </div>
      </section>

      {/* Limitations */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Known Limitations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {limitations.map((lim, idx) => (
            <div key={idx} style={{ ...CARD, borderTop: `4px solid ${lim.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ background: `${lim.color}18`, padding: '8px', borderRadius: '8px', color: lim.color }}>
                  {lim.icon}
                </div>
                <h3 style={{ fontSize: '0.95rem', margin: 0 }}>{lim.title}</h3>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.65, margin: 0, color: 'var(--text-main)' }}>{lim.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* V3 Roadmap */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <Rocket size={20} color="#E8A838" />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>What Comes Next</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {v3Roadmap.map((item, i) => (
            <div key={i} style={{ ...CARD, borderTop: '4px solid #E8A838' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '8px' }}>
                {item.improvement}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#E8A838', fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>
                {item.expectedGain}
              </div>
              <div style={{
                display: 'inline-block',
                background: item.status === 'Highest priority' ? 'rgba(26,127,160,0.1)' : item.status === 'Data acquisition' ? 'rgba(232,168,56,0.1)' : 'rgba(136,153,171,0.1)',
                color: item.status === 'Highest priority' ? '#1A7FA0' : item.status === 'Data acquisition' ? '#B8860B' : '#5A6E85',
                padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700,
              }}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#8899AB', fontStyle: 'italic', textAlign: 'center' }}>
          V2 is the credible foundation. V3 builds on proven architecture.
        </div>
      </section>

      {/* Continuous Improvement */}
      <section style={{ ...CARD, padding: '24px 28px', borderLeft: '4px solid var(--accent-teal)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <RefreshCw size={18} color="var(--accent-teal)" />
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Continuous Improvement Pathway</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--accent-teal)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Near-Term (Q1–Q2)</h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', lineHeight: 2 }}>
              <li>Ingest Q4 2025 + Q1 2026 collision records</li>
              <li>ECCC weather station bootstrap (temp + wind)</li>
              <li>Validate NSRN posted speeds against field data</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--accent-teal)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Medium-Term (Q3–Q4)</h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', lineHeight: 2 }}>
              <li>NCDB vehicle type + occupant data linkage</li>
              <li>Route-held-out validation (Hwy 102 vs 103)</li>
              <li>Platt calibration for probability scoring</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Integrity;
