import React, { useEffect, useState } from "react";
import { ChevronDown, Download, Fuel, MoreHorizontal, Plus, DollarSign, X } from "lucide-react";
import { api } from "../api";

export default function Expenses({ user }) {
  const [activeTab, setActiveTab] = useState("fuel"); // "fuel" or "expenses"
  
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // Modals
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [fuelForm, setFuelForm] = useState({
    vehicleId: "",
    tripId: "",
    liters: "",
    cost: "",
    odometerAtFillup: ""
  });
  const [fuelError, setFuelError] = useState("");
  const [fuelSaving, setFuelSaving] = useState(false);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    vehicleId: "",
    tripId: "",
    type: "Toll",
    amount: "",
    notes: ""
  });
  const [expenseError, setExpenseError] = useState("");
  const [expenseSaving, setExpenseSaving] = useState(false);

  // Permissions
  const isFleetManager = user?.accountType === "FleetManager";
  const isFinancialAnalyst = user?.accountType === "FinancialAnalyst";
  const isDriver = user?.accountType === "Driver";
  const isAdmin = user?.accountType === "Admin";

  const canWrite = isFleetManager || isDriver || isAdmin;
  const canRead = isFleetManager || isFinancialAnalyst || isAdmin;

  const fetchData = async () => {
    setLoading(true);
    try {
      if (canRead) {
        const fuelRes = await api.get("/fuel-logs");
        if (fuelRes.success && fuelRes.logs) {
          setFuelLogs(fuelRes.logs);
        }

        const expRes = await api.get("/expenses");
        if (expRes.success && expRes.expenses) {
          setExpenses(expRes.expenses);
        }
      }
    } catch (error) {
      console.error("Failed to load logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    try {
      const vRes = await api.get("/vehicles");
      if (vRes.success && vRes.vehicles) {
        setVehicles(vRes.vehicles.filter(v => v.status !== "Retired"));
      }

      const tRes = await api.get("/trips");
      if (tRes.success && tRes.trips) {
        // Only active/completed trips
        setTrips(tRes.trips.filter(t => t.status === "Dispatched" || t.status === "Completed"));
      }
    } catch (error) {
      console.error("Failed to load dropdown assets:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleOpenFuelModal = () => {
    setFuelError("");
    loadDropdowns();
    setShowFuelModal(true);
  };

  const handleOpenExpenseModal = () => {
    setExpenseError("");
    loadDropdowns();
    setShowExpenseModal(true);
  };

  const handleLogFuel = async (e) => {
    e.preventDefault();
    setFuelError("");
    setFuelSaving(true);

    try {
      const payload = {
        vehicleId: fuelForm.vehicleId,
        tripId: fuelForm.tripId || undefined,
        liters: Number(fuelForm.liters),
        cost: Number(fuelForm.cost),
        odometerAtFillup: fuelForm.odometerAtFillup ? Number(fuelForm.odometerAtFillup) : undefined
      };

      const res = await api.post("/fuel-logs", payload);
      if (res.success) {
        setShowFuelModal(false);
        setFuelForm({ vehicleId: "", tripId: "", liters: "", cost: "", odometerAtFillup: "" });
        fetchData();
      }
    } catch (error) {
      setFuelError(error.message || "Failed to log fuel refill");
    } finally {
      setFuelSaving(false);
    }
  };

  const handleLogExpense = async (e) => {
    e.preventDefault();
    setExpenseError("");
    setExpenseSaving(true);

    try {
      const payload = {
        vehicleId: expenseForm.vehicleId,
        tripId: expenseForm.tripId || undefined,
        type: expenseForm.type,
        amount: Number(expenseForm.amount),
        notes: expenseForm.notes
      };

      const res = await api.post("/expenses", payload);
      if (res.success) {
        setShowExpenseModal(false);
        setExpenseForm({ vehicleId: "", tripId: "", type: "Toll", amount: "", notes: "" });
        fetchData();
      }
    } catch (error) {
      setExpenseError(error.message || "Failed to log expense");
    } finally {
      setExpenseSaving(false);
    }
  };

  return (
    <div className="expenses-page">
      <header className="fleet-header">
        <div>
          <span className="fleet-eyebrow">Financial controls</span>
          <h1>Fuel & Expenses</h1>
          <p>Monitor operational costs, log refills, and route expenses.</p>
        </div>
        <div className="fleet-header-actions" style={{ display: "flex", gap: "10px" }}>
          {canWrite && (
            <>
              <button className="fleet-export-button" type="button" onClick={handleOpenFuelModal}>
                <Plus size={16} /> Log Fuel
              </button>
              <button className="fleet-add-button" type="button" onClick={handleOpenExpenseModal}>
                <Plus size={17} /> Log Expense
              </button>
            </>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border-muted)", paddingBottom: "10px" }}>
        <button 
          onClick={() => setActiveTab("fuel")}
          style={{ 
            background: "none", border: "none", padding: "10px 20px", fontSize: "1rem", fontWeight: "700",
            color: activeTab === "fuel" ? "var(--text-dark)" : "var(--text-muted)",
            borderBottom: activeTab === "fuel" ? "3px solid var(--accent-gold)" : "none",
            cursor: "pointer"
          }}
        >
          Fuel Logs
        </button>
        <button 
          onClick={() => setActiveTab("expenses")}
          style={{ 
            background: "none", border: "none", padding: "10px 20px", fontSize: "1rem", fontWeight: "700",
            color: activeTab === "expenses" ? "var(--text-dark)" : "var(--text-muted)",
            borderBottom: activeTab === "expenses" ? "3px solid var(--accent-gold)" : "none",
            cursor: "pointer"
          }}
        >
          Route Expenses
        </button>
      </div>

      {!canRead ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-surface)", borderRadius: "10px" }}>
          🔐 Expense lists are restricted to Financial Analysts and Fleet Managers. Log forms are accessible above.
        </div>
      ) : loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading ledger sheets...</div>
      ) : activeTab === "fuel" ? (
        <section className="fleet-registry">
          <div className="fleet-table-wrap">
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Trip ID</th>
                  <th>Date</th>
                  <th>Liters</th>
                  <th>Odometer At Fill</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {fuelLogs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      <div className="fleet-vehicle-name">
                        <span><Fuel size={15} /></span>
                        <strong>{log.vehicle?.name || "Deleted Vehicle"}</strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "4px" }}>
                          ({log.vehicle?.registrationNumber || "—"})
                        </span>
                      </div>
                    </td>
                    <td>{log.trip ? log.trip.slice(-6).toUpperCase() : "Standalone"}</td>
                    <td>{new Date(log.date).toLocaleDateString()}</td>
                    <td>{log.liters} L</td>
                    <td>{log.odometerAtFillup ? `${log.odometerAtFillup.toLocaleString()} km` : "—"}</td>
                    <td><strong>₹{log.cost?.toLocaleString()}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!fuelLogs.length && (
            <div className="fleet-empty">
              <Fuel size={22} />
              <strong>No fuel logs registered</strong>
              <span>Refill telemetry has not been recorded yet.</span>
            </div>
          )}
        </section>
      ) : (
        <section className="fleet-registry">
          <div className="fleet-table-wrap">
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Trip ID</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Notes</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp._id}>
                    <td>
                      <div className="fleet-vehicle-name">
                        <span><DollarSign size={15} /></span>
                        <strong>{exp.vehicle?.name || "Deleted Vehicle"}</strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "4px" }}>
                          ({exp.vehicle?.registrationNumber || "—"})
                        </span>
                      </div>
                    </td>
                    <td>{exp.trip ? exp.trip.slice(-6).toUpperCase() : "Standalone"}</td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>
                      <span style={{ fontWeight: "700" }}>{exp.type}</span>
                    </td>
                    <td>{exp.notes || "—"}</td>
                    <td><strong>₹{exp.amount?.toLocaleString()}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!expenses.length && (
            <div className="fleet-empty">
              <DollarSign size={22} />
              <strong>No route expenses recorded</strong>
              <span>Tolls, parking, and fines logs are empty.</span>
            </div>
          )}
        </section>
      )}

      {/* Log Fuel Modal */}
      {showFuelModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "center", 
          alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div className="loadswift-card" style={{ width: "100%", maxWidth: "500px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800" }}>Log Fuel Refill</h2>
              <button onClick={() => setShowFuelModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            
            {fuelError && <p style={{ color: "var(--text-retired)", fontSize: "0.85rem", fontWeight: "600" }}>❌ {fuelError}</p>}
            
            <form onSubmit={handleLogFuel} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>SELECT VEHICLE *</label>
                <select 
                  className="loadswift-input" style={{ width: "100%" }} required
                  value={fuelForm.vehicleId} onChange={e => setFuelForm({...fuelForm, vehicleId: e.target.value})}
                >
                  <option value="">-- Choose Vehicle --</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.name} ({v.registrationNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>ASSOCIATED ACTIVE TRIP (OPTIONAL)</label>
                <select 
                  className="loadswift-input" style={{ width: "100%" }}
                  value={fuelForm.tripId} onChange={e => setFuelForm({...fuelForm, tripId: e.target.value})}
                >
                  <option value="">Standalone / Unassigned</option>
                  {trips.filter(t => t.vehicle?._id === fuelForm.vehicleId).map(t => (
                    <option key={t._id} value={t._id}>{t.source} to {t.destination} ({t._id.slice(-6).toUpperCase()})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>LITERS REFILLED *</label>
                  <input 
                    type="number" step="0.01" min="0.01" placeholder="e.g. 45" className="loadswift-input" required 
                    value={fuelForm.liters} onChange={e => setFuelForm({...fuelForm, liters: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>TOTAL COST (INR) *</label>
                  <input 
                    type="number" min="0" placeholder="e.g. 3500" className="loadswift-input" required 
                    value={fuelForm.cost} onChange={e => setFuelForm({...fuelForm, cost: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>ODOMETER AT FILLUP (KM)</label>
                <input 
                  type="number" min="0" placeholder="e.g. 74500" className="loadswift-input" 
                  value={fuelForm.odometerAtFillup} onChange={e => setFuelForm({...fuelForm, odometerAtFillup: e.target.value})}
                />
              </div>

              <button 
                type="submit" disabled={fuelSaving}
                style={{ 
                  background: 'var(--text-dark)', color: '#fff', border: 'none', padding: '14px', 
                  borderRadius: '8px', cursor: fuelSaving ? 'not-allowed' : 'pointer', fontWeight: '700', 
                  fontSize: '0.95rem', marginTop: "10px" 
                }}
              >
                {fuelSaving ? "Logging Refill..." : "Log Fuel refill"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Log Expense Modal */}
      {showExpenseModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "center", 
          alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div className="loadswift-card" style={{ width: "100%", maxWidth: "500px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800" }}>Log Route Expense</h2>
              <button onClick={() => setShowExpenseModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            
            {expenseError && <p style={{ color: "var(--text-retired)", fontSize: "0.85rem", fontWeight: "600" }}>❌ {expenseError}</p>}
            
            <form onSubmit={handleLogExpense} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>SELECT VEHICLE *</label>
                <select 
                  className="loadswift-input" style={{ width: "100%" }} required
                  value={expenseForm.vehicleId} onChange={e => setExpenseForm({...expenseForm, vehicleId: e.target.value})}
                >
                  <option value="">-- Choose Vehicle --</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.name} ({v.registrationNumber})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>EXPENSE CATEGORY *</label>
                  <select 
                    className="loadswift-input" style={{ width: "100%" }} required
                    value={expenseForm.type} onChange={e => setExpenseForm({...expenseForm, type: e.target.value})}
                  >
                    <option value="Toll">Toll</option>
                    <option value="Parking">Parking</option>
                    <option value="Fine">Fine</option>
                    <option value="Permit">Permit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>AMOUNT (INR) *</label>
                  <input 
                    type="number" min="0" placeholder="e.g. 350" className="loadswift-input" required 
                    value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>ASSOCIATED ACTIVE TRIP (OPTIONAL)</label>
                <select 
                  className="loadswift-input" style={{ width: "100%" }}
                  value={expenseForm.tripId} onChange={e => setExpenseForm({...expenseForm, tripId: e.target.value})}
                >
                  <option value="">Standalone / Unassigned</option>
                  {trips.filter(t => t.vehicle?._id === expenseForm.vehicleId).map(t => (
                    <option key={t._id} value={t._id}>{t.source} to {t.destination} ({t._id.slice(-6).toUpperCase()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>NOTES / DESCRIPTION</label>
                <input 
                  type="text" placeholder="e.g. Pune expressway toll gate 3" className="loadswift-input" 
                  value={expenseForm.notes} onChange={e => setExpenseForm({...expenseForm, notes: e.target.value})}
                />
              </div>

              <button 
                type="submit" disabled={expenseSaving}
                style={{ 
                  background: 'var(--text-dark)', color: '#fff', border: 'none', padding: '14px', 
                  borderRadius: '8px', cursor: expenseSaving ? 'not-allowed' : 'pointer', fontWeight: '700', 
                  fontSize: '0.95rem', marginTop: "10px" 
                }}
              >
                {expenseSaving ? "Recording Expense..." : "Log Route Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
