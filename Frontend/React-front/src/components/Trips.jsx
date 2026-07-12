import React, { useMemo, useState } from "react";
import { CircleCheck, Filter, MapPin, Plus, Search, SlidersHorizontal, Truck, X } from "lucide-react";
import { mockRecentTrips } from "../mockData";

const tripMeta = {
  TR001: { origin: "Gandhinagar Depot", destination: "Ahmedabad Hub", progress: 66 },
  TR002: { origin: "Surat Terminal", destination: "Vadodara Warehouse", progress: 100 },
  TR003: { origin: "Rajkot Distribution", destination: "Ahmedabad Hub", progress: 28 },
  TR004: { origin: "Origin pending", destination: "Destination pending", progress: 0 },
};

const statusClass = { "On Trip": "trip-on-route", Completed: "trip-completed", Dispatched: "trip-dispatched", Draft: "trip-draft" };

export default function Trips() {
  const [cargoWeight, setCargoWeight] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("VAN-05");
  const [validationError, setValidationError] = useState("");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All loads");

  const handleWeightChange = (event) => {
    const value = event.target.value;
    const weight = Number.parseFloat(value);
    const limit = selectedVehicle === "VAN-05" ? 500 : 5000;
    setCargoWeight(value);
    setValidationError(Number.isFinite(weight) && weight > limit ? `Cargo weight exceeds the ${limit.toLocaleString()} kg limit for ${selectedVehicle}. Choose another vehicle or reduce the load.` : "");
  };

  const visibleTrips = useMemo(() => mockRecentTrips.filter((trip) => {
    const matchesQuery = `${trip.id} ${trip.vehicle} ${trip.driver}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === "All loads" || (activeFilter === "In transit" && trip.status === "On Trip") || (activeFilter === "Completed" && trip.status === "Completed");
    return matchesQuery && matchesFilter;
  }), [activeFilter, query]);

  return <div className="trips-page">
    <header className="trips-header">
      <div><span className="trips-eyebrow">Dispatch centre</span><h1>Tracking loads</h1><p>Monitor active routes and create a new fleet dispatch.</p></div>
      <button className="trips-primary-action" type="button"><Plus size={17} /> Add load</button>
    </header>

    <div className="trips-layout">
      <section className="trips-loads-panel">
        <div className="trips-search-row"><div className="trips-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search trip, vehicle or driver" />{query && <button aria-label="Clear search" type="button" onClick={() => setQuery("")}><X size={15} /></button>}</div><button className="trips-filter-button" type="button"><SlidersHorizontal size={16} /> Filters</button></div>
        <div className="trips-filter-tabs">{["All loads", "In transit", "Completed"].map((filter) => <button key={filter} className={activeFilter === filter ? "is-selected" : ""} type="button" onClick={() => setActiveFilter(filter)}>{filter}<span>{filter === "All loads" ? mockRecentTrips.length : filter === "In transit" ? 1 : 1}</span></button>)}</div>
        <div className="trips-load-list">
          {visibleTrips.length ? visibleTrips.map((trip) => {
            const meta = tripMeta[trip.id];
            return <article className="trip-load-card" key={trip.id}>
              <div className="trip-load-topline"><div className="trip-load-id"><span><Truck size={15} /></span><strong>#{trip.id}</strong></div><span className={`trip-status ${statusClass[trip.status]}`}>{trip.status === "Completed" && <CircleCheck size={13} />}{trip.status}</span></div>
              <div className="trip-route"><div><i className="trip-route-start" /><span>{meta.origin}</span></div><div className="trip-route-line"><b style={{ width: `${meta.progress}%` }} /></div><Truck className="trip-route-truck" size={15} /><div><i className="trip-route-end" /><span>{meta.destination}</span></div></div>
              <footer><span><MapPin size={14} /> {trip.vehicle}</span><span>{trip.driver}</span><strong>{trip.eta}</strong></footer>
            </article>;
          }) : <div className="trips-empty"><Filter size={20} /><strong>No loads found</strong><span>Try changing your search or filter.</span></div>}
        </div>
      </section>

      <aside className="trips-create-panel">
        <div className="trips-create-heading"><div className="trips-heading-icon"><Truck size={18} /></div><div><h2>New dispatch</h2><p>Create a route in a few details.</p></div></div>
        <form className="trips-form" onSubmit={(event) => event.preventDefault()}>
          <label>Origin depot<input className="loadswift-input" type="text" placeholder="e.g. Gandhinagar Depot" /></label>
          <label>Delivery destination<input className="loadswift-input" type="text" placeholder="e.g. Ahmedabad Hub" /></label>
          <label>Vehicle<select className="loadswift-input" value={selectedVehicle} onChange={(event) => { setSelectedVehicle(event.target.value); setCargoWeight(""); setValidationError(""); }}><option value="VAN-05">VAN-05 · capacity 500 kg</option><option value="TRUCK-11">TRUCK-11 · capacity 5,000 kg</option></select></label>
          <label>Cargo weight <span>(kg)</span><input className={`loadswift-input ${validationError ? "is-invalid" : ""}`} type="number" min="0" value={cargoWeight} onChange={handleWeightChange} placeholder="Enter cargo weight" /></label>
          {validationError && <div className="trips-validation-error">{validationError}</div>}
          <button className="trips-create-submit" type="submit" disabled={Boolean(validationError)}><Plus size={17} /> Create dispatch</button>
        </form>
        <div className="trips-form-note">Vehicle capacity is checked automatically before your dispatch is created.</div>
      </aside>
    </div>
  </div>;
}
