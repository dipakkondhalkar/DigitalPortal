import { QRCodeSVG } from "qrcode.react";
import { Check, Download, X } from "lucide-react";

import { createCardUrl, generateVCard } from "../utils/card";

/* =========================================================
   QR POPUP
   ========================================================= */

export default function QRModal({ card, onClose }) {
  if (!card) return null;

  const cardUrl = createCardUrl(card);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
      {/* =====================================================
          MODAL
          ===================================================== */}

      <div
        className="
          relative
          my-8
          w-full
          max-w-sm
          rounded-3xl
          bg-white
          p-7
          text-center
          shadow-2xl
        "
      >
        {/* ===================================================
            CLOSE BUTTON
            =================================================== */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute
            right-4
            top-4
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
            active:scale-95
          "
        >
          <X className="h-5 w-5" />
        </button>

        {/* ===================================================
            SUCCESS ICON
            =================================================== */}

        <div
          className="
            mx-auto
            mb-4
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-green-100
            text-green-600
          "
        >
          <Check className="h-8 w-8" />
        </div>

        {/* ===================================================
            TITLE
            =================================================== */}

        <h3 className="text-xl font-bold text-slate-800">QR Code Generated!</h3>

        <p className="mt-2 mb-5 text-xs leading-5 text-slate-500">
          Scan this QR code with any phone to open the digital card.
        </p>

        {/* ===================================================
            QR CODE
            =================================================== */}

        <div
          className="
            mx-auto
            flex
            w-fit
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="relative">
            {/* QR */}
            <QRCodeSVG
              value={cardUrl}
              size={300}
              level="H"
              includeMargin={true}
            />

            {/* =================================================
                CENTER COMPANY BRANDING
                ================================================= */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                flex
                w-[120px]
                -translate-x-1/2
                -translate-y-1/2
                flex-col
                items-center
                justify-center
                rounded-lg
                bg-white
                px-2
                py-2
                text-center
                shadow-sm
              "
            >
              <div
                className="
                  text-[9px]
                  font-extrabold
                  leading-tight
                  tracking-wide
                  text-[#601D1E]
                "
              >
                AARYANS GROUP
              </div>

              <div
                className="
                  mt-1
                  text-[7px]
                  font-semibold
                  leading-tight
                  text-slate-600
                "
              >
                OF COMPANIES
              </div>

              <div
                className="
                  mt-1
                  text-[7px]
                  font-medium
                  leading-tight
                  text-[#601D1E]
                "
              >
                www.aaryans.group
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            QR INFORMATION
            =================================================== */}

        <p className="mt-4 text-[11px] leading-5 text-slate-500">
          Scan the QR code to view the digital business card.
        </p>

        {/* ===================================================
            SAVE CONTACT
            =================================================== */}

        <a
          href={`data:text/vcard;charset=utf-8,${encodeURIComponent(
            generateVCard(card),
          )}`}
          download={`${card.fullName || "contact"}.vcf`}
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#E2BA6E]
            py-3
            text-xs
            font-bold
            text-[#5B1B20]
            transition
            hover:bg-[#d4a94f]
            active:scale-[0.98]
          "
        >
          <Download className="h-4 w-4" />
          Save Contact
        </a>

        {/* ===================================================
            CLOSE
            =================================================== */}

        <button
          type="button"
          onClick={onClose}
          className="
            mt-2
            w-full
            rounded-xl
            bg-slate-100
            py-3
            text-xs
            font-bold
            text-slate-700
            transition
            hover:bg-slate-200
            active:scale-[0.98]
          "
        >
          Close
        </button>
      </div>
    </div>
  );
}
