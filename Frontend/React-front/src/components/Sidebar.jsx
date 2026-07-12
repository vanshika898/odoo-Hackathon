import React from 'react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const tabs = ['Dashboard', 'Fleet', 'Drivers', 'Trips', 'Maintenance', 'Fuel & Expenses', 'Analytics'];
  return (
    <div style={{ width: '260px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border-color)', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <h2 style={{ color: '#fff', letterSpacing: '0.5px' }}>TransitOps</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            style={{
              textAlign: 'left', padding: '12px 16px', background: currentTab === tab ? 'var(--accent-odoo)' : 'transparent',
              color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}