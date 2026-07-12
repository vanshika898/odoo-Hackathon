import React, { useState } from 'react';
import { mockRecentTrips } from '../mockData';

export default function Trips() {
  const [cargoWeight, setCargoWeight] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('VAN-05');
  const [validationError, setValidationError] = useState('');

  const handleWeightChange = (e) => {
    const weight = parseFloat(e.target.value);
    setCargoWeight(e.target.value);
    const limit = selectedVehicle === 'VAN-05' ? 500 : 5000;
    if (weight > limit) {
      setValidationError(`Allocation Alert: Vehicle Limit: ${limit} kg | Requested Input: ${weight} kg. ❌ Mass index limit breach — configuration blocked.`);
    } else {
      setValidationError('');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
      {/* Interactive Input Form Control Area */}
      <div className="loadswift-card">
        <h3 style={{ fontWeight: '700', marginBottom: '4px' }}>Deploy New Active Route Segment</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>System checks validation limits instantly upon data input.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>ORIGIN DISPATCH DEPOT</label><input type="text" placeholder="e.g., Gandhinagar Depot" className="loadswift-input" /></div>
          <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>DESTINATION DELIVERY TERMINAL</label><input type="text" placeholder="e.g., Ahmedabad Hub" className="loadswift-input" /></div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>TARGET POOL ASSET RESOURCE</label>
            <select className="loadswift-input" value={selectedVehicle} onChange={e => setSelectedVehicle(e.target.value)}>
              <option value="VAN-05">VAN-05 (Max Capacity Baseline: 500 kg)</option>
              <option value="TRUCK-11">TRUCK-11 (Max Capacity Baseline: 5000 kg)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>CARGO LOAD WEIGHT (KG)</label>
            <input type="number" value={cargoWeight} onChange={handleWeightChange} placeholder="Enter manifest payload mass index" className="loadswift-input" />
          </div>

          {validationError && (
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid var(--text-retired)', padding: '14px', borderRadius: '8px', color: 'var(--text-retired)', fontSize: '0.9rem', lineHeight: '1.4' }}>
              {validationError}
            </div>
          )}

          <button disabled={!!validationError} style={{ background: validationError ? '#b1b5c3' : 'var(--text-dark)', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', cursor: validationError ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '0.95rem', transition: '0.2s' }}>
            Initialize Route Manifest Execution
          </button>
        </div>
      </div>

      {/* Right Content Live View Board */}
      <div className="loadswift-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontWeight: '700' }}>Active Node Deployment Streams</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mockRecentTrips.map(t => (
            <div key={t.id} style={{ padding: '18px', background: '#f8f9fa', borderRadius: '10px', border: '1px solid var(--border-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700' }}>#{t.id}</span>
                <span className="status-badge" style={{ background: t.status==='On Trip'?'var(--badge-ontrip)':'#f4f5f6', color: t.status==='On Trip'?'var(--text-ontrip)':'var(--text-dark)', fontSize: '0.75rem' }}>{t.status}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Logistics Asset Mapping: <strong style={{ color: 'var(--text-dark)' }}>{t.vehicle}</strong> assigned to operator matrix pools.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}