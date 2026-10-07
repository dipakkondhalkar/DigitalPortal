import { Mail, Phone, MapPin, Globe } from "lucide-react";

import aaryansLogo from "../assets/image.png";

import { COMPANY_NAME, COMPANY_WEBSITE, COMPANY_WEBSITE_URL } from "../config";

/* =========================================================
   COMPACT RESPONSIVE AARYANS BUSINESS CARD

   Mobile:
   285px

   Laptop / Desktop:
   250px

   Height:
   Completely automatic
   ========================================================= */

export default function BusinessCard({ card }) {
  if (!card) return null;

  return (
    <div
      className="
        business-card-font
        w-full
        max-w-[285px]
        lg:max-w-[250px]
        overflow-hidden
        rounded-[18px]
        border
        border-[#ded5ca]
        bg-[#faf8f4]
        shadow-[0_15px_35px_rgba(59,24,26,0.18)]
      "
    >
      {/* =====================================================
          BROWN TOP SECTION
          ===================================================== */}

      <div
        className="
          bg-[#681F22]
          px-3
          pb-5
          pt-5
          lg:px-2.5
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
              h-[58px]
              w-auto
              max-w-[165px]
              object-contain
              drop-shadow-[0_4px_8px_rgba(0,0,0,0.20)]
              lg:h-[50px]
              lg:max-w-[145px]
            "
          />
        </div>

        {/* =================================================
            COMPANY NAME
            ================================================= */}

        <p
          className="
            mt-1.5
            text-center
            text-[12px]
            font-bold
            text-[#E2BA6E]
            lg:mt-1
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
            mt-2.5
            flex
            items-center
            justify-center
            gap-1.5
            lg:mt-2
          "
        >
          <span
            className="
              h-px
              w-6
              bg-[#E2BA6E]/60
              lg:w-5
            "
          />

          <span
            className="
              h-1
              w-1
              rotate-45
              bg-[#E2BA6E]
            "
          />

          <span
            className="
              h-px
              w-6
              bg-[#E2BA6E]/60
              lg:w-5
            "
          />
        </div>

        {/* =================================================
            WHITE NAME + DESIGNATION BOX

            Brown area remains visible around the box.
            ================================================= */}

        <div
          className="
            mt-4
            rounded-[14px]
            bg-white
            px-3
            py-4
            text-center
            shadow-[0_8px_18px_rgba(0,0,0,0.18)]
            lg:mt-3
            lg:rounded-[12px]
            lg:px-2.5
            lg:py-3.5
          "
        >
          {/* =================================================
              NAME
              ================================================= */}

          <h1
            className="
              break-words
              text-[19px]
              font-extrabold
              uppercase
              leading-tight
              tracking-[0.2px]
              text-[#681F22]
              lg:text-[16px]
            "
          >
            {card.fullName}
          </h1>

          {/* =================================================
              GOLD DIVIDER
              ================================================= */}

          <div
            className="
              mx-auto
              mt-2
              h-[2px]
              w-8
              rounded-full
              bg-[#E2BA6E]
              lg:mt-1.5
              lg:w-7
            "
          />

          {/* =================================================
              DESIGNATION
              ================================================= */}

          <p
            className="
              mt-1.5
              text-[13px]
              font-medium
              leading-4
              text-[#4A4A4A]
              lg:mt-1
              lg:text-[11px]
              lg:leading-4
            "
          >
            {card.title}
          </p>
        </div>
      </div>

      {/* =====================================================
          CONTACT INFORMATION
          AUTOMATIC HEIGHT
          ===================================================== */}

      <div
        className="
          bg-[#FAF8F5]
          px-4
          py-5
          lg:px-3
          lg:py-4
        "
      >
        <div
          className="
            space-y-3.5
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
                gap-2.5
                no-underline
                lg:gap-2
              "
            >
              {/* Icon */}

              <div
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-[7px]
                  bg-[#681F22]
                  text-[#E2BA6E]
                  lg:h-6
                  lg:w-6
                  lg:rounded-[6px]
                "
              >
                <Mail
                  className="
                    h-[13px]
                    w-[13px]
                    lg:h-[12px]
                    lg:w-[12px]
                  "
                  strokeWidth={2}
                />
              </div>

              {/* Information */}

              <span
                className="
                  min-w-0
                  break-all
                  text-[11px]
                  font-medium
                  leading-4
                  text-[#444444]
                  lg:text-[9.5px]
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
                gap-2.5
                no-underline
                lg:gap-2
              "
            >
              {/* Icon */}

              <div
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-[7px]
                  bg-[#681F22]
                  text-[#E2BA6E]
                  lg:h-6
                  lg:w-6
                  lg:rounded-[6px]
                "
              >
                <Phone
                  className="
                    h-[13px]
                    w-[13px]
                    lg:h-[12px]
                    lg:w-[12px]
                  "
                  strokeWidth={2}
                />
              </div>

              {/* Information */}

              <span
                className="
                  text-[12px]
                  font-medium
                  leading-4
                  text-[#444444]
                  lg:text-[10px]
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
                gap-2.5
                lg:gap-2
              "
            >
              {/* Icon */}

              <div
                className="
                  mt-0.5
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-[7px]
                  bg-[#681F22]
                  text-[#E2BA6E]
                  lg:h-6
                  lg:w-6
                  lg:rounded-[6px]
                "
              >
                <MapPin
                  className="
                    h-[13px]
                    w-[13px]
                    lg:h-[12px]
                    lg:w-[12px]
                  "
                  strokeWidth={2}
                />
              </div>

              {/* Information */}

              <span
                className="
                  min-w-0
                  whitespace-pre-line
                  text-[11px]
                  font-medium
                  leading-4
                  text-[#444444]
                  lg:text-[9.5px]
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
              gap-2.5
              no-underline
              lg:gap-2
            "
          >
            {/* Icon */}

            <div
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-[7px]
                bg-[#681F22]
                text-[#E2BA6E]
                lg:h-6
                lg:w-6
                lg:rounded-[6px]
              "
            >
              <Globe
                className="
                  h-[13px]
                  w-[13px]
                  lg:h-[12px]
                  lg:w-[12px]
                "
                strokeWidth={2}
              />
            </div>

            {/* Information */}

            <span
              className="
                text-[11px]
                font-medium
                leading-4
                text-[#444444]
                lg:text-[9.5px]
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
            mt-4
            flex
            items-center
            gap-2
            lg:mt-3
          "
        >
          <div className="h-px flex-1 bg-[#ddd3c8]" />

          <div
            className="
              h-1
              w-1
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
          px-3
          py-2
          text-center
          lg:py-1.5
        "
      >
        <p
          className="
            text-[7px]
            font-bold
            uppercase
            tracking-[1.7px]
            text-[#E2BA6E]
            lg:text-[6.5px]
          "
        >
          Aaryans Group of Companies
        </p>
      </div>
    </div>
  );
}
