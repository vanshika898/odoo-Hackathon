import React, { useState } from "react";
import { Bell, Building2, Check, ChevronRight, CircleUserRound, LockKeyhole, Mail, MapPinned, Plus, Settings2, ShieldCheck, SlidersHorizontal, UsersRound, X } from "lucide-react";
import { api } from "../api";

const preferences = [
  { key: "engine", icon: Settings2, title: "Automated cost calculation", description: "Calculate route, fuel and operating costs as activity is logged." },
  { key: "check", icon: ShieldCheck, title: "Capacity protection", description: "Block dispatches that exceed a vehicle's approved cargo capacity." },
  { key: "routing", icon: MapPinned, title: "Live fleet tracking", description: "Keep active vehicle locations and route progress synchronized." },
];

function Toggle({ checked, onChange, label }) { 
  return <button className={`settings-toggle ${checked ? "is-on" : ""}`} type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange}><span /></button>; 
}

const roleMap = {
  "Driver": "Driver",
  "Financial Analyst": "FinancialAnalyst",
  "Fleet Manager": "FleetManager",
  "Safety Officer": "SafetyOfficer",
  "Dispatcher": "Dispatcher"
};

export default function Settings({ user }) {
  const [switches, setSwitches] = useState({ engine: true, check: true, routing: false });
  
  // Invite form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Driver" });
  const [inviteStatus, setInviteStatus] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);

  // Password form state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordStatus, setPasswordStatus] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Check roles
  const canInvite = user?.accountType === "FleetManager" || user?.accountType === "Admin";

  const handleAddUser = async (event) => {
    event.preventDefault();
    setInviteStatus("");
    setSendingInvite(true);

    try {
      const dbRole = roleMap[formData.role] || formData.role;
      const res = await api.post("/auth/register", {
        fullName: formData.name,
        email: formData.email,
        accountType: dbRole
      });

      if (res.success) {
        setInviteStatus("✅ Registration invite sent successfully! Temporary password generated and emailed.");
        setFormData({ name: "", email: "", role: "Driver" });
        setTimeout(() => {
          setShowForm(false);
          setInviteStatus("");
        }, 3000);
      }
    } catch (error) {
      setInviteStatus(`❌ Failed to register user: ${error.message}`);
    } finally {
      setSendingInvite(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordStatus("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus("❌ Passwords do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await api.post("/auth/change-pass", {
        email: user.email,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmPassword
      });

      if (res.success) {
        setPasswordStatus("✅ Password changed successfully!");
        setPasswordData({ newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordStatus("");
        }, 3000);
      }
    } catch (error) {
      setPasswordStatus(`❌ Failed to change password: ${error.message}`);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div>
          <span className="settings-eyebrow">Workspace setup</span>
          <h1>Settings</h1>
          <p>Manage your operational preferences, security, and team invites.</p>
        </div>
      </header>
      
      <div className="settings-layout">
        <aside className="settings-side-nav">
          <button className="is-active" type="button"><Building2 size={16} /> Company profile<ChevronRight size={15} /></button>
          <button type="button"><SlidersHorizontal size={16} /> Operations</button>
          <button type="button" onClick={() => setShowForm(true)}><UsersRound size={16} /> Team access</button>
          <button type="button" onClick={() => setShowPasswordForm(true)}><LockKeyhole size={16} /> Security</button>
        </aside>

        <div className="settings-content">
          <section className="settings-card settings-company-card">
            <header>
              <div className="settings-card-icon"><Building2 size={18} /></div>
              <div>
                <h2>Workspace Profile</h2>
                <p>Company information active on your Gateway Account.</p>
              </div>
            </header>
            <div className="settings-company-body">
              <div className="settings-company-mark">TO</div>
              <div className="settings-company-fields">
                <label>Operator Name<input className="loadswift-input" readOnly value={user?.fullName || "TransitOps Operator"} /></label>
                <label>Associated Email<input className="loadswift-input" readOnly type="email" value={user?.email || "ops@transitops.in"} /></label>
                <label>Workspace Role<input className="loadswift-input" readOnly value={user?.accountType || "Operator"} /></label>
                <label>Gateway Status<input className="loadswift-input" readOnly value="ACTIVE CONNECTIVITY" /></label>
              </div>
            </div>
          </section>

          <section className="settings-card settings-preferences-card">
            <header>
              <div className="settings-card-icon is-blue"><SlidersHorizontal size={18} /></div>
              <div>
                <h2>Operational preferences</h2>
                <p>Control the guardrails your team uses every day.</p>
              </div>
            </header>
            <div className="settings-preference-list">
              {preferences.map((preference, index) => {
                const Icon = preference.icon;
                return (
                  <div className="settings-preference" key={preference.key}>
                    <span className="settings-preference-icon"><Icon size={17} /></span>
                    <div>
                      <strong>{preference.title}</strong>
                      <p>{preference.description}</p>
                    </div>
                    <Toggle 
                      checked={switches[preference.key]} 
                      label={preference.title} 
                      onChange={() => setSwitches((current) => ({ ...current, [preference.key]: !current[preference.key] }))} 
                    />
                    {index < preferences.length - 1 && <i />}
                  </div>
                );
              })}
            </div>
          </section>

          {canInvite && (
            <section className="settings-card settings-team-card">
              <header>
                <div className="settings-card-icon is-yellow"><UsersRound size={18} /></div>
                <div>
                  <h2>Team invites</h2>
                  <p>Create new login credentials and assign system roles.</p>
                </div>
                <button className="settings-invite-button" type="button" onClick={() => setShowForm((current) => !current)}>
                  {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Invite member</>}
                </button>
              </header>

              {showForm && (
                <form className="settings-invite-form" onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "10px" }}>
                  {inviteStatus && <p style={{ fontSize: "0.85rem", fontWeight: "600" }}>{inviteStatus}</p>}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>FULL NAME *</label>
                    <input 
                      className="loadswift-input" required value={formData.name} 
                      onChange={(event) => setFormData({ ...formData, name: event.target.value })} 
                      placeholder="e.g. Priya Shah" disabled={sendingInvite}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>EMAIL ADDRESS *</label>
                    <input 
                      className="loadswift-input" required type="email" value={formData.email} 
                      onChange={(event) => setFormData({ ...formData, email: event.target.value })} 
                      placeholder="name@company.com" disabled={sendingInvite}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>WORKSPACE ROLE *</label>
                    <select 
                      className="loadswift-input" style={{ width: "100%" }} value={formData.role} 
                      onChange={(event) => setFormData({ ...formData, role: event.target.value })} disabled={sendingInvite}
                    >
                      <option>Driver</option>
                      <option>Financial Analyst</option>
                      <option>Fleet Manager</option>
                      <option>Safety Officer</option>
                    </select>
                  </div>
                  <button type="submit" disabled={sendingInvite} style={{ background: "var(--text-dark)", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyItems: "center", gap: "8px" }}>
                    <Mail size={16} /> Send registration invite
                  </button>
                </form>
              )}
            </section>
          )}

          <section className="settings-card settings-security-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <span className="settings-card-icon" style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563eb" }}><LockKeyhole size={18} /></span>
                <div>
                  <h2>Security Credentials</h2>
                  <p>Update your secure operational gateway password.</p>
                </div>
              </div>
              <button 
                type="button" className="settings-invite-button"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </button>
            </header>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "10px" }}>
                {passwordStatus && <p style={{ fontSize: "0.85rem", fontWeight: "600" }}>{passwordStatus}</p>}
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>NEW PASSWORD *</label>
                  <input 
                    type="password" className="loadswift-input" required minLength="8"
                    value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="••••••••" disabled={changingPassword}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>CONFIRM NEW PASSWORD *</label>
                  <input 
                    type="password" className="loadswift-input" required minLength="8"
                    value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="••••••••" disabled={changingPassword}
                  />
                </div>
                <button type="submit" disabled={changingPassword} style={{ background: "var(--text-dark)", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", width: "200px" }}>
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
