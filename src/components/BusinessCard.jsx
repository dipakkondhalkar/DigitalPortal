import { Mail, Phone, MapPin, Globe } from "lucide-react";

import aaryansLogo from "../assets/image.png";

import { COMPANY_NAME, COMPANY_WEBSITE, COMPANY_WEBSITE_URL } from "../config";

/* =========================================================
   PREMIUM RESPONSIVE AARYANS BUSINESS CARD
   ========================================================= */

export default function BusinessCard({ card }) {
  if (!card) return null;

  return (
    <div
      className="
        business-card-font
        w-full
        max-w-[330px]
        lg:max-w-[250px]
        overflow-hidden
        rounded-[20px]
        border
        border-[#ded5ca]
        bg-[#faf8f4]
        shadow-[0_18px_45px_rgba(59,24,26,0.18)]
      "
    >
      {/* =====================================================
          BROWN BRAND + NAME SECTION
          ===================================================== */}

      <div
        className="
          bg-[#681F22]
          px-4
          pb-6
          pt-6
          lg:px-3
          lg:pb-4
          lg:pt-4
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
              h-[68px]
              w-auto
              max-w-[190px]
              object-contain
              drop-shadow-[0_5px_10px_rgba(0,0,0,0.20)]

              lg:h-[52px]
              lg:max-w-[150px]
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
            text-[14px]
            font-bold
            tracking-[0.1px]
            text-[#E2BA6E]

            lg:mt-1.5
            lg:text-[10px]
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

            lg:mt-2
          "
        >
          <span className="h-px w-7 bg-[#E2BA6E]/60 lg:w-5" />

          <span
            className="
              h-1.5
              w-1.5
              rotate-45
              bg-[#E2BA6E]

              lg:h-1
              lg:w-1
            "
          />

          <span className="h-px w-7 bg-[#E2BA6E]/60 lg:w-5" />
        </div>

        {/* =================================================
            WHITE NAME + DESIGNATION BOX
            ================================================= */}

        <div
          className="
            mt-5
            rounded-[18px]
            bg-white
            px-4
            py-6
            text-center
            shadow-[0_10px_25px_rgba(0,0,0,0.18)]

            lg:mt-3
            lg:rounded-[14px]
            lg:px-3
            lg:py-4
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

              lg:text-[16px]
              lg:tracking-[0.2px]
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
              w-10
              rounded-full
              bg-[#E2BA6E]

              lg:mt-2
              lg:w-7
            "
          />

          {/* DESIGNATION */}

          <p
            className="
              mt-2
              text-[14px]
              font-medium
              text-[#4A4A4A]

              lg:mt-1.5
              lg:text-[11px]
            "
          >
            {card.title}
          </p>
        </div>
      </div>

      {/* =====================================================
          CONTACT INFORMATION
          ===================================================== */}

      <div
        className="
          bg-[#FAF8F5]
          px-4
          py-5

          lg:px-3
          lg:py-3.5
        "
      >
        <div
          className="
            space-y-4

            lg:space-y-2.5
          "
        >
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

                lg:gap-2
              "
            >
              {/* EMAIL ICON */}

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

                  lg:h-6
                  lg:w-6
                  lg:rounded-[7px]
                "
              >
                <Mail
                  className="
                    h-[15px]
                    w-[15px]

                    lg:h-3
                    lg:w-3
                  "
                  strokeWidth={2}
                />
              </div>

              {/* EMAIL */}

              <span
                className="
                  min-w-0
                  break-all
                  text-[12px]
                  font-medium
                  leading-5
                  text-[#444444]

                  lg:text-[9px]
                  lg:leading-4
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

                lg:gap-2
              "
            >
              {/* PHONE ICON */}

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

                  lg:h-6
                  lg:w-6
                  lg:rounded-[7px]
                "
              >
                <Phone
                  className="
                    h-[15px]
                    w-[15px]

                    lg:h-3
                    lg:w-3
                  "
                  strokeWidth={2}
                />
              </div>

              {/* PHONE */}

              <span
                className="
                  text-[13px]
                  font-medium
                  leading-5
                  text-[#444444]

                  lg:text-[9px]
                  lg:leading-4
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

                lg:gap-2
              "
            >
              {/* LOCATION ICON */}

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

                  lg:h-6
                  lg:w-6
                  lg:rounded-[7px]
                "
              >
                <MapPin
                  className="
                    h-[15px]
                    w-[15px]

                    lg:h-3
                    lg:w-3
                  "
                  strokeWidth={2}
                />
              </div>

              {/* ADDRESS */}

              <span
                className="
                  min-w-0
                  whitespace-pre-line
                  text-[12px]
                  font-medium
                  leading-5
                  text-[#444444]

                  lg:text-[9px]
                  lg:leading-4
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

              lg:gap-2
            "
          >
            {/* WEBSITE ICON */}

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

                lg:h-6
                lg:w-6
                lg:rounded-[7px]
              "
            >
              <Globe
                className="
                  h-[15px]
                  w-[15px]

                  lg:h-3
                  lg:w-3
                "
                strokeWidth={2}
              />
            </div>

            {/* WEBSITE */}

            <span
              className="
                text-[12px]
                font-medium
                leading-5
                text-[#444444]

                lg:text-[9px]
                lg:leading-4
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

            lg:mt-3
            lg:gap-2
          "
        >
          <div className="h-px flex-1 bg-[#ddd3c8]" />

          <div
            className="
              h-1.5
              w-1.5
              rotate-45
              bg-[#E2BA6E]

              lg:h-1
              lg:w-1
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

          lg:px-3
          lg:py-1.5
        "
      >
        <p
          className="
            text-[8px]
            font-bold
            uppercase
            tracking-[2px]
            text-[#E2BA6E]

            lg:text-[6px]
            lg:tracking-[1.5px]
          "
        >
          Aaryans Group of Companies
        </p>
      </div>
    </div>
  );
}
