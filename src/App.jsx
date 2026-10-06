import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminPage from "./pages/AdminPage";
import PublicCardView from "./pages/PublicCardView";
import { STORAGE_KEYS } from "./config";
import { readJSON, writeJSON } from "./utils/storage";

/* =========================================================
   APP  (state + routes only)
   ========================================================= */

export default function App() {
  const [cards, setCards] = useState(() => readJSON(STORAGE_KEYS.cards, []));

  const [adminCreds, setAdminCreds] = useState(() =>
    readJSON(STORAGE_KEYS.adminCreds, null),
  );

  useEffect(() => {
    writeJSON(STORAGE_KEYS.cards, cards);
  }, [cards]);

  useEffect(() => {
    if (adminCreds) {
      writeJSON(STORAGE_KEYS.adminCreds, adminCreds);
    }
  }, [adminCreds]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-100">
        <Routes>
          {/* FIRST PAGE: ADMIN LOGIN -> FORM + DATABASE */}
          <Route
            path="/"
            element={
              <AdminPage
                cards={cards}
                setCards={setCards}
                adminCreds={adminCreds}
                setAdminCreds={setAdminCreds}
              />
            }
          />

          {/* QR CARD PAGE (public, opened by scanning the QR) */}
          <Route path="/card/:id" element={<PublicCardView />} />

          {/* ANY UNKNOWN URL GOES TO HOME */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
