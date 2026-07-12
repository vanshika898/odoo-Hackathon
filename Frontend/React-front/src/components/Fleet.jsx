import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Download, Eye, Filter, MoreHorizontal, Plus, Search, Truck, X } from "lucide-react";
import { api } from "../api";

const statusClass = { 
  Available: "fleet-available", 
  "On Trip": "fleet-on-trip", 
  "In Shop": "fleet-in-shop", 
  Retired: "fleet-retired" 
};

export default function Fleet({ user }) {
  const [vehiclesList, setVehiclesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [type, setType] = useState("All types");
  
  // Modal controls
  const [showModal, setShowModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    registrationNumber: "",
    name: "",
    type: "Truck",
    maxLoadCapacity: "",
    odometer: 0,
    acquisitionCost: "",
    region: "Unassigned"
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Check if role has writing permission (FleetManager or Admin)
  const canModify = user?.accountType === "FleetManager" || user?.accountType === "Admin";

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/vehicles");
      if (res.success && res.vehicles) {
        setVehiclesList(res.vehicles);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const vehicles = useMemo(() => {
    return vehiclesList.filter((vehicle) => {
      const searchStr = `${vehicle.registrationNumber} ${vehicle.name} ${vehicle.type} ${vehicle.region || ""}`.toLowerCase();
      const matchesQuery = searchStr.includes(query.toLowerCase());
      const matchesStatus = status === "All statuses" || vehicle.status === status;
      const matchesType = type === "All types" || vehicle.type === type;
      return matchesQuery && matchesStatus && matchesType;
    });
  }, [vehiclesList, query, status, type]);

  const handleRetire = async (id) => {
    if (!window.confirm("Are you sure you want to retire this vehicle asset?")) return;
    try {
      const res = await api.patch(`/vehicles/${id}/retire`);
      if (res.success) {
        alert("Vehicle retired successfully");
        fetchVehicles();
      }
    } catch (error) {
      alert(error.message || "Failed to retire vehicle");
    }
  };

  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    try {
      const payload = {
        ...newVehicle,
        maxLoadCapacity: Number(newVehicle.maxLoadCapacity),
        odometer: Number(newVehicle.odometer),
        acquisitionCost: Number(newVehicle.acquisitionCost)
      };

      const res = await api.post("/vehicles", payload);
      if (res.success) {
        setShowModal(false);
        setNewVehicle({
          registrationNumber: "",
          name: "",
          type: "Truck",
          maxLoadCapacity: "",
          odometer: 0,
          acquisitionCost: "",
          region: "Unassigned"
        });
        fetchVehicles();
      }
    } catch (error) {
      setFormError(error.message || "Failed to register vehicle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fleet-page">
      <header className="fleet-header">
        <div>
          <span className="fleet-eyebrow">Asset management</span>
          <h1>Fleet Registry</h1>
          <p><strong>{vehicles.length}</strong> active assets match your dashboard filter context.</p>
        </div>
        <div className="fleet-header-actions">
          {canModify && (
            <button className="fleet-add-button" type="button" onClick={() => setShowModal(true)}>
              <Plus size={17} /> Add vehicle
            </button>
          )}
        </div>
      </header>

      <section className="fleet-registry">
        <div className="fleet-toolbar">
          <div className="fleet-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search registration or asset" />
          </div>
          <div className="fleet-select-wrap">
            <Filter size={15} />
            <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>All statuses</option>
              <option>Available</option>
              <option>On Trip</option>
              <option>In Shop</option>
              <option>Retired</option>
            </select>
            <ChevronDown size={14} />
          </div>
          <div className="fleet-select-wrap fleet-type-select">
            <select aria-label="Filter by vehicle type" value={type} onChange={(event) => setType(event.target.value)}>
              <option>All types</option>
              <option>Truck</option>
              <option>Van</option>
              <option>Trailer</option>
              <option>Pickup</option>
              <option>Bike</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading vehicle directory...</div>
        ) : (
          <div className="fleet-table-wrap">
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Registration</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Odometer</th>
                  <th>Asset value</th>
                  <th>Region</th>
                  <th>Status</th>
                  {canModify && <th aria-label="Actions" />}
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle._id}>
                    <td>
                      <div className="fleet-vehicle-name">
                        <span><Truck size={16} /></span>
                        <strong>{vehicle.name}</strong>
                      </div>
                    </td>
                    <td>{vehicle.registrationNumber}</td>
                    <td>{vehicle.type}</td>
                    <td>{vehicle.maxLoadCapacity?.toLocaleString()} kg</td>
                    <td>{vehicle.odometer?.toLocaleString()} km</td>
                    <td>₹{vehicle.acquisitionCost?.toLocaleString()}</td>
                    <td>{vehicle.region}</td>
                    <td>
                      <span className={`fleet-status ${statusClass[vehicle.status] || "fleet-retired"}`}>{vehicle.status}</span>
                    </td>
                    {canModify && (
                      <td>
                        <div className="fleet-row-actions">
                          {vehicle.status !== "Retired" && vehicle.status !== "On Trip" && (
                            <button 
                              type="button" 
                              title="Retire Vehicle" 
                              onClick={() => handleRetire(vehicle._id)}
                              style={{ color: "var(--text-retired)", cursor: "pointer", border: "none", background: "none" }}
                            >
                              Retire
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !vehicles.length && (
          <div className="fleet-empty">
            <Truck size={22} />
            <strong>No vehicles match these filters</strong>
            <span>Try a different search or filter option.</span>
          </div>
        )}
      </section>

      {/* Add Vehicle Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "center", 
          alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div className="loadswift-card" style={{ width: "100%", maxWidth: "500px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800" }}>Register New Vehicle</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            
            {formError && <p style={{ color: "var(--text-retired)", fontSize: "0.85rem", fontWeight: "600" }}>❌ {formError}</p>}
            
            <form onSubmit={handleCreateVehicle} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>ASSET NAME *</label>
                <input 
                  type="text" placeholder="e.g. TRUCK-A" className="loadswift-input" required 
                  value={newVehicle.name} onChange={e => setNewVehicle({...newVehicle, name: e.target.value})}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>REGISTRATION NUMBER *</label>
                  <input 
                    type="text" placeholder="e.g. MH12AB1234" className="loadswift-input" required 
                    value={newVehicle.registrationNumber} onChange={e => setNewVehicle({...newVehicle, registrationNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>VEHICLE TYPE *</label>
                  <select 
                    className="loadswift-input" style={{ width: "100%" }}
                    value={newVehicle.type} onChange={e => setNewVehicle({...newVehicle, type: e.target.value})}
                  >
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                    <option value="Trailer">Trailer</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>MAX CAPACITY (KG) *</label>
                  <input 
                    type="number" min="1" placeholder="e.g. 5000" className="loadswift-input" required 
                    value={newVehicle.maxLoadCapacity} onChange={e => setNewVehicle({...newVehicle, maxLoadCapacity: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>ODOMETER (KM)</label>
                  <input 
                    type="number" min="0" placeholder="e.g. 15000" className="loadswift-input" 
                    value={newVehicle.odometer} onChange={e => setNewVehicle({...newVehicle, odometer: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>ACQUISITION COST (INR) *</label>
                  <input 
                    type="number" min="0" placeholder="e.g. 1200000" className="loadswift-input" required 
                    value={newVehicle.acquisitionCost} onChange={e => setNewVehicle({...newVehicle, acquisitionCost: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>REGION</label>
                  <input 
                    type="text" placeholder="e.g. West" className="loadswift-input" 
                    value={newVehicle.region} onChange={e => setNewVehicle({...newVehicle, region: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={saving}
                style={{ 
                  background: 'var(--text-dark)', color: '#fff', border: 'none', padding: '14px', 
                  borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', 
                  fontSize: '0.95rem', marginTop: "10px" 
                }}
              >
                {saving ? "Registering Asset..." : "Register Vehicle"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
