import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Fleet from './components/Fleet';
import Drivers from './components/Drivers';
import Trips from './components/Trips';
import Maintenance from './components/Maintenance';
import Expenses from './components/Expenses';
import Analytics from './components/Analytics';
import Login from './components/Login';
import Settings from './components/Settings';
import './index.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState('Dashboard');

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <input type="text" placeholder="Search operational matrices..." className="odoo-input" style={{ maxWidth: '320px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Raven K.</span>
            <span style={{ background: '#24242b', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-odoo)' }}>DISPATCHER</span>
          </div>
        </div>

        {currentTab === 'Dashboard' && <Dashboard />}
        {currentTab === 'Fleet' && <Fleet />}
        {currentTab === 'Drivers' && <Drivers />}
        {currentTab === 'Trips' && <Trips />}
        {currentTab === 'Maintenance' && <Maintenance />}
        {currentTab === 'Fuel & Expenses' && <Expenses />}
        {currentTab === 'Analytics' && <Analytics />}
        {currentTab === 'Settings' && <Settings />}
      </div>
    </div>
  );
}