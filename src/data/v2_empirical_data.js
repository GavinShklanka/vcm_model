// ═══════════════════════════════════════════════════════════════════════════════
// NOVA SCOTIA ROAD SAFETY INTELLIGENCE SYSTEM — V2 EMPIRICAL DATA
// V2: RF + XGBoost Ensemble · Temporal holdout · 8-feature architecture
// Ensemble AUC: 0.6576 · Records: 2,068 · Train 1,543 / Test 525
// ═══════════════════════════════════════════════════════════════════════════════

export const EMPIRICAL_DATA = {
  meta: {
    title: "Nova Scotia Road Safety Intelligence System",
    subtitle: "2,068 Collisions · 8 Final Features · 6 Intervention Profiles",
    records: 2068,
    trainRecords: 1543,
    testRecords: 525,
    features: 8,
    rawFeatures: 77,
    availableFeatures: 35,
    severeRate: "21.8%",
    severeCount: 450,
    model: "RF + XGBoost Ensemble",
    modelSubtitle: "XGBoost for ranking · RF for calibration · Ensemble for final triage score",
    auc: 0.6576,
    dateRange: "Jan 2024 – Jan 2026"
  },
  question: {
    headline: "What Drives Collision Severity?",
    statement: "What factors are associated with higher motor vehicle collision severity on provincial highways in Nova Scotia?",
    insights: [
      {
        label: "Not predicting IF",
        text: "a collision will occur — that's a different problem entirely",
        expand: "We model severity conditional on a collision already happening. This keeps the analysis grounded in observable events."
      },
      {
        label: "Predicting WHICH",
        text: "collisions become severe once they happen",
        expand: "Binary classification: severe (fatality/major injury) vs. non-severe. 21.8% of our dataset is severe."
      },
      {
        label: "Understanding WHY",
        text: "terrain, weather, behavior, and timing combine to elevate risk",
        expand: "8 final features capture the core context: road geometry, surface conditions, driver flags, traffic volume, and time of day — after rigorous temporal ablation."
      }
    ]
  },
  models: {
    narrative: "The RF + XGBoost ensemble combines two complementary models: XGBoost excels at ranking collision severity (highest discrimination), while Random Forest produces calibrated probability estimates. Neither alone outperforms the combination — their disagreement on specific features is precisely what drives ensemble gain.",
    comparison: [
      { name: "Ensemble",           auc: 0.6576, desc: "RF + XGBoost average · Final production score",    isEnsemble: true  },
      { name: "XGBoost",            auc: 0.6572, desc: "Best ranking engine · Overconfident probabilities", isEnsemble: false },
      { name: "Random Forest",      auc: 0.6535, desc: "Best calibration slope (0.815)",                   isEnsemble: false },
      { name: "Logistic Regression",auc: 0.5708, desc: "Transparent linear baseline",                      isEnsemble: false }
    ],
    calibration: {
      rf:       { slope: 0.815,  label: "Well-calibrated",   color: "#2EAF6C", note: "RF produces reliable probability estimates" },
      xgboost:  { slope: 3.101,  label: "Overconfident",     color: "#E8A838", note: "XGBoost produces reliable rank orderings" }
    },
    architectureCards: [
      {
        name: "XGBoost",
        auc: 0.6572,
        role: "Ranking Engine",
        bullets: ["Strongest discrimination", "Overconfident probabilities", "Use for case ordering"],
        accent: "#1A7FA0"
      },
      {
        name: "Random Forest",
        auc: 0.6535,
        role: "Probability Model",
        bullets: ["Calibration slope: 0.815", "Best probability model", "Use when threshold matters"],
        accent: "#0E3B6B"
      },
      {
        name: "Ensemble",
        auc: 0.6576,
        role: "Final Production Score",
        bullets: ["RF + XGBoost average", "Best overall triage output", "Primary deployment model"],
        accent: "#34B8D9",
        isPrimary: true
      }
    ],
    ensembleDisagreement: {
      rfDominates:      ["hour_v2", "weather_severity_rank"],
      xgboostDominates: ["n_vehicles", "posted_speed_kmh"],
      tagline: "Model disagreement creates ensemble gain."
    },
    deploymentRoles: [
      { scenario: "A new report comes in",       model: "Ensemble", why: "Best overall severity triage score" },
      { scenario: "Need a probability threshold", model: "RF",       why: "Calibrated probabilities (slope 0.815)" },
      { scenario: "Rank-ordering a triage queue", model: "XGBoost",  why: "Strongest discrimination / ranking" }
    ],
    // Final 8-feature architecture — grouped by module
    featureModules: [
      { module: "Collision Geometry", color: "#1A7FA0", features: ["n_vehicles", "any_turning"] },
      { module: "Road / Speed",       color: "#0E3B6B", features: ["posted_speed_kmh"] },
      { module: "Behavior",           color: "#D94848", features: ["aggressive_driving", "impaired_driving"] },
      { module: "Time / Exposure",    color: "#E8A838", features: ["hour_v2"] },
      { module: "Environment",        color: "#2EAF6C", features: ["surface_severity_rank", "weather_severity_rank"] }
    ],
    // XGBoost gain ranking (normalized 0-1)
    xgboostGain: [
      { name: "n_vehicles",             imp: 0.95 },
      { name: "posted_speed_kmh",       imp: 0.78 },
      { name: "aggressive_driving",     imp: 0.65 },
      { name: "hour_v2",                imp: 0.58 },
      { name: "surface_severity_rank",  imp: 0.47 },
      { name: "impaired_driving",       imp: 0.38 },
      { name: "weather_severity_rank",  imp: 0.31 },
      { name: "any_turning",            imp: 0.22 }
    ],
    // RF impurity (raw values)
    rfImpurity: [
      { name: "hour_v2",                imp: 82.4 },
      { name: "n_vehicles",             imp: 42.1 },
      { name: "posted_speed_kmh",       imp: 33.2 },
      { name: "weather_severity_rank",  imp: 29.3 },
      { name: "surface_severity_rank",  imp: 26.1 },
      { name: "aggressive_driving",     imp: 21.9 },
      { name: "impaired_driving",       imp: 15.6 },
      { name: "any_turning",            imp: 11.7 }
    ],
    featureFunnel: [
      { stage: "Raw Columns",        count: 77, label: "Original dataset" },
      { stage: "Available Features", count: 35, label: "After dropping 100% NA (ECCC)" },
      { stage: "Final V2 Features",  count: 8,  label: "After temporal ablation" }
    ],
    // Legacy predictors kept for any old references
    predictors: [
      { name: "n_vehicles",            imp: 0.95, desc: "Multi-vehicle severity amplifier"  },
      { name: "posted_speed_kmh",      imp: 0.78, desc: "Speed class on segment"            },
      { name: "aggressive_driving",    imp: 0.65, desc: "Officer-reported flag"             },
      { name: "hour_v2",               imp: 0.58, desc: "Time-of-day risk window"           },
      { name: "surface_severity_rank", imp: 0.47, desc: "Ranked surface condition"          },
      { name: "impaired_driving",      imp: 0.38, desc: "Impairment flag"                   },
      { name: "weather_severity_rank", imp: 0.31, desc: "Ranked weather condition"          },
      { name: "any_turning",           imp: 0.22, desc: "Turning movement present"          }
    ]
  },
  designHardening: [
    {
      title: "Temporal Holdout",
      accent: "#1A7FA0",
      bullets: [
        "Trained on Jan 2024 – Jul 2025",
        "Tested on Aug 2025 – Jan 2026",
        "The model never sees future data during training"
      ]
    },
    {
      title: "Feature Ablation",
      accent: "#0E3B6B",
      bullets: [
        "77 raw columns → 35 available → 8 final",
        "Features tested for temporal stability",
        "Fewer features improved generalization"
      ]
    },
    {
      title: "Ensemble Architecture",
      accent: "#34B8D9",
      bullets: [
        "RF + XGBoost combined",
        "Complementary strengths: ranking + calibration",
        "AUC 0.6576 — best overall result"
      ]
    },
    {
      title: "Missing Data Resilience",
      accent: "#2EAF6C",
      bullets: [
        "ECCC weather: 100% unavailable in V2",
        "V1's strongest predictors were absent",
        "Model still improved — conservative and credible"
      ]
    }
  ],
  v3Roadmap: [
    { improvement: "ECCC Weather Bootstrap",      expectedGain: "+0.03 to +0.06 AUC", status: "Highest priority" },
    { improvement: "True Posted Speed Data",       expectedGain: "+0.01 to +0.02 AUC", status: "Data acquisition" },
    { improvement: "Calibration + Route Validation", expectedGain: "Reliability gain",  status: "Next phase"      }
  ],
  riskZones: {
    terrain: {
      narrative: "A straight, flat road forgives mistakes. A curve on a slope does not. Single-vehicle crashes on curves have a 29.9% severity rate — the highest terrain-specific risk in the dataset. Rollovers hit 58.5%.",
      curves: 0.299,
      straight: 0.225,
      types: [
        { type: "Rollover",      rate: 0.585 },
        { type: "Head-On",       rate: 0.467 },
        { type: "Right Angle",   rate: 0.474 },
        { type: "Off Road (R)",  rate: 0.310 },
        { type: "Rear End",      rate: 0.200 },
        { type: "Sideswipe",     rate: 0.094 }
      ],
      bars: [
        { label: "Curved + Level",   rate: 0.281, n: 281  },
        { label: "Curved + Graded",  rate: 0.250, n: 256  },
        { label: "Straight + Graded",rate: 0.205, n: 346  },
        { label: "Flat + Straight",  rate: 0.199, n: 1185 }
      ]
    },
    visibilityTime: {
      narrative: "Here's the surprise: September has the highest severity rate at 29.3% — not January. And dusk (27.5%) is deadlier than full darkness. When conditions are obviously bad, people slow down. When they look fine but aren't, that's when severity spikes.",
      lightBars: [
        { label: "Dusk",     rate: 0.275 },
        { label: "Daylight", rate: 0.219 },
        { label: "Darkness", rate: 0.212 },
        { label: "Dawn",     rate: 0.183 }
      ],
      monthlyRates: [
        { m: "Jan", r: 0.218 }, { m: "Feb", r: 0.171 }, { m: "Mar", r: 0.172 }, { m: "Apr", r: 0.219 },
        { m: "May", r: 0.284 }, { m: "Jun", r: 0.265 }, { m: "Jul", r: 0.253 }, { m: "Aug", r: 0.238 },
        { m: "Sep", r: 0.293 }, { m: "Oct", r: 0.230 }, { m: "Nov", r: 0.144 }, { m: "Dec", r: 0.162 }
      ]
    }
  },
  archetypes: [
    { name: "The Distracted Commuter",    pct: "7.7%",  severe: "33.1%", tag: "DEADLIEST",        desc: "100% distraction. Think: texting at 110 km/h on the 102. One glance down, rear-end at full speed. Caution: This is a flag-defined heuristic partition." },
    { name: "The Aggressive Tailgater",   pct: "19.0%", severe: "25.7%", tag: "MOST COMMON RISK", desc: "Following too close on the highway during commute hours. The 'I'm late for work' crash." },
    { name: "The Wildlife Encounter",     pct: "9.5%",  severe: "10.7%", tag: "LOWEST SEVERITY",  desc: "November, 9 PM, Highway 7 — a deer steps out. The driver swerves, not crashes head-on." },
    { name: "The Winter Road Warrior",    pct: "16.2%", severe: "18.0%", tag: "EXPECTED",          desc: "Ice, curves, and a single car sliding off the highway. Nova Scotians expect winter — and mostly adapt. Paradoxically lower severity due to defensive driving." },
    { name: "The Late Night Risk Taker",  pct: "6.8%",  severe: "32.1%", tag: "2ND DEADLIEST",    desc: "Saturday, 1 AM, dark highway — impairment 10× the average. Young, alone, off the road." },
    { name: "The Everyday Commuter",      pct: "40.8%", severe: "20.1%", tag: "BASELINE",          desc: "No standout flag. Just the background risk of driving Nova Scotian highways every day. (Residual category)" }
  ],
  findings: [
    { num: "01", title: "Summer Is Deadlier Than Winter",  text: "May–Sep: 25–29% severity. Nov–Mar: 14–22%. When it's obviously bad, drivers slow down. Complacency at speed is the real killer." },
    { num: "02", title: "Dusk Is the Danger Window",       text: "27.5% severity — higher than full darkness or daylight. The rapid light transition catches drivers on curved rural highways." },
    { num: "03", title: "Curves Kill Disproportionately",  text: "29.9% severity for single-vehicle curve crashes vs 22.5% straight. Combined with grades, curves become unforgiving." },
    { num: "04", title: "Distraction Outranks Impairment", text: "33.1% severity vs 32.1%. But distraction is 3× more prevalent — 7.9% of all collisions vs 3.0% impaired." }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// MAP DATA (corridors + hotspots + view presets)
// ─────────────────────────────────────────────────────────────────────────────

export const MAP_DATA = {
  center: [45.0, -63.3],
  defaultZoom: 7,
  hrmCenter: [44.685, -63.605],
  hrmZoom: 11,
  corridors: [
    {
      id: 'hwy102', name: 'Hwy 102 — Halifax to Truro', color: '#2B6CB0',
      coords: [
        [44.653,-63.592],[44.680,-63.610],[44.710,-63.635],
        [44.735,-63.648],[44.758,-63.665],[44.783,-63.710],
        [44.820,-63.735],[44.870,-63.725],[44.920,-63.690],
        [44.980,-63.640],[45.050,-63.560],[45.140,-63.455],
        [45.220,-63.368],[45.300,-63.280],[45.370,-63.270]
      ]
    },
    {
      id: 'hwy101', name: 'Hwy 101 — Halifax to Windsor', color: '#38A89D',
      coords: [
        [44.653,-63.592],[44.680,-63.555],[44.720,-63.530],
        [44.760,-63.560],[44.810,-63.620],[44.860,-63.680],
        [44.930,-63.780],[44.975,-64.040],[45.000,-64.140]
      ]
    },
    {
      id: 'hwy103', name: 'Hwy 103 — Halifax to Yarmouth', color: '#D69E2E',
      coords: [
        [44.653,-63.592],[44.620,-63.700],[44.580,-63.810],
        [44.530,-63.920],[44.480,-64.030],[44.430,-64.140],
        [44.380,-64.260],[44.320,-64.380]
      ]
    },
    {
      id: 'hwy104', name: 'Hwy 104 — Truro to Cape Breton', color: '#9B2C2C',
      coords: [
        [45.370,-63.270],[45.440,-63.180],[45.510,-63.060],
        [45.580,-62.920],[45.620,-62.750],[45.660,-62.560],
        [45.690,-62.340],[45.720,-62.100],[45.780,-61.800],
        [45.840,-61.400],[45.930,-60.920]
      ]
    },
    {
      id: 'hwy111', name: 'Hwy 111 — Dartmouth Connector', color: '#553C9A',
      coords: [
        [44.680,-63.573],[44.695,-63.565],[44.710,-63.558],
        [44.723,-63.548],[44.735,-63.538]
      ]
    },
    {
      id: 'hwy118', name: 'Hwy 118 — Bedford Connector', color: '#2C7A7B',
      coords: [[44.720,-63.648],[44.730,-63.638],[44.743,-63.628]]
    }
  ],
  hotspots: [
    { id:'burnside-interchange',  name:'Burnside / Hwy 102–118 Interchange',     lat:44.730, lng:-63.648, severity:'high',   severeRate:'31.2%', note:'Highest-volume merge zone in HRM. AM/PM peak convergence of Hwy 102 and Bedford connector.' },
    { id:'bedford-basin',         name:'Bedford Basin Corridor (Hwy 102 km 28–34)',lat:44.762,lng:-63.708, severity:'high',   severeRate:'28.7%', note:'Curved descent through fog-prone basin. Single-vehicle off-road events spike at dusk.' },
    { id:'dartmouth-connector',   name:'Hwy 111 Dartmouth Connector',             lat:44.705, lng:-63.558, severity:'medium', severeRate:'24.1%', note:'High traffic volume with short merge lanes. Rear-end severity elevated.' },
    { id:'truro-hub',             name:'Truro Hub — Hwy 102/104 Junction',         lat:45.370, lng:-63.270, severity:'high',   severeRate:'29.5%', note:'Major rural interchange. High-speed merges from diverging highway spurs.' },
    { id:'falmouth',              name:'Falmouth Curve — Hwy 101 km 62',           lat:44.978, lng:-64.058, severity:'medium', severeRate:'22.8%', note:'Downhill S-curve with limited sight lines. Winter surface freezes before treatment.' },
    { id:'antigonish',            name:'Antigonish Corridor — Hwy 104 km 175',     lat:45.610, lng:-62.058, severity:'medium', severeRate:'23.4%', note:'Rural 2-lane stretch with moose exposure at night. Limited shoulder width.' }
  ]
};

// ─── MAP GRID CELLS ───────────────────────────────────────────────────────────
export const GRID_CELLS = [
  [44.740,-63.720,44.765,-63.695,'elevated'],[44.765,-63.720,44.790,-63.695,'critical'],
  [44.790,-63.745,44.815,-63.720,'elevated'],[44.815,-63.745,44.840,-63.720,'watch'],
  [44.840,-63.770,44.865,-63.745,'watch'],   [44.865,-63.795,44.890,-63.770,'baseline'],
  [44.740,-63.695,44.765,-63.670,'watch'],   [44.765,-63.695,44.790,-63.670,'elevated'],
  [44.790,-63.720,44.815,-63.695,'critical'],[44.815,-63.720,44.840,-63.695,'elevated'],
  [44.840,-63.745,44.865,-63.720,'watch'],
  [44.650,-63.640,44.675,-63.615,'critical'],[44.650,-63.615,44.675,-63.590,'critical'],
  [44.650,-63.590,44.675,-63.565,'elevated'],[44.675,-63.640,44.700,-63.615,'critical'],
  [44.675,-63.615,44.700,-63.590,'elevated'],[44.675,-63.590,44.700,-63.565,'elevated'],
  [44.700,-63.640,44.725,-63.615,'elevated'],[44.700,-63.615,44.725,-63.590,'watch'],
  [44.700,-63.590,44.725,-63.565,'watch'],   [44.625,-63.615,44.650,-63.590,'elevated'],
  [44.625,-63.590,44.650,-63.565,'critical'],[44.625,-63.565,44.650,-63.540,'elevated'],
  [44.600,-63.590,44.625,-63.565,'watch'],   [44.600,-63.565,44.625,-63.540,'baseline'],
  [44.700,-63.565,44.725,-63.540,'elevated'],[44.700,-63.540,44.725,-63.515,'elevated'],
  [44.700,-63.515,44.725,-63.490,'watch'],   [44.675,-63.565,44.700,-63.540,'critical'],
  [44.675,-63.540,44.700,-63.515,'elevated'],[44.675,-63.515,44.700,-63.490,'watch'],
  [44.650,-63.515,44.675,-63.490,'elevated'],[44.650,-63.490,44.675,-63.465,'watch'],
  [44.625,-63.490,44.650,-63.465,'baseline'],[44.625,-63.465,44.650,-63.440,'baseline'],
  [44.720,-63.660,44.745,-63.635,'critical'],[44.720,-63.635,44.745,-63.610,'elevated'],
  [44.745,-63.660,44.770,-63.635,'critical'],[44.745,-63.635,44.770,-63.610,'elevated'],
  [44.770,-63.660,44.795,-63.635,'elevated'],[44.770,-63.635,44.795,-63.610,'watch'],
  [44.700,-63.590,44.725,-63.565,'elevated'],[44.725,-63.615,44.750,-63.590,'watch'],
  [44.725,-63.590,44.750,-63.565,'watch'],   [44.750,-63.615,44.775,-63.590,'baseline'],
  [44.755,-63.720,44.780,-63.695,'watch'],   [44.755,-63.745,44.780,-63.720,'elevated'],
  [44.780,-63.720,44.805,-63.695,'watch'],   [44.780,-63.745,44.805,-63.720,'watch'],
  [44.805,-63.770,44.830,-63.745,'baseline'],[44.805,-63.795,44.830,-63.770,'watch'],
  [44.820,-63.620,44.845,-63.595,'baseline'],[44.845,-63.595,44.870,-63.570,'watch'],
  [44.870,-63.595,44.895,-63.570,'elevated'],[44.895,-63.595,44.920,-63.570,'watch'],
  [44.895,-63.570,44.920,-63.545,'baseline'],[44.920,-63.545,44.945,-63.520,'watch'],
  [44.945,-63.520,44.970,-63.495,'elevated'],[44.970,-63.520,44.995,-63.495,'watch'],
  [44.970,-63.495,44.995,-63.470,'baseline'],[44.995,-63.470,45.020,-63.445,'watch'],
  [45.020,-63.470,45.045,-63.445,'elevated'],[45.045,-63.445,45.070,-63.420,'watch'],
  [45.070,-63.420,45.095,-63.395,'baseline'],[45.095,-63.395,45.120,-63.370,'watch'],
  [45.120,-63.395,45.145,-63.370,'baseline'],[45.145,-63.370,45.170,-63.345,'baseline'],
  [45.170,-63.345,45.195,-63.320,'watch'],   [45.195,-63.320,45.220,-63.295,'elevated'],
  [45.220,-63.295,45.245,-63.270,'critical'],[45.245,-63.270,45.270,-63.245,'elevated'],
  [45.270,-63.245,45.295,-63.220,'watch'],
  [44.680,-63.490,44.705,-63.465,'watch'],   [44.680,-63.465,44.705,-63.440,'baseline'],
  [44.705,-63.465,44.730,-63.440,'watch'],   [44.730,-63.465,44.755,-63.440,'baseline'],
  [44.755,-63.440,44.780,-63.415,'baseline'],
  [44.580,-62.090,44.605,-62.065,'watch'],   [44.605,-62.065,44.630,-62.040,'elevated'],
  [44.630,-62.040,44.655,-62.015,'watch'],
];

// ─── COLLISION POINTS ─────────────────────────────────────────────────────────
export const COLLISION_POINTS = [
  [44.755,-63.702,true],[44.762,-63.698,false],[44.769,-63.715,false],
  [44.776,-63.722,true],[44.783,-63.728,false],[44.790,-63.735,false],
  [44.797,-63.741,true],[44.804,-63.748,false],[44.748,-63.692,false],
  [44.756,-63.710,false],[44.763,-63.718,true],[44.770,-63.725,false],
  [44.777,-63.731,false],[44.784,-63.738,true],[44.791,-63.745,false],
  [44.798,-63.751,false],[44.805,-63.758,false],[44.812,-63.764,true],
  [44.819,-63.771,false],[44.826,-63.778,false],[44.833,-63.784,false],
  [44.740,-63.688,true],[44.747,-63.695,false],[44.754,-63.702,false],
  [44.658,-63.628,true],[44.662,-63.620,false],[44.666,-63.612,true],
  [44.670,-63.604,false],[44.674,-63.596,false],[44.678,-63.622,true],
  [44.682,-63.614,false],[44.686,-63.606,false],[44.690,-63.630,true],
  [44.694,-63.622,false],[44.698,-63.614,false],[44.702,-63.606,true],
  [44.655,-63.608,false],[44.659,-63.600,true],[44.663,-63.592,false],
  [44.667,-63.584,false],[44.671,-63.618,false],[44.675,-63.610,true],
  [44.679,-63.602,false],[44.683,-63.634,false],[44.687,-63.626,true],
  [44.691,-63.618,false],[44.695,-63.610,false],[44.699,-63.602,true],
  [44.706,-63.580,false],[44.710,-63.572,true],[44.714,-63.564,false],
  [44.718,-63.556,false],[44.722,-63.548,true],[44.726,-63.540,false],
  [44.730,-63.532,false],[44.703,-63.576,true],[44.707,-63.568,false],
  [44.711,-63.560,false],[44.715,-63.552,true],[44.719,-63.544,false],
  [44.723,-63.536,false],[44.727,-63.528,false],[44.731,-63.520,true],
  [44.724,-63.648,true],[44.728,-63.640,false],[44.732,-63.632,true],
  [44.736,-63.648,false],[44.740,-63.640,false],[44.744,-63.632,true],
  [44.748,-63.648,false],[44.752,-63.640,false],[44.756,-63.656,true],
  [44.760,-63.648,false],[44.764,-63.640,false],[44.768,-63.656,true],
  [44.772,-63.648,false],[44.776,-63.640,false],[44.720,-63.652,true],
  [44.680,-63.540,false],[44.675,-63.532,true],[44.670,-63.524,false],
  [44.665,-63.516,false],[44.660,-63.508,true],[44.655,-63.500,false],
  [44.650,-63.492,false],[44.645,-63.484,true],[44.683,-63.548,false],
  [44.678,-63.540,false],[44.673,-63.532,true],[44.668,-63.524,false],
  [44.870,-63.588,false],[44.895,-63.570,true],[44.920,-63.550,false],
  [44.945,-63.530,false],[44.970,-63.510,true],[44.995,-63.488,false],
  [45.020,-63.465,false],[45.045,-63.442,true],[45.070,-63.418,false],
  [45.095,-63.392,false],[45.120,-63.368,false],[45.145,-63.344,true],
  [45.170,-63.320,false],[45.195,-63.296,false],[45.220,-63.272,true],
  [45.245,-63.248,false],[45.270,-63.224,false],[45.295,-63.200,true],
  [45.320,-63.176,false],[45.345,-63.152,false],[45.370,-63.128,true],
  [44.620,-63.710,true],[44.590,-63.780,false],[44.555,-63.860,false],
  [44.520,-63.940,true],[44.485,-64.020,false],[44.450,-64.100,false],
  [44.415,-64.180,true],[44.380,-64.260,false],[44.345,-64.340,false],
  [45.588,-62.082,false],[45.610,-62.058,true],[45.632,-62.034,false],
  [45.645,-62.010,false],[45.618,-62.046,true],[45.640,-62.022,false],
];

// ─── SCENARIO PRESETS ─────────────────────────────────────────────────────────
export const SCENARIO_PRESETS = [
  { label:'Dusk — Curved Rural Hwy (Worst Case)', conditions:{ timeOfDay:'dusk',  roadType:'curve',            weather:'clear', traffic:'high'   } },
  { label:'Winter Night — Rural (Snow)',           conditions:{ timeOfDay:'night', roadType:'rural',            weather:'snow',  traffic:'low'    } },
  { label:'Foggy Dawn — Straight Highway',         conditions:{ timeOfDay:'dawn',  roadType:'straight_highway', weather:'fog',   traffic:'medium' } },
  { label:'Summer Midday — Urban (Baseline)',      conditions:{ timeOfDay:'day',   roadType:'urban',            weather:'clear', traffic:'high'   } },
];

// ─── RESOURCE ALLOCATION ──────────────────────────────────────────────────────
export const RESOURCE_ALLOCATION = [
  { domain:'EMS Pre-Positioning',     priority:'Critical', horizon:'Immediate (0–90 days)',    lever:'Predictive dispatch staging',              impact:'High',   feasibility:'High'   },
  { domain:'Infrastructure Targeting',priority:'High',     horizon:'Medium (1–3 years)',        lever:'Guardrail + rumble strip placement',        impact:'High',   feasibility:'Medium' },
  { domain:'Traffic Enforcement',     priority:'High',     horizon:'Immediate (0–90 days)',    lever:'Corridor patrol scheduling',               impact:'Medium', feasibility:'High'   },
  { domain:'Public Education',        priority:'Medium',   horizon:'Ongoing',                   lever:'Season-specific messaging (dusk, Sept)',    impact:'Medium', feasibility:'High'   },
  { domain:'Insurance Pricing',       priority:'Medium',   horizon:'Long (3+ years)',           lever:'Risk-corridor premium banding',            impact:'Medium', feasibility:'Low'    },
  { domain:'Winter Maintenance',      priority:'High',     horizon:'Immediate (seasonal)',      lever:'Pre-treat curve segments before events',   impact:'High',   feasibility:'High'   },
  { domain:'Data + Monitoring',       priority:'Low',      horizon:'Medium (1–3 years)',        lever:'Real-time severity feed integration',       impact:'Low',    feasibility:'Medium' },
];
