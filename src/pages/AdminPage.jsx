import { useState } from "react";

import AdminSetup from "./AdminSetup";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import { STORAGE_KEYS } from "../config";

/* =========================================================
   HOME PAGE ("/")
   1. No admin yet  -> create admin account
   2. Not logged in -> username / password login
   3. Logged in     -> dashboard (form on left, database on right)
   ========================================================= */

export default function AdminPage({ cards, setCards, adminCreds, setAdminCreds }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEYS.adminSession) === "true",
  );

  const startSession = () => {
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.adminSession, "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.adminSession);
  };

  if (!adminCreds) {
    return (
      <AdminSetup
        onCreate={(creds) => {
          setAdminCreds(creds);
          startSession();
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin adminCreds={adminCreds} onLogin={startSession} />;
  }

  return (
    <Dashboard
      cards={cards}
      setCards={setCards}
      adminCreds={adminCreds}
      setAdminCreds={setAdminCreds}
      onLogout={logout}
    />
  );
}
