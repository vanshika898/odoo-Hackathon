import React from "react";
import { BarChart3, Bell, ChevronRight, CircleHelp, Fuel, LayoutDashboard, LogOut, Route, Settings, Truck, Users, Wrench } from "lucide-react";

const primaryTabs = [
  { title: "Dashboard", icon: LayoutDashboard }, { title: "Trips", icon: Route },
  { title: "Fleet", icon: Truck }, { title: "Drivers", icon: Users },
];
const managementTabs = [
  { title: "Maintenance", icon: Wrench }, { title: "Fuel & Expenses", icon: Fuel },
  { title: "Analytics", icon: BarChart3 }, { title: "Settings", icon: Settings },
];

function NavItem({ tab, currentTab, setCurrentTab }) {
  const Icon = tab.icon;
  const active = currentTab === tab.title;
  return <button className={`sidebar-nav-item ${active ? "is-active" : ""}`} type="button" onClick={() => setCurrentTab(tab.title)}>
    <Icon size={17} strokeWidth={active ? 2.3 : 1.9} /><span>{tab.title}</span>{active && <ChevronRight className="sidebar-nav-arrow" size={15} />}
  </button>;
}

export default function Sidebar({ currentTab, setCurrentTab }) {
  return <aside className="app-sidebar">
    <div>
      <div className="sidebar-brand"><div className="sidebar-brand-mark"><span /><i /></div><div><strong>TransitOps</strong><small>Fleet Command</small></div></div>
      <nav className="sidebar-navigation" aria-label="Main navigation">
        <span className="sidebar-section-label">Workspace</span>
        <div className="sidebar-nav-list">{primaryTabs.map((tab) => <NavItem key={tab.title} tab={tab} currentTab={currentTab} setCurrentTab={setCurrentTab} />)}</div>
        <div className="sidebar-divider" />
        <span className="sidebar-section-label">Manage</span>
        <div className="sidebar-nav-list">{managementTabs.map((tab) => <NavItem key={tab.title} tab={tab} currentTab={currentTab} setCurrentTab={setCurrentTab} />)}</div>
      </nav>
    </div>
    <div className="sidebar-bottom">
      <div className="sidebar-quick-links"><button type="button"><Bell size={16} /><span>Notifications</span><b>3</b></button><button type="button"><CircleHelp size={16} /><span>Help centre</span></button></div>
      <div className="sidebar-profile"><div className="sidebar-avatar">RK</div><div className="sidebar-profile-copy"><strong>Raven K.</strong><span>Fleet dispatcher</span></div><button type="button" aria-label="Log out"><LogOut size={16} /></button></div>
    </div>
  </aside>;
}
