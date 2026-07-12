import React from 'react';
import { mockRecentTrips } from '../mockData';

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Welcome back, Raven K.</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>TransitOps console platform tracking and managing optimization streams.</p>
      </div>

      {/* KPI Element Matrix Block Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Financial KPI Box Panel */}
        <div className="loadswift-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>📈 Operation Funds</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>See details ↗</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Consolidated balance ledger:</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0', color: 'var(--text-available)' }}>₹71,300.00</h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-muted)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>Fleet Utilization Capacity:</span>
            <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>81%</span>
          </div>
        </div>

        {/* Live Map Frame Placeholder Engine Widget */}
        <div className="loadswift-card" style={{ padding: '0', overflow: 'hidden', height: '240px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2, background: '#fff', padding: '6px 14px', borderRadius: '6px', fontWeight: '700', fontSize: '0.85rem', border: '1px solid var(--border-muted)' }}>Active Tracking Map</div>
          <div style={{ width: '100%', height: '100%', background: '#e5e9f0', backgroundImage: 'radial-gradient(#ccd3e0 2px, transparent 2px)', backgroundSize: '16px 16px', opacity: 0.8 }}>
            {/* Simulated Vector Pins mimicking mockup layout maps */}
            <div style={{ position: 'absolute', top: '40%', left: '30%', width: '12px', height: '12px', background: 'var(--text-dark)', borderRadius: '50%', border: '2px solid #fff' }}></div>
            <div style={{ position: 'absolute', top: '60%', left: '70%', width: '24px', height: '24px', background: 'var(--text-ontrip)', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}></div>
          </div>
        </div>
      </div>

      {/* Main Monitoring Tracking Data Log Segment */}
      <div className="loadswift-card">
        <h3 style={{ marginBottom: '20px', fontWeight: '700' }}>Recent Fleet Trip Dispatch Deployments</h3>
        <table className="loadswift-table">
          <thead>
            <tr>
              <th>TRIP IDENTIFIER</th>
              <th>RESOURCE VEHICLE</th>
              <th>ASSIGNED OPERATOR</th>
              <th>LIVE STATE ENGINE</th>
            </tr>
          </thead>
          <tbody>
            {mockRecentTrips.map(trip => (
              <tr key={trip.id}>
                <td style={{ fontWeight: '700' }}>#{trip.id}</td>
                <td>{trip.vehicle}</td>
                <td>{trip.driver}</td>
                <td>
                  <span 
                    className="status-badge" 
                    style={{
                      background: trip.status === 'On Trip' ? 'var(--badge-ontrip)' : trip.status === 'Completed' ? 'var(--badge-available)' : 'var(--border-muted)',
                      color: trip.status === 'On Trip' ? 'var(--text-ontrip)' : trip.status === 'Completed' ? 'var(--text-available)' : 'var(--text-dark)'
                    }}
                  >
                    {trip.status}
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