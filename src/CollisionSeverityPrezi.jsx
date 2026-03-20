import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA SCOTIA ROAD SAFETY INTELLIGENCE SYSTEM — V2
// 6-minute timed · Interactive clock & map · Hover animations · No insight boxes
// ═══════════════════════════════════════════════════════════════════════════════

const C = {
  bg: "#0A1929", card: "#0D2040", dark: "#071321",
  border: "#1A3A5C", borderLight: "#132340",
  accent: "#0096C7", green: "#22C55E", red: "#EF4444",
  yellow: "#F59E0B", purple: "#8B5CF6", blue: "#3B82F6",
  white: "#FFFFFF", muted: "#8AB4D8", dim: "#4A6FA5", warm: "#C8D8F0",
};
const F = { serif: "'DM Serif Display',serif", sans: "'IBM Plex Sans',sans-serif", mono: "'JetBrains Mono',monospace" };

// Format to 2 significant digits (e.g. 21.8→22, 0.642→0.64, 33.1→33, 9.8→9.8, 100→100)
function sig2(n) {
  if (n === 0) return "0.0";
  if (n === 100) return "100";
  const d = Math.floor(Math.log10(Math.abs(n))) + 1;
  if (d >= 2) return Number(n.toPrecision(2)).toString();
  return n.toPrecision(2);
}
const fonts = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=IBM+Plex+Sans:wght@400;600&family=JetBrains+Mono:wght@500;600&display=swap');`;

// 6 minutes = 360 seconds across 16 slides
const SLIDE_DURATIONS = [12,18,20,25,24,24,24,28,28,28,24,28,22,22,22,21]; // = 360s
const TOTAL_TIME = SLIDE_DURATIONS.reduce((a,b)=>a+b,0);

// ── HOVER CARD ─────────────────────────────────────────────────────────────────
function HoverCard({ children, style, expandContent }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-4px) scale(1.02)" : "none",
        boxShadow: hovered ? `0 12px 32px rgba(0,150,199,0.15)` : "none",
        zIndex: hovered ? 10 : 1, position: "relative",
        ...style,
      }}
    >
      {children}
      {expandContent && (
        <div style={{
          maxHeight: hovered ? 200 : 0, overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s",
          opacity: hovered ? 1 : 0, padding: hovered ? "0 18px 14px" : "0 18px 0",
        }}>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
            {expandContent}
          </div>
        </div>
      )}
    </div>
  );
}

// ── CLOCK VISUALIZATION ────────────────────────────────────────────────────────
function ClockViz({ data, highlightRange }) {
  const [hoveredHour, setHoveredHour] = useState(null);
  const max = Math.max(...data.map(d => d.v));
  const cx = 160, cy = 160, R = 130, inner = 50;

  return (
    <div style={{ display:"flex", alignItems:"center", gap: 20, flex:1, justifyContent:"center" }}>
      <svg viewBox="0 0 320 320" style={{ width: "100%", maxWidth: 320, height: "auto", flexShrink: 0 }}>
        {/* Face */}
        <circle cx={cx} cy={cy} r={R+8} fill="none" stroke={C.border} strokeWidth={1} />
        <circle cx={cx} cy={cy} r={inner} fill={C.dark} stroke={C.border} strokeWidth={1} />
        {/* Hour labels */}
        {[12,1,2,3,4,5,6,7,8,9,10,11].map((h,i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const lx = cx + (R + 20) * Math.cos(angle);
          const ly = cy + (R + 20) * Math.sin(angle);
          return <text key={h} x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fill={C.dim} fontSize={10} fontFamily={F.mono}>{h}</text>;
        })}
        {/* Bars */}
        {data.map((d, i) => {
          const angle = (i * 15 - 90) * Math.PI / 180;
          const barLen = (d.v / max) * (R - inner - 8);
          const x1 = cx + (inner + 4) * Math.cos(angle);
          const y1 = cy + (inner + 4) * Math.sin(angle);
          const x2 = cx + (inner + 4 + barLen) * Math.cos(angle);
          const y2 = cy + (inner + 4 + barLen) * Math.sin(angle);
          const isHL = highlightRange ? (d.h >= highlightRange[0] || d.h <= highlightRange[1]) && (d.h >= highlightRange[0] && d.h <= (highlightRange[1] < highlightRange[0] ? 23 : highlightRange[1]) || (highlightRange[1] < highlightRange[0] && d.h <= highlightRange[1])) : false;
          const isPeak = d.h >= 19 && d.h <= 22;
          const isHov = hoveredHour === i;
          return (
            <g key={i} onMouseEnter={() => setHoveredHour(i)} onMouseLeave={() => setHoveredHour(null)} style={{ cursor: "pointer" }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isHov ? C.white : isPeak ? C.red : C.accent}
                strokeWidth={isHov ? 6 : 4}
                strokeLinecap="round"
                opacity={isHov ? 1 : isPeak ? 1 : 0.6}
              />
              {isHov && (
                <text x={cx + (inner + barLen + 18) * Math.cos(angle)} y={cy + (inner + barLen + 18) * Math.sin(angle)}
                  textAnchor="middle" dominantBaseline="central"
                  fill={C.white} fontSize={11} fontWeight={600} fontFamily={F.mono}>
                  {d.v}
                </text>
              )}
            </g>
          );
        })}
        {/* Center text */}
        <text x={cx} y={cy-6} textAnchor="middle" fill={C.white} fontSize={18} fontWeight={600} fontFamily={F.mono}>
          {hoveredHour !== null ? data[hoveredHour].v : "200"}
        </text>
        <text x={cx} y={cy+12} textAnchor="middle" fill={C.dim} fontSize={9} fontFamily={F.sans}>
          {hoveredHour !== null ? `${data[hoveredHour].h}:00` : "total strikes"}
        </text>
      </svg>
      {/* Legend - below clock */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 120 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 4, background: C.red, borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: C.muted }}>Peak (7–10 PM)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 4, background: C.accent, borderRadius: 2, opacity: 0.6 }} />
          <span style={{ fontSize: 11, color: C.dim }}>Other hours</span>
        </div>
        <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>Hover a spoke for count</div>
      </div>
    </div>
  );
}

// ── SLIDES ──────────────────────────────────────────────────────────────────────
const SLIDES = [
  // 0: TITLE
  { id:0, label:"TITLE", type:"title",
    headline:"Nova Scotia Road Safety\nIntelligence System",
    subtitle:"2,068 Collisions · 79 Features · 6 Driver Archetypes · Kodi & Shklanka" },
  // 1: THE QUESTION
  { id:1, label:"01  THE QUESTION", type:"question",
    headline:"What Drives\nCollision Severity?",
    content:{
      question:"What factors are associated with higher motor vehicle collision severity on provincial highways in Nova Scotia?",
      cards:[
        {label:"Not predicting IF",text:"a collision will occur — that's a different problem entirely",expand:"We model severity conditional on a collision already happening. This keeps the analysis grounded in observable events."},
        {label:"Predicting WHICH",text:"collisions become severe once they happen",expand:"Binary classification: severe (fatality/major injury) vs. non-severe. 21.8% of our dataset is severe."},
        {label:"Understanding WHY",text:"terrain, weather, behavior, and timing combine to elevate risk",expand:"79 features capture the full context: road geometry, surface conditions, driver flags, traffic volumes, and weather at collision time."},
      ]
    }},
  // 2: DATA
  { id:2, label:"02  DATA", type:"data",
    headline:"Three Datasets.\nOne Intelligence Layer.",
    content:{
      datasets:[
        {icon:"🚗",label:"Collision Records",value:"2,068",detail:"Provincial corridor incidents — each with 79 features capturing road, weather, behavior, and outcome",expand:"Sourced from Nova Scotia Open Data. Includes severity classification, road geometry (curves, grades), driver behavioral flags (aggression, distraction, impairment), and collision configuration."},
        {icon:"📊",label:"Traffic Exposure",value:"AADT",detail:"Annual average daily traffic and truck percentages by route segment",expand:"Normalizes collision rates so high-volume corridors like Hwy 102 aren't unfairly compared to rural routes with 1/10th the traffic."},
        {icon:"🌦️",label:"Weather Context",value:"7 conditions",detail:"Clear, overcast, rain, snow, freezing rain, fog, strong wind at collision time",expand:"Weather isn't just precipitation — it shapes road surface, visibility, and driver behavior. Our model treats weather as a context multiplier, not just a standalone variable."},
      ],
      stats:[
        {label:"Severe Rate",value:"21.8%",sub:"450 of 2,068 collisions",expand:"This class imbalance means accuracy is misleading — we use AUC-ROC for evaluation."},
        {label:"Routes",value:"24",sub:"Provincial corridors covered",expand:"From Hwy 102 (557 collisions) to rural connectors like Hwy 224 (24 collisions)."},
        {label:"Time Span",value:"2024–26",sub:"~2 years of collision data",expand:"Captures full seasonal cycles including two winters and two summers."},
        {label:"Features",value:"79",sub:"Per collision record",expand:"Engineered features include traffic×visibility interactions, weekend flags, rush-hour indicators, and terrain composites."},
      ]
    }},
  // 3: ARCHETYPES OVERVIEW
  { id:3, label:"03  ARCHETYPES", type:"archetypes",
    headline:"Six Driver Archetypes\nEmerge from the Data",
    content:{
      method:"K-means clustering on 17 behavioral, environmental, and temporal features. The data told us who these drivers are.",
      archetypes:[
        {icon:"📱",name:"The Distracted Commuter",pct:"7.7%",severe:"33.1%",color:C.yellow,tag:"DEADLIEST",desc:"Think: texting at 110 km/h on the 102. One glance down, rear-end at full speed."},
        {icon:"🏎️",name:"The Aggressive Tailgater",pct:"19.0%",severe:"25.7%",color:C.red,tag:"MOST COMMON RISK",desc:"Following too close on the highway during commute hours. The 'I'm late for work' crash."},
        {icon:"🦌",name:"The Wildlife Encounter",pct:"9.5%",severe:"10.7%",color:C.green,tag:"LOWEST SEVERITY",desc:"November, 9 PM, Highway 7 — a deer steps out. The driver swerves, not crashes head-on."},
        {icon:"❄️",name:"The Winter Road Warrior",pct:"16.2%",severe:"18.0%",color:C.blue,tag:"EXPECTED",desc:"Ice, curves, and a single car sliding off the highway. Nova Scotians expect winter — and mostly adapt."},
        {icon:"🌙",name:"The Late Night Risk Taker",pct:"6.8%",severe:"32.1%",color:C.purple,tag:"2ND DEADLIEST",desc:"Saturday, 1 AM, dark highway — impairment 10× the average. Young, alone, off the road."},
        {icon:"🚗",name:"The Everyday Commuter",pct:"40.8%",severe:"20.1%",color:"#6B7280",tag:"BASELINE",desc:"No standout flag. Just the background risk of driving Nova Scotian highways every day."},
      ]
    }},
  // 4: DISTRACTED COMMUTER
  { id:4, label:"04  📱 DISTRACTED", type:"archetype_deep",
    headline:"The Distracted\nCommuter",
    content:{
      icon:"📱",color:C.yellow,
      narrative:"Picture this: a driver on Highway 102, Thursday afternoon, phone buzzing. They glance down for two seconds at 110 km/h — that's 61 meters of road covered blind. The car ahead brakes. Rear-end. Severe.",
      stats:[
        {label:"Distraction Flag",value:"100%",ctx:"vs 7.9% overall — this IS the distraction cluster",expand:"Every collision in this archetype was flagged for driver distraction. It's not a contributing factor — it's the defining feature."},
        {label:"Severity Rate",value:"33.1%",ctx:"Highest of all 6 archetypes",expand:"1 in 3 distracted-commuter collisions results in fatality or major injury. Highway speeds leave zero margin for error."},
        {label:"Aggressive Driving",value:"57.5%",ctx:"Distraction + aggression compound",expand:"Over half are also flagged for aggressive driving — speeding while distracted is the lethal combination."},
        {label:"Young Drivers",value:"31%",ctx:"Overrepresented in the cluster",expand:"Young drivers are 1.3× more likely to appear in this cluster than in the general population."},
      ],
      policy:"Targeted distraction enforcement on Hwy 102 and 103 during weekday business hours could reach this exact population."
    }},
  // 5: LATE NIGHT
  { id:5, label:"05  🌙 NIGHT RISK", type:"archetype_deep",
    headline:"The Late Night\nRisk Taker",
    content:{
      icon:"🌙",color:C.purple,
      narrative:"Saturday night. A 22-year-old leaves a gathering, takes Highway 7 home. Dark, winding, no streetlights. Impairment slows reaction time. The car drifts right, hits gravel, overcorrects — off the road. Single vehicle. Severe.",
      stats:[
        {label:"Impairment Rate",value:"32.1%",ctx:"10.7× the dataset average of 3.0%",expand:"Nearly 1 in 3 drivers in this archetype were flagged for impairment — alcohol or drugs were a documented factor."},
        {label:"Late Night",value:"80%",ctx:"10 PM – 3 AM window",expand:"Four out of five of these collisions happen in the deepest part of the night when traffic is thin but individual risk is extreme."},
        {label:"Darkness",value:"89%",ctx:"Near-total darkness at time of crash",expand:"Reduced visibility compounds impairment — the two factors multiply each other rather than just adding."},
        {label:"Young Drivers",value:"42%",ctx:"Highest youth concentration",expand:"The 18-25 demographic is dramatically overrepresented. This is the young male weekend pattern."},
      ],
      policy:"Friday/Saturday night impaired driving checkpoints on Highway 7 and rural 100-series connectors."
    }},
  // 6: WINTER WARRIOR
  { id:6, label:"06  ❄️ WINTER", type:"archetype_deep",
    headline:"The Winter\nRoad Warrior",
    content:{
      icon:"❄️",color:C.blue,
      narrative:"February morning, freezing rain overnight. A driver crests a hill on Highway 103, hits black ice on a curve. Tires break traction. Single vehicle, off-road to the right. But here's the thing — severity is only 18%. Most Nova Scotians know to slow down when it's obviously bad.",
      stats:[
        {label:"Winter Surface",value:"94%",ctx:"Ice, fresh snow, packed snow, or wet snow",expand:"Nearly every collision in this archetype involves compromised road surfaces — this is the defining environmental condition."},
        {label:"Adverse Weather",value:"72%",ctx:"Snow, freezing rain, or fog at time of crash",expand:"Active precipitation or fog was present in almost three-quarters of these events."},
        {label:"Curved Roads",value:"40%",ctx:"1.5× the overall curve rate of 26%",expand:"Curves amplify loss-of-control risk when traction is reduced — the physics are unforgiving."},
        {label:"Severity Rate",value:"18.0%",ctx:"BELOW baseline — defensive driving works",expand:"Counter-intuitive but revealing: when conditions are obviously dangerous, drivers compensate. The real danger is when conditions deteriorate suddenly."},
      ],
      policy:"Enhanced curve delineation and variable speed limits during freeze-thaw transitions on graded highway sections."
    }},
  // 7: WILDLIFE
  { id:7, label:"07  🦌 WILDLIFE", type:"wildlife",
    headline:"Wildlife on\nthe Road",
    content:{
      narrative:"200 collisions. Nearly 1 in 10. And they follow a calendar — November peaks at 38 strikes (deer rut) and May-June surges to 50 (spring emergence). The clock tells the rest: 8-10 PM is the strike zone.",
      hourData:[
        {h:0,v:6},{h:1,v:3},{h:2,v:5},{h:3,v:3},{h:4,v:8},{h:5,v:2},{h:6,v:8},{h:7,v:8},{h:8,v:12},{h:9,v:10},
        {h:10,v:7},{h:11,v:7},{h:12,v:7},{h:13,v:7},{h:14,v:3},{h:15,v:5},{h:16,v:7},{h:17,v:13},{h:18,v:10},
        {h:19,v:6},{h:20,v:17},{h:21,v:21},{h:22,v:16},{h:23,v:9}
      ],
      monthData:[
        {m:"Jan",v:10},{m:"Feb",v:5},{m:"Mar",v:14},{m:"Apr",v:6},{m:"May",v:24},{m:"Jun",v:26},
        {m:"Jul",v:19},{m:"Aug",v:12},{m:"Sep",v:11},{m:"Oct",v:26},{m:"Nov",v:38},{m:"Dec",v:9}
      ],
      stats:[
        {label:"Peak Hour",value:"9 PM",ctx:"21 collisions — the dusk-to-dark transition"},
        {label:"Peak Month",value:"November",ctx:"38 incidents — deer rut season"},
        {label:"In Darkness",value:"51%",ctx:"101 of 200 in full darkness"},
        {label:"Severe Rate",value:"11%",ctx:"Drivers swerve, not crash head-on"},
      ]
    }},
  // 8: TERRAIN
  { id:8, label:"08  TERRAIN", type:"terrain",
    headline:"The Road Itself\nIs a Risk Factor",
    content:{
      narrative:"A straight, flat road forgives mistakes. A curve on a slope does not. Single-vehicle crashes on curves have a 29.9% severity rate — the highest terrain-specific risk in the dataset. Rollovers hit 58.5%.",
      bars:[
        {label:"Curved + Level",rate:0.281,n:281,color:C.red},
        {label:"Curved + Graded",rate:0.250,n:256,color:C.yellow},
        {label:"Straight + Graded",rate:0.205,n:346,color:C.blue},
        {label:"Flat + Straight",rate:0.199,n:1185,color:"#6B7280"},
      ],
      types:[
        {type:"Rollover",rate:0.585},{type:"Head-On",rate:0.467},{type:"Right Angle",rate:0.474},
        {type:"Off Road (R)",rate:0.310},{type:"Rear End",rate:0.200},{type:"Sideswipe",rate:0.094},
      ],
      curveStats:{curved:0.299,straight:0.225}
    }},
  // 9: VISIBILITY
  { id:9, label:"09  VISIBILITY", type:"visibility",
    headline:"Visibility, Seasons,\nand the Danger Window",
    content:{
      narrative:"Here's the surprise: September has the highest severity rate at 29.3% — not January. And dusk (27.5%) is deadlier than full darkness. When conditions are obviously bad, people slow down. When they look fine but aren't, that's when severity spikes.",
      lightBars:[
        {label:"Dusk",rate:0.275,color:C.yellow},{label:"Daylight",rate:0.219,color:C.green},
        {label:"Darkness",rate:0.212,color:C.purple},{label:"Dawn",rate:0.183,color:C.blue},
      ],
      monthlyRates:[
        {m:"Jan",r:0.218},{m:"Feb",r:0.171},{m:"Mar",r:0.172},{m:"Apr",r:0.219},
        {m:"May",r:0.284},{m:"Jun",r:0.265},{m:"Jul",r:0.253},{m:"Aug",r:0.238},
        {m:"Sep",r:0.293},{m:"Oct",r:0.230},{m:"Nov",r:0.144},{m:"Dec",r:0.162}
      ]
    }},
  // 10: DST
  { id:10, label:"10  DST POLICY", type:"dst",
    headline:"Daylight Savings:\nA Policy Question",
    content:{
      narrative:"When the clocks change, so do collision patterns. Fall-back creates 80% more collisions than spring-forward — a sudden shift to dark commutes. And midnight sits at 37.9% severity, the highest single hour.",
      comparison:[
        {label:"Spring Forward (Mar)",collisions:51,rate:0.098,detail:"Sleep disruption, but fewer severe outcomes",color:C.yellow},
        {label:"Fall Back (Nov)",collisions:92,rate:0.174,detail:"80% more collisions than spring — sudden darkness shift",color:C.red},
        {label:"Baseline (non-DST)",collisions:1925,rate:0.223,detail:"Normal severity rate across the year",color:"#6B7280"},
      ],
      peaks:[
        {label:"Midnight",rate:0.379,note:"Highest hourly severity"},
        {label:"10 AM",rate:0.305,note:"Mid-morning off-peak"},
        {label:"1 AM",rate:0.296,note:"Impairment window"},
        {label:"7 PM",rate:0.282,note:"Evening transition"},
      ]
    }},
  // 11: ROUTES
  { id:11, label:"11  HOTSPOTS", type:"routes",
    headline:"The Most Dangerous\nCorridors",
    content:{
      narrative:"Highway 333 — the winding coastal road to Peggy's Cove — has a 37.2% severity rate. That's nearly double Hwy 102's 21.4%, despite having 5× fewer collisions. Volume and severity tell very different stories.",
      routes:[
        {label:"Hwy 333",total:113,rate:0.372,desc:"Winding coastal — Peggy's Cove corridor",color:C.red},
        {label:"Hwy 2",total:30,rate:0.367,desc:"Rural arterial — low AADT, high severity",color:C.red},
        {label:"Hwy 224",total:24,rate:0.333,desc:"Inland connector — curves and grades",color:C.yellow},
        {label:"Hwy 7",total:135,rate:0.267,desc:"Eastern Shore — long rural stretches",color:C.yellow},
        {label:"Hwy 107",total:95,rate:0.263,desc:"Dartmouth connector — mixed terrain",color:C.blue},
        {label:"Hwy 102",total:557,rate:0.214,desc:"Halifax–Truro — highest volume corridor",color:C.accent},
      ]
    }},
  // 12: MAP
  { id:12, label:"12  MAP", type:"map",
    headline:"Explore the\nCollision Landscape",
    content:{} },
  // 13: MODEL
  { id:13, label:"13  MODEL", type:"model",
    headline:"XGBoost Leads.\nThe Story Is Nuanced.",
    content:{
      narrative:"XGBoost captures nonlinear interactions between weather, traffic, and terrain that simpler models miss. But even the best model achieves moderate discrimination — because severe and non-severe collisions overlap heavily in feature space. This is a risk-ranking tool, not a crystal ball.",
      models:[
        {name:"XGBoost",auc:0.642,desc:"Captures weather × traffic interactions",color:C.green},
        {name:"Logistic Reg.",auc:0.604,desc:"Transparent linear baseline",color:C.accent},
        {name:"Random Forest",auc:0.574,desc:"Flexible but weaker generalization",color:C.yellow},
      ],
      predictors:[
        {name:"Temperature",imp:0.95,desc:"Freeze-thaw, black ice cycles"},
        {name:"Wind Speed",imp:0.82,desc:"Vehicle stability at speed"},
        {name:"N Vehicles",imp:0.75,desc:"Multi-vehicle severity amplifier"},
        {name:"Traffic × Vis",imp:0.68,desc:"High traffic + low visibility"},
        {name:"Traffic × Precip",imp:0.62,desc:"Volume + rain/snow"},
        {name:"AADT",imp:0.55,desc:"Base exposure level"},
      ]
    }},
  // 14: FINDINGS
  { id:14, label:"14  FINDINGS", type:"findings",
    headline:"Five Things Nova Scotia\nShould Know",
    content:[
      {num:"01",title:"Summer Is Deadlier Than Winter",text:"May–Sep: 25–29% severity. Nov–Mar: 14–22%. When it's obviously bad, drivers slow down. Complacency at speed is the real killer.",color:C.red},
      {num:"02",title:"Dusk Is the Danger Window",text:"27.5% severity — higher than full darkness or daylight. The rapid light transition catches drivers on curved rural highways.",color:C.yellow},
      {num:"03",title:"Curves Kill Disproportionately",text:"29.9% severity for single-vehicle curve crashes vs 22.5% straight. Combined with grades, curves become unforgiving.",color:C.purple},
      {num:"04",title:"Distraction Outranks Impairment",text:"33.1% severity vs 32.1%. But distraction is 3× more prevalent — 7.9% of all collisions vs 3.0% impaired.",color:C.blue},
      {num:"05",title:"Wildlife Has a Calendar",text:"November (deer rut) and May-June (spring emergence) = 44% of animal collisions. 8–10 PM is the strike zone.",color:C.green},
    ]},
  // 15: CONCLUSION
  { id:15, label:"15  CONCLUSION", type:"conclusion",
    headline:"Not Prediction.\nPrioritization.",
    content:{
      closing:"This system identifies where attention should go. Severe collision risk is shaped by the intersection of environment, exposure, and behavior — and their combinations create actionable risk signatures.",
      callouts:[
        {label:"Best Model",value:"XGBoost · AUC 0.642"},
        {label:"Strongest Signal",value:"Weather × Traffic interactions"},
        {label:"Biggest Surprise",value:"Summer > Winter for severity"},
        {label:"Actionable Now",value:"6 archetypes → 5 policy levers"},
      ]
    }},
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CollisionPrezi() {
  const [idx, setIdx] = useState(0);
  const [entered, setEntered] = useState(false);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const elapsedRef = useRef(0);

  const slide = SLIDES[idx];
  const dur = SLIDE_DURATIONS[idx];
  const totalElapsed = SLIDE_DURATIONS.slice(0,idx).reduce((a,b)=>a+b,0);

  const transition = useCallback((newIdx) => {
    if (newIdx < 0 || newIdx >= SLIDES.length) return;
    setVisible(false);
    setTimeout(() => {
      setIdx(newIdx); setProgress(0); elapsedRef.current = 0;
      startRef.current = Date.now(); setVisible(true);
    }, 200);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (paused || !entered) return;
    startRef.current = Date.now() - elapsedRef.current * dur * 1000;
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const pct = Math.min(elapsed / dur, 1);
      elapsedRef.current = pct;
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(timerRef.current);
        if (idx < SLIDES.length - 1) transition(idx + 1);
      }
    }, 50);
    return () => clearInterval(timerRef.current);
  }, [idx, paused, entered, dur, transition]);

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); transition(idx + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); transition(idx - 1); }
      if (e.key === " ") { e.preventDefault(); setPaused(p => !p); }
      if (e.key === "Escape") transition(0);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [idx, transition]);

  const totalSecs = totalElapsed + Math.floor(progress * dur);
  const mins = String(Math.floor(totalSecs / 60)).padStart(2,"0");
  const secs = String(totalSecs % 60).padStart(2,"0");
  const globalPct = (totalElapsed + progress * dur) / TOTAL_TIME;

  // ── LANDING ──
  if (!entered) {
    return (
      <div style={S.shell}>
        <style>{fonts}{hoverCSS}</style>
        <div style={{...S.shell,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:28}}>
          <div style={{fontSize:11,color:C.accent,letterSpacing:4,textTransform:"uppercase",fontFamily:F.sans,fontWeight:600}}>Kodi & Shklanka · Provincial Corridor Analysis</div>
          <div style={{fontFamily:F.serif,fontSize:48,color:"#fff",textAlign:"center",lineHeight:1.15,maxWidth:700}}>
            Nova Scotia Road Safety<br/><span style={{color:C.accent}}>Intelligence System</span>
          </div>
          <div style={{fontFamily:F.sans,fontSize:15,color:C.muted,maxWidth:520,textAlign:"center",lineHeight:1.6}}>
            2,068 collisions · 79 features · 6 driver archetypes<br/>
            XGBoost severity model · 6-minute guided presentation
          </div>
          <button className="start-btn" style={S.startBtn} onClick={() => {setEntered(true);startRef.current=Date.now();}}>
            Begin Presentation →
          </button>
          <div style={{fontFamily:F.mono,fontSize:12,color:C.dim}}>
            ← → to navigate · Space to pause · ESC to restart
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.shell}>
      <style>{fonts}{hoverCSS}</style>
      {/* HUD */}
      <div style={S.hud}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <span style={S.hudLabel}>{slide.label}</span>
          <span style={{display:"flex",gap:3}}>
            {SLIDES.map((_,i) => (
              <span key={i} onClick={() => transition(i)} style={{
                width:i===idx?18:6,height:6,borderRadius:3,cursor:"pointer",transition:"all 0.2s",
                background:i===idx?C.accent:i<idx?"#1A5FA8":"#2A3F60",
              }} />
            ))}
          </span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontFamily:F.mono,fontSize:13,color:C.muted}}>{mins}:{secs} <span style={{color:C.dim}}>/ 6:00</span></span>
          <button className="pause-btn" onClick={() => setPaused(p => !p)} style={S.pauseBtn}>{paused ? "▶" : "⏸"}</button>
        </div>
      </div>
      {/* Progress bars */}
      <div style={{height:2,background:C.borderLight}}>
        <div style={{height:"100%",width:`${globalPct*100}%`,background:`linear-gradient(90deg,${C.accent},${C.green})`,transition:"width 0.3s linear"}} />
      </div>
      <div style={{height:2,background:C.borderLight}}>
        <div style={{height:"100%",width:`${progress*100}%`,background:C.accent,transition:paused?"none":"width 0.05s linear"}} />
      </div>
      {/* Content */}
      <div style={{...S.slideWrap,opacity:visible?1:0,transform:visible?"none":"translateY(8px)",transition:"opacity 0.2s ease, transform 0.2s ease"}}>
        {renderSlide(slide)}
      </div>
      {/* Nav */}
      <div style={S.nav}>
        <button className="nav-btn" style={S.navBtn} onClick={() => transition(idx-1)} disabled={idx===0}>← Prev</button>
        <span style={{fontFamily:F.mono,fontSize:13,color:C.dim}}>{idx+1} / {SLIDES.length}</span>
        <button className="nav-btn" style={S.navBtn} onClick={() => transition(idx+1)} disabled={idx===SLIDES.length-1}>Next →</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDERERS
// ═══════════════════════════════════════════════════════════════════════════════
function renderSlide(s) {
  switch(s.type) {
    case "title": return <TitleSlide s={s}/>;
    case "question": return <QuestionSlide s={s}/>;
    case "data": return <DataSlide s={s}/>;
    case "archetypes": return <ArchetypesSlide s={s}/>;
    case "archetype_deep": return <ArchetypeDeepSlide s={s}/>;
    case "wildlife": return <WildlifeSlide s={s}/>;
    case "terrain": return <TerrainSlide s={s}/>;
    case "visibility": return <VisibilitySlide s={s}/>;
    case "dst": return <DSTSlide s={s}/>;
    case "routes": return <RoutesSlide s={s}/>;
    case "map": return <MapSlide s={s}/>;
    case "model": return <ModelSlide s={s}/>;
    case "findings": return <FindingsSlide s={s}/>;
    case "conclusion": return <ConclusionSlide s={s}/>;
    default: return null;
  }
}

function Headline({text,center}) {
  return (
    <div style={{borderLeft:center?"none":`4px solid ${C.accent}`,paddingLeft:center?0:16,textAlign:center?"center":"left"}}>
      <div style={{fontFamily:F.serif,fontSize:34,lineHeight:1.15,color:"#fff",letterSpacing:"-0.5px"}}>
        {text.split("\n").map((l,i,a) => <span key={i}>{l}{i<a.length-1?<br/>:null}</span>)}
      </div>
    </div>
  );
}

function Narrative({text,color}) {
  return (
    <div style={{fontSize:14,color:color||C.warm,lineHeight:1.7,fontFamily:F.sans,maxWidth:800}}>{text}</div>
  );
}

// ── TITLE ──
function TitleSlide({s}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:20}}>
      <Headline text={s.headline} center />
      <div style={{fontFamily:F.sans,fontSize:15,color:C.muted,letterSpacing:1}}>{s.subtitle}</div>
    </div>
  );
}

// ── QUESTION ──
function QuestionSlide({s}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20,flex:1}}>
      <Headline text={s.headline} />
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${C.accent}`,borderRadius:8,padding:"18px 22px"}}>
        <div style={{fontFamily:F.sans,fontSize:15,color:C.warm,lineHeight:1.7,fontStyle:"italic"}}>"{s.content.question}"</div>
      </div>
      <div style={{display:"flex",gap:14}}>
        {s.content.cards.map((c,i) => (
          <HoverCard key={i} style={{flex:1,padding:"16px 18px"}} expandContent={c.expand}>
            <div style={{padding:"16px 18px"}}>
              <div style={{fontSize:12,fontWeight:600,color:C.accent,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>{c.label}</div>
              <div style={{fontSize:14,color:C.warm}}>{c.text}</div>
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}

// ── DATA ──
function DataSlide({s}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,flex:1}}>
      <Headline text={s.headline} />
      <div style={{display:"flex",gap:14}}>
        {s.content.datasets.map((d,i) => (
          <HoverCard key={i} style={{flex:1}} expandContent={d.expand}>
            <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:8}}>
              <div style={{fontSize:28}}>{d.icon}</div>
              <div style={{fontSize:12,fontWeight:600,color:C.accent,letterSpacing:1,textTransform:"uppercase"}}>{d.label}</div>
              <div style={{fontFamily:F.mono,fontSize:24,color:"#fff",fontWeight:600}}>{d.value}</div>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.5}}>{d.detail}</div>
            </div>
          </HoverCard>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
        {s.content.stats.map((st,i) => (
          <HoverCard key={i} expandContent={st.expand}>
            <div style={{padding:"14px 16px",textAlign:"center"}}>
              <div style={{fontFamily:F.mono,fontSize:26,color:C.accent,fontWeight:600}}>{st.value}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:2}}>{st.label}</div>
              <div style={{fontSize:11,color:C.dim}}>{st.sub}</div>
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}

// ── ARCHETYPES OVERVIEW ──
function ArchetypesSlide({s}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,flex:1}}>
      <Headline text={s.headline} />
      <div style={{fontSize:13,color:C.muted}}>{s.content.method}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,flex:1}}>
        {s.content.archetypes.map((a,i) => (
          <HoverCard key={i} style={{borderLeft:`4px solid ${a.color}`}} expandContent={a.desc}>
            <div style={{padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:22}}>{a.icon}</span>
                <span style={{fontSize:9,fontWeight:600,color:a.color,background:`${a.color}15`,padding:"2px 8px",borderRadius:4,letterSpacing:0.5}}>{a.tag}</span>
              </div>
              <div style={{fontSize:14,fontWeight:600,color:"#fff",marginTop:6}}>{a.name}</div>
              <div style={{display:"flex",gap:12,marginTop:6}}>
                <div><span style={{fontFamily:F.mono,fontSize:13,color:C.muted}}>{a.pct}</span><span style={{fontSize:10,color:C.dim}}> of all</span></div>
                <div><span style={{fontFamily:F.mono,fontSize:13,color:a.color,fontWeight:600}}>{a.severe}</span><span style={{fontSize:10,color:C.dim}}> severe</span></div>
              </div>
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}

// ── ARCHETYPE DEEP ──
function ArchetypeDeepSlide({s}) {
  const c = s.content;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,flex:1}}>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <span style={{fontSize:40}}>{c.icon}</span>
        <Headline text={s.headline} />
      </div>
      <Narrative text={c.narrative} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {c.stats.map((st,i) => (
          <HoverCard key={i} expandContent={st.expand}>
            <div style={{padding:"14px 18px"}}>
              <div style={{fontFamily:F.mono,fontSize:30,color:c.color,fontWeight:600}}>{st.value}</div>
              <div style={{fontSize:13,color:"#fff",fontWeight:600,marginTop:2}}>{st.label}</div>
              <div style={{fontSize:12,color:C.muted}}>{st.ctx}</div>
            </div>
          </HoverCard>
        ))}
      </div>
      <div style={{fontSize:13,color:c.color,fontWeight:600,fontFamily:F.sans,marginTop:"auto",padding:"10px 16px",background:`${c.color}10`,borderRadius:6,borderLeft:`3px solid ${c.color}`}}>{c.policy}</div>
    </div>
  );
}

// ── WILDLIFE ──
function WildlifeSlide({s}) {
  const c = s.content;
  const maxM = Math.max(...c.monthData.map(d => d.v));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12,flex:1}}>
      <Headline text={s.headline} />
      <Narrative text={c.narrative} />
      <div style={{display:"flex",gap:14,flex:1,minHeight:0}}>
        {/* CLOCK */}
        <div style={{...cardStyle,flex:1,padding:"14px 16px",display:"flex",flexDirection:"column"}}>
          <div style={{fontSize:11,color:C.accent,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Strikes by Hour</div>
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <ClockViz data={c.hourData} highlightRange={[19,22]} />
          </div>
        </div>
        {/* MONTH - expanded to fill with pixel heights */}
        <div style={{...cardStyle,flex:1,padding:"14px 16px",display:"flex",flexDirection:"column"}}>
          <div style={{fontSize:11,color:C.accent,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Strikes by Month</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:6,flex:1,minHeight:200,paddingBottom:4}}>
            {c.monthData.map((d,i) => {
              const isPeak = d.m==="Nov"||d.m==="May"||d.m==="Jun"||d.m==="Oct";
              const barH = Math.max(8, (d.v / maxM) * 200);
              return (
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,justifyContent:"flex-end"}}>
                  <span style={{fontSize:11,color:isPeak?C.red:C.muted,fontWeight:isPeak?700:400,fontFamily:F.mono}}>{d.v}</span>
                  <div style={{width:"100%",maxWidth:32,background:isPeak?C.red:C.green,borderRadius:"3px 3px 0 0",height:barH,transition:"height 0.3s"}} />
                  <span style={{fontSize:10,color:C.dim,fontWeight:500}}>{d.m}</span>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:14,marginTop:4}}>
            <span style={{fontSize:10,color:C.red}}>■ Peak months</span>
            <span style={{fontSize:10,color:C.green}}>■ Other months</span>
          </div>
        </div>
      </div>
      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
        {c.stats.map((f,i) => (
          <HoverCard key={i}>
            <div style={{padding:"10px 14px",textAlign:"center"}}>
              <div style={{fontFamily:F.mono,fontSize:20,color:C.green,fontWeight:600}}>{f.value}</div>
              <div style={{fontSize:11,color:"#fff",fontWeight:600}}>{f.label}</div>
              <div style={{fontSize:10,color:C.dim,marginTop:2,lineHeight:1.3}}>{f.ctx}</div>
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}

// ── TERRAIN ──
function TerrainSlide({s}) {
  const c = s.content;
  const maxR = Math.max(...c.bars.map(b=>b.rate));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,flex:1}}>
      <Headline text={s.headline} />
      <Narrative text={c.narrative} />
      <div style={{display:"flex",gap:14,flex:1}}>
        <div style={{...cardStyle,flex:1,padding:"16px 18px"}}>
          <div style={labelStyle}>Severity by Terrain</div>
          {c.bars.map((b,i) => (
            <div key={i} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:13,color:"#fff"}}>{b.label}</span>
                <span style={{fontFamily:F.mono,fontSize:14,color:b.color,fontWeight:600}}>{sig2(b.rate*100)}%</span>
              </div>
              <div style={{height:10,background:C.dark,borderRadius:5}}>
                <div style={{height:"100%",width:`${(b.rate/maxR)*100}%`,background:b.color,borderRadius:5,transition:"width 0.5s"}} />
              </div>
              <span style={{fontSize:10,color:C.dim}}>n = {b.n}</span>
            </div>
          ))}
          <div style={{display:"flex",gap:16,marginTop:8,padding:"10px 0",borderTop:`1px solid ${C.border}`}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:F.mono,fontSize:24,color:C.red,fontWeight:600}}>{sig2(c.curveStats.curved*100)}%</div>
              <div style={{fontSize:11,color:C.muted}}>Curves (single veh.)</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:F.mono,fontSize:24,color:"#6B7280"}}>{sig2(c.curveStats.straight*100)}%</div>
              <div style={{fontSize:11,color:C.muted}}>Straight (single veh.)</div>
            </div>
          </div>
        </div>
        <div style={{...cardStyle,flex:1,padding:"16px 18px"}}>
          <div style={labelStyle}>Collision Type Severity</div>
          {c.types.map((ct,i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <span style={{fontSize:13,color:C.warm,width:90}}>{ct.type}</span>
              <div style={{flex:1,height:8,background:C.dark,borderRadius:4}}>
                <div style={{height:"100%",width:`${ct.rate*100}%`,background:ct.rate>0.4?C.red:ct.rate>0.25?C.yellow:C.accent,borderRadius:4,transition:"width 0.5s"}} />
              </div>
              <span style={{fontFamily:F.mono,fontSize:13,color:ct.rate>0.4?C.red:C.muted,fontWeight:600,width:45,textAlign:"right"}}>{sig2(ct.rate*100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── VISIBILITY ──
function VisibilitySlide({s}) {
  const c = s.content;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,flex:1}}>
      <Headline text={s.headline} />
      <Narrative text={c.narrative} />
      <div style={{display:"flex",gap:14,flex:1}}>
        <div style={{...cardStyle,flex:1,padding:"16px 18px"}}>
          <div style={labelStyle}>Severity by Light Condition</div>
          {c.lightBars.map((b,i) => (
            <div key={i} style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:15,color:"#fff",fontWeight:500}}>{b.label}</span>
                <span style={{fontFamily:F.mono,fontSize:18,color:b.color,fontWeight:600}}>{sig2(b.rate*100)}%</span>
              </div>
              <div style={{height:18,background:C.dark,borderRadius:8}}>
                <div style={{height:"100%",width:`${(b.rate/0.30)*100}%`,background:b.color,borderRadius:8,transition:"width 0.5s"}} />
              </div>
            </div>
          ))}
        </div>
        <div style={{...cardStyle,flex:1.4,padding:"16px 18px",display:"flex",flexDirection:"column"}}>
          <div style={labelStyle}>Monthly Severity Rate</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:5,flex:1,minHeight:200,paddingBottom:4}}>
            {c.monthlyRates.map((d,i) => {
              const isSummer = i>=4 && i<=8;
              const maxRate = 0.30;
              const barH = Math.max(8, (d.r / maxRate) * 200);
              return (
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,justifyContent:"flex-end"}}>
                  <span style={{fontSize:10,color:isSummer?C.red:C.muted,fontWeight:isSummer?600:400,fontFamily:F.mono}}>{sig2(d.r*100)}%</span>
                  <div style={{width:"100%",background:isSummer?C.red:C.blue,borderRadius:"3px 3px 0 0",height:barH,opacity:isSummer?1:0.6,transition:"height 0.3s"}} />
                  <span style={{fontSize:9,color:C.dim}}>{d.m}</span>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:14,marginTop:4}}>
            <span style={{fontSize:10,color:C.red}}>■ May–Sep (danger corridor)</span>
            <span style={{fontSize:10,color:C.blue,opacity:0.6}}>■ Oct–Apr</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DST ──
function DSTSlide({s}) {
  const c = s.content;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,flex:1}}>
      <Headline text={s.headline} />
      <Narrative text={c.narrative} />
      <div style={{display:"flex",gap:12}}>
        {c.comparison.map((d,i) => (
          <HoverCard key={i} style={{flex:1,borderLeft:`4px solid ${d.color}`}} expandContent={d.detail}>
            <div style={{padding:"16px 18px"}}>
              <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>{d.label}</div>
              <div style={{fontFamily:F.mono,fontSize:32,color:d.color,fontWeight:600,marginTop:4}}>{d.collisions}</div>
              <div style={{fontSize:12,color:C.muted}}>collisions · <span style={{color:d.color,fontWeight:600}}>{sig2(d.rate*100)}%</span> severe</div>
            </div>
          </HoverCard>
        ))}
      </div>
      <div style={{...cardStyle,padding:"16px 18px"}}>
        <div style={labelStyle}>Highest Severity Hours</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
          {c.peaks.map((h,i) => (
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontFamily:F.mono,fontSize:28,color:C.purple,fontWeight:600}}>{sig2(h.rate*100)}%</div>
              <div style={{fontSize:13,color:"#fff",fontWeight:600}}>{h.label}</div>
              <div style={{fontSize:10,color:C.dim}}>{h.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ROUTES ──
function RoutesSlide({s}) {
  const c = s.content;
  const maxT = Math.max(...c.routes.map(r=>r.total));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,flex:1}}>
      <Headline text={s.headline} />
      <Narrative text={c.narrative} />
      <div style={{display:"flex",flexDirection:"column",gap:8,flex:1}}>
        {c.routes.map((r,i) => {
          const maxRate = Math.max(...c.routes.map(x=>x.rate));
          return (
          <HoverCard key={i} style={{display:"flex",alignItems:"center",gap:16}} expandContent={`${r.total} collisions on this corridor. ${r.desc}.`}>
            <div style={{padding:"12px 18px",display:"flex",alignItems:"center",gap:16,width:"100%"}}>
              <div style={{width:80}}>
                <div style={{fontFamily:F.mono,fontSize:15,color:"#fff",fontWeight:600}}>{r.label}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <div style={{width:50,fontSize:10,color:C.dim}}>Volume</div>
                  <div style={{flex:1,height:10,background:C.dark,borderRadius:5}}>
                    <div style={{height:"100%",width:`${(r.total/maxT)*100}%`,background:r.color,borderRadius:5,opacity:0.5,transition:"width 0.5s"}} />
                  </div>
                  <span style={{fontFamily:F.mono,fontSize:12,color:C.muted,width:35}}>{r.total}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:50,fontSize:10,color:C.dim}}>Severity</div>
                  <div style={{flex:1,height:10,background:C.dark,borderRadius:5}}>
                    <div style={{height:"100%",width:`${(r.rate/maxRate)*100}%`,background:r.color,borderRadius:5,transition:"width 0.5s"}} />
                  </div>
                  <span style={{fontFamily:F.mono,fontSize:13,color:r.color,fontWeight:600,width:50,textAlign:"right"}}>{sig2(r.rate*100)}%</span>
                </div>
                <div style={{fontSize:10,color:C.dim,marginTop:2}}>{r.desc}</div>
              </div>
            </div>
          </HoverCard>
          );
        })}
      </div>
    </div>
  );
}

// ── MAP (Leaflet) ──
function MapSlide({s}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;
    // Dynamically load Leaflet
    const loadLeaflet = async () => {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      if (!window.L) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      const L = window.L;
      const map = L.map(mapRef.current).setView([44.68, -63.57], 9);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors', maxZoom: 17
      }).addTo(map);
      mapInstance.current = map;

      const tierColors = {Critical:"#dc2626",Elevated:"#ea580c",Watch:"#ca8a04",Baseline:"#16a34a","No Data":"#94a3b8"};
      // Resolve base path for Vite — works in both dev and production
      const base = import.meta.env.BASE_URL || "/";

      // Load grid
      try {
        const gridRes = await fetch(base + "data/ns_hotspot_grid.geojson");
        const gridData = await gridRes.json();
        const gridLayer = L.geoJSON(gridData, {
          style: (f) => {
            const tier = f.properties.hotspot_tier || "No Data";
            return {
              fillColor: tierColors[tier]||"#94a3b8",
              fillOpacity: tier==="No Data"?0.05:0.55,
              weight: tier==="No Data"?0.3:1,
              color:"#334155", opacity: tier==="No Data"?0.1:0.6
            };
          },
          onEachFeature: (f, layer) => {
            const p = f.properties;
            layer.bindPopup(`<div style="font-family:sans-serif;font-size:13px"><b style="color:${tierColors[p.hotspot_tier]||'#999'}">${p.hotspot_tier||'No Data'}</b><br/>Collisions: <b>${p.collisions}</b><br/>Severe: <b>${Math.round(p.severe_collisions)}</b> (${sig2(p.severe_rate*100)}%)<br/>Top Route: <b>${p.top_route}</b></div>`);
            layer.on("mouseover",()=>layer.setStyle({weight:3,fillOpacity:0.8}));
            layer.on("mouseout",()=>gridLayer.resetStyle(layer));
          }
        }).addTo(map);
        map.fitBounds(gridLayer.getBounds(), {padding:[20,20]});
      } catch(e) { console.warn("Grid not loaded",e); }

      // Load points
      try {
        const ptRes = await fetch(base + "data/ns_collision_points.geojson");
        const ptData = await ptRes.json();
        L.geoJSON(ptData, {
          pointToLayer: (f, ll) => {
            const isSev = f.properties.severe===1.0;
            return L.circleMarker(ll, {
              radius:4, fillColor:isSev?"#dc2626":"#3b82f6",
              color:"#ffffff", weight:0.5, fillOpacity:0.8
            });
          },
          onEachFeature: (f, layer) => {
            const p = f.properties;
            layer.bindPopup(`<div style="font-family:sans-serif;font-size:12px"><b>${p.nsrn_street||'Unknown'}</b><br/>${p.severe_label} · ${p.collision_configuration||''}<br/>Weather: ${p.weather_condition||'?'} · Light: ${p.light_condition||'?'}<br/>Road: ${p.road_alignment||'?'}, ${p.road_grade||'?'}<br/>Vehicles: ${p.n_vehicles||'?'}</div>`);
            layer.on("mouseover",()=>layer.setStyle({radius:7,weight:2}));
            layer.on("mouseout",()=>layer.setStyle({radius:4,weight:0.5}));
          }
        }).addTo(map);
      } catch(e) { console.warn("Points not loaded",e); }
    };
    loadLeaflet();
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, []);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12,flex:1}}>
      <Headline text={s.headline} />
      <div style={{fontSize:13,color:C.muted}}>Click any zone or point to explore collision details. Hotspot tiers: <span style={{color:"#dc2626"}}>■</span> Critical <span style={{color:"#ea580c"}}>■</span> Elevated <span style={{color:"#ca8a04"}}>■</span> Watch <span style={{color:"#16a34a"}}>■</span> Baseline</div>
      <div ref={mapRef} style={{flex:1,minHeight:380,borderRadius:10,border:`1px solid ${C.border}`,overflow:"hidden"}} />
    </div>
  );
}

// ── MODEL ──
function ModelSlide({s}) {
  const c = s.content;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,flex:1}}>
      <Headline text={s.headline} />
      <Narrative text={c.narrative} />
      <div style={{display:"flex",gap:14}}>
        {c.models.map((m,i) => (
          <HoverCard key={i} style={{flex:1,borderTop:`3px solid ${m.color}`}}>
            <div style={{padding:"16px 18px"}}>
              <div style={{fontSize:14,fontWeight:600,color:"#fff"}}>{m.name}</div>
              <div style={{fontFamily:F.mono,fontSize:34,color:m.color,fontWeight:600,margin:"6px 0"}}>{m.auc}</div>
              <div style={{fontSize:10,color:C.dim}}>AUC-ROC</div>
              <div style={{fontSize:12,color:C.muted,marginTop:8,lineHeight:1.4}}>{m.desc}</div>
            </div>
          </HoverCard>
        ))}
      </div>
      <div style={{...cardStyle,padding:"16px 18px"}}>
        <div style={labelStyle}>Top Predictors (XGBoost)</div>
        {c.predictors.map((p,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
            <div style={{width:110,fontSize:12,color:"#fff",fontWeight:500}}>{p.name}</div>
            <div style={{flex:1,height:8,background:C.dark,borderRadius:4}}>
              <div style={{height:"100%",width:`${p.imp*100}%`,background:`linear-gradient(90deg,${C.accent},${C.green})`,borderRadius:4}} />
            </div>
            <div style={{fontSize:11,color:C.dim,width:160,textAlign:"right"}}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FINDINGS ──
function FindingsSlide({s}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12,flex:1}}>
      <Headline text={s.headline} />
      {s.content.map((f,i) => (
        <HoverCard key={i} style={{borderLeft:`4px solid ${f.color}`}}>
          <div style={{padding:"14px 18px",display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{fontFamily:F.mono,fontSize:18,color:f.color,fontWeight:600,flexShrink:0}}>{f.num}</div>
            <div>
              <div style={{fontSize:15,fontWeight:600,color:"#fff",marginBottom:3}}>{f.title}</div>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.5}}>{f.text}</div>
            </div>
          </div>
        </HoverCard>
      ))}
    </div>
  );
}

// ── CONCLUSION ──
function ConclusionSlide({s}) {
  const c = s.content;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,flex:1}}>
      <Headline text={s.headline} center />
      <div style={{fontSize:15,color:C.muted,maxWidth:600,textAlign:"center",lineHeight:1.7}}>{c.closing}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,width:"100%",maxWidth:560}}>
        {c.callouts.map((cl,i) => (
          <HoverCard key={i}>
            <div style={{padding:"14px 18px",textAlign:"center"}}>
              <div style={{fontSize:11,color:C.dim,letterSpacing:1,textTransform:"uppercase"}}>{cl.label}</div>
              <div style={{fontFamily:F.mono,fontSize:15,color:C.accent,fontWeight:600,marginTop:4}}>{cl.value}</div>
            </div>
          </HoverCard>
        ))}
      </div>
      <div style={{fontFamily:F.serif,fontSize:18,color:C.green,fontStyle:"italic",marginTop:8}}>A risk-prioritization layer for Nova Scotia's provincial road network.</div>
      <div style={{fontSize:11,color:C.dim,marginTop:12}}>Gavin Shklanka & Rachel Kodi · 2026</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════════════════════════════════════════
const cardStyle = {background:C.card,border:`1px solid ${C.border}`,borderRadius:8};
const labelStyle = {fontSize:11,color:C.accent,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:10};

const hoverCSS = `
  .start-btn:hover{background:#00AADF!important}
  .nav-btn:hover:not(:disabled){border-color:${C.accent}!important;color:#fff!important}
  .nav-btn:disabled{opacity:0.3;cursor:default!important}
  .pause-btn:hover{border-color:${C.accent}!important;color:#fff!important}
  * { box-sizing: border-box; }
  body { margin:0; overflow:hidden; }
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:${C.dark}} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
`;

const S = {
  shell:{width:"100%",minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:F.sans,color:"#fff",overflow:"hidden"},
  hud:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 24px",borderBottom:`1px solid ${C.borderLight}`,background:"#0D1F35"},
  hudLabel:{fontSize:11,fontWeight:600,color:C.accent,letterSpacing:2,textTransform:"uppercase"},
  slideWrap:{flex:1,display:"flex",flexDirection:"column",padding:"16px 36px 10px",overflow:"auto"},
  nav:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 24px",borderTop:`1px solid ${C.borderLight}`,background:"#0D1F35"},
  navBtn:{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"6px 18px",borderRadius:6,cursor:"pointer",fontSize:13,fontFamily:F.sans},
  pauseBtn:{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,width:30,height:30,borderRadius:6,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"},
  startBtn:{background:C.accent,border:"none",color:"#fff",padding:"14px 40px",borderRadius:8,fontSize:16,fontFamily:F.sans,fontWeight:600,cursor:"pointer",letterSpacing:0.5},
};
