import React, { useState } from 'react';
import { mockRecentTrips } from '../mockData';

export default function Trips() {
  const [cargoWeight, setCargoWeight] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('VAN-05');
  const [validationError, setValidationError] = useState('');

  const handleWeightChange = (e) => {
    const value = e.target.value;
    setCargoWeight(value);

    const weight = parseFloat(value);

    if (isNaN(weight)) {
      setValidationError('');
      return;
    }

    const limit = selectedVehicle === 'VAN-05' ? 500 : 5000;

    if (weight > limit) {
      setValidationError(
        `Vehicle Capacity: ${limit} kg | Cargo Weight: ${weight} kg ❌ Capacity exceeded by ${weight - limit} kg — dispatch blocked.`
      );
    } else {
      setValidationError('');
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '30px',
      }}
    >
      <div className="odoo-card">
        <h3>Deploy New Operational Trip Dispatcher</h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '20px',
          }}
        >
          <div>
            <label style={{ color: 'var(--text-muted)' }}>
              SOURCE NODE DEPOT
            </label>
            <input
              type="text"
              placeholder="Gandhinagar Depot"
              className="odoo-input"
            />
          </div>

          <div>
            <label style={{ color: 'var(--text-muted)' }}>
              DESTINATION HUB
            </label>
            <input
              type="text"
              placeholder="Ahmedabad Hub"
              className="odoo-input"
            />
          </div>

          <div>
            <label style={{ color: 'var(--text-muted)' }}>
              VEHICLE ALLOCATION POOL
            </label>

            <select
              className="odoo-input"
              value={selectedVehicle}
              onChange={(e) => {
                const vehicle = e.target.value;
                setSelectedVehicle(vehicle);

                if (cargoWeight !== '') {
                  const weight = parseFloat(cargoWeight);
                  const limit = vehicle === 'VAN-05' ? 500 : 5000;

                  if (weight > limit) {
                    setValidationError(
                      `Vehicle Capacity: ${limit} kg | Cargo Weight: ${weight} kg ❌ Capacity exceeded by ${weight - limit} kg — dispatch blocked.`
                    );
                  } else {
                    setValidationError('');
                  }
                }
              }}
            >
              <option value="VAN-05">
                VAN-05 (Max Capacity: 500 kg)
              </option>
              <option value="TRUCK-11">
                TRUCK-11 (Max Capacity: 5000 kg)
              </option>
            </select>
          </div>

          <div>
            <label style={{ color: 'var(--text-muted)' }}>
              CARGO WEIGHT RECORD (KG)
            </label>

            <input
              type="number"
              value={cargoWeight}
              onChange={handleWeightChange}
              placeholder="Enter cargo load mass"
              className="odoo-input"
            />
          </div>

          {validationError && (
            <div
              style={{
                background: 'rgba(255,102,102,0.1)',
                border: '1px solid var(--status-retired)',
                padding: '14px',
                borderRadius: '6px',
                color: 'var(--status-retired)',
                fontSize: '0.9rem',
              }}
            >
              {validationError}
            </div>
          )}

          <button
            disabled={!!validationError}
            style={{
              background: validationError
                ? '#2c2c35'
                : 'var(--accent-odoo)',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: '6px',
              cursor: validationError ? 'not-allowed' : 'pointer',
              fontWeight: '600',
            }}
          >
            Dispatch Active Run Workflow
          </button>
        </div>
      </div>

      <div className="odoo-card">
        <h3>Live Structural Active Execution Matrix</h3>

        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {mockRecentTrips.map((t) => (
            <div
              key={t.id}
              style={{
                padding: '16px',
                background: 'var(--bg-surface)',
                borderRadius: '6px',
                borderLeft: `4px solid ${
                  t.status === 'On Trip'
                    ? 'var(--status-ontrip)'
                    : 'var(--border-color)'
                }`,
              }}
            >
              <h4>{t.id} : Active Node Execution Segment</h4>

              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                }}
              >
                Resource Allocation: {t.vehicle} / Driver Target Matrix
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}