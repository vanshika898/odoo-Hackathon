import React from 'react';
import { mockDrivers } from '../mockData';

export default function Drivers() {
  return (
    <div className="loadswift-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontWeight: '700' }}>Personnel & License Safety Engine</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>Validating active regulatory certifications.</p>
        </div>
        <button style={{ background: 'var(--text-dark)', border: 'none', padding: '12px 24px', color: '#fff', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>+ Add Operator</button>
      </div>

      <table className="loadswift-table">
        <thead>
          <tr>
            <th>OPERATOR NAME</th>
            <th>LICENSE IDENTIFIER</th>
            <th>EXPIRY DATE</th>
            <th>SAFETY INDEX</th>
            <th>OPERATIONAL STATUS</th>
          </tr>
        </thead>
        <tbody>
          {mockDrivers.map(d => (
            <tr key={d.id}>
              <td style={{ fontWeight: '600' }}>{d.name}</td>
              <td>{d.license}</td>
              <td style={{ color: d.expiry.includes('EXPIRED') ? 'var(--text-retired)' : 'inherit', fontWeight: d.expiry.includes('EXPIRED') ? '600' : 'normal' }}>{d.expiry}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ background: '#e6e8ec', width: '60px', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ background: d.safety > 90 ? 'var(--text-available)' : 'var(--text-maintenance)', width: `${d.safety}%`, height: '100%' }}></div>
                  </div>
                  <span>{d.safety}%</span>
                </div>
              </td>
              <td>
                <span 
                  className="status-badge"
                  style={{
                    background: d.status === 'Available' ? 'var(--badge-available)' : d.status === 'On Trip' ? 'var(--badge-ontrip)' : 'var(--badge-suspended)',
                    color: d.status === 'Available' ? 'var(--text-available)' : d.status === 'On Trip' ? 'var(--text-ontrip)' : 'var(--text-retired)'
                  }}
                >
                  {d.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}