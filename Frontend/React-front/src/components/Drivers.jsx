import React from 'react';
import { mockDrivers } from '../mockData';

export default function Drivers() {
  return (
    <div className="odoo-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3>Drivers & Safety Profiles Console</h3>
        <button style={{ background: 'var(--accent-odoo)', border: 'none', padding: '10px 20px', color: '#fff', borderRadius: '4px', fontWeight: '600' }}>+ Add Driver</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
            <th style={{ paddingBottom: '12px' }}>OPERATOR</th><th>LICENSE NO.</th><th>EXPIRY DATE</th><th>SAFETY SCORE</th><th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {mockDrivers.map(d => (
            <tr key={d.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px 0' }}>{d.name}</td><td>{d.license}</td><td>{d.expiry}</td><td>{d.safety}%</td>
              <td><span className={`status-badge status-${d.status.toLowerCase().replace(' ', '')}`}>{d.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}