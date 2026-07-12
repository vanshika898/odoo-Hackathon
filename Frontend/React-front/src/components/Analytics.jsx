import React, { useState } from "react";
import { ArrowDownRight, ArrowUpRight, BarChart3, ChevronDown, CircleDollarSign, Gauge, Route, TrendingUp } from "lucide-react";

const chartData = {
  "Trip volume": { value: "128", label: "completed trips", change: "+14.8%", points: "0,93 38,75 75,82 112,50 150,62 188,29 225,40 263,13 300,25 338,7 376,20 414,4 452,14 490,3", fill: "0,104 0,93 38,75 75,82 112,50 150,62 188,29 225,40 263,13 300,25 338,7 376,20 414,4 452,14 490,3 490,105 0,105" },
  "Fuel efficiency": { value: "8.4", label: "km per litre", change: "+3.2%", points: "0,71 38,64 75,76 112,55 150,61 188,42 225,52 263,34 300,38 338,20 376,28 414,15 452,21 490,11", fill: "0,104 0,71 38,64 75,76 112,55 150,61 188,42 225,52 263,34 300,38 338,20 376,28 414,15 452,21 490,11 490,105 0,105" },
  "Operating cost": { value: "₹32.5k", label: "this month", change: "-8.6%", points: "0,29 38,35 75,23 112,47 150,40 188,58 225,49 263,68 300,59 338,76 376,68 414,86 452,79 490,92", fill: "0,104 0,29 38,35 75,23 112,47 150,40 188,58 225,49 263,68 300,59 338,76 376,68 414,86 452,79 490,92 490,105 0,105" },
};

export default function Analytics() {
  const [metric, setMetric] = useState("Trip volume");
  const [period, setPeriod] = useState("Last 30 days");
  const chart = chartData[metric];
  return <div className="analytics-page">
    <header className="analytics-header"><div><span className="analytics-eyebrow">Performance intelligence</span><h1>Analytics</h1><p>Turn fleet operations into clearer, faster decisions.</p></div><div className="analytics-period"><select aria-label="Analytics time period" value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 30 days</option><option>Last 90 days</option><option>This year</option></select><ChevronDown size={14} /></div></header>

    <section className="analytics-kpi-grid">
      <article><span className="analytics-kpi-icon is-blue"><Gauge size={17} /></span><div><span>Fuel efficiency</span><strong>8.4 <small>km/L</small></strong><p><ArrowUpRight size={13} /> 3.2% from last period</p></div></article>
      <article><span className="analytics-kpi-icon is-yellow"><BarChart3 size={17} /></span><div><span>Fleet utilization</span><strong>81<small>%</small></strong><p><ArrowUpRight size={13} /> 4.1% from last period</p></div></article>
      <article><span className="analytics-kpi-icon is-red"><CircleDollarSign size={17} /></span><div><span>Operating cost</span><strong>₹34,070</strong><p className="analytics-negative"><ArrowDownRight size={13} /> 8.6% from last period</p></div></article>
      <article><span className="analytics-kpi-icon is-green"><TrendingUp size={17} /></span><div><span>Fleet ROI</span><strong>14.2<small>%</small></strong><p><ArrowUpRight size={13} /> 1.8% from last period</p></div></article>
    </section>

    <section className="analytics-main-grid">
      <article className="analytics-trend-card"><header><div><h2>Performance trend</h2><p>{chart.label} across {period.toLowerCase()}.</p></div><div className="analytics-tabs">{Object.keys(chartData).map((item) => <button type="button" className={metric === item ? "is-active" : ""} key={item} onClick={() => setMetric(item)}>{item}</button>)}</div></header><div className="analytics-chart-summary"><strong>{chart.value}</strong><span className={chart.change.startsWith("-") ? "is-down" : ""}>{chart.change.startsWith("-") ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{chart.change}</span></div><div className="analytics-line-chart"><svg viewBox="0 0 490 110" preserveAspectRatio="none" aria-label={`${metric} line chart`} role="img"><defs><linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2588ed" stopOpacity=".19" /><stop offset="100%" stopColor="#2588ed" stopOpacity="0" /></linearGradient></defs><line x1="0" x2="490" y1="22" y2="22" /><line x1="0" x2="490" y1="53" y2="53" /><line x1="0" x2="490" y1="84" y2="84" /><polygon points={chart.fill} fill="url(#analytics-area)" /><polyline points={chart.points} fill="none" stroke="#2588ed" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></div><div className="analytics-chart-dates"><span>01 Jul</span><span>07 Jul</span><span>14 Jul</span><span>21 Jul</span><span>28 Jul</span></div></article>
      <article className="analytics-utilization-card"><header><div><h2>Fleet utilization</h2><p>Vehicle availability by status.</p></div><button type="button">View fleet</button></header><div className="analytics-donut-wrap"><div className="analytics-donut"><strong>81<small>%</small></strong><span>utilized</span></div><div className="analytics-donut-legend"><span><i className="is-active" />On route <b>4</b></span><span><i className="is-available" />Available <b>3</b></span><span><i className="is-service" />In service <b>1</b></span></div></div><div className="analytics-utilization-note"><Route size={16} /><span>4 vehicles are currently serving active loads.</span></div></article>
    </section>

    <section className="analytics-bottom-grid"><article className="analytics-routes-card"><header><div><h2>Top routes</h2><p>Most active corridors this month.</p></div><button type="button">View all</button></header><div className="analytics-route-row"><div><strong>Ahmedabad → Pune</strong><span>24 completed trips</span></div><b><i style={{ width: "86%" }} /></b><em>86%</em></div><div className="analytics-route-row"><div><strong>Surat → Vadodara</strong><span>19 completed trips</span></div><b><i style={{ width: "68%" }} /></b><em>68%</em></div><div className="analytics-route-row"><div><strong>Rajkot → Ahmedabad</strong><span>14 completed trips</span></div><b><i style={{ width: "53%" }} /></b><em>53%</em></div></article><article className="analytics-insight-card"><span><TrendingUp size={17} /></span><div><h2>Efficiency insight</h2><p>Your fuel efficiency is <strong>3.2% above</strong> its recent average. Keep routing active trips through the Ahmedabad–Pune corridor to preserve the gain.</p><button type="button">See recommendations <ArrowUpRight size={14} /></button></div></article></section>
  </div>;
}
