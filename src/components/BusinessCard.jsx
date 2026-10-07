import { Mail, Phone, MapPin, Globe } from "lucide-react";

import aaryansLogo from "../assets/image.png";

import { COMPANY_NAME, COMPANY_WEBSITE, COMPANY_WEBSITE_URL } from "../config";

/* =========================================================
   PREMIUM COMPACT AARYANS BUSINESS CARD
   Auto Height - No Fixed Height
   ========================================================= */

export default function BusinessCard({ card }) {
  if (!card) return null;

  return (
    <div
      className="
        business-card-font
        w-full
        max-w-[300px]
        overflow-hidden
        rounded-[22px]
        border
        border-[#ded5ca]
        bg-[#faf8f4]
        shadow-[0_18px_45px_rgba(59,24,26,0.18)]
      "
    >
      {/* =====================================================
          BROWN TOP SECTION
          ===================================================== */}

      <div
        className="
          bg-[#681F22]
          px-4
          pb-6
          pt-6
        "
      >
        {/* =================================================
            LOGO
            ================================================= */}

        <div className="flex justify-center">
          <img
            src={aaryansLogo}
            alt="Aaryans"
            className="
              h-[64px]
              w-auto
              max-w-[175px]
              object-contain
              drop-shadow-[0_5px_10px_rgba(0,0,0,0.20)]
            "
          />
        </div>

        {/* =================================================
            COMPANY NAME
            ================================================= */}

        <p
          className="
            mt-2
            text-center
            text-[13px]
            font-bold
            tracking-[0.1px]
            text-[#E2BA6E]
          "
        >
          {COMPANY_NAME}
        </p>

        {/* =================================================
            GOLD DIVIDER
            ================================================= */}

        <div
          className="
            mx-auto
            mt-3
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <span className="h-px w-7 bg-[#E2BA6E]/60" />

          <span
            className="
              h-1.5
              w-1.5
              rotate-45
              bg-[#E2BA6E]
            "
          />

          <span className="h-px w-7 bg-[#E2BA6E]/60" />
        </div>

        {/* =================================================
            WHITE NAME + DESIGNATION BOX

            Brown area remains visible around this box.
            Height is completely automatic.
            ================================================= */}

        <div
          className="
            mt-5
            rounded-[17px]
            bg-white
            px-4
            py-5
            text-center
            shadow-[0_10px_25px_rgba(0,0,0,0.18)]
          "
        >
          {/* NAME */}

          <h1
            className="
              break-words
              text-[21px]
              font-extrabold
              uppercase
              leading-tight
              tracking-[0.3px]
              text-[#681F22]
            "
          >
            {card.fullName}
          </h1>

          {/* GOLD DIVIDER */}

          <div
            className="
              mx-auto
              mt-3
              h-[2px]
              w-9
              rounded-full
              bg-[#E2BA6E]
            "
          />

          {/* DESIGNATION */}

          <p
            className="
              mt-2
              text-[14px]
              font-medium
              leading-5
              text-[#4A4A4A]
            "
          >
            {card.title}
          </p>
        </div>
      </div>

      {/* =====================================================
          CONTACT INFORMATION
          Height automatically follows content
          ===================================================== */}

      <div
        className="
          bg-[#FAF8F5]
          px-4
          py-5
        "
      >
        <div className="space-y-4">
          {/* =================================================
              EMAIL
              ================================================= */}

          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="
                flex
                items-center
                gap-3
                no-underline
              "
            >
              {/* Icon */}

              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-[9px]
                  bg-[#681F22]
                  text-[#E2BA6E]
                "
              >
                <Mail className="h-[15px] w-[15px]" strokeWidth={2} />
              </div>

              {/* Information */}

              <span
                className="
                  min-w-0
                  break-all
                  text-[12px]
                  font-medium
                  leading-5
                  text-[#444444]
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
                flex
                items-center
                gap-3
                no-underline
              "
            >
              {/* Icon */}

              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-[9px]
                  bg-[#681F22]
                  text-[#E2BA6E]
                "
              >
                <Phone className="h-[15px] w-[15px]" strokeWidth={2} />
              </div>

              {/* Information */}

              <span
                className="
                  text-[13px]
                  font-medium
                  leading-5
                  text-[#444444]
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
                gap-3
              "
            >
              {/* Icon */}

              <div
                className="
                  mt-0.5
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-[9px]
                  bg-[#681F22]
                  text-[#E2BA6E]
                "
              >
                <MapPin className="h-[15px] w-[15px]" strokeWidth={2} />
              </div>

              {/* Information */}

              <span
                className="
                  min-w-0
                  whitespace-pre-line
                  text-[12px]
                  font-medium
                  leading-5
                  text-[#444444]
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
              flex
              items-center
              gap-3
              no-underline
            "
          >
            {/* Icon */}

            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-[9px]
                bg-[#681F22]
                text-[#E2BA6E]
              "
            >
              <Globe className="h-[15px] w-[15px]" strokeWidth={2} />
            </div>

            {/* Information */}

            <span
              className="
                text-[12px]
                font-medium
                leading-5
                text-[#444444]
              "
            >
              {COMPANY_WEBSITE}
            </span>
          </a>
        </div>

        {/* =================================================
            BOTTOM DECORATION
            ================================================= */}

        <div
          className="
            mt-5
            flex
            items-center
            gap-3
          "
        >
          <div className="h-px flex-1 bg-[#ddd3c8]" />

          <div
            className="
              h-1.5
              w-1.5
              rotate-45
              bg-[#E2BA6E]
            "
          />

          <div className="h-px flex-1 bg-[#ddd3c8]" />
        </div>
      </div>

      {/* =====================================================
          BOTTOM BRAND STRIP
          ===================================================== */}

      <div
        className="
          bg-[#681F22]
          px-4
          py-2.5
          text-center
        "
      >
        <p
          className="
            text-[8px]
            font-bold
            uppercase
            tracking-[2px]
            text-[#E2BA6E]
          "
        >
          Aaryans Group of Companies
        </p>
      </div>
    </div>
  );
}
