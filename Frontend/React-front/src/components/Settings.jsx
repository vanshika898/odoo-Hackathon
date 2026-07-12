import React, { useState } from 'react';

export default function Settings() {
  // State for Switchboards
  const [switches, setSwitches] = useState({ engine: true, check: true, routing: false });

  // State for User Management
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([{ id: 1, name: 'Raven K.', email: 'raven@transitops.in', role: 'Fleet Manager' }]);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Driver' });

  const handleAddUser = (e) => {
    e.preventDefault();
    setUsers([...users, { id: Date.now(), ...formData }]);
    setShowForm(false);
    setFormData({ name: '', email: '', role: 'Driver' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. User Access Management Section */}
      <div className="loadswift-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontWeight: '700' }}>User Access Management</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage system roles and identity tokens.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ background: 'var(--text-dark)', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            {showForm ? 'Cancel' : '+ Add New User'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddUser} style={{ marginBottom: '24px', padding: '20px', border: '2px solid var(--accent-gold)', borderRadius: '12px', background: '#fffcf0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <input className="loadswift-input" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <input className="loadswift-input" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <select className="loadswift-input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="Driver">Driver</option>
                <option value="Financial Analyst">Financial Analyst</option>
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Safety Officer">Safety Officer</option>
              </select>
            </div>
            <button type="submit" style={{ marginTop: '16px', background: 'var(--text-available)', color: '#fff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Register User</button>
          </form>
        )}

        <table className="loadswift-table">
          <thead><tr><th>NAME</th><th>EMAIL</th><th>ROLE</th></tr></thead>
          <tbody>{users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>)}</tbody>
        </table>
      </div>

      {/* 2. System Processing Switchboards Section */}
      <div className="loadswift-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ fontWeight: '700' }}>System Processing Switchboards</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Configure low-level logical validation barriers.</p>
        </div>

        {['engine', 'check', 'routing'].map((key, i) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: i !== 2 ? '1px solid var(--border-muted)' : 'none' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>
                {key === 'engine' ? 'Automated Cost Calculation Engine' : key === 'check' ? 'Strict Capacity & Weight Overload Barrier' : 'Real-time Fleet Map Synchronization'}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>Toggling changes operational constraint engine execution profiles.</p>
            </div>
            <button 
              onClick={() => setSwitches({...switches, [key]: !switches[key]})}
              style={{
                background: switches[key] ? 'var(--text-dark)' : '#e6e8ec', color: switches[key] ? '#fff' : 'var(--text-muted)',
                border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem'
              }}
            >
              {switches[key] ? 'ACTIVE ENGINE' : 'MUTED LOOP'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}