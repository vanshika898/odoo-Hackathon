import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Filter, MoreHorizontal, Plus, Search, Wrench, X } from "lucide-react";
import { api } from "../api";

const statusClass = { 
  active: "fleet-on-trip", // styling: yellow/orange warning indicator
  closed: "fleet-available"  // styling: green success indicator
};

export default function Maintenance({ user }) {
  const [logsList, setLogsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  
  // Selection options
  const [availableVehicles, setAvailableVehicles] = useState([]);

  // Create Modal
  const [showModal, setShowModal] = useState(false);
  const [newLog, setNewLog] = useState({
    vehicleId: "",
    description: "",
    cost: "",
    performedBy: ""
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Role permissions
  const canModify = user?.accountType === "FleetManager" || user?.accountType === "Admin";

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/maintenance");
      if (res.success && res.logs) {
        setLogsList(res.logs);
      }
    } catch (error) {
      console.error("Failed to load maintenance directory:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      // Show vehicles that are Available to go into shop
      const res = await api.get("/vehicles?status=Available");
      if (res.success && res.vehicles) {
        setAvailableVehicles(res.vehicles);
      }
    } catch (error) {
      console.error("Failed to load available vehicles:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const logs = useMemo(() => {
    return logsList.filter((log) => {
      const vehicleName = log.vehicle ? `${log.vehicle.name} ${log.vehicle.registrationNumber}` : "";
      const searchStr = `${vehicleName} ${log.description} ${log.performedBy || ""}`.toLowerCase();
      const matchesQuery = searchStr.includes(query.toLowerCase());
      
      const mappedStatus = log.status === "active" ? "Active" : "Closed";
      const matchesStatus = statusFilter === "All statuses" || mappedStatus === statusFilter;
      
      return matchesQuery && matchesStatus;
    });
  }, [logsList, query, statusFilter]);

  const handleOpenModal = () => {
    setFormError("");
    loadVehicles();
    setShowModal(true);
  };

  const handleCreateLog = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    try {
      const payload = {
        ...newLog,
        cost: Number(newLog.cost)
      };

      const res = await api.post("/maintenance", payload);
      if (res.success) {
        setShowModal(false);
        setNewLog({
          vehicleId: "",
          description: "",
          cost: "",
          performedBy: ""
        });
        fetchLogs();
      }
    } catch (error) {
      setFormError(error.message || "Failed to log maintenance job");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseMaintenance = async (id) => {
    if (!window.confirm("Confirm closing this maintenance log? Vehicle status will be updated.")) return;
    try {
      const res = await api.patch(`/maintenance/${id}/close`);
      if (res.success) {
        alert("Maintenance closed successfully. Vehicle returned to Available.");
        fetchLogs();
      }
    } catch (error) {
      alert(error.message || "Failed to close maintenance");
    }
  };

  return (
    <div className="maintenance-page">
      <header className="fleet-header">
        <div>
          <span className="fleet-eyebrow">Service schedules</span>
          <h1>Maintenance</h1>
          <p>Tracking workshop schedules and maintenance logs.</p>
        </div>
        <div className="fleet-header-actions">
          {canModify && (
            <button className="fleet-add-button" type="button" onClick={handleOpenModal}>
              <Plus size={17} /> Log service
            </button>
          )}
        </div>
      </header>

      <section className="fleet-registry">
        <div className="fleet-toolbar">
          <div className="fleet-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search vehicle or description..." />
          </div>
          <div className="fleet-select-wrap">
            <Filter size={15} />
            <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>All statuses</option>
              <option>Active</option>
              <option>Closed</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading maintenance records...</div>
        ) : (
          <div className="fleet-table-wrap">
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Description</th>
                  <th>Service Cost</th>
                  <th>Started Date</th>
                  <th>Closed Date</th>
                  <th>Performed By</th>
                  <th>Status</th>
                  {canModify && <th aria-label="Actions" />}
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      <div className="fleet-vehicle-name">
                        <span><Wrench size={15} /></span>
                        <strong>{log.vehicle?.name || "Deleted Vehicle"}</strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "4px" }}>
                          ({log.vehicle?.registrationNumber || "—"})
                        </span>
                      </div>
                    </td>
                    <td>{log.description}</td>
                    <td>₹{log.cost?.toLocaleString()}</td>
                    <td>{new Date(log.startDate).toLocaleDateString()}</td>
                    <td>{log.closedDate ? new Date(log.closedDate).toLocaleDateString() : "—"}</td>
                    <td>{log.performedBy || "—"}</td>
                    <td>
                      <span className={`fleet-status ${statusClass[log.status] || "fleet-retired"}`}>
                        {log.status === "active" ? "Active" : "Closed"}
                      </span>
                    </td>
                    {canModify && (
                      <td>
                        <div className="fleet-row-actions">
                          {log.status === "active" && (
                            <button 
                              type="button" 
                              onClick={() => handleCloseMaintenance(log._id)}
                              style={{ color: "#16a34a", fontWeight: "700", cursor: "pointer", border: "none", background: "none" }}
                            >
                              Close log
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
        {!loading && !logs.length && (
          <div className="fleet-empty">
            <Wrench size={22} />
            <strong>No maintenance logs match</strong>
            <span>Try a different search or filter option.</span>
          </div>
        )}
      </section>

      {/* Log Maintenance Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "center", 
          alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div className="loadswift-card" style={{ width: "100%", maxWidth: "500px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800" }}>Log Vehicle Maintenance</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            
            {formError && <p style={{ color: "var(--text-retired)", fontSize: "0.85rem", fontWeight: "600" }}>❌ {formError}</p>}
            
            <form onSubmit={handleCreateLog} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>SELECT VEHICLE (AVAILABLE ONLY) *</label>
                <select 
                  className="loadswift-input" style={{ width: "100%" }} required
                  value={newLog.vehicleId} onChange={e => setNewLog({...newLog, vehicleId: e.target.value})}
                >
                  <option value="">-- Choose Vehicle --</option>
                  {availableVehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.name} ({v.registrationNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>WORK DESCRIPTION *</label>
                <input 
                  type="text" placeholder="e.g. Engine tune-up, brake service" className="loadswift-input" required 
                  value={newLog.description} onChange={e => setNewLog({...newLog, description: e.target.value})}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>COST (INR) *</label>
                  <input 
                    type="number" min="0" placeholder="e.g. 5000" className="loadswift-input" required 
                    value={newLog.cost} onChange={e => setNewLog({...newLog, cost: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>PERFORMED BY / WORKSHOP</label>
                  <input 
                    type="text" placeholder="e.g. Speedway Garage" className="loadswift-input" 
                    value={newLog.performedBy} onChange={e => setNewLog({...newLog, performedBy: e.target.value})}
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
                {saving ? "Logging Service..." : "Log Maintenance Work"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
