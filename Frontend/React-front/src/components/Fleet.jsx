import React from 'react';
import { mockVehicles } from '../mockData';

export default function Fleet() {
  return (
    <div className="odoo-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3>Vehicle Configuration Registry Console</h3>
        <button style={{ background: 'var(--accent-odoo)', border: 'none', padding: '10px 20px', color: '#fff', borderRadius: '4px', fontWeight: '600' }}>+ Add Vehicle</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
            <th style={{ paddingBottom: '12px' }}>REG. NO.</th><th>MODEL NAME</th><th>TYPE</th><th>CAPACITY</th><th>ODOMETER</th><th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {mockVehicles.map(v => (
            <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px 0' }}>{v.reg_no}</td><td>{v.name}</td><td>{v.type}</td><td>{v.capacity} kg</td><td>{v.odometer}</td>
              <td><span className={`status-badge status-${v.status.toLowerCase().replace(' ', '')}`}>{v.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}