import React from 'react';
import { mockMaintenance } from '../mockData';

export default function Maintenance() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '30px' }}>
      <div className="odoo-card">
        <h3>Log Service Record Entry</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          <div><label style={{ color: 'var(--text-muted)' }}>VEHICLE ASSIGNMENT ID</label><input type="text" placeholder="VAN-05" className="odoo-input" /></div>
          <div><label style={{ color: 'var(--text-muted)' }}>SERVICE TYPE TASK</label><input type="text" placeholder="Oil Change" className="odoo-input" /></div>
          <div><label style={{ color: 'var(--text-muted)' }}>COST EXPENDITURE</label><input type="number" placeholder="2500" className="odoo-input" /></div>
          <button style={{ background: 'var(--accent-odoo)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '600' }}>Save Service Record</button>
        </div>
      </div>
      <div className="odoo-card">
        <h3>Active System Maintenance Workshop Log</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ paddingBottom: '12px' }}>VEHICLE</th><th>SERVICE DESCRIPTION</th><th>REPAIR COST</th><th>SHOP STATUS</th>
            </tr>
          </thead>
          <tbody>
            {mockMaintenance.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '14px 0' }}>{m.vehicle}</td><td>{m.service}</td><td>₹{m.cost}</td>
                <td><span className={`status-badge status-${m.status === 'In Shop' ? 'suspended' : 'available'}`}>{m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}