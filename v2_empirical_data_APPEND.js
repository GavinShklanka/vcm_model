// ─────────────────────────────────────────────────────────────────────────────
// APPEND THIS ENTIRE FILE to the bottom of src/data/v2_empirical_data.js
// Do NOT modify anything above. Just paste below the closing `};` of EMPIRICAL_DATA.
// ─────────────────────────────────────────────────────────────────────────────

// ─── MAP DATA (corridors + hotspots + view presets) ──────────────────────────
export const MAP_DATA = {
  // Province-level view
  center: [45.0, -63.3],
  defaultZoom: 7,

  // HRM close-up view
  hrmCenter: [44.685, -63.605],
  hrmZoom: 11,

  // Highway corridor polylines
  corridors: [
    {
      id: 'hwy102',
      name: 'Hwy 102 — Halifax to Truro',
      color: '#2B6CB0',
      coords: [
        [44.653, -63.592], [44.680, -63.610], [44.710, -63.635],
        [44.735, -63.648], [44.758, -63.665], [44.783, -63.710],
        [44.820, -63.735], [44.870, -63.725], [44.920, -63.690],
        [44.980, -63.640], [45.050, -63.560], [45.140, -63.455],
        [45.220, -63.368], [45.300, -63.280], [45.370, -63.270]
      ]
    },
    {
      id: 'hwy101',
      name: 'Hwy 101 — Halifax to Windsor',
      color: '#38A89D',
      coords: [
        [44.653, -63.592], [44.680, -63.555], [44.720, -63.530],
        [44.760, -63.560], [44.810, -63.620], [44.860, -63.680],
        [44.930, -63.780], [44.975, -64.040], [45.000, -64.140]
      ]
    },
    {
      id: 'hwy103',
      name: 'Hwy 103 — Halifax to Yarmouth',
      color: '#D69E2E',
      coords: [
        [44.653, -63.592], [44.620, -63.700], [44.580, -63.810],
        [44.530, -63.920], [44.480, -64.030], [44.430, -64.140],
        [44.380, -64.260], [44.320, -64.380]
      ]
    },
    {
      id: 'hwy104',
      name: 'Hwy 104 — Truro to Cape Breton',
      color: '#9B2C2C',
      coords: [
        [45.370, -63.270], [45.440, -63.180], [45.510, -63.060],
        [45.580, -62.920], [45.620, -62.750], [45.660, -62.560],
        [45.690, -62.340], [45.720, -62.100], [45.780, -61.800],
        [45.840, -61.400], [45.930, -60.920]
      ]
    },
    {
      id: 'hwy111',
      name: 'Hwy 111 — Dartmouth Connector',
      color: '#553C9A',
      coords: [
        [44.680, -63.573], [44.695, -63.565], [44.710, -63.558],
        [44.723, -63.548], [44.735, -63.538]
      ]
    },
    {
      id: 'hwy118',
      name: 'Hwy 118 — Bedford Connector',
      color: '#2C7A7B',
      coords: [
        [44.720, -63.648], [44.730, -63.638], [44.743, -63.628]
      ]
    }
  ],

  // Named high-risk hotspots
  hotspots: [
    {
      id: 'burnside-interchange',
      name: 'Burnside / Hwy 102–118 Interchange',
      lat: 44.730, lng: -63.648,
      severity: 'high',
      severeRate: '31.2%',
      note: 'Highest-volume merge zone in HRM. AM/PM peak convergence of Hwy 102 and Bedford connector.'
    },
    {
      id: 'bedford-basin',
      name: 'Bedford Basin Corridor (Hwy 102 km 28–34)',
      lat: 44.762, lng: -63.708,
      severity: 'high',
      severeRate: '28.7%',
      note: 'Curved descent through fog-prone basin. Single-vehicle off-road events spike at dusk.'
    },
    {
      id: 'dartmouth-connector',
      name: 'Hwy 111 Dartmouth Connector',
      lat: 44.705, lng: -63.558,
      severity: 'medium',
      severeRate: '24.1%',
      note: 'High traffic volume with short merge lanes. Rear-end severity elevated.'
    },
    {
      id: 'truro-hub',
      name: 'Truro Hub — Hwy 102/104 Junction',
      lat: 45.370, lng: -63.270,
      severity: 'high',
      severeRate: '29.5%',
      note: 'Major rural interchange. High-speed merges from diverging highway spurs.'
    },
    {
      id: 'falmouth',
      name: 'Falmouth Curve — Hwy 101 km 62',
      lat: 44.978, lng: -64.058,
      severity: 'medium',
      severeRate: '22.8%',
      note: 'Downhill S-curve with limited sight lines. Winter surface freezes before treatment.'
    },
    {
      id: 'antigonish',
      name: 'Antigonish Corridor — Hwy 104 km 175',
      lat: 45.610, lng: -62.058,
      severity: 'medium',
      severeRate: '23.4%',
      note: 'Rural 2-lane stretch with moose exposure at night. Limited shoulder width.'
    }
  ]
};

// ─── MAP GRID CELLS (severity zone tiles over NS corridors) ──────────────────
// Each cell: [swLat, swLng, neLat, neLng, tier]
// tier: 'critical' | 'elevated' | 'watch' | 'baseline'
export const GRID_CELLS = [
  // ── Bedford / Sackville corridor (Hwy 102 north approach) ──
  [44.740, -63.720, 44.765, -63.695, 'elevated'],
  [44.765, -63.720, 44.790, -63.695, 'critical'],
  [44.790, -63.745, 44.815, -63.720, 'elevated'],
  [44.815, -63.745, 44.840, -63.720, 'watch'],
  [44.840, -63.770, 44.865, -63.745, 'watch'],
  [44.865, -63.795, 44.890, -63.770, 'baseline'],
  [44.740, -63.695, 44.765, -63.670, 'watch'],
  [44.765, -63.695, 44.790, -63.670, 'elevated'],
  [44.790, -63.720, 44.815, -63.695, 'critical'],
  [44.815, -63.720, 44.840, -63.695, 'elevated'],
  [44.840, -63.745, 44.865, -63.720, 'watch'],
  // ── HRM core — Halifax / Dartmouth ──
  [44.650, -63.640, 44.675, -63.615, 'critical'],
  [44.650, -63.615, 44.675, -63.590, 'critical'],
  [44.650, -63.590, 44.675, -63.565, 'elevated'],
  [44.675, -63.640, 44.700, -63.615, 'critical'],
  [44.675, -63.615, 44.700, -63.590, 'elevated'],
  [44.675, -63.590, 44.700, -63.565, 'elevated'],
  [44.700, -63.640, 44.725, -63.615, 'elevated'],
  [44.700, -63.615, 44.725, -63.590, 'watch'],
  [44.700, -63.590, 44.725, -63.565, 'watch'],
  [44.625, -63.615, 44.650, -63.590, 'elevated'],
  [44.625, -63.590, 44.650, -63.565, 'critical'],
  [44.625, -63.565, 44.650, -63.540, 'elevated'],
  [44.600, -63.590, 44.625, -63.565, 'watch'],
  [44.600, -63.565, 44.625, -63.540, 'baseline'],
  // ── Burnside / Eastern Passage / Cole Harbour ──
  [44.700, -63.565, 44.725, -63.540, 'elevated'],
  [44.700, -63.540, 44.725, -63.515, 'elevated'],
  [44.700, -63.515, 44.725, -63.490, 'watch'],
  [44.675, -63.565, 44.700, -63.540, 'critical'],
  [44.675, -63.540, 44.700, -63.515, 'elevated'],
  [44.675, -63.515, 44.700, -63.490, 'watch'],
  [44.650, -63.515, 44.675, -63.490, 'elevated'],
  [44.650, -63.490, 44.675, -63.465, 'watch'],
  [44.625, -63.490, 44.650, -63.465, 'baseline'],
  [44.625, -63.465, 44.650, -63.440, 'baseline'],
  // ── Hwy 102 / 118 interchange zone ──
  [44.720, -63.660, 44.745, -63.635, 'critical'],
  [44.720, -63.635, 44.745, -63.610, 'elevated'],
  [44.745, -63.660, 44.770, -63.635, 'critical'],
  [44.745, -63.635, 44.770, -63.610, 'elevated'],
  [44.770, -63.660, 44.795, -63.635, 'elevated'],
  [44.770, -63.635, 44.795, -63.610, 'watch'],
  // ── Hwy 111 Dartmouth connector ──
  [44.700, -63.590, 44.725, -63.565, 'elevated'],
  [44.725, -63.615, 44.750, -63.590, 'watch'],
  [44.725, -63.590, 44.750, -63.565, 'watch'],
  [44.750, -63.615, 44.775, -63.590, 'baseline'],
  // ── Lower Sackville ──
  [44.755, -63.720, 44.780, -63.695, 'watch'],
  [44.755, -63.745, 44.780, -63.720, 'elevated'],
  [44.780, -63.720, 44.805, -63.695, 'watch'],
  [44.780, -63.745, 44.805, -63.720, 'watch'],
  [44.805, -63.770, 44.830, -63.745, 'baseline'],
  [44.805, -63.795, 44.830, -63.770, 'watch'],
  // ── Windsor Junction / Middle Musquodoboit corridor ──
  [44.820, -63.620, 44.845, -63.595, 'baseline'],
  [44.845, -63.595, 44.870, -63.570, 'watch'],
  [44.870, -63.595, 44.895, -63.570, 'elevated'],
  [44.895, -63.595, 44.920, -63.570, 'watch'],
  [44.895, -63.570, 44.920, -63.545, 'baseline'],
  [44.920, -63.545, 44.945, -63.520, 'watch'],
  [44.945, -63.520, 44.970, -63.495, 'elevated'],
  [44.970, -63.520, 44.995, -63.495, 'watch'],
  [44.970, -63.495, 44.995, -63.470, 'baseline'],
  [44.995, -63.470, 45.020, -63.445, 'watch'],
  [45.020, -63.470, 45.045, -63.445, 'elevated'],
  [45.045, -63.445, 45.070, -63.420, 'watch'],
  [45.070, -63.420, 45.095, -63.395, 'baseline'],
  [45.095, -63.395, 45.120, -63.370, 'watch'],
  [45.120, -63.395, 45.145, -63.370, 'baseline'],
  [45.145, -63.370, 45.170, -63.345, 'baseline'],
  // ── Truro approach ──
  [45.170, -63.345, 45.195, -63.320, 'watch'],
  [45.195, -63.320, 45.220, -63.295, 'elevated'],
  [45.220, -63.295, 45.245, -63.270, 'critical'],
  [45.245, -63.270, 45.270, -63.245, 'elevated'],
  [45.270, -63.245, 45.295, -63.220, 'watch'],
  // ── East Dartmouth / Hwy 107 fringe ──
  [44.680, -63.490, 44.705, -63.465, 'watch'],
  [44.680, -63.465, 44.705, -63.440, 'baseline'],
  [44.705, -63.465, 44.730, -63.440, 'watch'],
  [44.730, -63.465, 44.755, -63.440, 'baseline'],
  [44.755, -63.440, 44.780, -63.415, 'baseline'],
  // ── Antigonish segment ──
  [45.580, -62.090, 45.605, -62.065, 'watch'],
  [45.605, -62.065, 45.630, -62.040, 'elevated'],
  [45.630, -62.040, 45.655, -62.015, 'watch'],
];

// ─── COLLISION POINTS (individual events) ────────────────────────────────────
// [lat, lng, severe (bool)]  — red dot if severe, blue if not
export const COLLISION_POINTS = [
  // ── Hwy 102 north of Halifax ──
  [44.755, -63.702, true],  [44.762, -63.698, false], [44.769, -63.715, false],
  [44.776, -63.722, true],  [44.783, -63.728, false], [44.790, -63.735, false],
  [44.797, -63.741, true],  [44.804, -63.748, false], [44.748, -63.692, false],
  [44.756, -63.710, false], [44.763, -63.718, true],  [44.770, -63.725, false],
  [44.777, -63.731, false], [44.784, -63.738, true],  [44.791, -63.745, false],
  [44.798, -63.751, false], [44.805, -63.758, false], [44.812, -63.764, true],
  [44.819, -63.771, false], [44.826, -63.778, false], [44.833, -63.784, false],
  [44.740, -63.688, true],  [44.747, -63.695, false], [44.754, -63.702, false],
  // ── HRM core (Halifax-Dartmouth) ──
  [44.658, -63.628, true],  [44.662, -63.620, false], [44.666, -63.612, true],
  [44.670, -63.604, false], [44.674, -63.596, false], [44.678, -63.622, true],
  [44.682, -63.614, false], [44.686, -63.606, false], [44.690, -63.630, true],
  [44.694, -63.622, false], [44.698, -63.614, false], [44.702, -63.606, true],
  [44.655, -63.608, false], [44.659, -63.600, true],  [44.663, -63.592, false],
  [44.667, -63.584, false], [44.671, -63.618, false], [44.675, -63.610, true],
  [44.679, -63.602, false], [44.683, -63.634, false], [44.687, -63.626, true],
  [44.691, -63.618, false], [44.695, -63.610, false], [44.699, -63.602, true],
  // ── Hwy 111 / Burnside corridor ──
  [44.706, -63.580, false], [44.710, -63.572, true],  [44.714, -63.564, false],
  [44.718, -63.556, false], [44.722, -63.548, true],  [44.726, -63.540, false],
  [44.730, -63.532, false], [44.703, -63.576, true],  [44.707, -63.568, false],
  [44.711, -63.560, false], [44.715, -63.552, true],  [44.719, -63.544, false],
  [44.723, -63.536, false], [44.727, -63.528, false], [44.731, -63.520, true],
  // ── Hwy 102 interchange zone ──
  [44.724, -63.648, true],  [44.728, -63.640, false], [44.732, -63.632, true],
  [44.736, -63.648, false], [44.740, -63.640, false], [44.744, -63.632, true],
  [44.748, -63.648, false], [44.752, -63.640, false], [44.756, -63.656, true],
  [44.760, -63.648, false], [44.764, -63.640, false], [44.768, -63.656, true],
  [44.772, -63.648, false], [44.776, -63.640, false], [44.720, -63.652, true],
  // ── Cole Harbour / Eastern Passage ──
  [44.680, -63.540, false], [44.675, -63.532, true],  [44.670, -63.524, false],
  [44.665, -63.516, false], [44.660, -63.508, true],  [44.655, -63.500, false],
  [44.650, -63.492, false], [44.645, -63.484, true],  [44.683, -63.548, false],
  [44.678, -63.540, false], [44.673, -63.532, true],  [44.668, -63.524, false],
  // ── Hwy 102 toward Truro ──
  [44.870, -63.588, false], [44.895, -63.570, true],  [44.920, -63.550, false],
  [44.945, -63.530, false], [44.970, -63.510, true],  [44.995, -63.488, false],
  [45.020, -63.465, false], [45.045, -63.442, true],  [45.070, -63.418, false],
  [45.095, -63.392, false], [45.120, -63.368, false], [45.145, -63.344, true],
  [45.170, -63.320, false], [45.195, -63.296, false], [45.220, -63.272, true],
  [45.245, -63.248, false], [45.270, -63.224, false], [45.295, -63.200, true],
  [45.320, -63.176, false], [45.345, -63.152, false], [45.370, -63.128, true],
  // ── Hwy 103 southwest ──
  [44.620, -63.710, true],  [44.590, -63.780, false], [44.555, -63.860, false],
  [44.520, -63.940, true],  [44.485, -64.020, false], [44.450, -64.100, false],
  [44.415, -64.180, true],  [44.380, -64.260, false], [44.345, -64.340, false],
  // ── Antigonish / Hwy 104 ──
  [45.588, -62.082, false], [45.610, -62.058, true],  [45.632, -62.034, false],
  [45.645, -62.010, false], [45.618, -62.046, true],  [45.640, -62.022, false],
];

// ─── SCENARIO PRESETS (condition quick-selects for ResourceAllocation) ────────
export const SCENARIO_PRESETS = [
  {
    label: 'Dusk — Curved Rural Hwy (Worst Case)',
    conditions: { timeOfDay: 'dusk', roadType: 'curve', weather: 'clear', traffic: 'high' }
  },
  {
    label: 'Winter Night — Rural (Snow)',
    conditions: { timeOfDay: 'night', roadType: 'rural', weather: 'snow', traffic: 'low' }
  },
  {
    label: 'Foggy Dawn — Straight Highway',
    conditions: { timeOfDay: 'dawn', roadType: 'straight_highway', weather: 'fog', traffic: 'medium' }
  },
  {
    label: 'Summer Midday — Urban (Baseline)',
    conditions: { timeOfDay: 'day', roadType: 'urban', weather: 'clear', traffic: 'high' }
  },
];

// ─── RESOURCE ALLOCATION (operational domain matrix rows) ────────────────────
export const RESOURCE_ALLOCATION = [
  {
    domain: 'EMS Pre-Positioning',
    priority: 'Critical',
    horizon: 'Immediate (0–90 days)',
    lever: 'Predictive dispatch staging',
    impact: 'High',
    feasibility: 'High'
  },
  {
    domain: 'Infrastructure Targeting',
    priority: 'High',
    horizon: 'Medium (1–3 years)',
    lever: 'Guardrail + rumble strip placement',
    impact: 'High',
    feasibility: 'Medium'
  },
  {
    domain: 'Traffic Enforcement',
    priority: 'High',
    horizon: 'Immediate (0–90 days)',
    lever: 'Corridor patrol scheduling',
    impact: 'Medium',
    feasibility: 'High'
  },
  {
    domain: 'Public Education',
    priority: 'Medium',
    horizon: 'Ongoing',
    lever: 'Season-specific messaging (dusk, Sept)',
    impact: 'Medium',
    feasibility: 'High'
  },
  {
    domain: 'Insurance Pricing',
    priority: 'Medium',
    horizon: 'Long (3+ years)',
    lever: 'Risk-corridor premium banding',
    impact: 'Medium',
    feasibility: 'Low'
  },
  {
    domain: 'Winter Maintenance',
    priority: 'High',
    horizon: 'Immediate (seasonal)',
    lever: 'Pre-treat curve segments before events',
    impact: 'High',
    feasibility: 'High'
  },
  {
    domain: 'Data + Monitoring',
    priority: 'Low',
    horizon: 'Medium (1–3 years)',
    lever: 'Real-time severity feed integration',
    impact: 'Low',
    feasibility: 'Medium'
  },
];
