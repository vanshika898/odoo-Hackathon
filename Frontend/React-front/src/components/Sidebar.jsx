// import React from 'react';

// export default function Sidebar({ currentTab, setCurrentTab }) {
//   const tabs = ['Dashboard', 'Fleet', 'Drivers', 'Trips', 'Maintenance', 'Fuel & Expenses', 'Analytics', 'Settings'];
//   return (
//     <div style={{ width: '260px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border-color)', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
//       <h2 style={{ color: '#fff', letterSpacing: '0.5px' }}>TransitOps</h2>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setCurrentTab(tab)}
//             style={{
//               textAlign: 'left', padding: '12px 16px', background: currentTab === tab ? 'var(--accent-odoo)' : 'transparent',
//               color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem'
//             }}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// // }
// import React from 'react';

// export default function Sidebar({ currentTab, setCurrentTab }) {
//   const tabs = ['Dashboard', 'Fleet', 'Drivers', 'Trips', 'Maintenance', 'Fuel & Expenses', 'Analytics', 'Settings'];
  
//   return (
//     <div style={{ width: '260px', background: 'var(--bg-sidebar)', padding: '32px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//       <div>
//         {/* Company Header Container */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', marginBottom: '40px' }}>
//           <div style={{ width: '32px', height: '32px', background: 'var(--accent-gold)', borderRadius: '8px' }}></div>
//           <div>
//             <h4 style={{ color: '#ffffff', fontWeight: '700', fontSize: '1.05rem', lineHeight: '1.2' }}>TransitOps</h4>
//             <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Fleet Management</p>
//           </div>
//         </div>

//         {/* Tab Selection Row Loops */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setCurrentTab(tab)}
//               style={{
//                 textAlign: 'left', padding: '12px 16px', 
//                 background: currentTab === tab ? 'var(--sidebar-active)' : 'transparent',
//                 color: currentTab === tab ? 'var(--accent-gold)' : '#92929d', 
//                 border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
//                 display: 'flex', alignItems: 'center', gap: '12px', transition: '0.2s'
//               }}
//             >
//               <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentTab === tab ? 'var(--accent-gold)' : 'transparent' }}></span>
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Driver Identity Token footer area container */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1c1c1f', padding: '12px', borderRadius: '10px' }}>
//         <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffcc00', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>RK</div>
//         <div>
//           <h5 style={{ color: '#fff', fontSize: '0.85rem' }}>Raven K.</h5>
//           <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Broker Admin</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  BarChart3,
  Settings,
  ChevronRight,
  UserCircle2,
} from "lucide-react";

export default function Sidebar({ currentTab, setCurrentTab }) {
  const tabs = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      title: "Fleet",
      icon: <Truck size={19} />,
    },
    {
      title: "Drivers",
      icon: <Users size={19} />,
    },
    {
      title: "Trips",
      icon: <Route size={19} />,
    },
    {
      title: "Maintenance",
      icon: <Wrench size={19} />,
    },
    {
      title: "Analytics",
      icon: <BarChart3 size={19} />,
    },
    {
      title: "Settings",
      icon: <Settings size={19} />,
    },
  ];

  return (
    <div
      style={{
        width: "280px",
        background: "var(--bg-sidebar)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px",
        color: "#fff",
        minHeight: "100vh",
        borderRight: "1px solid rgba(255,255,255,.04)",
      }}
    >
      {/* ================= LOGO ================= */}

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "42px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "var(--accent-gold)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "22px",
              fontWeight: "800",
              color: "#111",
              boxShadow: "0 10px 25px rgba(244,196,48,.30)",
            }}
          >
            T
          </div>

          <div>
            <h2
              style={{
                color: "#fff",
                fontSize: "1.2rem",
                fontWeight: "800",
                marginBottom: "3px",
              }}
            >
              TransitOps
            </h2>

            <p
              style={{
                color: "#8d9098",
                fontSize: ".8rem",
              }}
            >
              Fleet Intelligence
            </p>
          </div>
        </div>

        {/* SECTION */}

        <p
          style={{
            color: "#696d77",
            fontSize: ".72rem",
            fontWeight: "700",
            letterSpacing: "1.3px",
            marginBottom: "16px",
          }}
        >
          MAIN MENU
        </p>

        {/* MENU */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {tabs.map((tab) => {
            const active = currentTab === tab.title;

            return (
              <button
                key={tab.title}
                onClick={() => setCurrentTab(tab.title)}
                style={{
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  transition: ".25s",
                  background: active
                    ? "var(--accent-gold)"
                    : "transparent",
                  color: active ? "#111" : "#B5B8C3",
                  fontWeight: active ? "700" : "600",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  {tab.icon}

                  <span
                    style={{
                      fontSize: ".95rem",
                    }}
                  >
                    {tab.title}
                  </span>
                </div>

                {active && <ChevronRight size={18} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= PROFILE ================= */}

      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid rgba(255,255,255,.06)",
          paddingTop: "22px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: "#202228",
            borderRadius: "16px",
            padding: "14px",
          }}
        >
          <UserCircle2
            size={48}
            color="var(--accent-gold)"
          />

          <div style={{ flex: 1 }}>
            <h4
              style={{
                color: "#fff",
                marginBottom: "4px",
              }}
            >
              Raven K.
            </h4>

            <p
              style={{
                color: "#8c9098",
                fontSize: ".8rem",
              }}
            >
              Fleet Dispatcher
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}