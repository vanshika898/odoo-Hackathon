import React, { useMemo, useState } from "react";
import { CalendarClock, ChevronDown, CircleCheck, Clock3, Filter, Plus, Search, Wrench } from "lucide-react";
import { mockMaintenance } from "../mockData";

const statusClass = { "In Shop": "maintenance-in-shop", Completed: "maintenance-completed" };

export default function Maintenance() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All tickets");
  const tickets = useMemo(() => mockMaintenance.filter((ticket) => `${ticket.vehicle} ${ticket.service}`.toLowerCase().includes(query.toLowerCase()) && (status === "All tickets" || ticket.status === status)), [query, status]);

  return <div className="maintenance-page">
    <header className="maintenance-header"><div><span className="maintenance-eyebrow">Fleet care</span><h1>Maintenance</h1><p>Keep every vehicle service-ready with one clear workshop queue.</p></div><button className="maintenance-add-button" type="button"><Plus size={17} /> New service ticket</button></header>

    <section className="maintenance-summary-grid">
      <article><span className="maintenance-summary-icon"><Wrench size={17} /></span><div><strong>{mockMaintenance.length}</strong><span>Service tickets</span></div></article>
      <article><span className="maintenance-summary-icon is-yellow"><Clock3 size={17} /></span><div><strong>{mockMaintenance.filter((ticket) => ticket.status === "In Shop").length}</strong><span>Vehicles in workshop</span></div></article>
      <article><span className="maintenance-summary-icon is-green"><CircleCheck size={17} /></span><div><strong>{mockMaintenance.filter((ticket) => ticket.status === "Completed").length}</strong><span>Completed this month</span></div></article>
      <article><span className="maintenance-summary-icon is-blue"><CalendarClock size={17} /></span><div><strong>4</strong><span>Services due soon</span></div></article>
    </section>

    <div className="maintenance-layout">
      <section className="maintenance-queue">
        <div className="maintenance-queue-heading"><div><h2>Workshop queue</h2><p>Track current repairs and service costs.</p></div><span>{tickets.length} tickets</span></div>
        <div className="maintenance-toolbar"><div className="maintenance-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search vehicle or service" /></div><div className="maintenance-filter"><Filter size={15} /><select aria-label="Filter maintenance tickets by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All tickets</option><option>In Shop</option><option>Completed</option></select><ChevronDown size={14} /></div></div>
        <div className="maintenance-table-wrap"><table className="maintenance-table"><thead><tr><th>Vehicle</th><th>Service task</th><th>Cost</th><th>Priority</th><th>Status</th></tr></thead><tbody>{tickets.map((ticket) => <tr key={ticket.id}><td><span className="maintenance-vehicle"><Wrench size={15} />{ticket.vehicle}</span></td><td><strong>{ticket.service}</strong></td><td>₹{ticket.cost}</td><td><span className={`maintenance-priority ${ticket.status === "In Shop" ? "is-high" : "is-normal"}`}>{ticket.status === "In Shop" ? "In progress" : "Normal"}</span></td><td><span className={`maintenance-status ${statusClass[ticket.status]}`}>{ticket.status === "Completed" && <CircleCheck size={13} />}{ticket.status}</span></td></tr>)}</tbody></table></div>
        {!tickets.length && <div className="maintenance-empty"><Wrench size={22} /><strong>No service tickets found</strong><span>Try changing the search or filter.</span></div>}
        <footer className="maintenance-queue-footer"><span>Estimated maintenance spend</span><strong>₹26,700</strong></footer>
      </section>

      <aside className="maintenance-form-card"><div className="maintenance-form-heading"><span><Plus size={17} /></span><div><h2>Log maintenance</h2><p>Create a ticket for a workshop task.</p></div></div><form onSubmit={(event) => event.preventDefault()}><label>Vehicle<input className="loadswift-input" type="text" placeholder="e.g. VAN-05" /></label><label>Service task<input className="loadswift-input" type="text" placeholder="e.g. Engine tune-up" /></label><label>Estimated cost <span>(₹)</span><input className="loadswift-input" type="number" min="0" placeholder="Enter service cost" /></label><label>Workshop notes<textarea placeholder="Add an optional note for the workshop" /></label><button type="submit"><Plus size={17} /> Register ticket</button></form><div className="maintenance-form-note">New tickets are added to your active workshop queue for review.</div></aside>
    </div>
  </div>;
}
