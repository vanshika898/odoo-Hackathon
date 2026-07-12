import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (creds.email === 'tishajain603@gmail.com' && creds.password === '123456') {
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-surface)' }}>
      {/* Form Input Container Panels Grid */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Business info</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>Enter system gateway validation credentials manually.</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>BUSINESS CONTROL EMAIL *</label>
            <input type="email" placeholder="Raven.k@transitops.in" className="loadswift-input" required onChange={e => setCreds({...creds, email: e.target.value})} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>SECURE ACCESS PIN PASSWORD *</label>
            <input type="password" placeholder="••••••••" className="loadswift-input" required onChange={e => setCreds({...creds, password: e.target.value})} />
          </div>

          {error && <p style={{ color: 'var(--text-retired)', fontSize: '0.85rem', fontWeight: '600' }}>❌ Authorization loop rejection: Input values invalid.</p>}

          <button type="submit" style={{ background: 'var(--text-dark)', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem', marginTop: '10px' }}>
            Continue to Operations Board
          </button>
        </form>
      </div>

      {/* Vector Illustration / Graphic Container side split window element mapping right side panel box layout */}
      <div style={{ flex: 1.1, background: '#f4f5f8', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '120%', height: '120%', background: '#e5e9f0', backgroundImage: 'radial-gradient(#ccd3e0 1.5px, transparent 1.5px)', backgroundSize: '20px 20px', opacity: 0.5 }}></div>
        <div style={{ zIndex: 2, background: 'var(--accent-gold)', width: '340px', height: '220px', borderRadius: '16px', boxShadow: '0px 30px 60px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '30px', color: 'var(--text-dark)' }}>
          <h2 style={{ fontWeight: '900', fontSize: '1.8rem' }}>LOAD <br /> CONNEX</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: '700', opacity: 0.8 }}>
            <span>TRANSITOPS ENGINE</span>
            <span>v2026.04</span>
          </div>
        </div>
      </div>
    </div>
  );
}