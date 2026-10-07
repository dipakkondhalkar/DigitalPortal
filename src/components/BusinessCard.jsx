import { Mail, Phone, MapPin, Globe } from "lucide-react";

import aaryansLogo from "../assets/image.png";

import { COMPANY_NAME, COMPANY_WEBSITE, COMPANY_WEBSITE_URL } from "../config";

/* =========================================================
   PREMIUM AARYANS BUSINESS CARD
   ========================================================= */

export default function BusinessCard({ card }) {
  if (!card) return null;

  return (
    <div
      className="
        business-card-font
        relative
        w-full
        max-w-[390px]
        overflow-hidden
        rounded-[30px]
        border
        border-[#dfd5ca]
        bg-[#f8f5f0]
        shadow-[0_25px_70px_rgba(59,24,26,0.22)]
      "
    >
      {/* =====================================================
          TOP BRAND SECTION
          ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          bg-[#681F22]
          px-6
          pb-[82px]
          pt-9
          text-center
        "
      >
        {/* Decorative background glow */}
        <div
          className="
            pointer-events-none
            absolute
            -left-20
            -top-24
            h-52
            w-52
            rounded-full
            bg-[#E2BA6E]/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            top-10
            h-52
            w-52
            rounded-full
            bg-[#E2BA6E]/10
            blur-3xl
          "
        />

        {/* Top gold line */}
        <div
          className="
            absolute
            left-1/2
            top-5
            h-[2px]
            w-14
            -translate-x-1/2
            rounded-full
            bg-[#E2BA6E]
          "
        />

        {/* =================================================
            LOGO
            ================================================= */}

        <div className="relative z-10 flex justify-center">
          <img
            src={aaryansLogo}
            alt="Aaryans"
            className="
              h-[90px]
              w-auto
              max-w-[235px]
              object-contain
              drop-shadow-[0_8px_15px_rgba(0,0,0,0.25)]
            "
          />
        </div>

        {/* =================================================
            COMPANY NAME
            ================================================= */}

        <h2
          className="
            relative
            z-10
            mt-3
            text-[18px]
            font-extrabold
            tracking-[0.2px]
            text-[#E2BA6E]
          "
        >
          {COMPANY_NAME}
        </h2>

        {/* Decorative divider */}
        <div
          className="
            relative
            z-10
            mx-auto
            mt-4
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <span className="h-px w-9 bg-[#E2BA6E]/60" />

          <span
            className="
              h-1.5
              w-1.5
              rotate-45
              bg-[#E2BA6E]
            "
          />

          <span className="h-px w-9 bg-[#E2BA6E]/60" />
        </div>
      </div>

      {/* =====================================================
          NAME + DESIGNATION
          PREMIUM BROWN BOX
          ===================================================== */}

      <div
        className="
          relative
          z-20
          -mt-[58px]
          px-5
        "
      >
        <div
          className="
            relative
            overflow-hidden
            rounded-[24px]
            border
            border-[#7b3033]
            bg-[#5B1B20]
            px-5
            py-7
            text-center
            shadow-[0_18px_40px_rgba(70,24,26,0.28)]
          "
        >
          {/* Inner border */}
          <div
            className="
              pointer-events-none
              absolute
              inset-[6px]
              rounded-[19px]
              border
              border-[#E2BA6E]/20
            "
          />

          {/* Decorative top gold line */}
          <div
            className="
              absolute
              left-1/2
              top-0
              h-[3px]
              w-20
              -translate-x-1/2
              rounded-b-full
              bg-[#E2BA6E]
            "
          />

          {/* Name */}
          <h1
            className="
              relative
              z-10
              break-words
              px-2
              text-[27px]
              font-black
              uppercase
              leading-tight
              tracking-[0.8px]
              text-[#FFFFFF]
            "
          >
            {card.fullName}
          </h1>

          {/* Gold separator */}
          <div
            className="
              relative
              z-10
              mx-auto
              mt-4
              h-[1px]
              w-14
              bg-[#E2BA6E]
            "
          />

          {/* Designation */}
          <p
            className="
              relative
              z-10
              mt-3
              text-[18px]
              font-medium
              tracking-[0.3px]
              text-[#E2BA6E]
            "
          >
            {card.title}
          </p>
        </div>
      </div>

      {/* =====================================================
          CONTACT INFORMATION
          ICON + INFORMATION ONLY
          ===================================================== */}

      <div
        className="
          px-6
          pb-6
          pt-9
        "
      >
        <div className="space-y-5">
          {/* =================================================
              EMAIL
              ================================================= */}

          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="
                group
                flex
                items-center
                gap-4
                no-underline
              "
            >
              {/* Icon Circle */}
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[13px]
                  bg-[#681F22]
                  text-[#E2BA6E]
                  shadow-[0_5px_14px_rgba(104,31,34,0.20)]
                  transition-all
                  duration-200
                  group-hover:scale-105
                "
              >
                <Mail className="h-[18px] w-[18px]" strokeWidth={2} />
              </div>

              {/* Email */}
              <span
                className="
                  min-w-0
                  break-all
                  text-[15px]
                  font-medium
                  leading-6
                  text-[#454545]
                "
              >
                {card.email}
              </span>
            </a>
          )}

          {/* =================================================
              PHONE
              ================================================= */}

          {card.phone && (
            <a
              href={`tel:+91${card.phone}`}
              className="
                group
                flex
                items-center
                gap-4
                no-underline
              "
            >
              {/* Icon Circle */}
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[13px]
                  bg-[#681F22]
                  text-[#E2BA6E]
                  shadow-[0_5px_14px_rgba(104,31,34,0.20)]
                  transition-all
                  duration-200
                  group-hover:scale-105
                "
              >
                <Phone className="h-[18px] w-[18px]" strokeWidth={2} />
              </div>

              {/* Phone */}
              <span
                className="
                  text-[16px]
                  font-medium
                  leading-6
                  text-[#454545]
                "
              >
                +91 {card.phone}
              </span>
            </a>
          )}

          {/* =================================================
              ADDRESS
              ================================================= */}

          {card.address && (
            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              {/* Icon Circle */}
              <div
                className="
                  mt-0.5
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[13px]
                  bg-[#681F22]
                  text-[#E2BA6E]
                  shadow-[0_5px_14px_rgba(104,31,34,0.20)]
                "
              >
                <MapPin className="h-[18px] w-[18px]" strokeWidth={2} />
              </div>

              {/* Address */}
              <span
                className="
                  min-w-0
                  whitespace-pre-line
                  text-[15px]
                  font-medium
                  leading-6
                  text-[#454545]
                "
              >
                {card.address}
              </span>
            </div>
          )}

          {/* =================================================
              WEBSITE
              ================================================= */}

          <a
            href={COMPANY_WEBSITE_URL}
            target="_blank"
            rel="noreferrer"
            className="
              group
              flex
              items-center
              gap-4
              no-underline
            "
          >
            {/* Icon Circle */}
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-[13px]
                bg-[#681F22]
                text-[#E2BA6E]
                shadow-[0_5px_14px_rgba(104,31,34,0.20)]
                transition-all
                duration-200
                group-hover:scale-105
              "
            >
              <Globe className="h-[18px] w-[18px]" strokeWidth={2} />
            </div>

            {/* Website */}
            <span
              className="
                text-[15px]
                font-medium
                leading-6
                text-[#454545]
              "
            >
              {COMPANY_WEBSITE}
            </span>
          </a>
        </div>
      </div>

      {/* =====================================================
          PREMIUM BOTTOM DECORATION
          NO SOCIAL MEDIA
          ===================================================== */}

      <div className="px-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[#d8cdc1]" />

          <div
            className="
              h-2
              w-2
              rotate-45
              bg-[#E2BA6E]
            "
          />

          <div className="h-px flex-1 bg-[#d8cdc1]" />
        </div>
      </div>

      {/* =====================================================
          BOTTOM BRAND STRIP
          ===================================================== */}

      <div
        className="
          bg-[#681F22]
          px-5
          py-3.5
          text-center
        "
      >
        <p
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-[2.5px]
            text-[#E2BA6E]
          "
        >
          Aaryans Group of Companies
        </p>
      </div>
    </div>
  );
}
