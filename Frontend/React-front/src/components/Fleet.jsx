import React, { useMemo, useState } from "react";
import { ChevronDown, Download, Eye, Filter, MoreHorizontal, Plus, Search, Truck } from "lucide-react";
import { mockVehicles } from "../mockData";

const statusClass = { Available: "fleet-available", "On Trip": "fleet-on-trip", "In Shop": "fleet-in-shop", Retired: "fleet-retired" };

export default function Fleet() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [type, setType] = useState("All types");

  const vehicles = useMemo(() => mockVehicles.filter((vehicle) => {
    const terms = `${vehicle.reg_no} ${vehicle.name} ${vehicle.type}`.toLowerCase();
    return terms.includes(query.toLowerCase()) && (status === "All statuses" || vehicle.status === status) && (type === "All types" || vehicle.type === type);
  }), [query, status, type]);

  return <div className="fleet-page">
    <header className="fleet-header">
      <div><span className="fleet-eyebrow">Asset management</span><h1>Fleet</h1><p><strong>{mockVehicles.length}</strong> registered vehicles in your operation.</p></div>
      <div className="fleet-header-actions"><button className="fleet-export-button" type="button"><Download size={16} /> Export</button><button className="fleet-add-button" type="button"><Plus size={17} /> Add vehicle</button></div>
    </header>

    <section className="fleet-registry">
      <div className="fleet-toolbar">
        <div className="fleet-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search registration or asset" /></div>
        <div className="fleet-select-wrap"><Filter size={15} /><select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Available</option><option>On Trip</option><option>In Shop</option><option>Retired</option></select><ChevronDown size={14} /></div>
        <div className="fleet-select-wrap fleet-type-select"><select aria-label="Filter by vehicle type" value={type} onChange={(event) => setType(event.target.value)}><option>All types</option><option>Van</option><option>Truck</option><option>Mini</option></select><ChevronDown size={14} /></div>
      </div>

      <div className="fleet-table-wrap"><table className="fleet-table">
        <thead><tr><th>Vehicle</th><th>Registration</th><th>Type</th><th>Capacity</th><th>Odometer</th><th>Asset value</th><th>Status</th><th aria-label="Actions" /></tr></thead>
        <tbody>{vehicles.map((vehicle) => <tr key={vehicle.id}>
          <td><div className="fleet-vehicle-name"><span><Truck size={16} /></span><strong>{vehicle.name}</strong></div></td>
          <td>{vehicle.reg_no}</td><td>{vehicle.type}</td><td>{vehicle.capacity.toLocaleString()} kg</td><td>{vehicle.odometer.toLocaleString()} km</td><td>₹{vehicle.cost}</td>
          <td><span className={`fleet-status ${statusClass[vehicle.status]}`}>{vehicle.status}</span></td>
          <td><div className="fleet-row-actions"><button type="button" aria-label={`View ${vehicle.name}`}><Eye size={16} /></button><button type="button" aria-label={`More options for ${vehicle.name}`}><MoreHorizontal size={17} /></button></div></td>
        </tr>)}</tbody>
      </table></div>
      {!vehicles.length && <div className="fleet-empty"><Truck size={22} /><strong>No vehicles match these filters</strong><span>Try a different search or filter option.</span></div>}
      <footer className="fleet-registry-footer"><span>Showing <strong>{vehicles.length}</strong> of {mockVehicles.length} vehicles</span><div><button type="button" disabled>Previous</button><button className="is-current" type="button">1</button><button type="button" disabled>Next</button></div></footer>
    </section>
  </div>;
}
