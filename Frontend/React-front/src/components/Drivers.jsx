import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Eye, Filter, MoreHorizontal, Plus, Search, Users, X, AlertTriangle } from "lucide-react";
import { api } from "../api";

const statusClass = { 
  Available: "fleet-available", 
  "On Trip": "fleet-on-trip", 
  "Off Duty": "fleet-in-shop", 
  Suspended: "fleet-retired" 
};

export default function Drivers({ user }) {
  const [driversList, setDriversList] = useState([]);
  const [expiringDrivers, setExpiringDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  
  // Modal controls
  const [showModal, setShowModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    licenseNumber: "",
    licenseCategory: "LMV",
    licenseExpiryDate: "",
    contactNumber: ""
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Check roles permissions
  const isFleetManager = user?.accountType === "FleetManager";
  const isSafetyOfficer = user?.accountType === "SafetyOfficer";
  const isAdmin = user?.accountType === "Admin";

  const canRegister = isFleetManager || isSafetyOfficer || isAdmin;
  const canSuspend = isSafetyOfficer || isAdmin;

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/drivers");
      if (res.success && res.drivers) {
        setDriversList(res.drivers);
      }

      // Fetch license expiry warnings (next 30 days)
      const expiryRes = await api.get("/drivers/expiring-licenses?days=30");
      if (expiryRes.success && expiryRes.drivers) {
        setExpiringDrivers(expiryRes.drivers);
      }
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const drivers = useMemo(() => {
    return driversList.filter((driver) => {
      const searchStr = `${driver.name} ${driver.licenseNumber} ${driver.licenseCategory} ${driver.contactNumber}`.toLowerCase();
      const matchesQuery = searchStr.includes(query.toLowerCase());
      const matchesStatus = status === "All statuses" || driver.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [driversList, query, status]);

  const handleSuspend = async (id, isSuspended) => {
    const action = isSuspended ? "reinstate" : "suspend";
    if (!window.confirm(`Are you sure you want to ${action} this driver?`)) return;
    
    try {
      const res = await api.patch(`/drivers/${id}/${action}`);
      if (res.success) {
        alert(`Driver ${action}ed successfully`);
        fetchDrivers();
      }
    } catch (error) {
      alert(error.message || `Failed to ${action} driver`);
    }
  };

  const handleCreateDriver = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    try {
      const res = await api.post("/drivers", newDriver);
      if (res.success) {
        setShowModal(false);
        setNewDriver({
          name: "",
          licenseNumber: "",
          licenseCategory: "LMV",
          licenseExpiryDate: "",
          contactNumber: ""
        });
        fetchDrivers();
      }
    } catch (error) {
      setFormError(error.message || "Failed to register driver");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="drivers-page">
      <header className="fleet-header">
        <div>
          <span className="fleet-eyebrow">Personnel registry</span>
          <h1>Drivers</h1>
          <p><strong>{drivers.length}</strong> operators in database tracking.</p>
        </div>
        <div className="fleet-header-actions">
          {canRegister && (
            <button className="fleet-add-button" type="button" onClick={() => setShowModal(true)}>
              <Plus size={17} /> Add driver
            </button>
          )}
        </div>
      </header>

      {expiringDrivers.length > 0 && (isSafetyOfficer || isFleetManager || isAdmin) && (
        <div style={{
          background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#b91c1c", padding: "16px 20px", borderRadius: "10px", display: "flex", 
          alignItems: "center", gap: "12px", marginBottom: "20px"
        }}>
          <AlertTriangle size={20} />
          <div>
            <strong style={{ fontSize: "0.95rem" }}>License Expiry Alerts: </strong>
            <span style={{ fontSize: "0.9rem" }}>
              {expiringDrivers.length} driver(s) have licenses expiring within the next 30 days:{" "}
              {expiringDrivers.map(d => `${d.name} (${d.licenseNumber})`).join(", ")}
            </span>
          </div>
        </div>
      )}

      <section className="fleet-registry">
        <div className="fleet-toolbar">
          <div className="fleet-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search driver name, license or phone" />
          </div>
          <div className="fleet-select-wrap">
            <Filter size={15} />
            <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>All statuses</option>
              <option>Available</option>
              <option>On Trip</option>
              <option>Off Duty</option>
              <option>Suspended</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading driver directory...</div>
        ) : (
          <div className="fleet-table-wrap">
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>License Number</th>
                  <th>Category</th>
                  <th>License Expiry</th>
                  <th>Contact Number</th>
                  <th>Safety Score</th>
                  <th>Status</th>
                  {canSuspend && <th aria-label="Actions" />}
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => {
                  const isSuspended = driver.status === "Suspended";
                  const expiryDate = new Date(driver.licenseExpiryDate);
                  const isExpired = expiryDate < new Date();
                  
                  return (
                    <tr key={driver._id}>
                      <td>
                        <div className="fleet-vehicle-name">
                          <span><Users size={16} /></span>
                          <strong>{driver.name}</strong>
                        </div>
                      </td>
                      <td>{driver.licenseNumber}</td>
                      <td>{driver.licenseCategory}</td>
                      <td style={{ color: isExpired ? "var(--text-retired)" : "inherit" }}>
                        {expiryDate.toLocaleDateString()}
                        {isExpired && <span style={{ marginLeft: "6px", fontWeight: "700", fontSize: "0.75rem", background: "rgba(239, 68, 68, 0.15)", padding: "2px 6px", borderRadius: "4px" }}>EXPIRED</span>}
                      </td>
                      <td>{driver.contactNumber}</td>
                      <td>
                        <span style={{ fontWeight: "700", color: driver.safetyScore >= 90 ? "#15803d" : "#b45309" }}>
                          {driver.safetyScore} / 100
                        </span>
                      </td>
                      <td>
                        <span className={`fleet-status ${statusClass[driver.status] || "fleet-retired"}`}>{driver.status}</span>
                      </td>
                      {canSuspend && (
                        <td>
                          <div className="fleet-row-actions">
                            {driver.status !== "On Trip" && (
                              <button 
                                type="button" 
                                onClick={() => handleSuspend(driver._id, isSuspended)}
                                style={{ 
                                  color: isSuspended ? "#15803d" : "var(--text-retired)", 
                                  fontWeight: "700", cursor: "pointer", border: "none", background: "none" 
                                }}
                              >
                                {isSuspended ? "Reinstate" : "Suspend"}
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !drivers.length && (
          <div className="fleet-empty">
            <Users size={22} />
            <strong>No drivers match these filters</strong>
            <span>Try a different search or filter option.</span>
          </div>
        )}
      </section>

      {/* Add Driver Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "center", 
          alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div className="loadswift-card" style={{ width: "100%", maxWidth: "500px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800" }}>Register New Driver</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            
            {formError && <p style={{ color: "var(--text-retired)", fontSize: "0.85rem", fontWeight: "600" }}>❌ {formError}</p>}
            
            <form onSubmit={handleCreateDriver} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>FULL NAME *</label>
                <input 
                  type="text" placeholder="e.g. Alex Carter" className="loadswift-input" required 
                  value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>LICENSE NUMBER *</label>
                  <input 
                    type="text" placeholder="e.g. DL-88213" className="loadswift-input" required 
                    value={newDriver.licenseNumber} onChange={e => setNewDriver({...newDriver, licenseNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>LICENSE CATEGORY *</label>
                  <select 
                    className="loadswift-input" style={{ width: "100%" }}
                    value={newDriver.licenseCategory} onChange={e => setNewDriver({...newDriver, licenseCategory: e.target.value})}
                  >
                    <option value="LMV">LMV (Light Motor Vehicle)</option>
                    <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                    <option value="MCWG">MCWG (Motor Cycle With Gear)</option>
                    <option value="Transport">Transport</option>
                    <option value="Trailer">Trailer</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>LICENSE EXPIRY *</label>
                  <input 
                    type="date" className="loadswift-input" required 
                    value={newDriver.licenseExpiryDate} onChange={e => setNewDriver({...newDriver, licenseExpiryDate: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>CONTACT NUMBER *</label>
                  <input 
                    type="tel" placeholder="e.g. +919876543210" className="loadswift-input" required 
                    value={newDriver.contactNumber} onChange={e => setNewDriver({...newDriver, contactNumber: e.target.value})}
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
                {saving ? "Registering Driver..." : "Register Driver"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
