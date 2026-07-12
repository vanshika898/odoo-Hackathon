// src/mockData.js

export const mockVehicles = [
  { id: 1, reg_no: "GJ01AB4521", name: "VAN-05", type: "Van", capacity: 500, odometer: 74000, cost: "6,20,000", status: "Available" },
  { id: 2, reg_no: "GJ01AB9981", name: "TRUCK-11", type: "Truck", capacity: 5000, odometer: 182000, cost: "24,50,000", status: "On Trip" },
  { id: 3, reg_no: "GJ01AB1120", name: "MINI-03", type: "Mini", capacity: 1000, odometer: 66000, cost: "4,10,000", status: "In Shop" },
  { id: 4, reg_no: "GJ01AB0008", name: "VAN-09", type: "Van", capacity: 750, odometer: 241900, cost: "5,90,000", status: "Retired" }
];

export const mockDrivers = [
  { id: 1, name: "Alex", license: "DL-88213", category: "LMV", expiry: "12/2028", contact: "98765xxxxx", safety: 96, status: "Available" },
  { id: 2, name: "John", license: "DL-44120", category: "HMV", expiry: "03/2025 EXPIRED", contact: "98220xxxxx", safety: 81, status: "Suspended" },
  { id: 3, name: "Priya", license: "DL-77031", category: "LMV", expiry: "08/2029", contact: "99110xxxxx", safety: 99, status: "On Trip" },
  { id: 4, name: "Suresh", license: "DL-90045", category: "HMV", expiry: "01/2027", contact: "97440xxxxx", safety: 88, status: "Off Duty" }
];

export const mockRecentTrips = [
  { id: "TR001", vehicle: "VAN-05", driver: "Alex", status: "On Trip", eta: "45 min" },
  { id: "TR002", vehicle: "TRK-12", driver: "John", status: "Completed", eta: "—" },
  { id: "TR003", vehicle: "MINI-08", driver: "Priya", status: "Dispatched", eta: "1h 10m" },
  { id: "TR004", vehicle: "—", driver: "—", status: "Draft", eta: "Awaiting vehicle" }
];

export const mockMaintenance = [
  { id: 1, vehicle: "VAN-05", service: "Oil Change", cost: "2,500", status: "In Shop" },
  { id: 2, vehicle: "TRUCK-11", service: "Engine Repair", cost: "18,000", status: "Completed" },
  { id: 3, vehicle: "MINI-03", service: "Tyre Replace", cost: "6,20,000", status: "In Shop" }
];

export const mockFuelLogs = [
  { id: 1, vehicle: "VAN-05", date: "05 Jul 2026", liters: "42 L", cost: "3,150" },
  { id: 2, vehicle: "TRUCK-11", date: "06 Jul 2026", liters: "110 L", cost: "8,400" },
  { id: 3, vehicle: "MINI-08", date: "06 Jul 2026", liters: "28 L", cost: "2,050" }
];

export const mockOtherExpenses = [
  { id: "TR001", vehicle: "VAN-05", toll: 120, other: 0, maintenance: 0, status: "Available" },
  { id: "TR002", vehicle: "TRK-12", toll: 340, other: 150, maintenance: 18000, status: "Completed" }
];