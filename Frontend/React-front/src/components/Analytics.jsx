import React from 'react';

export default function Analytics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 style={{ fontWeight: '700' }}>System Intelligence Data Insights</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        <div className="loadswift-card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>FUEL EFFICIENCY INDEX</p>
          <h2 style={{ fontSize: '2.2rem', marginTop: '12px', color: 'var(--text-ontrip)' }}>8.4 km/L</h2>
        </div>
        <div className="loadswift-card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>FLEET ALLOCATION INDEX</p>
          <h2 style={{ fontSize: '2.2rem', marginTop: '12px' }}>81%</h2>
        </div>
        <div className="loadswift-card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>CONSOLIDATED OPERATIONAL LOSS</p>
          <h2 style={{ fontSize: '2.2rem', marginTop: '12px', color: 'var(--text-maintenance)' }}>₹34,070</h2>
        </div>
        <div className="loadswift-card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>FLEET INVESTMENT ROI</p>
          <h2 style={{ fontSize: '2.2rem', marginTop: '12px', color: 'var(--text-available)' }}>14.2%</h2>
        </div>
      </div>
    </div>
  );
}