import React, { useMemo, useState } from "react";
import { AlertTriangle, ChevronDown, Eye, Filter, MoreHorizontal, Phone, Plus, Search, ShieldCheck, UserRound } from "lucide-react";
import { mockDrivers } from "../mockData";

const statusClass = { Available: "driver-available", "On Trip": "driver-on-trip", Suspended: "driver-suspended", "Off Duty": "driver-off-duty" };

function initials(name) { return name.split(" ").map((part) => part[0]).join("").slice(0, 2); }

export default function Drivers() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All drivers");
  const drivers = useMemo(() => mockDrivers.filter((driver) => (`${driver.name} ${driver.license} ${driver.category}`).toLowerCase().includes(query.toLowerCase()) && (status === "All drivers" || driver.status === status)), [query, status]);

  return <div className="drivers-page">
    <header className="drivers-header">
      <div><span className="drivers-eyebrow">Team management</span><h1>Drivers</h1><p>Manage operator credentials, safety and availability.</p></div>
      <button className="drivers-add-button" type="button"><Plus size={17} /> Add driver</button>
    </header>

    <section className="drivers-summary-grid">
      <article><span className="drivers-summary-icon"><UserRound size={17} /></span><div><strong>{mockDrivers.length}</strong><span>Total drivers</span></div></article>
      <article><span className="drivers-summary-icon is-green"><ShieldCheck size={17} /></span><div><strong>{mockDrivers.filter((driver) => driver.status === "Available").length}</strong><span>Available now</span></div></article>
      <article><span className="drivers-summary-icon is-blue"><Phone size={17} /></span><div><strong>96%</strong><span>Avg. safety score</span></div></article>
      <article><span className="drivers-summary-icon is-red"><AlertTriangle size={17} /></span><div><strong>1</strong><span>Licence needs review</span></div></article>
    </section>

    <section className="drivers-directory">
      <div className="drivers-toolbar"><div className="drivers-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, licence or category" /></div><div className="drivers-filter"><Filter size={15} /><select aria-label="Filter drivers by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All drivers</option><option>Available</option><option>On Trip</option><option>Suspended</option><option>Off Duty</option></select><ChevronDown size={14} /></div></div>
      <div className="drivers-table-wrap"><table className="drivers-table"><thead><tr><th>Driver</th><th>Licence</th><th>Category</th><th>Contact</th><th>Safety score</th><th>Licence expiry</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{drivers.map((driver) => {
        const expired = driver.expiry.includes("EXPIRED");
        return <tr key={driver.id}><td><div className="driver-identity"><span className={`driver-avatar avatar-${driver.id}`}>{initials(driver.name)}</span><strong>{driver.name}</strong></div></td><td>{driver.license}</td><td>{driver.category}</td><td>{driver.contact}</td><td><div className="driver-safety"><div><b style={{ width: `${driver.safety}%` }} /></div><strong className={driver.safety >= 90 ? "is-safe" : "is-watch"}>{driver.safety}%</strong></div></td><td><span className={expired ? "driver-expired" : ""}>{expired && <AlertTriangle size={13} />}{driver.expiry.replace(" EXPIRED", "")}</span></td><td><span className={`driver-status ${statusClass[driver.status]}`}>{driver.status}</span></td><td><div className="driver-row-actions"><button type="button" aria-label={`View ${driver.name}`}><Eye size={16} /></button><button type="button" aria-label={`More options for ${driver.name}`}><MoreHorizontal size={17} /></button></div></td></tr>;
      })}</tbody></table></div>
      {!drivers.length && <div className="drivers-empty"><UserRound size={22} /><strong>No drivers found</strong><span>Try changing the search or status filter.</span></div>}
      <footer className="drivers-footer"><span>Showing <strong>{drivers.length}</strong> of {mockDrivers.length} drivers</span><span>Last updated today, 9:41 AM</span></footer>
    </section>
  </div>;
}
