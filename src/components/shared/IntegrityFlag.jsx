import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const IntegrityFlag = ({ message }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 500, color: 'var(--accent-blue)', background: 'rgba(43,108,176,0.08)', border: '1px solid rgba(43,108,176,0.2)', padding: '4px 10px', borderRadius: '20px' }}>
    <ShieldCheck size={13} />
    {message || 'Empirical V2 · XGBoost 0.642 AUC · Real NS Data'}
  </div>
);

export const CausalBoundary = () => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 14px', background: 'rgba(183,121,31,0.08)', border: '1px solid rgba(183,121,31,0.2)', borderRadius: '6px', fontSize: '0.82rem' }}>
    <AlertCircle size={14} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '1px' }} />
    <span style={{ color: 'var(--text-main)', lineHeight: 1.5 }}>
      Severity conditional on collision. This is a prioritization tool, not causal determinism or crash prediction.
    </span>
  </div>
);

export default IntegrityFlag;
