import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, ShieldCheck, PieChart, Users, Navigation, Map, Target, Layers, Play } from 'lucide-react';

const navItems = [
  { path: '/',                    label: 'Overview',                   icon: <Activity size={18} /> },
  { path: '/performance',         label: 'Scoring Architecture',       icon: <PieChart size={18} /> },
  { path: '/features',            label: 'Intelligence Architecture',  icon: <Layers size={18} /> },
  { path: '/risk-zones',          label: 'Risk Zones',                 icon: <Navigation size={18} /> },
  { path: '/map',                 label: 'Geographic Evidence',        icon: <Map size={18} /> },
  { path: '/archetypes',          label: 'Intervention Profiles',      icon: <Users size={18} /> },
  { path: '/resource-allocation', label: 'Resource Allocation',        icon: <Target size={18} /> },
  { path: '/policy',              label: 'Policy Signals',             icon: <Activity size={18} /> },
  { path: '/integrity',           label: 'Integrity + Limits',         icon: <ShieldCheck size={18} /> },
  { path: '/presentation',        label: 'Presentation',               icon: <Play size={18} /> },
];

/* Flow connector pill strip */
const FLOW_STEPS = ['Data', 'Features', 'Models', 'Geography', 'Action'];

const Sidebar = () => (
  <aside className="sidebar">
    <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1A7FA0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>
        Provincial Highway Safety
      </div>
      <h2 style={{ fontSize: '1.05rem', color: 'var(--text-heading)', lineHeight: 1.2, margin: 0 }}>
        NS Collision Severity
      </h2>
      <div style={{ fontSize: '0.75rem', color: '#1A7FA0', fontWeight: 600, marginTop: '0.3rem', letterSpacing: '0.4px' }}>
        V2 Ensemble · 0.6576 AUC
      </div>
    </div>

    {/* Flow connector pills */}
    <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', gap: '3px', alignItems: 'center', justifyContent: 'center' }}>
        {FLOW_STEPS.map((step, i) => (
          <React.Fragment key={i}>
            <span style={{
              fontSize: '0.62rem', fontWeight: 600, color: '#8899AB',
              background: '#F4F7FA', padding: '2px 7px', borderRadius: '10px',
              border: '1px solid #E2E8F0', textTransform: 'uppercase', letterSpacing: '0.3px',
              whiteSpace: 'nowrap',
            }}>
              {step}
            </span>
            {i < FLOW_STEPS.length - 1 && (
              <span style={{ fontSize: '0.55rem', color: '#CBD5E1' }}>›</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>

    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.12rem', padding: '0 0.75rem', flex: 1 }}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0.6rem 0.85rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.85rem',
            color: isActive ? '#1A7FA0' : 'var(--text-main)',
            background: isActive ? 'rgba(26,127,160,0.08)' : 'transparent',
            fontWeight: isActive ? 600 : 400,
            borderLeft: isActive ? '3px solid #1A7FA0' : '3px solid transparent',
            transition: 'all 0.15s ease'
          })}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>

    <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-light)' }}>
      <div style={{ padding: '10px 12px', background: 'var(--bg-fog)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '3px' }}>Public Health Framework</div>
        <div style={{ fontSize: '0.7rem', color: '#8899AB', lineHeight: 1.5 }}>
          Severity conditional on collision. Not causal determinism.
        </div>
        <div style={{ fontSize: '0.67rem', color: '#1A7FA0', marginTop: '5px', fontWeight: 500 }}>
          Shklanka &amp; Kodi · 2025
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;
