import React from 'react';
import { mockFuelLogs, mockOtherExpenses } from '../mockData';

export default function Expenses() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="loadswift-card">
        <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Dynamic Fuel Metric Allocations</h3>
        <table className="loadswift-table">
          <thead>
            <tr><th>VEHICLE RECON</th><th>LOG DATE</th><th>VOLUME DELIVERED</th><th>TRANSACTION EXPENSE</th></tr>
          </thead>
          <tbody>
            {mockFuelLogs.map(f => (
              <tr key={f.id}><td>{f.vehicle}</td><td>{f.date}</td><td>{f.liters}</td><td style={{ fontWeight: '600' }}>₹{f.cost}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="loadswift-card">
        <h3>Auxiliary Route Cost Tracking</h3>
        <table className="loadswift-table">
          <thead>
            <tr><th>TRIP CODE</th><th>RESOURCE ASSET</th><th>TOLL EXPENSES</th><th>AUX MISC COSTS</th><th>TOTAL STREAM AGGREGATE</th></tr>
          </thead>
          <tbody>
            {mockOtherExpenses.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: '700' }}>#{o.id}</td>
                <td>{o.vehicle}</td>
                <td>₹{o.toll}</td>
                <td>₹{o.other}</td>
                <td style={{ color: 'var(--text-dark)', fontWeight: '800' }}>₹{o.toll + o.other + o.maintenance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}