// import React, { useState } from 'react';
// import Sidebar from './components/Sidebar';
// import Dashboard from './components/Dashboard';
// import Fleet from './components/Fleet';
// import Drivers from './components/Drivers';
// import Trips from './components/Trips';
// import Maintenance from './components/Maintenance';
// import Expenses from './components/Expenses';
// import Analytics from './components/Analytics';
// import Settings from './components/Settings';
// import Login from './components/Login';
// import './index.css';

// export default function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentTab, setCurrentTab] = useState('Dashboard');

//   if (!isAuthenticated) {
//     return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
//   }

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
//       <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
//       <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
//         {/* TOP STATUS NAVIGATION BAR HUB */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-muted)' }}>
//           <span style={{ fontWeight: '700', color: 'var(--text-dark)', fontSize: '0.95rem' }}>Active Workspace Context Engine</span>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', fontWeight: '600' }}>
//             <span style={{ color: 'var(--text-muted)' }}>Current Route Layer:</span>
//             <span style={{ background: '#f1f2f4', padding: '4px 10px', borderRadius: '4px' }}>{currentTab.toUpperCase()}</span>
//           </div>
//         </div>

//         {/* CONTROLLER SWITCH CONTAINER VIEWPORT BLOCK */}
//         {currentTab === 'Dashboard' && <Dashboard />}
//         {currentTab === 'Fleet' && <Fleet />}
//         {currentTab === 'Drivers' && <Drivers />}
//         {currentTab === 'Trips' && <Trips />}
//         {currentTab === 'Maintenance' && <Maintenance />}
//         {currentTab === 'Fuel & Expenses' && <Expenses />}
//         {currentTab === 'Analytics' && <Analytics />}
//         {currentTab === 'Settings' && <Settings />}
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Fleet from "./components/Fleet";
import Drivers from "./components/Drivers";
import Trips from "./components/Trips";
import Maintenance from "./components/Maintenance";
import Expenses from "./components/Expenses";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import Login from "./components/Login";
import "./index.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState("Dashboard");

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case "Dashboard":
        return <Dashboard />;

      case "Fleet":
        return <Fleet />;

      case "Drivers":
        return <Drivers />;

      case "Trips":
        return <Trips />;

      case "Maintenance":
        return <Maintenance />;

      case "Fuel & Expenses":
        return <Expenses />;

      case "Analytics":
        return <Analytics />;

      case "Settings":
        return <Settings />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-primary)",
      }}
    >
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      <div
        style={{
          flex: 1,
          padding: "28px 38px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        {/* TOP NAVBAR */}
        <div
          className="loadswift-card"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 28px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                marginBottom: "6px",
              }}
            >
              Welcome Back 👋
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: ".95rem",
              }}
            >
              Manage your fleet operations efficiently from one place.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <span
              style={{
                color: "var(--text-muted)",
                fontWeight: "600",
              }}
            >
              Current Module
            </span>

            <div
              style={{
                background: "var(--accent-gold)",
                color: "#111",
                padding: "8px 18px",
                borderRadius: "999px",
                fontWeight: "700",
                fontSize: ".85rem",
              }}
            >
              {currentTab}
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}

        {renderContent()}
      </div>
    </div>
  );
}