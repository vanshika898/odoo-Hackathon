import React from 'react';
import { mockMaintenance } from '../mockData';

export default function Maintenance() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
      <div className="loadswift-card">
        <h3 style={{ fontWeight: '700', marginBottom: '20px' }}>Log New Maintenance Log</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>VEHICLE IDENTIFIER</label><input type="text" placeholder="e.g., VAN-05" className="loadswift-input" /></div>
          <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>SERVICE CATEGORY REPAIR TASK</label><input type="text" placeholder="e.g., Engine Tune Up" className="loadswift-input" /></div>
          <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>SERVICE EXPENDITURE COST</label><input type="number" placeholder="₹" className="loadswift-input" /></div>
          <button style={{ background: 'var(--text-dark)', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}>Register Workshop Ticket</button>
        </div>
      </div>

      <div className="loadswift-card">
        <h3 style={{ fontWeight: '700', marginBottom: '20px' }}>Active Workshop Operational Queues</h3>
        <table className="loadswift-table">
          <thead>
            <tr>
              <th>VEHICLE RECON</th>
              <th>TASK DETAILED</th>
              <th>EXPENDITURE</th>
              <th>SHOP STATUS</th>
            </tr>
          </thead>
          <tbody>
            {mockMaintenance.map(m => (
              <tr key={m.id}>
                <td style={{ fontWeight: '600' }}>{m.vehicle}</td>
                <td>{m.service}</td>
                <td>₹{m.cost}</td>
                <td>
                  <span className="status-badge" style={{ background: m.status === 'In Shop' ? 'var(--badge-maintenance)' : 'var(--badge-available)', color: m.status === 'In Shop' ? 'var(--text-maintenance)' : 'var(--text-available)' }}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}