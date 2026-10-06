import { useState } from "react";
import { User, KeyRound, ShieldAlert } from "lucide-react";

import aaryansLogo from "../assets/image.png";

/* =========================================================
   FIRST-TIME ADMIN SETUP (no default username/password)
   ========================================================= */

export default function AdminSetup({ onCreate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username.trim().length < 4) {
      setError("Username must be at least 4 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    onCreate({ username: username.trim(), password });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div className="flex justify-center mb-5">
          <img src={aaryansLogo} alt="Aaryans" className="h-14" />
        </div>

        <div className="w-14 h-14 bg-[#5B1B20]/10 text-[#5B1B20] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold text-center">Create Admin Account</h2>

        <p className="text-xs text-slate-500 text-center mt-2">
          Choose your own username and password for this admin panel.
        </p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs flex gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Choose username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
              className="w-full pl-10 pr-3 py-3 border rounded-xl text-sm"
            />
          </div>

          <div className="relative">
            <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="password"
              placeholder="Choose password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="w-full pl-10 pr-3 py-3 border rounded-xl text-sm"
            />
          </div>

          <button className="w-full bg-[#5B1B20] text-white py-3 rounded-xl font-bold text-sm">
            Create Admin Account
          </button>
        </form>
      </div>
    </div>
  );
}
