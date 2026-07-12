import React, { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, BarChart3, ChevronDown, CircleDollarSign, Gauge, Route, TrendingUp, Download, Eye } from "lucide-react";
import { api } from "../api";

export default function Analytics({ user }) {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [averages, setAverages] = useState({
    avgEfficiency: 0,
    totalOperationalCost: 0,
    avgROI: 0
  });

  const isFinancialAnalyst = user?.accountType === "FinancialAnalyst";
  const isFleetManager = user?.accountType === "FleetManager";
  const isAdmin = user?.accountType === "Admin";
  
  const canViewROI = isFinancialAnalyst || isAdmin;
  const canReadReports = isFleetManager || isFinancialAnalyst || isAdmin;

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Fetch operational cost, fuel efficiency, and ROI data
      const efficiencyRes = await api.get("/reports/fuel-efficiency");
      const costRes = await api.get("/reports/operational-cost");
      
      let roiRes = { success: false, data: [] };
      if (canViewROI) {
        roiRes = await api.get("/reports/roi");
      }

      if (efficiencyRes.success && costRes.success) {
        // Merge data by vehicle name/registration
        const merged = efficiencyRes.data.map(eff => {
          const costItem = costRes.data.find(c => c.registrationNumber === eff.registrationNumber) || {};
          const roiItem = roiRes.data ? roiRes.data.find(r => r.registrationNumber === eff.registrationNumber) : null;
          
          return {
            registrationNumber: eff.registrationNumber,
            name: eff.name,
            type: eff.type,
            fuelEfficiency: eff.fuelEfficiency,
            totalFuelCost: costItem.totalFuelCost || 0,
            totalMaintenanceCost: costItem.totalMaintenanceCost || 0,
            operationalCost: costItem.operationalCost || 0,
            roi: roiItem ? roiItem.roi : null
          };
        });

        setReportData(merged);

        // Calculate aggregates
        const totalCost = merged.reduce((sum, item) => sum + item.operationalCost, 0);
        
        const validEffs = merged.filter(item => item.fuelEfficiency > 0);
        const avgEff = validEffs.length > 0 ? (validEffs.reduce((sum, item) => sum + item.fuelEfficiency, 0) / validEffs.length) : 0;

        const validROIs = merged.filter(item => item.roi !== null);
        const avgROI = validROIs.length > 0 ? (validROIs.reduce((sum, item) => sum + item.roi, 0) / validROIs.length) : 0;

        setAverages({
          avgEfficiency: Number(avgEff.toFixed(2)),
          totalOperationalCost: totalCost,
          avgROI: Number((avgROI * 100).toFixed(2)) // express as percentage
        });
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canReadReports) {
      fetchReports();
    }
  }, [user]);

  const handleExportCSV = async () => {
    try {
      const csvData = await api.get("/reports/export-csv");
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", `transitops_fleet_report_${Date.now()}.csv`);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to export report CSV: " + error.message);
    }
  };

  if (!canReadReports) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-surface)", borderRadius: "10px" }}>
        🔐 Report analytics access is restricted to Financial Analysts and Fleet Managers.
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <div>
          <span className="analytics-eyebrow">Performance intelligence</span>
          <h1>Analytics & Reports</h1>
          <p>Turn fleet operations data into clearer financial decisions.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={handleExportCSV} 
            className="fleet-export-button" 
            type="button"
            style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
          >
            <Download size={16} /> Export CSV Report
          </button>
        </div>
      </header>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Compiling ledger reports...
        </div>
      ) : (
        <>
          <section className="analytics-kpi-grid">
            <article>
              <span className="analytics-kpi-icon is-blue"><Gauge size={17} /></span>
              <div>
                <span>Avg Fuel Efficiency</span>
                <strong>{averages.avgEfficiency} <small>km/L</small></strong>
                <p>Telemetry-derived average</p>
              </div>
            </article>
            <article>
              <span className="analytics-kpi-icon is-red"><CircleDollarSign size={17} /></span>
              <div>
                <span>Total Operational Cost</span>
                <strong>₹{averages.totalOperationalCost?.toLocaleString()}</strong>
                <p>Fuel + Maintenance total</p>
              </div>
            </article>
            <article>
              <span className="analytics-kpi-icon is-green"><TrendingUp size={17} /></span>
              <div>
                <span>Average Fleet ROI</span>
                <strong>
                  {canViewROI ? `${averages.avgROI}%` : "Restricted"}
                </strong>
                <p>Asset returns metrics</p>
              </div>
            </article>
          </section>

          <section className="fleet-registry" style={{ marginTop: "24px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", padding: "20px 24px 10px" }}>Asset Financial Sheets</h2>
            <div className="fleet-table-wrap">
              <table className="fleet-table">
                <thead>
                  <tr>
                    <th>Vehicle Asset</th>
                    <th>Type</th>
                    <th>Fuel Efficiency</th>
                    <th>Fuel Costs</th>
                    <th>Maintenance Costs</th>
                    <th>Operational Cost</th>
                    <th>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item) => (
                    <tr key={item.registrationNumber}>
                      <td>
                        <strong>{item.name}</strong> 
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "6px" }}>
                          ({item.registrationNumber})
                        </span>
                      </td>
                      <td>{item.type}</td>
                      <td>{item.fuelEfficiency > 0 ? `${item.fuelEfficiency} km/L` : "—"}</td>
                      <td>₹{item.totalFuelCost?.toLocaleString()}</td>
                      <td>₹{item.totalMaintenanceCost?.toLocaleString()}</td>
                      <td><strong>₹{item.operationalCost?.toLocaleString()}</strong></td>
                      <td>
                        {canViewROI ? (
                          <span style={{ fontWeight: "700", color: item.roi >= 0 ? "#15803d" : "#b91c1c" }}>
                            {item.roi !== null ? `${(item.roi * 100).toFixed(2)}%` : "0.00%"}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Restricted</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!reportData.length && (
              <div className="fleet-empty">
                <BarChart3 size={22} />
                <strong>No asset telemetry found</strong>
                <span>Add vehicles and log completed trips to generate reports.</span>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
