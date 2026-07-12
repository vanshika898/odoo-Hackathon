import React, { useState, useEffect } from "react";
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
import { api } from "./api";
import "./index.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("Dashboard");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/auth/me");
          if (res.success && res.user) {
            setUser(res.user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentTab("Dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-primary)" }}>
        <div style={{ color: "var(--text-dark)", fontWeight: "600", fontSize: "1.2rem" }}>Loading Operations Board...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case "Dashboard":
        return <Dashboard user={user} />;

      case "Fleet":
        return <Fleet user={user} />;

      case "Drivers":
        return <Drivers user={user} />;

      case "Trips":
        return <Trips user={user} />;

      case "Maintenance":
        return <Maintenance user={user} />;

      case "Fuel & Expenses":
        return <Expenses user={user} />;

      case "Analytics":
        return <Analytics user={user} />;

      case "Settings":
        return <Settings user={user} setUser={setUser} />;

      default:
        return <Dashboard user={user} />;
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
        user={user}
        onLogout={handleLogout}
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
              Welcome Back 👋, {user?.fullName || "Operator"}
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: ".95rem",
              }}
            >
              Role: <strong style={{ color: "var(--text-dark)" }}>{user?.accountType || "Unassigned"}</strong> | Manage your fleet operations efficiently.
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