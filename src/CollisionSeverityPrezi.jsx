import { useState, useEffect, useRef, useCallback } from "react";

const SLIDES = [
  {
    id: 0,
    label: "SYSTEM OVERVIEW",
    duration: 12,
    headline: "A Collision Risk Engine\nBuilt on Three Signals",
    type: "analogy",
    content: [
      { icon: "🌐", label: "Frontend", text: "Roads, weather, and traffic collect real-world inputs" },
      { icon: "⚙️", label: "Backend", text: "A model pipeline estimates collision severity probability" },
      { icon: "📡", label: "Signal Flow", text: "Raw environment → processed risk score → actionable insight" },
    ],
    plain: "Your phone's weather app reads sensors and tells you to bring an umbrella. This does the same for roads.",
  },
  {
    id: 1,
    label: "01  METHODOLOGY",
    duration: 18,
    headline: "Three Datasets.\nOne Question.",
    type: "bullets",
    content: [
      { label: "Datasets", text: "Collision records · traffic exposure volumes · weather observations — linked by location and time" },
      { label: "Target", text: "Binary outcome: Severe (fatality/major injury) vs. Non-Severe" },
      { label: "Exposure Weight", text: "Traffic volume (VMT) normalises rates so busy roads aren't unfairly penalised" },
    ],
    plain: "Like cross-referencing crash reports with real-time road conditions at the exact time and place.",
  },
  {
    id: 2,
    label: "02  CORE FORMULAS",
    duration: 22,
    headline: "The Math Behind\nthe Prediction",
    type: "formulas",
    content: [
      { tag: "Logistic Regression", formula: "P(Severe) = 1 / (1 + e^-(β₀ + β₁X₁ +…+ βₙXₙ))" },
      { tag: "Interaction Terms", formula: "β_ij = Traffic × Precipitation\nβ_ij = Traffic × Visibility" },
      { tag: "Normalisation", formula: "Rate = Severe Collisions / VMT × 10⁶" },
    ],
    plain: "High traffic + bad weather multiplies risk — the model is taught to expect the combination is worse than either alone.",
  },
  {
    id: 3,
    label: "03  ADVANCED MODELS",
    duration: 20,
    headline: "Beyond the\nStraight Line",
    type: "models",
    content: [
      { label: "Random Forest", formula: "f̂(x) = (1/T) Σ hₜ(x),  t=1…T", text: "500 independent trees vote — majority wins" },
      { label: "XGBoost", formula: "Fₘ(x) = Fₘ₋₁(x) + η · hₘ(x)", text: "Each tree corrects the last one's mistakes" },
    ],
    plain: "Instead of one opinion, you get 500 — and they keep getting smarter after each round.",
  },
  {
    id: 4,
    label: "04  ENHANCEMENTS",
    duration: 18,
    headline: "Context\nChanges Everything",
    type: "regimes",
    content: [
      { label: "Exposure Bias", text: "Inverse probability weighting for over-represented road segments" },
      { label: "Severe Weather", sub: true, text: "Snow · ice · fog sub-models trained separately" },
      { label: "Holiday Windows", sub: true, text: "Peak demand periods modelled independently" },
      { label: "Seasonal Shifts", sub: true, text: "Summer vs winter commute pattern divergence" },
    ],
    plain: "A blizzard on New Year's Eve is not the same as a Tuesday morning drizzle. The model knows the difference.",
  },
  {
    id: 5,
    label: "05  EVALUATION",
    duration: 14,
    headline: "How Do We Know\nIt Works?",
    type: "metrics",
    content: [
      { metric: "AUC-ROC", desc: "Discrimination across all thresholds" },
      { metric: "F1 Score", desc: "Precision/recall balance" },
      { metric: "Brier Score", desc: "Probability calibration" },
      { metric: "Log Loss", desc: "Penalises confident errors" },
    ],
    plain: "Multiple scorecards — not just accuracy — so the model is right for the right reasons.",
  },
  {
    id: 6,
    label: "06  INTERPRETABILITY",
    duration: 16,
    headline: "Open the\nBlack Box",
    type: "methods",
    content: [
      { label: "Permutation Importance", text: "Shuffle a feature → measure accuracy drop → rank global influence" },
      { label: "SHAP Values", text: "Game-theoretic attribution of each prediction to individual features" },
      { label: "Partial Dependence Plots", text: "Marginal effect of one variable, averaging over all others" },
    ],
    plain: "We can show exactly why the model flagged a road segment — not just that it did.",
  },
  {
    id: 7,
    label: "07  FEASIBILITY",
    duration: 14,
    headline: "Ready to Build.\nReady to Scale.",
    type: "checks",
    content: [
      { text: "All data sources publicly accessible or agency-held" },
      { text: "Pipeline extends regionally or nationally without restructuring" },
      { text: "Incremental retraining as new collision and weather data arrives" },
      { text: "Outputs ready for dashboards, GIS heatmaps, or policy tools" },
    ],
    plain: "This isn't a research concept — it's a deployable system.",
  },
  {
    id: 8,
    label: "08  DELIVERABLES",
    duration: 16,
    headline: "Six Outputs.\nOne Pipeline.",
    type: "deliverables",
    content: [
      { text: "Merged analytical dataset (collision + traffic + weather)" },
      { text: "Trained logistic regression model + coefficients" },
      { text: "Random Forest & XGBoost models with tuning logs" },
      { text: "SHAP summaries & partial dependence visualisations" },
      { text: "Behavioral regime sub-model comparison report" },
      { text: "Reproducible Python/R pipeline + documentation" },
    ],
    plain: "Everything needed to hand this off, replicate it, or extend it.",
  },
];

const TOTAL = SLIDES.reduce((s, sl) => s + sl.duration, 0); // 150s

export default function CollisionPrezi() {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [entered, setEntered] = useState(false);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const elapsedRef = useRef(0);

  const slide = SLIDES[idx];
  const totalElapsed = SLIDES.slice(0, idx).reduce((s, sl) => s + sl.duration, 0);

  const transition = useCallback((newIdx) => {
    setVisible(false);
    setTimeout(() => {
      setIdx(newIdx);
      setProgress(0);
      elapsedRef.current = 0;
      startRef.current = Date.now();
      setVisible(true);
    }, 220);
  }, []);

  useEffect(() => {
    if (paused || !entered) return;
    startRef.current = Date.now() - elapsedRef.current * slide.duration * 10;

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const pct = Math.min(elapsed / slide.duration, 1);
      elapsedRef.current = pct;
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(timerRef.current);
        if (idx < SLIDES.length - 1) {
          transition(idx + 1);
        }
      }
    }, 50);
    return () => clearInterval(timerRef.current);
  }, [idx, paused, entered, slide.duration, transition]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") transition(Math.min(idx + 1, SLIDES.length - 1));
      if (e.key === "ArrowLeft") transition(Math.max(idx - 1, 0));
      if (e.key === " ") { e.preventDefault(); setPaused(p => !p); }
      if (e.key === "Escape") transition(0);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [idx, transition]);

  const totalSecs = totalElapsed + Math.floor(progress * slide.duration);
  const mins = String(Math.floor(totalSecs / 60)).padStart(2, "0");
  const secs = String(totalSecs % 60).padStart(2, "0");
  const globalPct = (totalElapsed + progress * slide.duration) / TOTAL;

  if (!entered) {
    return (
      <div style={{ ...styles.shell, background: "#0F2A52", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
        <style>{googleFonts}</style>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 42, color: "#fff", textAlign: "center", lineHeight: 1.2 }}>
          Collision Severity<br /><span style={{ color: "#0096C7" }}>Modeling Framework</span>
        </div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "#8AB4D8", letterSpacing: 2, textTransform: "uppercase" }}>
          150-Second Overview · Kodi & Shklanka
        </div>
        <button
          style={styles.startBtn}
          onClick={() => { setEntered(true); startRef.current = Date.now(); }}
        >
          ▶ &nbsp; Begin Presentation
        </button>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#4A6FA5" }}>
          Space to pause · ← → to navigate · ESC to restart
        </div>
      </div>
    );
  }

  return (
    <div style={styles.shell}>
      <style>{googleFonts}</style>

      {/* GLOBAL PROGRESS */}
      <div style={styles.globalBar}>
        <div style={{ ...styles.globalFill, width: `${globalPct * 100}%` }} />
      </div>

      {/* HUD */}
      <div style={styles.hud}>
        <div style={styles.hudLeft}>
          <span style={styles.hudLabel}>{slide.label}</span>
          <span style={styles.hudDots}>
            {SLIDES.map((_, i) => (
              <span key={i} onClick={() => transition(i)} style={{ ...styles.dot, background: i === idx ? "#0096C7" : i < idx ? "#1A5FA8" : "#2A3F60", cursor: "pointer" }} />
            ))}
          </span>
        </div>
        <div style={styles.hudRight}>
          <span style={styles.timer}>{mins}:{secs} <span style={{ color: "#4A6FA5" }}>/ 2:30</span></span>
          <button style={styles.pauseBtn} onClick={() => setPaused(p => !p)}>
            {paused ? "▶" : "⏸"}
          </button>
        </div>
      </div>

      {/* SLIDE PROGRESS BAR */}
      <div style={styles.slideBar}>
        <div style={{ ...styles.slideFill, width: `${progress * 100}%`, transition: paused ? "none" : "width 0.05s linear" }} />
      </div>

      {/* MAIN SLIDE */}
      <div style={{ ...styles.slide, opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.97)", transition: "opacity 0.22s ease, transform 0.22s ease" }}>

        {/* HEADLINE */}
        <div style={styles.headlineWrap}>
          <div style={styles.headline}>
            {slide.headline.split("\n").map((line, i) => (
              <span key={i}>{line}{i < slide.headline.split("\n").length - 1 ? <br /> : null}</span>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div style={styles.content}>
          {slide.type === "analogy" && (
            <div style={styles.analogyGrid}>
              {slide.content.map((c, i) => (
                <div key={i} style={styles.analogyCard}>
                  <div style={styles.analogyIcon}>{c.icon}</div>
                  <div style={styles.analogyLabel}>{c.label}</div>
                  <div style={styles.analogyText}>{c.text}</div>
                </div>
              ))}
            </div>
          )}

          {slide.type === "bullets" && (
            <div style={styles.bulletList}>
              {slide.content.map((c, i) => (
                <div key={i} style={styles.bulletRow}>
                  <span style={styles.bulletDot}>◆</span>
                  <span><strong style={{ color: "#0096C7" }}>{c.label}: </strong><span style={{ color: "#C8D8F0" }}>{c.text}</span></span>
                </div>
              ))}
            </div>
          )}

          {slide.type === "formulas" && (
            <div style={styles.formulaList}>
              {slide.content.map((c, i) => (
                <div key={i} style={styles.formulaBlock}>
                  <div style={styles.formulaTag}>{c.tag}</div>
                  <div style={styles.formulaCode}>{c.formula}</div>
                </div>
              ))}
            </div>
          )}

          {slide.type === "models" && (
            <div style={styles.modelGrid}>
              {slide.content.map((c, i) => (
                <div key={i} style={styles.modelCard}>
                  <div style={styles.modelLabel}>{c.label}</div>
                  <div style={styles.formulaCode}>{c.formula}</div>
                  <div style={styles.modelText}>{c.text}</div>
                </div>
              ))}
            </div>
          )}

          {slide.type === "regimes" && (
            <div style={styles.bulletList}>
              {slide.content.map((c, i) => (
                <div key={i} style={{ ...styles.bulletRow, paddingLeft: c.sub ? 32 : 0, opacity: c.sub ? 0.85 : 1 }}>
                  <span style={{ ...styles.bulletDot, color: c.sub ? "#1A5FA8" : "#0096C7" }}>{c.sub ? "◦" : "◆"}</span>
                  <span><strong style={{ color: c.sub ? "#8AB4D8" : "#0096C7" }}>{c.label}: </strong><span style={{ color: "#C8D8F0" }}>{c.text}</span></span>
                </div>
              ))}
            </div>
          )}

          {slide.type === "metrics" && (
            <div style={styles.metricsGrid}>
              {slide.content.map((c, i) => (
                <div key={i} style={styles.metricCard}>
                  <div style={styles.metricName}>{c.metric}</div>
                  <div style={styles.metricDesc}>{c.desc}</div>
                </div>
              ))}
            </div>
          )}

          {slide.type === "methods" && (
            <div style={styles.bulletList}>
              {slide.content.map((c, i) => (
                <div key={i} style={styles.bulletRow}>
                  <span style={styles.bulletDot}>◆</span>
                  <span><strong style={{ color: "#0096C7" }}>{c.label}: </strong><span style={{ color: "#C8D8F0" }}>{c.text}</span></span>
                </div>
              ))}
            </div>
          )}

          {slide.type === "checks" && (
            <div style={styles.bulletList}>
              {slide.content.map((c, i) => (
                <div key={i} style={styles.bulletRow}>
                  <span style={{ ...styles.bulletDot, color: "#22C55E" }}>✓</span>
                  <span style={{ color: "#C8D8F0" }}>{c.text}</span>
                </div>
              ))}
            </div>
          )}

          {slide.type === "deliverables" && (
            <div style={styles.delivGrid}>
              {slide.content.map((c, i) => (
                <div key={i} style={styles.delivItem}>
                  <span style={styles.delivNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ color: "#C8D8F0", fontSize: 15 }}>{c.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PLAIN CALLOUT */}
        <div style={{ ...styles.plain, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s" }}>
          <div style={styles.plainBar} />
          <div>
            <span style={styles.plainLabel}>Plain  </span>
            <span style={styles.plainText}>{slide.plain}</span>
          </div>
        </div>
      </div>

      {/* NAV */}
      <div style={styles.nav}>
        <button style={styles.navBtn} onClick={() => transition(Math.max(idx - 1, 0))} disabled={idx === 0}>
          ← Prev
        </button>
        <span style={styles.slideCount}>{idx + 1} / {SLIDES.length}</span>
        <button style={styles.navBtn} onClick={() => transition(Math.min(idx + 1, SLIDES.length - 1))} disabled={idx === SLIDES.length - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}

const googleFonts = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=IBM+Plex+Sans:wght@400;600&family=JetBrains+Mono:wght@500&display=swap');
`;

const styles = {
  shell: {
    width: "100%", minHeight: "100vh",
    background: "#0A1929",
    display: "flex", flexDirection: "column",
    fontFamily: "'IBM Plex Sans', sans-serif",
    color: "#fff",
    overflow: "hidden",
    position: "relative",
  },
  globalBar: {
    position: "relative", height: 3,
    background: "#132340",
  },
  globalFill: {
    height: "100%",
    background: "linear-gradient(90deg, #0096C7, #22C55E)",
    transition: "width 0.3s linear",
  },
  hud: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 24px",
    borderBottom: "1px solid #132340",
    background: "#0D1F35",
  },
  hudLeft: { display: "flex", alignItems: "center", gap: 16 },
  hudRight: { display: "flex", alignItems: "center", gap: 12 },
  hudLabel: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 11, fontWeight: 600,
    color: "#0096C7", letterSpacing: 2, textTransform: "uppercase",
  },
  hudDots: { display: "flex", gap: 5, alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: "50%", display: "inline-block", transition: "background 0.2s" },
  timer: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#8AB4D8" },
  pauseBtn: {
    background: "transparent", border: "1px solid #1A3A5C",
    color: "#8AB4D8", width: 30, height: 30, borderRadius: 6,
    cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
  },
  slideBar: {
    height: 2, background: "#132340",
  },
  slideFill: {
    height: "100%", background: "#0096C7",
  },
  slide: {
    flex: 1, display: "flex", flexDirection: "column",
    padding: "28px 40px 16px",
    gap: 20,
  },
  headlineWrap: {
    borderLeft: "4px solid #0096C7",
    paddingLeft: 16,
  },
  headline: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 38, lineHeight: 1.15,
    color: "#FFFFFF",
    letterSpacing: "-0.5px",
  },
  content: { flex: 1 },

  // Analogy
  analogyGrid: { display: "flex", gap: 16, flexWrap: "wrap" },
  analogyCard: {
    flex: "1 1 180px",
    background: "#0D2040", border: "1px solid #1A3A5C",
    borderRadius: 10, padding: "18px 20px",
    display: "flex", flexDirection: "column", gap: 6,
  },
  analogyIcon: { fontSize: 24 },
  analogyLabel: { fontWeight: 600, fontSize: 14, color: "#0096C7" },
  analogyText: { fontSize: 14, color: "#8AB4D8", lineHeight: 1.4 },

  // Bullets
  bulletList: { display: "flex", flexDirection: "column", gap: 12 },
  bulletRow: {
    display: "flex", gap: 10, alignItems: "flex-start",
    fontSize: 16, lineHeight: 1.5,
  },
  bulletDot: { color: "#0096C7", fontSize: 10, marginTop: 6, flexShrink: 0 },

  // Formulas
  formulaList: { display: "flex", flexDirection: "column", gap: 14 },
  formulaBlock: { display: "flex", flexDirection: "column", gap: 4 },
  formulaTag: {
    fontSize: 11, fontWeight: 600, color: "#0096C7",
    textTransform: "uppercase", letterSpacing: 1.5,
  },
  formulaCode: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 15, color: "#E0F0FF",
    background: "#0D2040",
    border: "1px solid #1A3A5C",
    borderLeft: "4px solid #0096C7",
    padding: "10px 16px",
    borderRadius: "0 6px 6px 0",
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
  },

  // Models
  modelGrid: { display: "flex", gap: 16 },
  modelCard: {
    flex: 1, background: "#0D2040", border: "1px solid #1A3A5C",
    borderRadius: 10, padding: "16px 18px",
    display: "flex", flexDirection: "column", gap: 8,
  },
  modelLabel: { fontWeight: 600, fontSize: 15, color: "#0096C7" },
  modelText: { fontSize: 14, color: "#8AB4D8" },

  // Metrics
  metricsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  metricCard: {
    background: "#0D2040", border: "1px solid #1A3A5C",
    borderRadius: 8, padding: "14px 16px",
  },
  metricName: { fontWeight: 600, fontSize: 16, color: "#0096C7", marginBottom: 4 },
  metricDesc: { fontSize: 14, color: "#8AB4D8" },

  // Deliverables
  delivGrid: { display: "flex", flexDirection: "column", gap: 8 },
  delivItem: {
    display: "flex", gap: 14, alignItems: "center",
    background: "#0D2040", border: "1px solid #1A3A5C",
    borderRadius: 6, padding: "10px 14px",
  },
  delivNum: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12, color: "#0096C7", fontWeight: 600, flexShrink: 0,
  },

  // Plain
  plain: {
    display: "flex", gap: 12, alignItems: "flex-start",
    background: "#071A0E",
    border: "1px solid #1A3D25",
    borderRadius: 6, padding: "12px 16px",
    marginTop: "auto",
  },
  plainBar: { width: 3, borderRadius: 2, background: "#116633", flexShrink: 0, alignSelf: "stretch" },
  plainLabel: { fontWeight: 600, fontSize: 14, color: "#22C55E" },
  plainText: { fontStyle: "italic", fontSize: 14, color: "#6DB88A", lineHeight: 1.5 },

  // Nav
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 24px",
    borderTop: "1px solid #132340",
    background: "#0D1F35",
  },
  navBtn: {
    background: "transparent", border: "1px solid #1A3A5C",
    color: "#8AB4D8", padding: "6px 18px",
    borderRadius: 6, cursor: "pointer",
    fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif",
    transition: "border-color 0.2s, color 0.2s",
  },
  slideCount: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#4A6FA5" },
  startBtn: {
    background: "#0096C7", border: "none", color: "#fff",
    padding: "14px 40px", borderRadius: 8,
    fontSize: 16, fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 600, cursor: "pointer", letterSpacing: 0.5,
    transition: "background 0.2s",
  },
};
