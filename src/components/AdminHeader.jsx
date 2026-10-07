import { LogOut, Settings } from "lucide-react";

import aaryansLogo from "../assets/image.png";

/* =========================================================
   ADMIN HEADER
   ========================================================= */

export default function AdminHeader({ onOpenCredentials, onLogout }) {
  return (
    <header
      className="
        sticky
        top-0
        z-40
        w-full
        bg-white
        text-[#601D1E]
        border-b
        border-gray-200
        shadow-sm
      "
    >
      <div
        className="
          flex
          min-h-[80px]
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            LEFT SIDE
            ================================================= */}

        <div className="flex items-center gap-4">
          {/* =================================================
              LOGO
              ================================================= */}

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-xl
              bg-white
              p-1.5
              border
              border-gray-200
              shadow-sm
            "
          >
            <img
              src={aaryansLogo}
              alt="Aaryans"
              className="
                h-full
                w-full
                object-contain
              "
            />
          </div>

          {/* =================================================
              BRAND
              ================================================= */}

          <div>
            <h1
              className="
                text-lg
                font-bold
                tracking-tight
                text-[#601D1E]
                sm:text-xl
              "
            >
              Aaryans Digital Portal
            </h1>
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
            ================================================= */}

        <div
          className="
            flex
            items-center
            gap-2
            sm:gap-3
          "
        >
          {/* =================================================
              CREDENTIALS BUTTON
              ================================================= */}

          <button
            type="button"
            onClick={onOpenCredentials}
            className="
              group
              flex
              items-center
              gap-2

              rounded-xl

              border
              border-[#601D1E]

              bg-white

              px-3
              py-2.5

              text-xs
              font-semibold

              text-[#601D1E]

              shadow-sm

              transition-all
              duration-200

              hover:bg-[#601D1E]
              hover:text-white
              hover:shadow-md

              active:scale-95
            "
          >
            <Settings
              className="
                h-4
                w-4

                text-[#601D1E]

                transition-all
                duration-300

                group-hover:rotate-90
                group-hover:text-white
              "
            />

            <span className="hidden sm:inline">Credentials</span>
          </button>

          {/* =================================================
              LOGOUT BUTTON
              ================================================= */}

          <button
            type="button"
            onClick={onLogout}
            className="
              group
              flex
              items-center
              gap-2

              rounded-xl

              border
              border-gray-300

              bg-gray-50

              px-3
              py-2.5

              text-xs
              font-semibold

              text-[#601D1E]

              shadow-sm

              transition-all
              duration-200

              hover:border-[#601D1E]
              hover:bg-[#601D1E]
              hover:text-white
              hover:shadow-md

              active:scale-95
            "
          >
            <LogOut
              className="
                h-4
                w-4

                text-[#601D1E]

                transition-all
                duration-200

                group-hover:translate-x-0.5
                group-hover:text-white
              "
            />

            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
