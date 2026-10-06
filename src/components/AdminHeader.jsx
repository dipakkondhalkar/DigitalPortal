import { LogOut, Settings } from "lucide-react";

import aaryansLogo from "../assets/image.png";

/* =========================================================
   ADMIN HEADER
   ========================================================= */

export default function AdminHeader({ onOpenCredentials, onLogout }) {
  return (
    <header className="bg-[#5B1B20] text-white px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <img src={aaryansLogo} alt="Aaryans" className="h-10" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold">Aaryans Digital Portal</h1>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onOpenCredentials}
          className="text-xs bg-black/20 px-3 py-2 rounded-xl text-amber-200 flex items-center gap-1"
        >
          <Settings className="w-3.5 h-3.5" />
          Credentials
        </button>

        <button
          onClick={onLogout}
          className="text-xs bg-red-600 px-3 py-2 rounded-xl flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </header>
  );
}
