import { LogOut, Settings } from "lucide-react";

import aaryansLogo from "../assets/image.png";

/* =========================================================
   ADMIN HEADER
   ========================================================= */

export default function AdminHeader({ onOpenCredentials, onLogout }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#601D1E] text-white shadow-md">
      <div className="flex min-h-[80px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= LEFT SIDE ================= */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
            <img
              src={aaryansLogo}
              alt="Aaryans"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Brand */}
          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">
              Aaryans Digital Portal
            </h1>
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
              border border-white/20
              bg-white/10
              px-3 py-2.5
              text-xs font-semibold
              text-white
              backdrop-blur-sm
              transition-all duration-200
              hover:bg-white/20
              hover:shadow-md
              active:scale-95
            "
          >
            <Settings
              className="
                h-4 w-4
                text-[#F3D6B3]
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
              bg-[#431415]
              px-3 py-2.5
              text-xs font-semibold
              text-white
              shadow-sm
              transition-all duration-200
              hover:bg-[#321011]
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
