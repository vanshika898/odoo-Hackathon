import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Filter, MoreHorizontal, Plus, Search, Route, X, Play, CheckCircle2, Ban } from "lucide-react";
import { api } from "../api";

const statusStyle = {
  "On Trip": "is-on-trip", // maps to "Dispatched" in styling classes
  Completed: "is-completed",
  Dispatched: "is-dispatched",
  Draft: "is-draft",
  Cancelled: "is-cancelled"
};

export default function Trips({ user }) {
  const [tripsList, setTripsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  // Selection states for modal
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTrip, setNewTrip] = useState({
    source: "",
    destination: "",
    vehicleId: "",
    driverId: "",
    cargoWeight: "",
    plannedDistance: ""
  });
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  // Complete Modal
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [completionData, setCompletionData] = useState({
    finalOdometer: "",
    fuelConsumed: "",
    actualDistance: "",
    revenue: ""
  });
  const [completeError, setCompleteError] = useState("");
  const [completing, setCompleting] = useState(false);

  // Role permissions
  const isFleetManager = user?.accountType === "FleetManager";
  const isDriver = user?.accountType === "Driver";
  const isDispatcher = user?.accountType === "Dispatcher";
  const isAdmin = user?.accountType === "Admin";

  const canCreateDispatchComplete = isFleetManager || isDriver || isDispatcher || isAdmin;
  const canCancel = isFleetManager || isAdmin;

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trips");
      if (res.success && res.trips) {
        setTripsList(res.trips);
      }
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadModalData = async () => {
    try {
      // Fetch available vehicles
      const vRes = await api.get("/vehicles?status=Available");
      if (vRes.success && vRes.vehicles) {
        setAvailableVehicles(vRes.vehicles);
      }

      // Fetch available drivers
      const dRes = await api.get("/drivers?status=Available");
      if (dRes.success && dRes.drivers) {
        // filter out expired licenses if any client-side just in case
        const eligible = dRes.drivers.filter(d => new Date(d.licenseExpiryDate) > new Date());
        setAvailableDrivers(eligible);
      }
    } catch (error) {
      console.error("Failed to load options for dispatch selection:", error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleOpenCreateModal = () => {
    setCreateError("");
    loadModalData();
    setShowCreateModal(true);
  };

  const trips = useMemo(() => {
    return tripsList.filter((trip) => {
      // If user is a Driver, only show their assigned trips
      if (isDriver) {
        const isAssigned = trip.driver?._id === user.driverProfile || 
                           trip.driver?.userAccount === user._id ||
                           trip.driver?.name?.toLowerCase() === user.fullName?.toLowerCase();
        if (!isAssigned) return false;
      }

      const searchStr = `${trip.source} ${trip.destination} ${trip.vehicle?.name || ""} ${trip.driver?.name || ""}`.toLowerCase();
      const matchesQuery = searchStr.includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All statuses" || trip.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [tripsList, query, statusFilter, isDriver, user]);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);

    try {
      const payload = {
        ...newTrip,
        cargoWeight: Number(newTrip.cargoWeight),
        plannedDistance: Number(newTrip.plannedDistance)
      };

      const res = await api.post("/trips", payload);
      if (res.success) {
        setShowCreateModal(false);
        setNewTrip({
          source: "",
          destination: "",
          vehicleId: "",
          driverId: "",
          cargoWeight: "",
          plannedDistance: ""
        });
        fetchTrips();
      }
    } catch (error) {
      setCreateError(error.message || "Failed to create trip Draft");
    } finally {
      setCreating(false);
    }
  };

  const handleDispatch = async (id) => {
    if (!window.confirm("Confirm dispatching this trip load?")) return;
    try {
      const res = await api.patch(`/trips/${id}/dispatch`);
      if (res.success) {
        alert("Trip dispatched successfully! Vehicle and driver set to On Trip.");
        fetchTrips();
      }
    } catch (error) {
      alert(error.message || "Failed to dispatch trip");
    }
  };

  const handleOpenCompleteModal = (id) => {
    setCompleteError("");
    setSelectedTripId(id);
    setCompletionData({
      finalOdometer: "",
      fuelConsumed: "",
      actualDistance: "",
      revenue: ""
    });
    setShowCompleteModal(true);
  };

  const handleCompleteTrip = async (e) => {
    e.preventDefault();
    setCompleteError("");
    setCompleting(true);

    try {
      const payload = {
        finalOdometer: Number(completionData.finalOdometer),
        actualDistance: completionData.actualDistance ? Number(completionData.actualDistance) : undefined,
        fuelConsumed: completionData.fuelConsumed ? Number(completionData.fuelConsumed) : undefined,
        revenue: completionData.revenue ? Number(completionData.revenue) : 0
      };

      const res = await api.patch(`/trips/${selectedTripId}/complete`, payload);
      if (res.success) {
        setShowCompleteModal(false);
        fetchTrips();
      }
    } catch (error) {
      setCompleteError(error.message || "Failed to complete trip");
    } finally {
      setCompleting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;
    try {
      const res = await api.patch(`/trips/${id}/cancel`);
      if (res.success) {
        alert("Trip cancelled successfully.");
        fetchTrips();
      }
    } catch (error) {
      alert(error.message || "Failed to cancel trip");
    }
  };

  return (
    <div className="trips-page">
      <header className="fleet-header">
        <div>
          <span className="fleet-eyebrow">Logistics tracking</span>
          <h1>Trips & Routes</h1>
          <p>
            {isDriver 
              ? `Showing your assigned trips.` 
              : `Total of ${trips.length} operations monitored.`}
          </p>
        </div>
        <div className="fleet-header-actions">
          {canCreateDispatchComplete && (
            <button className="fleet-add-button" type="button" onClick={handleOpenCreateModal}>
              <Plus size={17} /> Create trip
            </button>
          )}
        </div>
      </header>

      <section className="fleet-registry">
        <div className="fleet-toolbar">
          <div className="fleet-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search source, destination, asset or operator" />
          </div>
          <div className="fleet-select-wrap">
            <Filter size={15} />
            <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>All statuses</option>
              <option>Draft</option>
              <option>Dispatched</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading trip sheets...</div>
        ) : (
          <div className="fleet-table-wrap">
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Route</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Cargo Weight</th>
                  <th>Planned Distance</th>
                  <th>Revenue</th>
                  <th>Status</th>
                  {canCreateDispatchComplete && <th aria-label="Actions" />}
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip._id}>
                    <td>
                      <span className="dashboard-trip-id">
                        <Route size={15} />
                        {trip._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <strong>{trip.source}</strong> to <strong>{trip.destination}</strong>
                    </td>
                    <td>{trip.vehicle ? `${trip.vehicle.name} (${trip.vehicle.registrationNumber})` : "—"}</td>
                    <td>{trip.driver ? trip.driver.name : "—"}</td>
                    <td>{trip.cargoWeight?.toLocaleString()} kg</td>
                    <td>{trip.plannedDistance} km</td>
                    <td>{trip.revenue ? `₹${trip.revenue.toLocaleString()}` : "—"}</td>
                    <td>
                      <span className={`fleet-status ${statusStyle[trip.status] || "fleet-available"}`}>{trip.status}</span>
                    </td>
                    {canCreateDispatchComplete && (
                      <td>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          {trip.status === "Draft" && (
                            <button 
                              type="button" title="Dispatch Load" onClick={() => handleDispatch(trip._id)}
                              style={{ color: "#2563eb", cursor: "pointer", border: "none", background: "none", fontWeight: "700" }}
                            >
                              Dispatch
                            </button>
                          )}
                          {trip.status === "Dispatched" && (
                            <button 
                              type="button" title="Complete Trip" onClick={() => handleOpenCompleteModal(trip._id)}
                              style={{ color: "#16a34a", cursor: "pointer", border: "none", background: "none", fontWeight: "700" }}
                            >
                              Complete
                            </button>
                          )}
                          {canCancel && (trip.status === "Draft" || trip.status === "Dispatched") && (
                            <button 
                              type="button" title="Cancel Trip" onClick={() => handleCancel(trip._id)}
                              style={{ color: "var(--text-retired)", cursor: "pointer", border: "none", background: "none", fontWeight: "700" }}
                            >
                              Cancel
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
        {!loading && !trips.length && (
          <div className="fleet-empty">
            <Route size={22} />
            <strong>No trips found</strong>
            <span>Try adjusting your filters or create a new trip record.</span>
          </div>
        )}
      </section>

      {/* Create Trip Modal */}
      {showCreateModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "center", 
          alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div className="loadswift-card" style={{ width: "100%", maxWidth: "500px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800" }}>Draft New Trip</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            
            {createError && <p style={{ color: "var(--text-retired)", fontSize: "0.85rem", fontWeight: "600" }}>❌ {createError}</p>}
            
            <form onSubmit={handleCreateTrip} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>SOURCE HUB *</label>
                  <input 
                    type="text" placeholder="e.g. Ahmedabad, GJ" className="loadswift-input" required 
                    value={newTrip.source} onChange={e => setNewTrip({...newTrip, source: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>DESTINATION HUB *</label>
                  <input 
                    type="text" placeholder="e.g. Pune, MH" className="loadswift-input" required 
                    value={newTrip.destination} onChange={e => setNewTrip({...newTrip, destination: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>SELECT VEHICLE (AVAILABLE ONLY) *</label>
                <select 
                  className="loadswift-input" style={{ width: "100%" }} required
                  value={newTrip.vehicleId} onChange={e => setNewTrip({...newTrip, vehicleId: e.target.value})}
                >
                  <option value="">-- Choose Vehicle --</option>
                  {availableVehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.name} ({v.registrationNumber}) - Cap: {v.maxLoadCapacity}kg</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>SELECT DRIVER (AVAILABLE ONLY) *</label>
                <select 
                  className="loadswift-input" style={{ width: "100%" }} required
                  value={newTrip.driverId} onChange={e => setNewTrip({...newTrip, driverId: e.target.value})}
                >
                  <option value="">-- Choose Driver --</option>
                  {availableDrivers.map(d => (
                    <option key={d._id} value={d._id}>{d.name} (License: {d.licenseNumber}) - Score: {d.safetyScore}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>CARGO WEIGHT (KG) *</label>
                  <input 
                    type="number" min="0" placeholder="e.g. 1500" className="loadswift-input" required 
                    value={newTrip.cargoWeight} onChange={e => setNewTrip({...newTrip, cargoWeight: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>PLANNED DISTANCE (KM) *</label>
                  <input 
                    type="number" min="1" placeholder="e.g. 650" className="loadswift-input" required 
                    value={newTrip.plannedDistance} onChange={e => setNewTrip({...newTrip, plannedDistance: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={creating}
                style={{ 
                  background: 'var(--text-dark)', color: '#fff', border: 'none', padding: '14px', 
                  borderRadius: '8px', cursor: creating ? 'not-allowed' : 'pointer', fontWeight: '700', 
                  fontSize: '0.95rem', marginTop: "10px" 
                }}
              >
                {creating ? "Saving Draft..." : "Save Draft"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Complete Trip Modal */}
      {showCompleteModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "center", 
          alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div className="loadswift-card" style={{ width: "100%", maxWidth: "500px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800" }}>Log Trip Completion</h2>
              <button onClick={() => setShowCompleteModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            
            {completeError && <p style={{ color: "var(--text-retired)", fontSize: "0.85rem", fontWeight: "600" }}>❌ {completeError}</p>}
            
            <form onSubmit={handleCompleteTrip} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>FINAL ODOMETER VALUE (KM) *</label>
                <input 
                  type="number" min="0" placeholder="e.g. 76000" className="loadswift-input" required 
                  value={completionData.finalOdometer} onChange={e => setCompletionData({...completionData, finalOdometer: e.target.value})}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>ACTUAL DISTANCE (KM)</label>
                  <input 
                    type="number" min="1" placeholder="e.g. 660" className="loadswift-input" 
                    value={completionData.actualDistance} onChange={e => setCompletionData({...completionData, actualDistance: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>FUEL CONSUMED (LITERS)</label>
                  <input 
                    type="number" min="1" placeholder="e.g. 80" className="loadswift-input" 
                    value={completionData.fuelConsumed} onChange={e => setCompletionData({...completionData, fuelConsumed: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>TRIP REVENUE (INR) *</label>
                <input 
                  type="number" min="0" placeholder="e.g. 25000" className="loadswift-input" required 
                  value={completionData.revenue} onChange={e => setCompletionData({...completionData, revenue: e.target.value})}
                />
              </div>

              <button 
                type="submit" disabled={completing}
                style={{ 
                  background: 'var(--text-dark)', color: '#fff', border: 'none', padding: '14px', 
                  borderRadius: '8px', cursor: completing ? 'not-allowed' : 'pointer', fontWeight: '700', 
                  fontSize: '0.95rem', marginTop: "10px" 
                }}
              >
                {completing ? "Recording Trip Sheet..." : "Log Completion"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
