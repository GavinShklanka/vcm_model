import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Overview from './views/Overview';
import Performance from './views/Performance';
import RiskZones from './views/RiskZones';
import Archetypes from './views/Archetypes';
import Policy from './views/Policy';
import Integrity from './views/Integrity';
import MapEvidence from './views/MapEvidence';
import ResourceAllocation from './views/ResourceAllocation';

// Ordered presentation sequence — must match Sidebar order
const SLIDE_ROUTES = [
  { path: '/',                    label: 'Overview' },
  { path: '/performance',         label: 'Model Performance' },
  { path: '/risk-zones',          label: 'Risk Zones' },
  { path: '/map',                 label: 'Geographic Evidence' },
  { path: '/archetypes',          label: 'Behavioral Profiles' },
  { path: '/resource-allocation', label: 'Resource Allocation' },
  { path: '/policy',              label: 'Policy Signals' },
  { path: '/integrity',           label: 'Integrity + Limits' },
];

function PresentationNav({ onExit }) {
  const navigate   = useNavigate();
  const { pathname } = useLocation();

  const currentIdx = SLIDE_ROUTES.findIndex(r =>
    r.path === '/' ? pathname === '/' : pathname.startsWith(r.path)
  );
  const idx = currentIdx < 0 ? 0 : currentIdx;

  const goTo = (i) => {
    if (i >= 0 && i < SLIDE_ROUTES.length) navigate(SLIDE_ROUTES[i].path);
  };

  const btnBase = {
    padding: '8px 14px', border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
    transition: 'all 0.15s ease'
  };

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px',
      display: 'flex', gap: '6px', alignItems: 'center',
      background: 'white', border: '1px solid var(--border-light)',
      borderRadius: '10px', padding: '8px 10px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 200
    }}>
      {/* Prev */}
      <button
        onClick={() => goTo(idx - 1)}
        disabled={idx === 0}
        style={{ ...btnBase,
          background: idx === 0 ? 'var(--bg-fog)' : 'var(--bg-fog)',
          color: idx === 0 ? 'var(--border-focus)' : 'var(--text-heading)',
          cursor: idx === 0 ? 'default' : 'pointer'
        }}
      >←</button>

      {/* Slide counter + label */}
      <div style={{ padding: '0 10px', textAlign: 'center', minWidth: '130px' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {idx + 1} of {SLIDE_ROUTES.length}
        </div>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {SLIDE_ROUTES[idx]?.label}
        </div>
      </div>

      {/* Next */}
      <button
        onClick={() => goTo(idx + 1)}
        disabled={idx === SLIDE_ROUTES.length - 1}
        style={{ ...btnBase,
          background: 'var(--accent-blue)',
          color: idx === SLIDE_ROUTES.length - 1 ? 'rgba(255,255,255,0.4)' : 'white',
          cursor: idx === SLIDE_ROUTES.length - 1 ? 'default' : 'pointer'
        }}
      >→</button>

      {/* Divider */}
      <div style={{ width: '1px', height: '28px', background: 'var(--border-light)', margin: '0 2px' }} />

      {/* Exit */}
      <button onClick={onExit} style={{ ...btnBase, background: 'var(--bg-fog)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Exit
      </button>
    </div>
  );
}

function App() {
  const [presentationMode, setPresentationMode] = useState(false);

  return (
    <div className={`app-container ${presentationMode ? 'presentation-mode' : ''}`}>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/"                    element={<Overview />} />
          <Route path="/performance"         element={<Performance />} />
          <Route path="/risk-zones"          element={<RiskZones />} />
          <Route path="/map"                 element={<MapEvidence />} />
          <Route path="/archetypes"          element={<Archetypes />} />
          <Route path="/resource-allocation" element={<ResourceAllocation />} />
          <Route path="/policy"              element={<Policy />} />
          <Route path="/integrity"           element={<Integrity />} />
          <Route path="*"                    element={<Navigate to="/" replace />} />
        </Routes>

        {presentationMode
          ? <PresentationNav onExit={() => setPresentationMode(false)} />
          : (
            <button
              onClick={() => setPresentationMode(true)}
              style={{
                position: 'fixed', bottom: '20px', right: '20px',
                padding: '8px 18px', background: 'var(--accent-blue)',
                color: 'white', border: 'none', borderRadius: '6px',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                boxShadow: '0 2px 8px rgba(43,108,176,0.3)', zIndex: 100
              }}
            >
              Present
            </button>
          )
        }
      </main>
    </div>
  );
}

export default App;
