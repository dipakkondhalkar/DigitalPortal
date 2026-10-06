import { LogOut, Settings, ShieldCheck } from "lucide-react";

import aaryansLogo from "../assets/image.png";

/* =========================================================
   ADMIN HEADER
   ========================================================= */

export default function AdminHeader({ onOpenCredentials, onLogout }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="flex min-h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= LEFT SIDE ================= */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200">
            <img
              src={aaryansLogo}
              alt="Aaryans"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Brand */}
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-800 sm:text-lg">
              Aaryans Digital Portal
            </h1>

            <div className="mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />

              <span className="text-[11px] font-medium text-slate-500 sm:text-xs">
                Admin Dashboard
              </span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Credentials */}
          <button
            type="button"
            onClick={onOpenCredentials}
            className="
              group
              flex items-center gap-2
              rounded-xl
              border border-slate-200
              bg-white
              px-3 py-2
              text-xs font-semibold
              text-slate-700
              shadow-sm
              transition-all duration-200
              hover:border-slate-300
              hover:bg-slate-50
              hover:shadow-md
              active:scale-95
            "
          >
            <Settings
              className="
                h-4 w-4
                text-slate-500
                transition-transform duration-300
                group-hover:rotate-90
              "
            />

            <span className="hidden sm:inline">Credentials</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="
              group
              flex items-center gap-2
              rounded-xl
              bg-[#5B1B20]
              px-3 py-2
              text-xs font-semibold
              text-white
              shadow-sm
              transition-all duration-200
              hover:bg-[#48151A]
              hover:shadow-md
              active:scale-95
            "
          >
            <LogOut
              className="
                h-4 w-4
                transition-transform duration-200
                group-hover:translate-x-0.5
              "
            />

            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
