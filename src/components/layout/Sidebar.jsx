import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, ShieldCheck, PieChart, Users, Navigation, Map, Target } from 'lucide-react';

const navItems = [
  { path: '/',                   label: 'Overview',             icon: <Activity size={18} /> },
  { path: '/performance',        label: 'Model Performance',    icon: <PieChart size={18} /> },
  { path: '/risk-zones',         label: 'Risk Zones',           icon: <Navigation size={18} /> },
  { path: '/map',                label: 'Geographic Evidence',  icon: <Map size={18} /> },
  { path: '/archetypes',         label: 'Behavioral Profiles',  icon: <Users size={18} /> },
  { path: '/resource-allocation',label: 'Resource Allocation',  icon: <Target size={18} /> },
  { path: '/policy',             label: 'Policy Signals',       icon: <Activity size={18} /> },
  { path: '/integrity',          label: 'Integrity + Limits',   icon: <ShieldCheck size={18} /> },
];

const Sidebar = () => (
  <aside className="sidebar">
    <div style={{ padding: '0 1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
        Provincial Highway Safety
      </div>
      <h2 style={{ fontSize: '1.1rem', color: 'var(--text-heading)', lineHeight: 1.2, margin: 0 }}>
        NS Collision Severity
      </h2>
      <div style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', fontWeight: 600, marginTop: '0.35rem', letterSpacing: '0.5px' }}>
        Empirical V2 · XGBoost 0.642 AUC
      </div>
    </div>

    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', padding: '0 0.75rem', flex: 1 }}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0.65rem 0.85rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            color: isActive ? 'var(--accent-blue)' : 'var(--text-main)',
            background: isActive ? 'rgba(43,108,176,0.08)' : 'transparent',
            fontWeight: isActive ? 600 : 400,
            borderLeft: isActive ? '3px solid var(--accent-blue)' : '3px solid transparent',
            transition: 'all 0.15s ease'
          })}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>

    <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-light)' }}>
      <div style={{ padding: '10px 12px', background: 'var(--bg-fog)', border: '1px solid var(--border-light)', borderRadius: '6px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '3px' }}>Public Health Framework</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Severity conditional on collision. Not causal determinism.
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--accent-teal)', marginTop: '6px', fontWeight: 500 }}>
          Shklanka & Kodi · 2025
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;
