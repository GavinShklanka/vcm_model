import React, { useState } from 'react';
import { SCENARIO_PRESETS, RESOURCE_ALLOCATION } from '../data/v2_empirical_data';

// ── Condition controls ──────────────────────────────────────────────────────────
const controls = {
  timeOfDay: { label: 'Time of Day', options: [
    { value: 'day',   label: 'Daylight' },
    { value: 'dusk',  label: 'Dusk ⚠️' },
    { value: 'night', label: 'Night' },
    { value: 'dawn',  label: 'Dawn' }
  ]},
  roadType: { label: 'Road Type', options: [
    { value: 'straight_highway', label: 'Straight Hwy' },
    { value: 'curve',            label: 'Curved Rural ⚠️' },
    { value: 'rural',            label: 'Rural Straight' },
    { value: 'urban',            label: 'Urban' }
  ]},
  weather: { label: 'Weather', options: [
    { value: 'clear', label: 'Clear' },
    { value: 'rain',  label: 'Rain' },
    { value: 'snow',  label: 'Snow / Ice ⚠️' },
    { value: 'fog',   label: 'Fog ⚠️' }
  ]},
  traffic: { label: 'Traffic', options: [
    { value: 'low',    label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high',   label: 'High' }
  ]}
};

const getRiskEstimate = (c) => {
  let r = 0.218;
  if (c.timeOfDay === 'dusk')            r += 0.057;
  if (c.timeOfDay === 'night')           r -= 0.006;
  if (c.roadType  === 'curve')           r += 0.081;
  if (c.weather   === 'snow')            r += 0.020;
  if (c.weather   === 'fog')             r += 0.035;
  if (c.traffic   === 'high')            r += 0.025;
  if (c.traffic   === 'low')             r -= 0.030;
  return Math.min(Math.max(r, 0.08), 0.55);
};

const riskLabel = (r) => {
  if (r >= 0.38) return { label: 'High Risk',      color: 'var(--accent-red)' };
  if (r >= 0.26) return { label: 'Elevated Risk',  color: 'var(--accent-amber)' };
  return               { label: 'Near Baseline',   color: 'var(--accent-green)' };
};

// ── Domain stories — 4 steps per domain ────────────────────────────────────────
const DOMAIN_STORIES = {
  'EMS Pre-Positioning': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'Dusk collisions (27.5% severity) and curved-road events (29.9%) are both over-represented in the severe category — and they cluster geographically on specific rural corridors.',
      stat: '27.5%', statLabel: 'Dusk severity rate' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'In the 30-minute window around astronomical sunset, severity spikes above baseline on curved rural roads. These windows are mathematically predictable from suncalc data — not random.',
      stat: '4.4×', statLabel: 'Higher severity than dawn' },
    { step: 3, label: 'The Action',   icon: '🚑',
      content: 'Pre-stage one additional trauma-capable EMS unit near the Bedford Highway corridor and Hwy 103 km 20-40 zone during the 60-minute dusk window each day, May through September.',
      stat: '60 min', statLabel: 'Target dusk window' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'Reduction in average EMS response time to severe rural events from ~14 min to ~9 min during the highest-risk daily window. No additional units required — just pre-positioning.',
      stat: '~5 min', statLabel: 'Estimated response reduction' },
  ],
  'Corridor Monitoring': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'Hwy 102 curve segments north of Halifax and the Bedford corridor show the densest concentration of high-severity events in the spatial grid analysis.',
      stat: '29.9%', statLabel: 'Curve crash severity' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'Rollover (58.5%) and right-angle (47.4%) collisions dominate severity at intersection and curve nodes. These locations are fixed — the geometry does not change. Real-time sensors can flag speed anomalies.',
      stat: '58.5%', statLabel: 'Rollover severity rate' },
    { step: 3, label: 'The Action',   icon: '📡',
      content: 'Install radar speed-feedback signs at 4 identified curve nodes on Hwy 102 (km 15, 22, 31, 38). Wire to a 511 API endpoint for real-time flagging when 85th-percentile speed exceeds posted limit by >15%.',
      stat: '4 nodes', statLabel: 'Priority installation sites' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'NS DOT pilots on comparable corridors showed 11-16% speed reduction at monitored sites. Applied to 29.9% baseline severity, even a 10% speed reduction delivers meaningful severity probability decrease.',
      stat: '~11–16%', statLabel: 'Speed reduction in comparable pilots' },
  ],
  'Seasonal Staffing': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'The single most counter-intuitive finding in the dataset: May–September severity (25–29%) consistently exceeds November–March (14–22%). Summer is the high-severity season.',
      stat: '29.3%', statLabel: 'September peak severity rate' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'The mechanism is behavioral: drivers adapt defensively to obvious winter hazards (visible ice, heavy snow). Summer\'s clear conditions at highway speeds create false safety — complacency elevates severity.',
      stat: '7.4 pts', statLabel: 'Sep vs Dec severity gap' },
    { step: 3, label: 'The Action',   icon: '📅',
      content: 'Shift RCMP Highway Patrol\'s peak-resource deployment window from December-February to May-September. Specifically: increase dusk patrol density on Hwy 102/103/104 during summer months.',
      stat: 'May–Sep', statLabel: 'New peak deployment window' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'No budget increase required — a shift of existing seasonal deployment patterns. Expected deterrence effect on high-speed distraction events, which comprise the majority of summer severe collisions.',
      stat: '$0 new', statLabel: 'Additional budget required' },
  ],
  'Weather-Triggered Readiness': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'Weather features (temperature, wind, fog) are the top-ranked XGBoost predictors with importance scores of 0.95 and 0.82. Environment Canada issues forecasts with 6–24hr lead time — enough to act.',
      stat: '0.95', statLabel: 'Temperature predictor importance' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'Fog and black-ice windows are predictable from forecast data. The model\'s weather severity rank feature (0–7 hierarchy) captures these combinations. Pre-emptive alerts can be triggered before the conditions materialise.',
      stat: '6–24hr', statLabel: 'Environment Canada forecast lead' },
    { step: 3, label: 'The Action',   icon: '🌤️',
      content: 'Build an automated pipeline: ECCC API forecast → weather severity rank calculator → if rank ≥ 5 on flagged corridors, trigger NS 511 advisory + EMS readiness alert. Runs nightly at 21:00.',
      stat: 'Rank ≥5', statLabel: 'Trigger threshold' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'Estimated 15-20% improvement in EMS readiness during the 8–12% of days that meet the high-severity weather threshold. Alert fatigue avoided by using the model\'s severity rank (not raw weather flags).',
      stat: '8–12%', statLabel: 'Days meeting trigger threshold/year' },
  ],
  'Engineering Interventions': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'Curved + level roads (28.1%) and curved + graded roads (25.0%) both exceed straight equivalents by 3-5 percentage points. The geometry is the hazard — and geometry can be engineered.',
      stat: '28.1%', statLabel: 'Curved+level severity rate' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'FHWA data shows rumble strips reduce run-off-road crashes by 30–50% on rural highways. NS has 8 corridor segments in the top-severity grid quartile with no current rumble strip coverage.',
      stat: '30–50%', statLabel: 'Run-off-road reduction with rumble strips' },
    { step: 3, label: 'The Action',   icon: '🏗️',
      content: 'Prioritize capital paving envelope for rumble strip installation on Hwy 102 (km 15-40) and Hwy 103 (km 20-55). Add curve advisory signage at all grid cells rated "critical" in the severity map.',
      stat: '8 segments', statLabel: 'Priority installation corridors' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'Based on FHWA benchmarks and NS corridor geometry, estimated 20-35% reduction in run-off-road severe events on treated segments. One-time capital cost with 15+ year effective life.',
      stat: '20–35%', statLabel: 'Estimated severe event reduction' },
  ],
  'Public Messaging': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'Distraction (33.1% severity) outranks impairment (32.1%) — and distraction is 3× more prevalent. The Distracted Commuter archetype (7.7% of crashes) is the deadliest segment.',
      stat: '3×', statLabel: 'Distraction prevalence vs impairment' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'Current NS public safety messaging is heavily winter-focused. Winter severity is actually 14-22% — well below summer. The messaging budget is misaligned with the actual risk calendar.',
      stat: '14–22%', statLabel: 'Winter severity range (lower than summer)' },
    { step: 3, label: 'The Action',   icon: '📢',
      content: 'Shift 40% of the annual highway safety messaging budget from winter campaigns to summer distraction and speed campaigns. Launch Spring (April) to intercept the May severity spike. Target digital channels reaching 25-45 age bracket.',
      stat: '40%', statLabel: 'Budget shift recommended' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'Primary goal: normalize the summer-is-dangerous message against entrenched winter-focused public perception. Secondary: reduce distraction prevalence in the 7.7% highest-severity archetype.',
      stat: 'May spike', statLabel: 'Target intervention window' },
  ],
  'Data Governance': [
    { step: 1, label: 'The Finding',  icon: '📊',
      content: 'The model was trained on Jan 2024 – Jan 2026 NS GeoJSON data. Seasonal drift and infrastructure changes mean that without retraining, accuracy degrades over 12+ month windows.',
      stat: '2,068', statLabel: 'Records in current training set' },
    { step: 2, label: 'The Evidence', icon: '🔍',
      content: 'XGBoost\'s temporal holdout test (Aug–Jan vs earlier training) showed 0.642 AUC — solid but dependent on the feature distribution of recent data. New months add new seasonal patterns the model hasn\'t seen.',
      stat: '0.642', statLabel: 'Current validated AUC' },
    { step: 3, label: 'The Action',   icon: '📊',
      content: 'Establish quarterly pipeline: (1) ingest new NS GeoJSON records, (2) run Scripts 04-06 (feature engineering + training), (3) compare new AUC to 0.642 baseline, (4) deploy if AUC ≥ 0.630.',
      stat: 'Quarterly', statLabel: 'Retraining cadence' },
    { step: 4, label: 'The Outcome',  icon: '✅',
      content: 'Maintained or improved model accuracy as the collision record base grows. Each new quarter adds ~130-150 records, strengthening the minority class (severe) representation and improving temporal generalization.',
      stat: '+~140 records', statLabel: 'Per quarter data growth estimate' },
  ],
};

// ── Story panel component ───────────────────────────────────────────────────────
const StoryPanel = ({ domain, onClose }) => {
  const [step, setStep] = useState(0);
  const steps = DOMAIN_STORIES[domain] || [];
  if (!steps.length) return null;
  const current = steps[step];

  return (
    <div style={{
      marginTop: '1rem', padding: '1.5rem',
      background: 'var(--bg-fog)', borderRadius: '8px',
      borderTop: '2px solid var(--accent-blue)',
      animation: 'fadeIn 0.25s ease'
    }}>
      {/* Step stepper */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            style={{
              flex: 1, padding: '8px 4px', border: 'none',
              background: i === step ? 'var(--accent-blue)' : i < step ? 'rgba(43,108,176,0.12)' : 'var(--bg-surface)',
              color: i === step ? 'white' : i < step ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontWeight: i === step ? 700 : 500,
              fontSize: '0.78rem', cursor: 'pointer',
              borderRight: i < steps.length - 1 ? '1px solid var(--border-light)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* Story content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{current.icon}</div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--text-heading)' }}>
            Step {step + 1}: {current.label}
          </h3>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.65, margin: 0, color: 'var(--text-main)' }}>{current.content}</p>
        </div>
        <div style={{ textAlign: 'center', background: 'white', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '1.25rem 1.5rem', minWidth: '120px' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-blue)', lineHeight: 1 }}>{current.stat}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '5px', lineHeight: 1.3 }}>{current.statLabel}</div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{
          padding: '6px 14px', border: '1px solid var(--border-light)', borderRadius: '6px',
          background: 'var(--bg-surface)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem'
        }}>
          ✕ Close
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{
            padding: '6px 14px', border: '1px solid var(--border-light)', borderRadius: '6px',
            background: step === 0 ? 'var(--bg-fog)' : 'var(--bg-surface)',
            color: step === 0 ? 'var(--border-focus)' : 'var(--text-main)',
            cursor: step === 0 ? 'default' : 'pointer', fontSize: '0.82rem'
          }}>← Back</button>

          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '0 4px' }}>
            {step + 1} / {steps.length}
          </span>

          {step < steps.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} style={{
              padding: '6px 16px', border: 'none', borderRadius: '6px',
              background: 'var(--accent-blue)', color: 'white',
              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600
            }}>Next →</button>
          ) : (
            <button onClick={onClose} style={{
              padding: '6px 16px', border: 'none', borderRadius: '6px',
              background: 'var(--accent-green)', color: 'white',
              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600
            }}>Done ✓</button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main component ──────────────────────────────────────────────────────────────
const ResourceAllocation = () => {
  const [conditions, setConditions]   = useState({ timeOfDay: 'day', roadType: 'straight_highway', weather: 'clear', traffic: 'medium' });
  const [openStory, setOpenStory]     = useState(null);   // domain name or null
  const riskEst = getRiskEstimate(conditions);
  const { label: riskLbl, color: riskClr } = riskLabel(riskEst);

  return (
    <div style={{ maxWidth: '1050px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Resource Allocation</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Scenario Simulator & Interactive Priority Matrix</p>
      </header>

      {/* Scenario quick-selects */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center', fontWeight: 600 }}>
          PRESETS:
        </span>
        {(SCENARIO_PRESETS ?? []).map((preset, i) => (
          <button
            key={i}
            onClick={() => setConditions(preset.conditions)}
            style={{
              padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem',
              border: '1px solid var(--border-light)', cursor: 'pointer',
              background: 'var(--bg-surface)', color: 'var(--text-main)',
              transition: 'all 0.12s ease'
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Condition builder + risk output */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Build a Scenario</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(controls).map(([key, ctrl]) => (
              <div key={key}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>{ctrl.label}</div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {ctrl.options.map(opt => (
                    <button key={opt.value} onClick={() => { setConditions(c => ({ ...c, [key]: opt.value })); setActivePreset(null); }} style={{
                      padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-light)', fontSize: '0.8rem',
                      background: conditions[key] === opt.value ? 'var(--accent-blue)' : 'var(--bg-fog)',
                      color: conditions[key] === opt.value ? 'white' : 'var(--text-main)',
                      fontWeight: conditions[key] === opt.value ? 600 : 400, cursor: 'pointer', transition: 'all 0.12s ease'
                    }}>{opt.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Risk Assessment</h2>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: riskClr, lineHeight: 1 }}>{(riskEst * 100).toFixed(1)}%</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '5px' }}>Estimated Severity Rate</div>
            <div style={{ display: 'inline-block', marginTop: '0.6rem', padding: '3px 12px', borderRadius: '20px', background: `${riskClr}18`, color: riskClr, fontWeight: 700, fontSize: '0.8rem' }}>{riskLbl}</div>
          </div>
          <div style={{ background: 'var(--bg-fog)', borderRadius: '6px', padding: '0.85rem', borderLeft: `3px solid ${riskClr}` }}>
            {/* Rationale removed; baseline comparison only */}
            <><div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px', textTransform: 'uppercase' }}>vs. Baseline</div>
              <div style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>
                Baseline 21.8%. This combination is {riskEst > 0.218 ? `${((riskEst / 0.218 - 1) * 100).toFixed(0)}% above baseline.` : 'near or below baseline.'}
              </div></>
          </div>
        </div>
      </div>

      {/* Interactive priority matrix */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Operational Priority Matrix</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click "Explore →" to walk through the evidence for any domain</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {RESOURCE_ALLOCATION.map((item, idx) => (
            <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden', border: openStory === item.domain ? '1px solid var(--accent-blue)' : '1px solid var(--border-light)', transition: 'border 0.15s ease' }}>
              {/* Row */}
              <div style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '2rem 1fr 1.6fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div style={{ fontSize: '1.35rem' }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-heading)' }}>{item.domain}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', fontWeight: 500, marginTop: '2px' }}>Finding {item.findingRef}</div>
                </div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-main)', lineHeight: 1.45 }}>{item.action}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-heading)', marginBottom: '1px' }}>{item.lead}</div>
                  <div>{item.season}</div>
                </div>
                <button
                  onClick={() => setOpenStory(openStory === item.domain ? null : item.domain)}
                  style={{
                    padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                    background: openStory === item.domain ? 'var(--accent-blue)' : 'rgba(43,108,176,0.1)',
                    color: openStory === item.domain ? 'white' : 'var(--accent-blue)',
                    fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                >
                  {openStory === item.domain ? '▲ Close' : 'Explore →'}
                </button>
              </div>

              {/* Story panel — expands inline */}
              {openStory === item.domain && (
                <div style={{ padding: '0 1.25rem 1.25rem' }}>
                  <StoryPanel domain={item.domain} onClose={() => setOpenStory(null)} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResourceAllocation;
