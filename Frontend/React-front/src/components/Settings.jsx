import React, { useState } from 'react';

export default function Settings() {
  const [switches, setSwitches] = useState({ engine: true, check: true, routing: false });

  return (
    <div className="loadswift-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ fontWeight: '700' }}>System Processing Switchboards</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Configure low-level logical validation barriers.</p>
      </div>

      {['engine', 'check', 'routing'].map((key, i) => (
        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: i !== 2 ? '1px solid var(--border-muted)' : 'none' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>
              {key === 'engine' ? 'Automated Cost Calculation Engine' : key === 'check' ? 'Strict Capacity & Weight Overload Barrier' : 'Real-time Fleet Map Synchronization'}
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>Toggling changes operational constraint engine execution profiles.</p>
          </div>
          <button 
            onClick={() => setSwitches({...switches, [key]: !switches[key]})}
            style={{
              background: switches[key] ? 'var(--text-dark)' : '#e6e8ec', color: switches[key] ? '#fff' : 'var(--text-muted)',
              border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem'
            }}
          >
            {switches[key] ? 'ACTIVE ENGINE' : 'MUTED LOOP'}
          </button>
        </div>
      ))}
    </div>
  );
}