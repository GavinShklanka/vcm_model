import React, { useState } from 'react';
import { Activity, ShieldAlert, Navigation, Clock, Cloud, Radio, Database } from 'lucide-react';

const policyActions = [
  {
    id: 1, icon: <Clock size={22} />,
    tier1: "Targeted Enforcement During Dusk Transitions",
    riskSignal: "Dusk Transition Risk", findingRef: "Finding 02",
    family: "Enforcement & Operations", lead: "RCMP Highway Patrol",
    rationale: "Align speed enforcement patrols with astronomical sunset, not fixed hours. The optical illusion of visibility during dusk on rural curves is the primary severity driver in Finding 02.",
    caution: "Requires shifting officer shift structures to track astronomical sunset windows by season."
  },
  {
    id: 2, icon: <ShieldAlert size={22} />,
    tier1: "Summer Public Health Messaging Reallocation",
    riskSignal: "Summer Complacency", findingRef: "Finding 01",
    family: "Communications", lead: "Dept. of Health / NS Public Works",
    rationale: "Winter driving awareness campaigns are effective (severity stays low). Redirect summer messaging to target high-speed distraction and complacency on clear, dry days — the actual peak season.",
    caution: "Avoid implying summer weather causes crashes. Target speed and attentional context specifically."
  },
  {
    id: 3, icon: <Navigation size={22} />,
    tier1: "Corridor-Specific Triage Scaling",
    riskSignal: "Curve + Grade Exposure", findingRef: "Finding 03",
    family: "Triage & Emergency Response", lead: "EHS / Hospital Administration",
    rationale: "Collisions reported on curved, graded rural segments should trigger elevated default trauma response probability regardless of initial caller assessment. A curve crash at 110 km/h has 29.9% severity base rate.",
    caution: "Applies to prioritization only. Must not delay response to straight-road crashes."
  },
  {
    id: 4, icon: <Cloud size={22} />,
    tier1: "Weather-Triggered Readiness Protocol",
    riskSignal: "Fog / Black-Ice Windows", findingRef: "Finding 01 + 02",
    family: "Emergency Preparedness", lead: "NS 511 / Emergency Management Office",
    rationale: "Automated alert pipeline: when Environment Canada forecasts fog or black-ice windows on key corridors (102/103/104), trigger pre-emptive EMS pre-positioning and dynamic corridor advisories.",
    caution: "Alert fatigue risk if thresholds are too broad. Calibrate to verified high-severity forecast conditions."
  },
  {
    id: 5, icon: <Radio size={22} />,
    tier1: "Corridor Monitoring Sensor Expansion",
    riskSignal: "Real-Time Severity Signals", findingRef: "Finding 03",
    family: "Infrastructure & Engineering", lead: "NS Dept. of Transportation",
    rationale: "Deploy real-time sensor alerts on Hwy 102/103 curve segments flagged in hotspot analysis. Speed feedback signs have demonstrated 10–15% speed reduction in comparable NS pilots.",
    caution: "Capital cost. Prioritize Truro interchange and Bedford Highway corridor first."
  },
  {
    id: 6, icon: <Database size={22} />,
    tier1: "Quarterly Model Retraining Pipeline",
    riskSignal: "Model Drift / Data Freshness", findingRef: "ALL",
    family: "Data Governance", lead: "NS Digital Service / MBAN Program",
    rationale: "Establish quarterly ingestion of new NS GeoJSON collision records to retrain the XGBoost model. Seasonal drift (new months shift severity distribution) degrades model accuracy over 12+ month windows.",
    caution: "Requires maintaining the empirical V2 pipeline and environment. Document all retraining runs."
  }
];

const Policy = () => {
  const [expandedId, setExpandedId] = useState(null);
  const toggle = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Operational Policy Signals</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Translating Model Outputs to System Interventions</p>
      </header>

      <section className="card" style={{ marginBottom: '3rem', borderLeft: '4px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          <Activity size={30} color="var(--accent-blue)" />
          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>The Goal: Prioritization, Not Magic</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              This model does not automate decision-making. It identifies combinations of environmental and temporal factors that reliably predict <em>elevated severity risk</em> when a collision occurs. Each policy action below ties directly to a numbered finding.
            </p>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {policyActions.map((action) => (
          <div key={action.id} className="card card-transition" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => toggle(action.id)}>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--accent-blue)', opacity: 0.8 }}>{action.icon}</div>
                <div>
                  <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-amber)', background: 'rgba(183,121,31,0.1)', padding: '2px 8px', borderRadius: '4px', marginBottom: '4px' }}>
                    {action.riskSignal} · {action.findingRef}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{action.tier1}</h3>
                </div>
              </div>
              <div style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 500, flexShrink: 0, marginLeft: '1rem' }}>
                {expandedId === action.id ? '↑ Close' : '↓ Details'}
              </div>
            </div>

            {expandedId === action.id && (
              <div style={{ padding: '1.5rem', background: 'var(--bg-fog)', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) 2fr', gap: '2rem' }}>
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Intervention Family</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 500 }}>{action.family}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Operational Lead</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 500 }}>{action.lead}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Structural Rationale</div>
                      <div style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>{action.rationale}</div>
                    </div>
                    <div style={{ background: 'rgba(197,48,48,0.05)', padding: '0.65rem 0.85rem', borderRadius: '4px', borderLeft: '2px solid var(--accent-red)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', marginBottom: '2px' }}>Integrity Caution</div>
                      <div style={{ fontSize: '0.88rem' }}>{action.caution}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Policy;
