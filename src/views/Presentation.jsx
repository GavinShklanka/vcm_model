import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer, LabelList
} from 'recharts';
import { EMPIRICAL_DATA } from '../data/v2_empirical_data';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const SLIDE_TIMINGS = [25, 40, 35, 45, 45, 40, 40, 40, 30]; // seconds per slide
const TOTAL_SLIDES = 9;

const COLORS = {
  teal:    '#1A7FA0',
  deepBlue:'#0E3B6B',
  gold:    '#E8A838',
  green:   '#2EAF6C',
  red:     '#D94848',
  muted:   '#8899AB',
  dark:    '#0F2A43',
  darkMid: '#1E3A5F',
  surface: '#FFFFFF',
  fog:     '#F4F7FA',
  border:  '#E2E8F0',
  textMain:'#2D3748',
  textHead:'#1E3A5F',
};

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const MONO  = "'JetBrains Mono', monospace";

// ── Reusable tiny components ─────────────────────────────────────────────────

const Dot = ({ color, size = 7 }) => (
  <span style={{
    display: 'inline-block', width: size, height: size,
    borderRadius: '50%', background: color, flexShrink: 0, marginTop: 7,
  }} />
);

const AccentCard = ({ accent, children, style = {} }) => (
  <div style={{
    background: COLORS.surface, borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${COLORS.border}`,
    borderLeft: `4px solid ${accent}`, padding: '20px 24px',
    ...style,
  }}>
    {children}
  </div>
);

const TopAccentCard = ({ accent, children, style = {} }) => (
  <div style={{
    background: COLORS.surface, borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${COLORS.border}`,
    borderTop: `4px solid ${accent}`, padding: '22px 24px',
    ...style,
  }}>
    {children}
  </div>
);

const DotRow = ({ color, text }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
    <Dot color={color} />
    <span style={{ fontSize: '1rem', lineHeight: 1.55, color: COLORS.textMain }}>{text}</span>
  </div>
);

const SlideTitle = ({ children }) => (
  <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: COLORS.textHead, letterSpacing: '-0.03em', margin: '0 0 6px 0', fontFamily: FONT }}>
    {children}
  </h2>
);

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE CONTENT RENDERERS
// ═══════════════════════════════════════════════════════════════════════════════

/* ── Slide 1 — Title ─────────────────────────────────────────────────────── */
const Slide1 = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '100%', background: `linear-gradient(160deg, ${COLORS.dark} 0%, ${COLORS.darkMid} 100%)`,
    textAlign: 'center', padding: '0 60px',
  }}>
    <Shield size={44} color={COLORS.teal} strokeWidth={1.8} style={{ marginBottom: 28, opacity: 0.85 }} />
    <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.04em', margin: '0 0 14px 0', fontFamily: FONT, lineHeight: 1.15 }}>
      Collision Severity Intelligence — V2
    </h1>
    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', margin: '0 0 40px 0', maxWidth: 600, lineHeight: 1.5 }}>
      A More Credible Model for Nova Scotia Road Safety
    </p>
    <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3px' }}>
      2,068 police-reported collisions &middot; Jan 2024 – Jan 2026
    </div>
    <div style={{ fontSize: '0.78rem', color: COLORS.teal, marginTop: 12, fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
      Black Point Analytics
    </div>
  </div>
);

/* ── Slide 2 — The Nova Scotia Reality ─────────────────────────────────────── */
const Slide2 = () => {
  const corridors = [
    { name: 'Hwy 333', collisions: 113, severity: '37.2%' },
    { name: 'Hwy 7',   collisions: 135, severity: '26.7%' },
    { name: 'Hwy 107', collisions: 95,  severity: '26.3%' },
  ];

  const TH = { padding: '6px 12px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${COLORS.border}` };
  const TD = { padding: '7px 12px', fontSize: '0.85rem', color: COLORS.textMain, borderBottom: `1px solid ${COLORS.border}` };

  return (
    <div style={{ display: 'flex', gap: 36, alignItems: 'center', height: '100%', padding: '0 56px' }}>
      {/* Left — headline stat */}
      <div style={{
        background: COLORS.dark, borderRadius: 16, padding: '44px 40px',
        borderLeft: `5px solid ${COLORS.gold}`, minWidth: 290, textAlign: 'center', flexShrink: 0,
      }}>
        <div style={{ fontSize: '4.6rem', fontWeight: 800, color: COLORS.gold, fontFamily: MONO, lineHeight: 1 }}>450</div>
        <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', marginTop: 12, lineHeight: 1.5 }}>severe collisions in 2,068 police reports</div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>21.8% severity rate — Nova Scotia provincial corridors, 2024–2026</div>
      </div>

      {/* Right — 3 data blocks */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SlideTitle>The Nova Scotia Reality</SlideTitle>
        <div style={{ height: 4, width: 48, background: COLORS.gold, borderRadius: 2, marginBottom: 6 }} />

        {/* Block 1 — Dangerous Corridors */}
        <AccentCard accent={COLORS.teal} style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.teal, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Dangerous Corridors</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th style={TH}>Corridor</th><th style={TH}>Collisions</th><th style={TH}>Severity Rate</th>
            </tr></thead>
            <tbody>
              {corridors.map((c, i) => (
                <tr key={i}>
                  <td style={{ ...TD, fontWeight: 600, color: COLORS.textHead }}>{c.name}</td>
                  <td style={{ ...TD, fontFamily: MONO }}>{c.collisions}</td>
                  <td style={{ ...TD, fontWeight: 700, color: parseFloat(c.severity) > 30 ? COLORS.red : COLORS.gold, fontFamily: MONO }}>{c.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: '0.75rem', color: COLORS.muted, fontStyle: 'italic', marginTop: 6 }}>Hwy 102 has 557 collisions but 21.4% severity — volume does not equal danger</div>
        </AccentCard>

        {/* Block 2 — Highest-Risk Behaviors */}
        <AccentCard accent={COLORS.gold} style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Highest-Risk Behaviors</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><Dot color={COLORS.gold} size={6} /><span style={{ fontSize: '0.85rem', color: COLORS.textMain, lineHeight: 1.45 }}>Distracted Commuter profile: <strong>33.1% severe</strong> (160 collisions)</span></div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><Dot color={COLORS.gold} size={6} /><span style={{ fontSize: '0.85rem', color: COLORS.textMain, lineHeight: 1.45 }}>Late Night Risk Taker: <strong>32.1% severe</strong> — 10x the provincial impairment average</span></div>
          </div>
        </AccentCard>

        {/* Block 3 — Seasonal Pattern */}
        <AccentCard accent={COLORS.deepBlue} style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.deepBlue, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>The Seasonal Pattern</div>
          <div style={{ fontSize: '0.85rem', color: COLORS.textMain, lineHeight: 1.5 }}>May–Sep averages <strong>26.5% severity</strong>. Nov–Mar drops to <strong>16.5%</strong>. Winter is high volume, low severity — drivers slow down.</div>
        </AccentCard>
      </div>
    </div>
  );
};

/* ── Slide 3 — What the System Does ───────────────────────────────────────── */
const Slide3 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 60px' }}>
    <SlideTitle>What the System Does</SlideTitle>
    <div style={{ height: 4, width: 48, background: COLORS.teal, borderRadius: 2, margin: '8px 0 28px 0' }} />

    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
      background: COLORS.surface, borderRadius: 14, overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: `1px solid ${COLORS.border}`,
    }}>
      {/* Does */}
      <div style={{ padding: '32px 36px', borderRight: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${COLORS.green}` }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: COLORS.green, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 18 }}>
          The system does
        </div>
        <DotRow color={COLORS.green} text="Score severity likelihood of reported collisions" />
        <DotRow color={COLORS.green} text="Enable data-driven triage for NS provincial corridors" />
        <DotRow color={COLORS.green} text="Support corridor monitoring and seasonal planning" />
      </div>
      {/* Does Not */}
      <div style={{ padding: '32px 36px', borderLeft: `4px solid ${COLORS.red}` }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: COLORS.red, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 18 }}>
          The system does not
        </div>
        <DotRow color={COLORS.red} text="Predict where collisions will occur" />
        <DotRow color={COLORS.red} text="Predict whether a collision will happen" />
        <DotRow color={COLORS.red} text="Assign causality or blame" />
      </div>
    </div>

    {/* Bottom strip */}
    <div style={{
      background: COLORS.dark, borderRadius: '0 0 14px 14px', padding: '16px 36px',
      textAlign: 'center', marginTop: 0, borderRadius: 14,
    }}>
      <span style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
        V2 answers one question: <strong style={{ color: COLORS.teal }}>how severe is this collision likely to be</strong> — after it has been reported.
      </span>
    </div>
  </div>
);

/* ── Slide 4 — Why This Model Is Credible ─────────────────────────────────── */
const Slide4 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 60px' }}>
    <SlideTitle>Why This Model Is Credible</SlideTitle>
    <div style={{ height: 4, width: 48, background: COLORS.deepBlue, borderRadius: 2, margin: '8px 0 28px 0' }} />

    {/* Timeline bar */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
      <div style={{
        flex: 3, background: COLORS.deepBlue, borderRadius: '10px 0 0 10px', padding: '20px 28px',
        color: '#FFFFFF',
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Training</div>
        <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>1,543 records</div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Jan 2024 – Jul 2025 &middot; 22.9% severe</div>
      </div>
      <div style={{
        width: 0, height: 0,
        borderTop: '36px solid transparent', borderBottom: '36px solid transparent',
        borderLeft: `20px solid ${COLORS.deepBlue}`, flexShrink: 0,
      }} />
      <div style={{
        flex: 2, background: COLORS.gold, borderRadius: '0 10px 10px 0', padding: '20px 28px',
        color: '#FFFFFF', marginLeft: -1,
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Testing</div>
        <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>525 records</div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Aug 2025 – Jan 2026 &middot; 18.3% severe</div>
      </div>
    </div>

    {/* Evidence block */}
    <div style={{
      background: COLORS.surface, borderRadius: 14, padding: '24px 28px',
      border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: COLORS.textHead, marginBottom: 18 }}>What makes V2 harder — and why that matters</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Dot color={COLORS.teal} />
          <div><strong style={{ color: COLORS.textHead }}>Temporal holdout, not random shuffle</strong><span style={{ fontSize: '0.88rem', color: COLORS.textMain, marginLeft: 6 }}>— The model was tested on 6 months of collisions that hadn't happened when it was trained. If you test on data you've already seen, of course it looks good.</span></div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Dot color={COLORS.gold} />
          <div><strong style={{ color: COLORS.textHead }}>Lower test severity</strong><span style={{ fontSize: '0.88rem', color: COLORS.textMain, marginLeft: 6 }}>— Training data: 22.9% severe. Test data: 18.3% severe. The test set is harder because severe collisions are rarer in it.</span></div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Dot color={COLORS.gold} />
          <div><strong style={{ color: COLORS.textHead }}>Missing key weather data</strong><span style={{ fontSize: '0.88rem', color: COLORS.textMain, marginLeft: 6 }}>— Environment Canada station variables — temperature, wind, precipitation — were V1's top 3 predictors. All were 100% unavailable in V2. The model still improved.</span></div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Dot color={COLORS.green} />
          <div><strong style={{ color: COLORS.textHead }}>Fewer features, not more</strong><span style={{ fontSize: '0.88rem', color: COLORS.textMain, marginLeft: 6 }}>— V1 used 35+ features. V2 uses 8. Every one was validated to hold up across time periods. The model got simpler and better simultaneously.</span></div>
        </div>
      </div>
      <div style={{ marginTop: 16, fontSize: '0.88rem', color: COLORS.muted, fontStyle: 'italic', textAlign: 'center' }}>
        V2 improved under every condition designed to make it fail. That's the credibility case.
      </div>
    </div>
  </div>
);

/* ── Slide 5 — V2 Results ─────────────────────────────────────────────────── */
const Slide5 = () => {
  const chartData = [
    { name: 'Logistic Reg.',  auc: 0.5708, isEnsemble: false },
    { name: 'Random Forest',  auc: 0.6535, isEnsemble: false },
    { name: 'XGBoost',        auc: 0.6572, isEnsemble: false },
    { name: 'Ensemble',       auc: 0.6576, isEnsemble: true  },
  ];

  return (
    <div style={{ display: 'flex', gap: 40, alignItems: 'center', height: '100%', padding: '0 60px' }}>
      {/* Left: bar chart */}
      <div style={{ flex: 1.3 }}>
        <SlideTitle>V2 Performance Results</SlideTitle>
        <div style={{ height: 4, width: 48, background: COLORS.teal, borderRadius: 2, margin: '8px 0 20px 0' }} />
        <div style={{ fontSize: '0.78rem', color: COLORS.muted, marginBottom: 16 }}>
          AUC — ability to separate severe from non-severe
        </div>
        <div style={{ background: COLORS.surface, borderRadius: 12, padding: '16px 8px 8px 0', border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 60, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.border} />
              <XAxis type="number" domain={[0.5, 0.7]} tickFormatter={v => v.toFixed(2)} tick={{ fontSize: 11, fill: COLORS.muted }} />
              <YAxis type="category" dataKey="name" width={105} tick={{ fontSize: 12, fill: COLORS.textHead, fontWeight: 500 }} />
              <Tooltip formatter={(v) => [v.toFixed(4), 'AUC']} contentStyle={{ borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: '0.85rem' }} />
              <Bar dataKey="auc" radius={[0, 6, 6, 0]} barSize={28}>
                <LabelList dataKey="auc" position="right" formatter={v => v.toFixed(4)} style={{ fontSize: 12, fontWeight: 700, fill: COLORS.textHead, fontFamily: MONO }} />
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.isEnsemble ? COLORS.teal : COLORS.muted} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right: metric cards */}
      <div style={{ flex: 0.7, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AccentCard accent={COLORS.gold}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Ensemble</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: COLORS.gold, fontFamily: MONO, lineHeight: 1 }}>0.658</div>
          <div style={{ fontSize: '0.85rem', color: COLORS.textMain, marginTop: 6 }}>Best overall score</div>
        </AccentCard>
        <AccentCard accent={COLORS.green}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>XGBoost</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: COLORS.green, fontFamily: MONO, lineHeight: 1 }}>+0.015</div>
          <div style={{ fontSize: '0.85rem', color: COLORS.textMain, marginTop: 6 }}>vs previous best</div>
        </AccentCard>
        <AccentCard accent={COLORS.green}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Random Forest</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: COLORS.green, fontFamily: MONO, lineHeight: 1 }}>+0.080</div>
          <div style={{ fontSize: '0.85rem', color: COLORS.textMain, marginTop: 6 }}>Largest single improvement</div>
        </AccentCard>
      </div>
    </div>
  );
};

/* ── Slide 6 — How 77 Columns Became 8 Features ──────────────────────────── */
const Slide6 = () => {
  const funnel = EMPIRICAL_DATA.models.featureFunnel;
  const modules = EMPIRICAL_DATA.models.featureModules;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 60px' }}>
      <SlideTitle>How 77 Columns Became 8 Features</SlideTitle>
      <div style={{ height: 4, width: 48, background: COLORS.gold, borderRadius: 2, margin: '8px 0 28px 0' }} />

      {/* Funnel */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0,
        marginBottom: 32, background: COLORS.surface, borderRadius: 14, padding: '24px 32px',
        border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        {funnel.map((step, i) => (
          <React.Fragment key={i}>
            <div style={{ textAlign: 'center', minWidth: 150, padding: '0 8px' }}>
              <div style={{
                fontSize: i === funnel.length - 1 ? '3rem' : '2.4rem', fontWeight: 800,
                color: i === 0 ? COLORS.muted : i === 1 ? COLORS.deepBlue : COLORS.gold,
                fontFamily: MONO, lineHeight: 1, marginBottom: 6,
              }}>
                {step.count}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.textHead, marginBottom: 3 }}>{step.stage}</div>
              <div style={{ fontSize: '0.75rem', color: COLORS.muted }}>{step.label}</div>
            </div>
            {i < funnel.length - 1 && (
              <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                <div style={{ height: 2, width: 32, background: `linear-gradient(to right, ${COLORS.border}, ${COLORS.teal})`, borderRadius: 2 }} />
                <ChevronRight size={18} color={COLORS.teal} style={{ marginLeft: -2 }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Feature table */}
      <div style={{
        background: COLORS.surface, borderRadius: 12, overflow: 'hidden',
        border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.fog }}>
              <th style={{ padding: '10px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.6px', borderBottom: `1px solid ${COLORS.border}` }}>Module</th>
              <th style={{ padding: '10px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.6px', borderBottom: `1px solid ${COLORS.border}` }}>Features</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((mod, i) => (
              <tr key={i} style={{ borderBottom: i < modules.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                <td style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Dot color={mod.color} size={8} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.textHead }}>{mod.module}</span>
                </td>
                <td style={{ padding: '12px 24px' }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {mod.features.map((f, j) => (
                      <span key={j} style={{
                        background: `${mod.color}10`, border: `1px solid ${mod.color}30`,
                        color: mod.color, padding: '3px 10px', borderRadius: 14,
                        fontSize: '0.8rem', fontWeight: 600, fontFamily: MONO,
                      }}>{f}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: '0.82rem', color: COLORS.muted, fontStyle: 'italic', marginTop: 14, textAlign: 'center' }}>
        ECCC weather station data — among the strongest predictors in V1 — was 100% unavailable. V2 still improved.
      </div>
    </div>
  );
};

/* ── Slide 7 — Three Models, One System ───────────────────────────────────── */
const Slide7 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 60px' }}>
    <SlideTitle>Three Models, One System</SlideTitle>
    <div style={{ height: 4, width: 48, background: COLORS.teal, borderRadius: 2, margin: '8px 0 28px 0' }} />

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
      <TopAccentCard accent={COLORS.teal}>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: COLORS.textHead, marginBottom: 6 }}>XGBoost</div>
        <div style={{ fontSize: '0.82rem', color: COLORS.teal, fontWeight: 600, marginBottom: 12 }}>Strongest ranking engine</div>
        <div style={{ fontSize: '0.88rem', color: COLORS.textMain, lineHeight: 1.55, marginBottom: 4 }}>AUC 0.657</div>
        <div style={{ fontSize: '0.88rem', color: COLORS.muted, lineHeight: 1.55, marginBottom: 4 }}>Top signal: vehicle count</div>
        <div style={{ fontSize: '0.85rem', color: COLORS.textMain, lineHeight: 1.55 }}>Best for ordering cases by severity risk</div>
      </TopAccentCard>

      <TopAccentCard accent={COLORS.deepBlue}>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: COLORS.textHead, marginBottom: 6 }}>Random Forest</div>
        <div style={{ fontSize: '0.82rem', color: COLORS.deepBlue, fontWeight: 600, marginBottom: 12 }}>Best probability model</div>
        <div style={{ fontSize: '0.88rem', color: COLORS.textMain, lineHeight: 1.55, marginBottom: 4 }}>AUC 0.654</div>
        <div style={{ fontSize: '0.88rem', color: COLORS.muted, lineHeight: 1.55, marginBottom: 4 }}>Top signal: time of day</div>
        <div style={{ fontSize: '0.85rem', color: COLORS.textMain, lineHeight: 1.55 }}>Most reliable predicted probabilities</div>
      </TopAccentCard>

      <TopAccentCard accent={COLORS.muted}>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: COLORS.textHead, marginBottom: 6 }}>Logistic Regression</div>
        <div style={{ fontSize: '0.82rem', color: COLORS.muted, fontWeight: 600, marginBottom: 12 }}>Transparent baseline</div>
        <div style={{ fontSize: '0.88rem', color: COLORS.textMain, lineHeight: 1.55, marginBottom: 4 }}>AUC 0.571</div>
        <div style={{ fontSize: '0.82rem', color: COLORS.muted, lineHeight: 1.55 }}>Confirms where complexity adds value</div>
      </TopAccentCard>
    </div>

    {/* Bottom ensemble bar */}
    <div style={{
      background: COLORS.dark, borderRadius: 12, padding: '18px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>
        Ensemble = RF + XGBoost combined
      </div>
      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: COLORS.teal }}>
        Best V2 result &middot; AUC 0.658
      </div>
      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', maxWidth: 320, textAlign: 'right' }}>
        The models disagree on what matters most — that disagreement is the signal
      </div>
    </div>
  </div>
);

/* ── Slide 8 — What This Means for Nova Scotia ────────────────────────────── */
const Slide8 = () => {
  const corridorData = [
    { name: 'Hwy 333', severity: '37.2%', delta: '+15.4 pts' },
    { name: 'Hwy 2',   severity: '36.7%', delta: '+14.9 pts' },
    { name: 'Hwy 7',   severity: '26.7%', delta: '+4.9 pts' },
  ];

  const TH = { padding: '5px 10px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: `1px solid ${COLORS.border}` };
  const TD = { padding: '5px 10px', fontSize: '0.82rem', color: COLORS.textMain, borderBottom: `1px solid ${COLORS.border}` };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 56px' }}>
      <SlideTitle>What This Means for Nova Scotia</SlideTitle>
      <div style={{ height: 4, width: 48, background: COLORS.teal, borderRadius: 2, margin: '8px 0 24px 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>

        {/* Panel 1 — Corridor Intelligence */}
        <AccentCard accent={COLORS.teal} style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: COLORS.teal, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>Where severity concentrates</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
            <thead><tr><th style={TH}>Corridor</th><th style={TH}>Severity</th><th style={TH}>vs Avg</th></tr></thead>
            <tbody>
              {corridorData.map((c, i) => (
                <tr key={i}>
                  <td style={{ ...TD, fontWeight: 600, color: COLORS.textHead }}>{c.name}</td>
                  <td style={{ ...TD, fontWeight: 700, color: COLORS.red, fontFamily: MONO }}>{c.severity}</td>
                  <td style={{ ...TD, color: COLORS.gold, fontFamily: MONO }}>{c.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: COLORS.textHead, lineHeight: 1.5 }}>These corridors need per-km engineering review, not just volume-based attention</div>
        </AccentCard>

        {/* Panel 2 — Behavioral Targets */}
        <AccentCard accent={COLORS.gold} style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>Who is crashing severely</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><Dot color={COLORS.gold} size={6} /><span style={{ fontSize: '0.82rem', color: COLORS.textMain, lineHeight: 1.45 }}>Late Night Risk Taker: <strong>32.1%</strong> severe — 32% impairment, 89% darkness, 42% young drivers</span></div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><Dot color={COLORS.gold} size={6} /><span style={{ fontSize: '0.82rem', color: COLORS.textMain, lineHeight: 1.45 }}>Distracted Commuter: <strong>33.1%</strong> severe — 100% distraction flag, daytime highway, rush hour</span></div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><Dot color={COLORS.gold} size={6} /><span style={{ fontSize: '0.82rem', color: COLORS.textMain, lineHeight: 1.45 }}>Aggressive Tailgater: 393 collisions at <strong>25.7%</strong> — the largest severity x volume product</span></div>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: COLORS.textHead, lineHeight: 1.5 }}>Three distinct enforcement windows: late-night impairment, daytime distraction, highway tailgating</div>
        </AccentCard>

        {/* Panel 3 — Conditions & Timing */}
        <AccentCard accent={COLORS.deepBlue} style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: COLORS.deepBlue, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>When and how severity spikes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><Dot color={COLORS.deepBlue} size={6} /><span style={{ fontSize: '0.82rem', color: COLORS.textMain, lineHeight: 1.45 }}>Midnight hour: <strong>37.9% severe</strong> (29 collisions) — highest hourly rate</span></div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><Dot color={COLORS.deepBlue} size={6} /><span style={{ fontSize: '0.82rem', color: COLORS.textMain, lineHeight: 1.45 }}>Rollovers: <strong>58.5% severe</strong> — the deadliest collision type</span></div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><Dot color={COLORS.deepBlue} size={6} /><span style={{ fontSize: '0.82rem', color: COLORS.textMain, lineHeight: 1.45 }}>Curved + level roads: <strong>28.1% severe</strong> — geometry matters more than grade</span></div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><Dot color={COLORS.deepBlue} size={6} /><span style={{ fontSize: '0.82rem', color: COLORS.textMain, lineHeight: 1.45 }}>Dusk: <strong>27.5% severe</strong> — the visibility transition window</span></div>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: COLORS.textHead, lineHeight: 1.5 }}>Seasonal, geometric, and temporal patterns are all actionable for deployment planning</div>
        </AccentCard>
      </div>
    </div>
  );
};

/* ── Slide 9 — Foundation for V3 ──────────────────────────────────────────── */
const Slide9 = () => {
  const { v3Roadmap } = EMPIRICAL_DATA;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 60px' }}>
      <SlideTitle>Foundation for V3</SlideTitle>
      <div style={{ height: 4, width: 48, background: COLORS.gold, borderRadius: 2, margin: '8px 0 24px 0' }} />

      {/* V2 summary strip */}
      <div style={{
        background: COLORS.dark, borderRadius: 12, padding: '18px 32px',
        display: 'flex', gap: 40, alignItems: 'center', marginBottom: 28,
      }}>
        {[
          'Improved under harder temporal testing',
          'Fewer features, no weather data — still better',
          'Ensemble AUC 0.658 vs previous best 0.642',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Dot color={COLORS.green} size={7} />
            <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)' }}>{item}</span>
          </div>
        ))}
      </div>

      {/* V3 roadmap table */}
      <div style={{
        background: COLORS.surface, borderRadius: 12, overflow: 'hidden',
        border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        marginBottom: 28,
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.fog }}>
              {['Next Step', 'Expected Gain', 'Priority'].map((h, i) => (
                <th key={i} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.6px', borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {v3Roadmap.map((row, i) => (
              <tr key={i} style={{ borderBottom: i < v3Roadmap.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                <td style={{ padding: '14px 24px', fontSize: '0.92rem', fontWeight: 600, color: COLORS.textHead }}>{row.improvement}</td>
                <td style={{ padding: '14px 24px', fontSize: '0.92rem', fontWeight: 700, color: COLORS.gold, fontFamily: MONO }}>{row.expectedGain}</td>
                <td style={{ padding: '14px 24px' }}>
                  <span style={{
                    background: row.status === 'Highest priority' ? `${COLORS.teal}15` : `${COLORS.muted}15`,
                    color: row.status === 'Highest priority' ? COLORS.teal : COLORS.muted,
                    padding: '3px 12px', borderRadius: 14, fontSize: '0.8rem', fontWeight: 600,
                  }}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.05rem', color: COLORS.teal, fontStyle: 'italic', fontWeight: 500, margin: 0 }}>
          A more credible and operationally meaningful severity intelligence model — because it passes the harder test.
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPEAKER NOTES
// ═══════════════════════════════════════════════════════════════════════════════

const SPEAKER_NOTES = [
  "Today I'll walk you through V2 of our collision severity intelligence model — a system built on real Nova Scotia police-reported data that identifies which collisions are most likely to be severe.",
  "Here's what Nova Scotia's collision data actually looks like. Highway 333 has a 37% severity rate — nearly double the provincial average. The highest-risk driver profile involves impairment at 10 times the dataset average, late at night, on weekends. And counter-intuitively, summer months are more dangerous than winter — when conditions are obviously bad, people drive cautiously. This is the reality the model needs to capture.",
  "Let me be precise about scope. This is a post-collision triage tool. Once a report comes in, V2 scores how likely it is to be severe. It doesn't predict crashes and it doesn't assign blame.",
  "Let me explain why you should trust this model. First, we tested it on future data it never saw during training — not a random shuffle. Second, the test set has a lower severity rate, so it's actively harder. Third, Environment Canada weather data — temperature, wind, precipitation — were our strongest signals in the previous version, and they were completely unavailable. We still improved. And fourth, we cut from 35 features down to 8, and the model got better. When a model improves under every condition designed to make it fail, that's the credibility case.",
  "The ensemble — a combination of Random Forest and XGBoost — achieves the best result at 0.658 AUC. That beats the previous best of 0.642, and it does so under a harder test. Random Forest improved by nearly 8 hundredths — the single largest gain.",
  "We started with 77 raw columns. Through temporal ablation — testing which features hold up when the model can't see the future — we narrowed to 8. Weather station data from Environment Canada was completely unavailable, and those were V1's strongest signals. V2 improved anyway.",
  "Three models, each built for a different strength. XGBoost ranks — it puts the most severe cases at the top. Random Forest calibrates — its probabilities are the ones you trust. The ensemble combines them. They disagree, and that productive disagreement is exactly why the ensemble outperforms both.",
  "Three concrete takeaways for Nova Scotia. First, corridors: Highway 333 has 37% severity — 15 points above average. That's not a volume problem, it's a severity problem, and it needs engineering attention. Second, behaviors: three driver profiles account for the highest risk — late-night impairment, daytime distraction, and aggressive tailgating. Each has a distinct enforcement window. Third, conditions: midnight collisions are nearly twice as likely to be severe, rollovers are fatal 58% of the time, and curved roads amplify risk even on level terrain. Every one of these is actionable.",
  "V2 is the foundation. Restoring Environment Canada weather data is the single highest-value next step — projected to add 3 to 6 hundredths of AUC. V2 proved the architecture works without it. V3 will prove how much further it can go. Thank you — I'm happy to take questions.",
];

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE RENDERERS MAP
// ═══════════════════════════════════════════════════════════════════════════════

const SLIDE_COMPONENTS = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PRESENTATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const Presentation = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(SLIDE_TIMINGS[0]);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  // ── Timer ──
  useEffect(() => {
    setTimeRemaining(SLIDE_TIMINGS[currentSlide]);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentSlide]);

  // ── Keyboard handler ──
  const handleKeyDown = useCallback((e) => {
    const go = (dir) => {
      const next = currentSlide + dir;
      if (next >= 0 && next < TOTAL_SLIDES) {
        setTransitioning(true);
        setTimeout(() => {
          setCurrentSlide(next);
          setTransitioning(false);
        }, 120);
      }
    };

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        go(1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        go(-1);
        break;
      case 'Escape':
        e.preventDefault();
        navigate('/');
        break;
      case 'n':
      case 'N':
        e.preventDefault();
        setShowNotes(prev => !prev);
        break;
      default:
        break;
    }
  }, [currentSlide, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ── Navigation helpers ──
  const goNext = () => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      setTransitioning(true);
      setTimeout(() => { setCurrentSlide(currentSlide + 1); setTransitioning(false); }, 120);
    }
  };
  const goPrev = () => {
    if (currentSlide > 0) {
      setTransitioning(true);
      setTimeout(() => { setCurrentSlide(currentSlide - 1); setTransitioning(false); }, 120);
    }
  };

  const SlideComponent = SLIDE_COMPONENTS[currentSlide];
  const progress = ((currentSlide + 1) / TOTAL_SLIDES) * 100;
  const isDarkSlide = currentSlide === 0; // only title slide has dark bg

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      zIndex: 2000, background: COLORS.fog, fontFamily: FONT,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* ── Progress bar ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: COLORS.border, zIndex: 10 }}>
        <div style={{
          height: '100%', background: COLORS.teal,
          width: `${progress}%`, transition: 'width 0.3s ease',
          borderRadius: '0 2px 2px 0',
        }} />
      </div>

      {/* ── Timer ── */}
      <div style={{
        position: 'absolute', top: 12, right: 20, zIndex: 10,
        fontSize: '0.88rem', fontWeight: 700, fontFamily: MONO,
        color: timeRemaining === 0 ? COLORS.gold : (isDarkSlide ? 'rgba(255,255,255,0.4)' : COLORS.muted),
        transition: 'color 0.3s ease',
      }}>
        {formatTime(timeRemaining)}
      </div>

      {/* ── Exit button ── */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute', top: 10, left: 16, zIndex: 10,
          background: 'none', border: 'none', cursor: 'pointer',
          color: isDarkSlide ? 'rgba(255,255,255,0.3)' : COLORS.muted,
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: '0.78rem', fontWeight: 500, padding: '4px 8px', borderRadius: 6,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = isDarkSlide ? 'rgba(255,255,255,0.7)' : COLORS.textHead}
        onMouseLeave={e => e.currentTarget.style.color = isDarkSlide ? 'rgba(255,255,255,0.3)' : COLORS.muted}
      >
        <X size={14} /> ESC
      </button>

      {/* ── Slide content ── */}
      <div style={{
        flex: 1, overflow: 'hidden',
        opacity: transitioning ? 0 : 1,
        transition: 'opacity 0.12s ease',
      }}>
        <SlideComponent />
      </div>

      {/* ── Speaker notes ── */}
      {showNotes && (
        <div style={{
          position: 'absolute', bottom: 56, left: 0, right: 0,
          padding: '14px 80px',
          background: isDarkSlide ? 'rgba(0,0,0,0.5)' : 'rgba(30,58,95,0.85)',
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, maxWidth: 800, margin: '0 auto' }}>
            {SPEAKER_NOTES[currentSlide]}
          </div>
        </div>
      )}

      {/* ── Bottom controls ── */}
      <div style={{
        height: 52, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        background: isDarkSlide ? 'rgba(0,0,0,0.3)' : COLORS.surface,
        borderTop: isDarkSlide ? 'none' : `1px solid ${COLORS.border}`,
        padding: '0 20px',
      }}>
        <button
          onClick={goPrev}
          disabled={currentSlide === 0}
          style={{
            background: 'none', border: `1px solid ${isDarkSlide ? 'rgba(255,255,255,0.2)' : COLORS.border}`,
            borderRadius: 6, padding: '6px 12px', cursor: currentSlide === 0 ? 'default' : 'pointer',
            color: currentSlide === 0 ? (isDarkSlide ? 'rgba(255,255,255,0.15)' : COLORS.border) : (isDarkSlide ? 'rgba(255,255,255,0.6)' : COLORS.textHead),
            display: 'flex', alignItems: 'center', transition: 'all 0.15s',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        <div style={{
          fontSize: '0.82rem', fontWeight: 600, minWidth: 60, textAlign: 'center',
          color: isDarkSlide ? 'rgba(255,255,255,0.5)' : COLORS.muted,
          fontFamily: MONO,
        }}>
          {currentSlide + 1} / {TOTAL_SLIDES}
        </div>

        <button
          onClick={goNext}
          disabled={currentSlide === TOTAL_SLIDES - 1}
          style={{
            background: currentSlide === TOTAL_SLIDES - 1 ? 'transparent' : COLORS.teal,
            border: currentSlide === TOTAL_SLIDES - 1 ? `1px solid ${isDarkSlide ? 'rgba(255,255,255,0.2)' : COLORS.border}` : `1px solid ${COLORS.teal}`,
            borderRadius: 6, padding: '6px 12px',
            cursor: currentSlide === TOTAL_SLIDES - 1 ? 'default' : 'pointer',
            color: currentSlide === TOTAL_SLIDES - 1 ? (isDarkSlide ? 'rgba(255,255,255,0.15)' : COLORS.border) : '#FFFFFF',
            display: 'flex', alignItems: 'center', transition: 'all 0.15s',
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Presentation;
