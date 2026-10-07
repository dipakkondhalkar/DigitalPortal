import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Twitter,
} from "lucide-react";

import aaryansLogo from "../assets/image.png";

import { COMPANY_NAME, COMPANY_WEBSITE, COMPANY_WEBSITE_URL } from "../config";

/* =========================================================
   PREMIUM BUSINESS CARD
   ========================================================= */

export default function BusinessCard({ card }) {
  if (!card) return null;

  /*
   * Social media links.
   *
   * Currently these use the values from card if available.
   * If no link exists, the icons are displayed but disabled.
   */
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: card.instagram || "",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: card.linkedin || "",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: card.facebook || "",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: card.youtube || "",
    },
    {
      name: "X",
      icon: Twitter,
      url: card.twitter || "",
    },
  ];

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
        border-[#e5dbd0]
        bg-[#f8f5f0]
        shadow-[0_25px_70px_rgba(59,24,26,0.20)]
      "
    >
      {/* =====================================================
          TOP PREMIUM HEADER
          ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          bg-[#681F22]
          px-6
          pb-[88px]
          pt-10
          text-center
        "
      >
        {/* Decorative glow - left */}
        <div
          className="
            pointer-events-none
            absolute
            -left-20
            -top-20
            h-48
            w-48
            rounded-full
            bg-[#E2BA6E]/10
            blur-3xl
          "
        />

        {/* Decorative glow - right */}
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            top-10
            h-44
            w-44
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
            top-6
            h-[2px]
            w-16
            -translate-x-1/2
            rounded-full
            bg-[#E2BA6E]/70
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
              h-[92px]
              w-auto
              max-w-[230px]
              object-contain
              drop-shadow-[0_8px_14px_rgba(0,0,0,0.20)]
            "
          />
        </div>

        {/* =================================================
            COMPANY NAME
            ================================================= */}

        <div className="relative z-10 mt-3">
          <h2
            className="
              text-[18px]
              font-extrabold
              tracking-[0.2px]
              text-[#E2BA6E]
              sm:text-[19px]
            "
          >
            {COMPANY_NAME}
          </h2>

          {/* Gold divider */}
          <div className="mx-auto mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-[#E2BA6E]/50" />

            <span className="h-1.5 w-1.5 rounded-full bg-[#E2BA6E]" />

            <span className="h-px w-10 bg-[#E2BA6E]/50" />
          </div>
        </div>
      </div>

      {/* =====================================================
          NAME + DESIGNATION
          ===================================================== */}

      <div className="relative z-20 -mt-[62px] px-5">
        <div
          className="
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-[#eee6dc]
            bg-[#fffdfa]
            px-5
            py-7
            text-center
            shadow-[0_15px_35px_rgba(52,27,28,0.16)]
          "
        >
          {/* Gold top decoration */}
          <div
            className="
              absolute
              left-1/2
              top-0
              h-1
              w-20
              -translate-x-1/2
              rounded-b-full
              bg-[#E2BA6E]
            "
          />

          {/* Name */}
          <h1
            className="
              break-words
              text-[27px]
              font-black
              uppercase
              leading-tight
              tracking-[0.7px]
              text-[#681F22]
            "
          >
            {card.fullName}
          </h1>

          {/* Small divider */}
          <div className="mx-auto mt-3 h-px w-12 bg-[#E2BA6E]" />

          {/* Designation */}
          <p
            className="
              mt-3
              text-[19px]
              font-medium
              tracking-[0.2px]
              text-[#4B4B4B]
            "
          >
            {card.title}
          </p>
        </div>
      </div>

      {/* =====================================================
          CONTACT INFORMATION
          ===================================================== */}

      <div className="px-6 pb-3 pt-8">
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
                items-start
                gap-4
                text-left
                no-underline
              "
            >
              {/* Icon */}
              <div
                className="
                  mt-0.5
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#681F22]
                  text-[#E2BA6E]
                  shadow-[0_5px_12px_rgba(104,31,34,0.18)]
                  transition-all
                  duration-200
                  group-hover:scale-105
                "
              >
                <Mail className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </div>

              {/* Text */}
              <div className="min-w-0 pt-1">
                <p
                  className="
                    mb-0.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[1.5px]
                    text-[#9B8B80]
                  "
                >
                  Email
                </p>

                <p
                  className="
                    break-all
                    text-[15px]
                    font-semibold
                    leading-6
                    text-[#454545]
                  "
                >
                  {card.email}
                </p>
              </div>
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
                items-start
                gap-4
                text-left
                no-underline
              "
            >
              {/* Icon */}
              <div
                className="
                  mt-0.5
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#681F22]
                  text-[#E2BA6E]
                  shadow-[0_5px_12px_rgba(104,31,34,0.18)]
                  transition-all
                  duration-200
                  group-hover:scale-105
                "
              >
                <Phone className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </div>

              {/* Text */}
              <div className="pt-1">
                <p
                  className="
                    mb-0.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[1.5px]
                    text-[#9B8B80]
                  "
                >
                  Phone
                </p>

                <p
                  className="
                    text-[16px]
                    font-semibold
                    leading-6
                    text-[#454545]
                  "
                >
                  +91 {card.phone}
                </p>
              </div>
            </a>
          )}

          {/* =================================================
              ADDRESS
              ================================================= */}

          {card.address && (
            <div className="flex items-start gap-4 text-left">
              {/* Icon */}
              <div
                className="
                  mt-0.5
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#681F22]
                  text-[#E2BA6E]
                  shadow-[0_5px_12px_rgba(104,31,34,0.18)]
                "
              >
                <MapPin className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </div>

              {/* Text */}
              <div className="min-w-0 pt-1">
                <p
                  className="
                    mb-0.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[1.5px]
                    text-[#9B8B80]
                  "
                >
                  Office
                </p>

                <p
                  className="
                    whitespace-pre-line
                    text-[15px]
                    font-medium
                    leading-6
                    text-[#454545]
                  "
                >
                  {card.address}
                </p>
              </div>
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
              items-start
              gap-4
              text-left
              no-underline
            "
          >
            {/* Icon */}
            <div
              className="
                mt-0.5
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#681F22]
                text-[#E2BA6E]
                shadow-[0_5px_12px_rgba(104,31,34,0.18)]
                transition-all
                duration-200
                group-hover:scale-105
              "
            >
              <Globe className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </div>

            {/* Text */}
            <div className="pt-1">
              <p
                className="
                  mb-0.5
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[1.5px]
                  text-[#9B8B80]
                "
              >
                Website
              </p>

              <p
                className="
                  text-[15px]
                  font-semibold
                  leading-6
                  text-[#454545]
                "
              >
                {COMPANY_WEBSITE}
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* =====================================================
          SOCIAL MEDIA
          ===================================================== */}

      <div className="px-6 pb-7 pt-5">
        {/* Heading divider */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#ded3c8]" />

          <span
            className="
              whitespace-nowrap
              text-[9px]
              font-bold
              uppercase
              tracking-[2px]
              text-[#9B8B80]
            "
          >
            Connect With Us
          </span>

          <div className="h-px flex-1 bg-[#ded3c8]" />
        </div>

        {/* Social icons */}
        <div className="flex justify-center gap-3">
          {socialLinks.map((social) => {
            const Icon = social.icon;

            {
              /* ===============================================
                DISABLED SOCIAL ICON
                =============================================== */
            }

            if (!social.url) {
              return (
                <div
                  key={social.name}
                  title={social.name}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#d9cec3]
                    bg-white
                    text-[#681F22]
                    shadow-[0_4px_10px_rgba(50,25,26,0.08)]
                  "
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </div>
              );
            }

            {
              /* ===============================================
                ACTIVE SOCIAL ICON
                =============================================== */
            }

            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                title={social.name}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#d9cec3]
                  bg-white
                  text-[#681F22]
                  shadow-[0_4px_10px_rgba(50,25,26,0.08)]
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:bg-[#681F22]
                  hover:text-[#E2BA6E]
                  hover:shadow-[0_8px_18px_rgba(104,31,34,0.20)]
                "
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </a>
            );
          })}
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
            font-semibold
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
