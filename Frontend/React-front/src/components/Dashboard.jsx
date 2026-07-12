import React from 'react';
import { mockRecentTrips } from '../mockData';

export default function Dashboard() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="odoo-card"><h4>Active Vehicles</h4><h2>53</h2></div>
        <div className="odoo-card"><h4 style={{ color: 'var(--status-available)' }}>Available Vehicles</h4><h2>42</h2></div>
        <div className="odoo-card"><h4 style={{ color: 'var(--status-suspended)' }}>In Maintenance</h4><h2>05</h2></div>
        <div className="odoo-card"><h4>Active Trips</h4><h2>18</h2></div>
        <div className="odoo-card"><h4>Pending Trips</h4><h2>09</h2></div>
        <div className="odoo-card"><h4>Fleet Utilization</h4><h2>81%</h2></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        <div className="odoo-card">
          <h3>Recent Live Dispatch Board Tracking</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ paddingBottom: '12px' }}>TRIP</th><th>VEHICLE</th><th>DRIVER</th><th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {mockRecentTrips.map(trip => (
                <tr key={trip.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 0' }}>{trip.id}</td><td>{trip.vehicle}</td><td>{trip.driver}</td>
                  <td><span className={`status-badge status-${trip.status.toLowerCase().replace(' ', '')}`}>{trip.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="odoo-card">
          <h3>Active Fleet Allocation Engine</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            <div><p>Available</p><div style={{ background: 'var(--status-available)', height: '8px', borderRadius: '4px', width: '70%' }}></div></div>
            <div><p>On Trip</p><div style={{ background: 'var(--status-ontrip)', height: '8px', borderRadius: '4px', width: '20%' }}></div></div>
            <div><p>In Shop</p><div style={{ background: 'var(--status-suspended)', height: '8px', borderRadius: '4px', width: '8%' }}></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}