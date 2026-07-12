import React, { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    autoEmission: true,
    evidenceRequired: true,
    badgeAutoAward: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* SYSTEM OPERATIONS CONFIGURATION CARD */}
      <div className="odoo-card">
        <h3>System Preferences & Configuration</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', marginBottom: '24px' }}>
          Manage core operational switches, system rules, and global processing toggles.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* TOGGLE ELEMENT 1 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>Auto Operational Processing Engine</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                When enabled, trip expenses and metrics update automatically from linked fuel and service records.
              </p>
            </div>
            <button 
              onClick={() => handleToggle('autoEmission')}
              style={{
                background: settings.autoEmission ? 'var(--status-available)' : 'var(--status-draft)',
                color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', width: '90px', transition: '0.2s'
              }}
            >
              {settings.autoEmission ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* TOGGLE ELEMENT 2 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>Strict License & Capacity Validation Checks</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                Enforce critical capacity and license checks instantly during form submissions to block restricted dispatches.
              </p>
            </div>
            <button 
              onClick={() => handleToggle('evidenceRequired')}
              style={{
                background: settings.evidenceRequired ? 'var(--status-available)' : 'var(--status-draft)',
                color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', width: '90px', transition: '0.2s'
              }}
            >
              {settings.evidenceRequired ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* TOGGLE ELEMENT 3 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>Auto Status Transition Logs</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                Automatically move vehicle states to "In Shop" when an active maintenance task is submitted.
              </p>
            </div>
            <button 
              onClick={() => handleToggle('badgeAutoAward')}
              style={{
                background: settings.badgeAutoAward ? 'var(--status-available)' : 'var(--status-draft)',
                color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', width: '90px', transition: '0.2s'
              }}
            >
              {settings.badgeAutoAward ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICATION HUB CARD */}
      <div className="odoo-card">
        <h3>Notification Routing Console</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', marginBottom: '24px' }}>
          Configure system alerts for vehicle status changes, expiring driver documentation, or budget breaches.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* NOTIFICATION TOGGLE 1 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>Email Notification Gateway</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>Receive standard daily analytics reports directly to registered email endpoints.</p>
            </div>
            <button 
              onClick={() => handleToggle('emailNotifications')}
              style={{
                background: settings.emailNotifications ? 'var(--accent-odoo)' : 'var(--status-draft)',
                color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', width: '90px', transition: '0.2s'
              }}
            >
              {settings.emailNotifications ? 'ACTIVE' : 'MUTED'}
            </button>
          </div>

          {/* NOTIFICATION TOGGLE 2 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>In-App Console Alerts</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>Show floating top alert panels for critical priority maintenance breakdowns.</p>
            </div>
            <button 
              onClick={() => handleToggle('pushNotifications')}
              style={{
                background: settings.pushNotifications ? 'var(--accent-odoo)' : 'var(--status-draft)',
                color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', width: '90px', transition: '0.2s'
              }}
            >
              {settings.pushNotifications ? 'ACTIVE' : 'MUTED'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}