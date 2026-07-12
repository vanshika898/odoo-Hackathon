import React from 'react';
import { mockFuelLogs, mockOtherExpenses } from '../mockData';

export default function Expenses() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="odoo-card">
        <h3>Fuel Metric Optimization Logs</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '14px', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
              <th>VEHICLE RECON</th><th>LOG DATE</th><th>LITERS QUANTITY</th><th>COST</th>
            </tr>
          </thead>
          <tbody>
            {mockFuelLogs.map(f => (
              <tr key={f.id} style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '14px 0' }}>{f.vehicle}</td><td>{f.date}</td><td>{f.liters}</td><td>₹{f.cost}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="odoo-card">
        <h3>Other Auxiliary Operational Costs</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '14px', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
              <th>TRIP REF</th><th>VEHICLE ID</th><th>TOLL EXPENSE</th><th>OTHER MISC</th><th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {mockOtherExpenses.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '14px 0' }}>{o.id}</td><td>{o.vehicle}</td><td>₹{o.toll}</td><td>₹{o.other}</td><td style={{ color: 'var(--accent-odoo)', fontWeight: '700' }}>₹{o.toll + o.other + o.maintenance}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}