import { Mail, Phone, MapPin, Globe } from "lucide-react";

import aaryansLogo from "../assets/image.png";
import { COMPANY_NAME, COMPANY_WEBSITE, COMPANY_WEBSITE_URL } from "../config";

/* =========================================================
   BUSINESS CARD DESIGN
   ========================================================= */

export default function BusinessCard({ card }) {
  if (!card) return null;

  return (
    <div className="w-[340px] max-w-full bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
      {/* TOP */}
      <div className="bg-[#5B1B20] text-white pt-8 pb-16 px-6 text-center rounded-b-[2rem] shadow-md flex flex-col items-center">
        <img
          src={aaryansLogo}
          alt="Aaryans"
          className="h-14 w-auto object-contain mb-2"
        />
        <p className="text-[#E2BA6E] text-xs font-semibold tracking-wide">
          {COMPANY_NAME}
        </p>
      </div>

      {/* NAME */}
      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl py-6 px-4 text-center border">
          <h1 className="text-xl font-extrabold text-[#5B1B20] tracking-wider uppercase">
            {card.fullName}
          </h1>
          <p className="text-slate-600 font-medium text-sm mt-2">
            {card.title}
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-7 space-y-4 text-xs text-slate-700">
        {card.email && (
          <a href={`mailto:${card.email}`} className="flex items-start gap-3.5">
            <Mail className="w-4 h-4 text-[#5B1B20] shrink-0 mt-0.5" />
            <span className="break-all font-semibold">{card.email}</span>
          </a>
        )}

        {card.phone && (
          <a
            href={`tel:+91${card.phone}`}
            className="flex items-center gap-3.5"
          >
            <Phone className="w-4 h-4 text-[#5B1B20] shrink-0" />
            <span className="font-semibold">+91 {card.phone}</span>
          </a>
        )}

        {card.address && (
          <div className="flex items-start gap-3.5">
            <MapPin className="w-4 h-4 text-[#5B1B20] shrink-0 mt-0.5" />
            <span className="leading-relaxed whitespace-pre-line">
              {card.address}
            </span>
          </div>
        )}

        <a
          href={COMPANY_WEBSITE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3.5"
        >
          <Globe className="w-4 h-4 text-[#5B1B20] shrink-0" />
          <span className="font-semibold">{COMPANY_WEBSITE}</span>
        </a>
      </div>
    </div>
  );
}
