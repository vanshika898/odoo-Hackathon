import React from "react";
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
import { mockRecentTrips } from "../mockData";

const statusStyle = {
  "On Trip": "is-on-trip",
  Completed: "is-completed",
  Dispatched: "is-dispatched",
  Draft: "is-draft",
};

function MapMarker({ className, children }) {
  return <span className={`dashboard-map-marker ${className || ""}`}>{children}</span>;
}

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <section className="dashboard-intro">
        <div>
          <span className="dashboard-eyebrow">Operations overview</span>
          <h1>Good morning, Raven</h1>
          <p>Here&apos;s a live snapshot of your fleet, routes and spending today.</p>
        </div>
        <button className="dashboard-date" type="button">
          <span>12 July 2026</span>
          <Navigation size={15} />
        </button>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-left-column">
          <article className="dashboard-summary-card dashboard-funds-card">
            <div className="dashboard-card-heading">
              <div className="dashboard-title-with-icon">
                <span className="dashboard-icon-tile"><CircleDollarSign size={17} /></span>
                <span>Available funds</span>
              </div>
              <button className="dashboard-icon-button" type="button" aria-label="View funds details"><ArrowUpRight size={17} /></button>
            </div>
            <div className="dashboard-funds-amount">₹71,300<span>.00</span></div>
            <div className="dashboard-funds-footer">
              <span><i className="dashboard-live-dot" />Updated just now</span>
              <strong>81% <small>fleet utilised</small></strong>
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
              <strong className="dashboard-mini-value">12 <small>loads</small></strong>
              <p>4 arriving within 2 hours</p>
            </article>
            <article className="dashboard-summary-card dashboard-mini-card">
              <div className="dashboard-card-heading">
                <div className="dashboard-title-with-icon">
                  <span className="dashboard-icon-tile is-yellow"><Fuel size={16} /></span>
                  <span>Fuel spend</span>
                </div>
                <MoreHorizontal size={19} color="#98a0ad" />
              </div>
              <strong className="dashboard-mini-value">₹18.4k</strong>
              <p><b>8.6%</b> lower than last week</p>
            </article>
          </div>

          <article className="dashboard-summary-card dashboard-rebate-card">
            <div className="dashboard-card-heading">
              <div className="dashboard-title-with-icon">
                <span className="dashboard-icon-tile is-green"><Banknote size={16} /></span>
                <span>Monthly savings</span>
              </div>
              <button className="dashboard-icon-button" type="button" aria-label="View savings details"><ArrowUpRight size={17} /></button>
            </div>
            <div className="dashboard-saving-line">
              <div><strong>₹48,321</strong><span>in route and fuel savings</span></div>
              <span className="dashboard-positive">+12.4%</span>
            </div>
          </article>
        </div>

        <article className="dashboard-map-card">
          <div className="dashboard-map-toolbar">
            <div><span className="dashboard-map-title">Live fleet tracking</span><span className="dashboard-map-subtitle">8 vehicles currently on route</span></div>
            <button type="button">View map <ArrowUpRight size={15} /></button>
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
          <button type="button">View all <ArrowUpRight size={15} /></button>
        </div>
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead><tr><th>Trip ID</th><th>Vehicle</th><th>Driver</th><th>ETA</th><th>Status</th></tr></thead>
            <tbody>
              {mockRecentTrips?.map((trip) => (
                <tr key={trip.id}>
                  <td><span className="dashboard-trip-id"><Truck size={15} />{trip.id}</span></td>
                  <td>{trip.vehicle}</td><td>{trip.driver}</td><td>{trip.eta}</td>
                  <td><span className={`dashboard-status ${statusStyle[trip.status] || "is-draft"}`}>{trip.status === "Completed" && <CheckCircle2 size={13} />}{trip.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
