import React from 'react';

export default function Analytics() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
      <div className="odoo-card"><h4>Fuel Efficiency Factor</h4><h2 style={{ color: 'var(--status-ontrip)' }}>8.4 km/L</h2></div>
      <div className="odoo-card"><h4>Active Fleet Utilization Matrix</h4><h2>81%</h2></div>
      <div className="odoo-card"><h4>Consolidated Operational Expense</h4><h2 style={{ color: 'var(--status-suspended)' }}>₹34,070</h2></div>
      <div className="odoo-card"><h4>Aggregated Fleet Return-On-Investment (ROI)</h4><h2 style={{ color: 'var(--status-available)' }}>14.2%</h2></div>
    </div>
  );
}