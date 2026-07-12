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


import React from 'react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const tabs = ['Dashboard', 'Fleet', 'Drivers', 'Trips', 'Maintenance', 'Analytics', 'Settings'];
  return (
    <div style={{ width: '260px', background: 'var(--bg-sidebar)', padding: '32px 16px', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      <h4 style={{ paddingLeft: '12px', marginBottom: '40px', fontWeight: '700' }}>TransitOps</h4>
      {tabs.map(tab => (
        <button key={tab} onClick={() => setCurrentTab(tab)} 
          style={{ background: currentTab === tab ? 'var(--sidebar-active)' : 'transparent', color: currentTab === tab ? 'var(--accent-gold)' : '#92929d', padding: '12px 16px', borderRadius: '8px', border: 'none', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }}>
          {tab}
        </button>
      ))}
    </div>
  );
}