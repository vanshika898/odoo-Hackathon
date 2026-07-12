import React from 'react';
import { mockVehicles } from '../mockData';

export default function Fleet() {
  return (
    <div className="loadswift-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontWeight: '700' }}>Vehicle Configuration Master Registry</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>Total vehicles configured in standard deployment loops.</p>
        </div>
        <button style={{ background: 'var(--text-dark)', border: 'none', padding: '12px 24px', color: '#fff', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>+ Add Asset Model</button>
      </div>

      <table className="loadswift-table">
        <thead>
          <tr>
            <th>REGISTRATION NO.</th>
            <th>ASSET MODEL</th>
            <th>CLASSIFICATION</th>
            <th>MAX CAPACITY</th>
            <th>ODOMETER</th>
            <th>SYSTEM STATUS</th>
          </tr>
        </thead>
        <tbody>
          {mockVehicles.map(v => (
            <tr key={v.id}>
              <td style={{ fontWeight: '600' }}>{v.reg_no}</td>
              <td>{v.name}</td>
              <td>{v.type}</td>
              <td>{v.capacity} kg</td>
              <td>{v.odometer} km</td>
              <td>
                <span 
                  className="status-badge"
                  style={{
                    background: v.status === 'Available' ? 'var(--badge-available)' : v.status === 'On Trip' ? 'var(--badge-ontrip)' : v.status === 'In Shop' ? 'var(--badge-maintenance)' : 'var(--badge-retired)',
                    color: v.status === 'Available' ? 'var(--text-available)' : v.status === 'On Trip' ? 'var(--text-ontrip)' : v.status === 'In Shop' ? 'var(--text-maintenance)' : 'var(--text-retired)'
                  }}
                >
                  {v.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}