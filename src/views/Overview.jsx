import React from 'react';
import { Activity, ShieldCheck, Mountain } from 'lucide-react';
import { EMPIRICAL_DATA } from '../data/v2_empirical_data';

const Overview = () => {
  const { meta, question } = EMPIRICAL_DATA;

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'inline-block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-blue)', background: 'var(--bg-fog)', padding: '4px 12px', border: '1px solid var(--border-light)', borderRadius: '20px', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Executive Briefing
        </div>
        <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem', letterSpacing: '-0.03em' }}>{question.headline}</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', lineHeight: 1.6 }}>{question.statement}</p>
      </header>
      
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '4rem' }}>
        <div className="card card-transition" style={{ padding: '1.5rem' }}>
          <div className="text-meta" style={{ marginBottom: '0.5rem' }}>Empirical Records</div>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-heading)', lineHeight: 1 }}>{meta.records.toLocaleString()}</div>
        </div>
        <div className="card card-transition" style={{ padding: '1.5rem' }}>
          <div className="text-meta" style={{ marginBottom: '0.5rem' }}>Baseline Severity</div>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-heading)', lineHeight: 1 }}>{meta.severeRate}</div>
        </div>
        <div className="card card-transition" style={{ padding: '1.5rem' }}>
          <div className="text-meta" style={{ marginBottom: '0.5rem' }}>Best Estimator</div>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-heading)', lineHeight: 1 }}>{meta.model}</div>
        </div>
        <div className="card card-transition" style={{ padding: '1.5rem', borderBottom: '4px solid var(--accent-blue)' }}>
          <div className="text-meta" style={{ marginBottom: '0.5rem' }}>Max Achieved AUC</div>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent-blue)', lineHeight: 1 }}>{meta.auc.toFixed(3)}</div>
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <ShieldCheck size={24} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-heading)' }}>Scope & Methodology</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {question.insights.map((insight, idx) => (
            <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 200px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                  {insight.label}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>{insight.text}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>{insight.expand}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Overview;
