import { useState } from "react";
import { User, Lock, KeyRound, ShieldAlert } from "lucide-react";

import aaryansLogo from "../assets/image.png";

/* =========================================================
   ADMIN LOGIN SCREEN (first page of the app)
   ========================================================= */

export default function AdminLogin({ adminCreds, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === adminCreds.username && password === adminCreds.password) {
      setLoginError(false);
      onLogin();
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div className="flex justify-center mb-5">
          <img src={aaryansLogo} alt="Aaryans" className="h-14" />
        </div>

        <div className="w-14 h-14 bg-[#5B1B20]/10 text-[#5B1B20] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold text-center">Admin Authentication</h2>

        {loginError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs flex gap-2">
            <ShieldAlert className="w-4 h-4" />
            Invalid username or password.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 border rounded-xl text-sm"
            />
          </div>

          <div className="relative">
            <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 border rounded-xl text-sm"
            />
          </div>

          <button className="w-full bg-[#5B1B20] text-white py-3 rounded-xl font-bold text-sm">
            Login to Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}
