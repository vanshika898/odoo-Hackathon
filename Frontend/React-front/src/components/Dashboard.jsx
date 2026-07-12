import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  Fuel,
  MapPin,
  MoreHorizontal,
  Navigation,
  Truck,
} from "lucide-react";
import { api } from "../api";

const statusStyle = {
  "On Trip": "is-on-trip",
  Completed: "is-completed",
  Dispatched: "is-dispatched",
  Draft: "is-draft",
  Cancelled: "is-cancelled"
};

function MapMarker({ className, children }) {
  return <span className={`dashboard-map-marker ${className || ""}`}>{children}</span>;
}

export default function Dashboard({ user }) {
  const [kpis, setKpis] = useState({
    activeVehicles: 0,
    availableVehicles: 0,
    vehiclesInMaintenance: 0,
    activeTrips: 0,
    pendingTrips: 0,
    driversOnDuty: 0,
    fleetUtilization: 0
  });
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const kpiRes = await api.get("/dashboard/kpis");
        if (kpiRes.success && kpiRes.kpis) {
          setKpis(kpiRes.kpis);
        }

        const tripRes = await api.get("/trips");
        if (tripRes.success && tripRes.trips) {
          // Take first 5 recent trips
          setRecentTrips(tripRes.trips.slice(0, 5));
        }
      } catch (error) {
        console.error("Error loading dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-page">
      <section className="dashboard-intro">
        <div>
          <span className="dashboard-eyebrow">Operations overview</span>
          <h1>Welcome, {user?.fullName || "Raven"}</h1>
          <p>Here&apos;s a live snapshot of your fleet, routes and spending today.</p>
        </div>
        <button className="dashboard-date" type="button">
          <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <Navigation size={15} />
        </button>
      </section>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Aggregating live telemetry...
        </div>
      ) : (
        <>
          <section className="dashboard-grid">
            <div className="dashboard-left-column">
              <article className="dashboard-summary-card dashboard-funds-card">
                <div className="dashboard-card-heading">
                  <div className="dashboard-title-with-icon">
                    <span className="dashboard-icon-tile"><CircleDollarSign size={17} /></span>
                    <span>Fleet Availability</span>
                  </div>
                </div>
                <div className="dashboard-funds-amount">
                  {kpis.availableVehicles}
                  <span style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--text-muted)", marginLeft: "8px" }}>
                    vehicles available
                  </span>
                </div>
                <div className="dashboard-funds-footer">
                  <span><i className="dashboard-live-dot" />Live telemetry active</span>
                  <strong>{kpis.fleetUtilization}% <small>utilised</small></strong>
                </div>
              </article>

              <div className="dashboard-mini-grid">
                <article className="dashboard-summary-card dashboard-mini-card">
                  <div className="dashboard-card-heading">
                    <div className="dashboard-title-with-icon">
                      <span className="dashboard-icon-tile is-blue"><Truck size={16} /></span>
                      <span>Active trips</span>
                    </div>
                    <MoreHorizontal size={19} color="#98a0ad" />
                  </div>
                  <strong className="dashboard-mini-value">{kpis.activeTrips} <small>loads</small></strong>
                  <p>{kpis.pendingTrips} trips currently in Draft state</p>
                </article>
                <article className="dashboard-summary-card dashboard-mini-card">
                  <div className="dashboard-card-heading">
                    <div className="dashboard-title-with-icon">
                      <span className="dashboard-icon-tile is-yellow"><Fuel size={16} /></span>
                      <span>In Maintenance</span>
                    </div>
                    <MoreHorizontal size={19} color="#98a0ad" />
                  </div>
                  <strong className="dashboard-mini-value">{kpis.vehiclesInMaintenance} <small>units</small></strong>
                  <p>In workshop workshop queue</p>
                </article>
              </div>

              <article className="dashboard-summary-card dashboard-rebate-card">
                <div className="dashboard-card-heading">
                  <div className="dashboard-title-with-icon">
                    <span className="dashboard-icon-tile is-green"><Banknote size={16} /></span>
                    <span>Drivers active</span>
                  </div>
                </div>
                <div className="dashboard-saving-line">
                  <div><strong>{kpis.driversOnDuty} drivers</strong><span>currently on duty on routes</span></div>
                </div>
              </article>
            </div>

            <article className="dashboard-map-card">
              <div className="dashboard-map-toolbar">
                <div>
                  <span className="dashboard-map-title">Live fleet tracking</span>
                  <span className="dashboard-map-subtitle">{kpis.activeTrips} vehicles currently on route</span>
                </div>
              </div>
              <div className="dashboard-map-canvas" aria-label="Fleet route preview">
                <div className="dashboard-road road-one" /><div className="dashboard-road road-two" /><div className="dashboard-road road-three" />
                <div className="dashboard-route route-a" /><div className="dashboard-route route-b" />
                <MapMarker className="marker-a"><Truck size={14} /></MapMarker>
                <MapMarker className="marker-b"><Truck size={14} /></MapMarker>
                <MapMarker className="marker-c"><Truck size={14} /></MapMarker>
                <MapMarker className="marker-d"><MapPin size={13} /></MapMarker>
                <div className="dashboard-map-label label-start">Ahmedabad, GJ</div>
                <div className="dashboard-map-label label-end">Pune, MH</div>
                <div className="dashboard-map-legend"><i /> Active vehicle</div>
              </div>
            </article>
          </section>

          <section className="dashboard-recent-card">
            <div className="dashboard-recent-heading">
              <div><h2>Recent trips</h2><p>Latest dispatches across your fleet</p></div>
            </div>
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead><tr><th>Trip ID</th><th>Vehicle</th><th>Driver</th><th>Cargo Weight</th><th>Status</th></tr></thead>
                <tbody>
                  {recentTrips.length > 0 ? (
                    recentTrips.map((trip) => (
                      <tr key={trip._id}>
                        <td>
                          <span className="dashboard-trip-id">
                            <Truck size={15} />
                            {trip._id.slice(-6).toUpperCase()}
                          </span>
                        </td>
                        <td>{trip.vehicle?.name || "—"} ({trip.vehicle?.registrationNumber || "—"})</td>
                        <td>{trip.driver?.name || "—"}</td>
                        <td>{trip.cargoWeight} kg</td>
                        <td>
                          <span className={`dashboard-status ${statusStyle[trip.status] || "is-draft"}`}>
                            {trip.status === "Completed" && <CheckCircle2 size={13} />}
                            {trip.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
                        No trips found in operations database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
