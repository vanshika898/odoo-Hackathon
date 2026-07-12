import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [authForm, setAuthForm] = useState({ email: '', password: '', role: 'Dispatcher' });
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (failedAttempts >= 4) {
      alert("Account Locked due to 5 consecutive failed authorization attempts!");
      return;
    }
    if (authForm.email === 'Raven.k@transitops.in' && authForm.password === '123456') {
      onLoginSuccess();
    } else {
      setFailedAttempts(prev => prev + 1);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ flex: 1, background: '#1e1e24', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ width: '40px', height: '40px', background: 'var(--accent-odoo)', marginBottom: '20px', borderRadius: '4px' }}></div>
          <h1 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '8px' }}>TransitOps</h1>
          <p style={{ color: 'var(--text-muted)' }}>Smart Transport Operations Platform</p>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TRANSITOPS © 2026 • RBAC ENABLED</p>
      </div>

      <div style={{ flex: 1.2, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2>Sign in to your account</h2>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>EMAIL</label>
            <input type="email" placeholder="Raven.k@transitops.in" className="odoo-input" required onChange={e => setAuthForm({...authForm, email: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>PASSWORD</label>
            <input type="password" placeholder="••••••••" className="odoo-input" required onChange={e => setAuthForm({...authForm, password: e.target.value})} />
          </div>
          {failedAttempts > 0 && <div style={{ color: 'var(--status-retired)' }}>❌ Invalid credentials ({failedAttempts}/5)</div>}
          <button type="submit" style={{ background: 'var(--accent-odoo)', color: '#fff', padding: '14px', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
}