import React, { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronDown, CircleDollarSign, Fuel, Plus, ReceiptText, Search, WalletCards } from "lucide-react";
import { mockFuelLogs, mockOtherExpenses } from "../mockData";

export default function Expenses() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Fuel logs");
  const [period, setPeriod] = useState("This month");
  const fuelLogs = useMemo(() => mockFuelLogs.filter((log) => `${log.vehicle} ${log.date}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const routeCosts = useMemo(() => mockOtherExpenses.filter((expense) => `${expense.id} ${expense.vehicle}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const fuelTotal = mockFuelLogs.reduce((total, log) => total + Number(log.cost.replace(",", "")), 0);
  const routeTotal = mockOtherExpenses.reduce((total, expense) => total + expense.toll + expense.other + expense.maintenance, 0);

  return <div className="expenses-page">
    <header className="expenses-header"><div><span className="expenses-eyebrow">Cost control</span><h1>Expenses</h1><p>Track fleet spending and route costs in one place.</p></div><button className="expenses-add-button" type="button"><Plus size={17} /> Add expense</button></header>

    <section className="expenses-summary-grid">
      <article><span className="expenses-summary-icon"><WalletCards size={17} /></span><div><span>Total spend</span><strong>₹32,460</strong><small><ArrowDownRight size={13} /> 8.6% vs last month</small></div></article>
      <article><span className="expenses-summary-icon is-yellow"><Fuel size={17} /></span><div><span>Fuel spend</span><strong>₹{fuelTotal.toLocaleString()}</strong><small>180 L logged this month</small></div></article>
      <article><span className="expenses-summary-icon is-blue"><ReceiptText size={17} /></span><div><span>Route costs</span><strong>₹{routeTotal.toLocaleString()}</strong><small><ArrowUpRight size={13} /> 2 active trip entries</small></div></article>
      <article><span className="expenses-summary-icon is-green"><CircleDollarSign size={17} /></span><div><span>Budget remaining</span><strong>₹38,840</strong><small>54% of monthly budget</small></div></article>
    </section>

    <section className="expenses-ledger">
      <div className="expenses-ledger-heading"><div><h2>Expense activity</h2><p>A detailed view of your latest fleet costs.</p></div><div className="expenses-period"><select aria-label="Expense period" value={period} onChange={(event) => setPeriod(event.target.value)}><option>This month</option><option>Last month</option><option>This quarter</option></select><ChevronDown size={14} /></div></div>
      <div className="expenses-controls"><div className="expenses-tabs">{["Fuel logs", "Route costs"].map((tab) => <button key={tab} className={activeTab === tab ? "is-active" : ""} type="button" onClick={() => setActiveTab(tab)}>{tab}<span>{tab === "Fuel logs" ? mockFuelLogs.length : mockOtherExpenses.length}</span></button>)}</div><div className="expenses-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={activeTab === "Fuel logs" ? "Search vehicle or date" : "Search trip or vehicle"} /></div></div>
      {activeTab === "Fuel logs" ? <div className="expenses-table-wrap"><table className="expenses-table"><thead><tr><th>Vehicle</th><th>Log date</th><th>Fuel volume</th><th>Cost</th><th>Cost / litre</th><th>Status</th></tr></thead><tbody>{fuelLogs.map((log) => <tr key={log.id}><td><span className="expenses-vehicle"><Fuel size={15} />{log.vehicle}</span></td><td>{log.date}</td><td>{log.liters}</td><td><strong>₹{log.cost}</strong></td><td>₹75.00</td><td><span className="expense-status expense-recorded">Recorded</span></td></tr>)}</tbody></table>{!fuelLogs.length && <EmptyState />}</div> : <div className="expenses-table-wrap"><table className="expenses-table"><thead><tr><th>Trip</th><th>Vehicle</th><th>Toll</th><th>Other costs</th><th>Maintenance</th><th>Total</th></tr></thead><tbody>{routeCosts.map((expense) => <tr key={expense.id}><td><strong className="expenses-trip-id">#{expense.id}</strong></td><td>{expense.vehicle}</td><td>₹{expense.toll.toLocaleString()}</td><td>₹{expense.other.toLocaleString()}</td><td>₹{expense.maintenance.toLocaleString()}</td><td><strong>₹{(expense.toll + expense.other + expense.maintenance).toLocaleString()}</strong></td></tr>)}</tbody></table>{!routeCosts.length && <EmptyState />}</div>}
      <footer className="expenses-ledger-footer"><span>Showing activity for <strong>{period.toLowerCase()}</strong></span><button type="button">Download report <ArrowDownRight size={14} /></button></footer>
    </section>
  </div>;
}

function EmptyState() { return <div className="expenses-empty"><ReceiptText size={22} /><strong>No matching expenses found</strong><span>Try changing your search.</span></div>; }
