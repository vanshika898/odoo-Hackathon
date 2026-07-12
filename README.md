# TransitOps

A modern transport operations management system built with a Node.js + Express backend and a React + Vite frontend. TransitOps helps logistics teams manage vehicles, drivers, trips, maintenance, fuel costs, and operational reporting in one place.

---

## 🚀 What this project does

TransitOps is a fleet operations dashboard designed for transport and logistics teams. The project includes:

- Role-based authentication and secure JWT sessions
- Vehicle registration, status tracking, and lifecycle management
- Driver profiles and trip assignments
- Trip planning, dispatch tracking, and completed trip reporting
- Maintenance scheduling and vehicle service management
- Fuel log and expense tracking for cost control
- Dashboard KPIs, analytics, and operational reports
- CSV export support for fleet reporting

---

## 🧩 Project structure

- `Backend/`
  - `Server.js` — Express server entrypoint
  - `config/database.js` — MongoDB connection logic
  - `routes/` — API route definitions
  - `controllers/` — request handlers and business logic
  - `models/` — Mongoose data schemas
  - `middleware/` — authentication, authorization, and error handling
  - `utils/` — helper utilities for email and OTP generation

- `Frontend/React-front/`
  - `src/` — React SPA source code
  - `src/components/` — user interface modules for Dashboard, Fleet, Drivers, Trips, Maintenance, Expenses, Analytics, Settings, and Login
  - `src/api.js` — API helper for backend requests
  - `vite.config.js` — Vite application config

---

## 🛠️ Tech stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, dotenv, cors
- Frontend: React, Vite, lucide-react, ESLint
- Dev tooling: nodemon, vite

---

## ✅ Key features

- Admin and workforce role management: `Admin`, `FleetManager`, `Dispatcher`, `Driver`, `SafetyOfficer`, `FinancialAnalyst`
- Secure login and protected API routes
- Vehicle registration, updates, and retirement workflows
- Trip management with status tracking and driver assignments
- Maintenance log tracking and cost control
- Fuel log and expense entry with authorized access
- KPI dashboard for active vehicles, pending trips, fleet utilization, and more
- Reports for fuel efficiency, operational cost, ROI, and CSV export

---

## 📦 Setup and run

### Backend

1. Open a terminal in `Backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```env
   DATABASE_URL=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

The backend listens on `http://localhost:5000` by default.

### Frontend

1. Open a terminal in `Frontend/React-front`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm run dev
   ```

The frontend runs on `http://localhost:5173` by default.

---

## 🔌 API overview

### Authentication

- `POST /api/v1/auth/register` — create a new user
- `POST /api/v1/auth/login` — authenticate and set cookie token
- `POST /api/v1/auth/change-pass` — change password (authenticated)
- `GET /api/v1/auth/me` — get current authenticated user

### Vehicles

- `GET /api/v1/vehicles` — list vehicles
- `POST /api/v1/vehicles` — create vehicle
- `GET /api/v1/vehicles/:id` — get vehicle by ID
- `PUT /api/v1/vehicles/:id` — update vehicle
- `DELETE /api/v1/vehicles/:id` — retire vehicle

### Drivers, trips, maintenance, fuel & expenses

- `GET/POST /api/v1/drivers`
- `GET/POST /api/v1/trips`
- `GET/POST /api/v1/maintenance`
- `GET/POST /api/v1/fuel-logs`
- `GET/POST /api/v1/expenses`

### Dashboard and reports

- `GET /api/v1/dashboard/kpis` — fleet KPIs and metrics
- `GET /api/v1/dashboard/reports` — aggregated operational report
- `GET /api/v1/reports/fuel-efficiency`
- `GET /api/v1/reports/operational-cost`
- `GET /api/v1/reports/roi`
- `GET /api/v1/reports/export-csv`

---

## 🎯 Why this project shines

TransitOps brings together fleet operations and finance visibility in a single platform. Its clean React UI and modular backend make it easy to extend with new vehicle analytics, workflow automation, or mobile access.

---

## 💡 Notes

- Ensure MongoDB is available before starting the backend.
- Set `CLIENT_URL` to your frontend development URL if you run the UI on a different host.
- The frontend automatically checks authentication and redirects to login when needed.

---

## 📄 License

This project is available under the ISC license.
