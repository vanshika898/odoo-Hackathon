import React, { useState } from "react";
import { Bell, Building2, Check, ChevronRight, CircleUserRound, LockKeyhole, Mail, MapPinned, Plus, Settings2, ShieldCheck, SlidersHorizontal, UsersRound, X } from "lucide-react";

const preferences = [
  { key: "engine", icon: Settings2, title: "Automated cost calculation", description: "Calculate route, fuel and operating costs as activity is logged." },
  { key: "check", icon: ShieldCheck, title: "Capacity protection", description: "Block dispatches that exceed a vehicle's approved cargo capacity." },
  { key: "routing", icon: MapPinned, title: "Live fleet tracking", description: "Keep active vehicle locations and route progress synchronized." },
];

function Toggle({ checked, onChange, label }) { return <button className={`settings-toggle ${checked ? "is-on" : ""}`} type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange}><span /></button>; }
function initials(name) { return name.split(" ").map((part) => part[0]).join("").slice(0, 2); }

export default function Settings() {
  const [switches, setSwitches] = useState({ engine: true, check: true, routing: false });
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [users, setUsers] = useState([{ id: 1, name: "Raven K.", email: "raven@transitops.in", role: "Fleet Manager" }]);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Driver" });
  const handleAddUser = (event) => { event.preventDefault(); setUsers((current) => [...current, { id: Date.now(), ...formData }]); setFormData({ name: "", email: "", role: "Driver" }); setShowForm(false); };

  return <div className="settings-page">
    <header className="settings-header"><div><span className="settings-eyebrow">Workspace setup</span><h1>Settings</h1><p>Manage your company profile, operational preferences and team access.</p></div><button className="settings-save-button" type="button" onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 2200); }}>{saved ? <><Check size={16} /> Changes saved</> : "Save changes"}</button></header>
    <div className="settings-layout">
      <aside className="settings-side-nav"><button className="is-active" type="button"><Building2 size={16} /> Company profile<ChevronRight size={15} /></button><button type="button"><SlidersHorizontal size={16} /> Operations</button><button type="button"><UsersRound size={16} /> Team access</button><button type="button"><Bell size={16} /> Notifications</button><button type="button"><LockKeyhole size={16} /> Security</button></aside>
      <div className="settings-content">
        <section className="settings-card settings-company-card"><header><div className="settings-card-icon"><Building2 size={18} /></div><div><h2>Company profile</h2><p>Keep the information used across your workspace up to date.</p></div></header><div className="settings-company-body"><div className="settings-company-mark">TO</div><div className="settings-company-fields"><label>Company name<input className="loadswift-input" defaultValue="TransitOps Logistics" /></label><label>Contact email<input className="loadswift-input" type="email" defaultValue="ops@transitops.in" /></label><label>Phone number<input className="loadswift-input" defaultValue="+91 98765 43210" /></label><label>Location<input className="loadswift-input" defaultValue="Ahmedabad, Gujarat" /></label></div></div></section>

        <section className="settings-card settings-preferences-card"><header><div className="settings-card-icon is-blue"><SlidersHorizontal size={18} /></div><div><h2>Operational preferences</h2><p>Control the guardrails your team uses every day.</p></div></header><div className="settings-preference-list">{preferences.map((preference, index) => { const Icon = preference.icon; return <div className="settings-preference" key={preference.key}><span className="settings-preference-icon"><Icon size={17} /></span><div><strong>{preference.title}</strong><p>{preference.description}</p></div><Toggle checked={switches[preference.key]} label={preference.title} onChange={() => setSwitches((current) => ({ ...current, [preference.key]: !current[preference.key] }))} />{index < preferences.length - 1 && <i />}</div>; })}</div></section>

        <section className="settings-card settings-team-card"><header><div className="settings-card-icon is-yellow"><UsersRound size={18} /></div><div><h2>Team access</h2><p>Invite people and assign their workspace role.</p></div><button className="settings-invite-button" type="button" onClick={() => setShowForm((current) => !current)}>{showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Invite member</>}</button></header>
          {showForm && <form className="settings-invite-form" onSubmit={handleAddUser}><label>Full name<input className="loadswift-input" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="e.g. Priya Shah" /></label><label>Email address<input className="loadswift-input" required type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="name@company.com" /></label><label>Role<select className="loadswift-input" value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value })}><option>Driver</option><option>Financial Analyst</option><option>Fleet Manager</option><option>Safety Officer</option></select></label><button type="submit"><Mail size={16} /> Send invite</button></form>}
          <div className="settings-members">{users.map((user) => <div className="settings-member" key={user.id}><span className="settings-member-avatar">{initials(user.name)}</span><div><strong>{user.name}</strong><span>{user.email}</span></div><em>{user.role}</em><button type="button" aria-label={`Manage ${user.name}`}><ChevronRight size={16} /></button></div>)}</div>
        </section>
        <section className="settings-card settings-security-card"><span><LockKeyhole size={17} /></span><div><h2>Security</h2><p>Two-factor authentication is enabled for your account.</p></div><button type="button">Manage security <ChevronRight size={15} /></button></section>
      </div>
    </div>
  </div>;
}
