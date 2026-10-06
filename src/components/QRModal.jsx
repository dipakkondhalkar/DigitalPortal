import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Download, Share2, X, Smartphone } from "lucide-react";

import { createCardUrl, generateVCard } from "../utils/card";

/* =========================================================
   QR POPUP
   ========================================================= */

export default function QRModal({ card, onClose }) {
  const qrRef = useRef(null);

  if (!card) return null;

  /* =========================================================
     OLD WORKING QR URL
     Keeps:
     /card/card-id?data=FULL_CARD_DATA
     ========================================================= */

  const cardUrl = createCardUrl(card);

  /* =========================================================
     DOWNLOAD QR CODE
     ========================================================= */

  const handleDownloadQR = () => {
    try {
      const svg = qrRef.current?.querySelector("svg");

      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const size = 1000;

      canvas.width = size;
      canvas.height = size;

      const img = new Image();

      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });

      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        /* White background */
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);

        /* Draw QR */
        ctx.drawImage(img, 0, 0, size, size);

        const pngUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");

        link.href = pngUrl;
        link.download = `${card.fullName || "business-card"}-QR.png`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (error) {
      console.error("QR download failed:", error);
    }
  };

  /* =========================================================
     SHARE QR CODE
     ========================================================= */

  const handleShareQR = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${card.fullName || "Business"} Digital Card`,
          text: `View ${card.fullName || "this"} digital business card.`,
          url: cardUrl,
        });

        return;
      }

      /* Fallback: copy URL */
      await navigator.clipboard.writeText(cardUrl);

      console.log("QR card link copied.");
    } catch (error) {
      console.error("QR share failed:", error);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        p-4
        overflow-y-auto
        backdrop-blur-sm
      "
    >
      {/* =====================================================
          MODAL
          ===================================================== */}

      <div
        className="
          relative
          my-6
          w-full
          max-w-md
          overflow-hidden
          rounded-[28px]
          bg-white
          shadow-2xl
        "
      >
        {/* ===================================================
            TOP HEADER
            =================================================== */}

        <div
          className="
            bg-[#601D1E]
            px-6
            pb-7
            pt-7
            text-white
          "
        >
          {/* CLOSE */}
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
              bg-white/10
              text-white
              transition
              hover:bg-white/20
              active:scale-95
            "
          >
            <X className="h-5 w-5" />
          </button>

          {/* SUCCESS ICON */}

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
              bg-white
              text-[#601D1E]
              shadow-lg
            "
          >
            <Check className="h-8 w-8" strokeWidth={3} />
          </div>

          {/* TITLE */}

          <h3 className="text-center text-2xl font-bold">QR Code Generated</h3>

          <p className="mx-auto mt-2 max-w-xs text-center text-xs leading-5 text-white/75">
            Your digital business card is ready to share.
          </p>
        </div>

        {/* ===================================================
            CONTENT
            =================================================== */}

        <div className="px-5 pb-6 pt-5 sm:px-7">
          {/* CARD NAME */}

          <div className="mb-5 text-center">
            <p className="text-sm font-bold text-slate-800">{card.fullName}</p>

            {card.title && (
              <p className="mt-1 text-xs text-slate-500">{card.title}</p>
            )}
          </div>

          {/* =================================================
              SQUARE QR AREA
              ================================================= */}

          <div
            className="
              mx-auto
              aspect-square
              w-full
              max-w-[330px]
              rounded-[28px]
              border
              border-slate-200
              bg-slate-50
              p-4
              shadow-inner
            "
          >
            <div
              ref={qrRef}
              className="
                relative
                flex
                h-full
                w-full
                items-center
                justify-center
                overflow-hidden
                rounded-[22px]
                bg-white
                p-3
                shadow-md
              "
            >
              {/* QR */}

              <QRCodeSVG
                value={cardUrl}
                size={275}
                level="H"
                includeMargin={true}
                fgColor="#601D1E"
                bgColor="#ffffff"
                className="h-full w-full"
              />

              {/* =================================================
                  CENTER BRANDING
                  ================================================= */}

              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  flex
                  w-[112px]
                  -translate-x-1/2
                  -translate-y-1/2
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-100
                  bg-white
                  px-2
                  py-2.5
                  text-center
                  shadow-md
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
                    text-[6px]
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

          {/* =================================================
              SCAN MESSAGE
              ================================================= */}

          <div
            className="
              mx-auto
              mt-4
              flex
              max-w-[330px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#f7f0e5]
              px-4
              py-3
              text-center
            "
          >
            <Smartphone className="h-4 w-4 shrink-0 text-[#601D1E]" />

            <p className="text-[11px] font-medium leading-4 text-[#601D1E]">
              Scan this QR code with any phone to open the digital card.
            </p>
          </div>

          {/* =================================================
              QR ACTION BUTTONS
              ================================================= */}

          <div className="mt-5 grid grid-cols-2 gap-3">
            {/* DOWNLOAD QR */}

            <button
              type="button"
              onClick={handleDownloadQR}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#601D1E]
                bg-[#601D1E]
                px-4
                py-3
                text-xs
                font-bold
                text-white
                shadow-md
                transition-all
                duration-200
                hover:bg-[#732328]
                hover:shadow-lg
                active:scale-[0.97]
              "
            >
              <Download className="h-4 w-4" />
              Download QR
            </button>

            {/* SHARE QR */}

            <button
              type="button"
              onClick={handleShareQR}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#E2BA6E]
                bg-[#E2BA6E]
                px-4
                py-3
                text-xs
                font-bold
                text-[#5B1B20]
                shadow-md
                transition-all
                duration-200
                hover:bg-[#d4a94f]
                hover:shadow-lg
                active:scale-[0.97]
              "
            >
              <Share2 className="h-4 w-4" />
              Share QR
            </button>
          </div>

          {/* =================================================
              SAVE CONTACT
              ================================================= */}

          <a
            href={`data:text/vcard;charset=utf-8,${encodeURIComponent(
              generateVCard(card),
            )}`}
            download={`${card.fullName || "contact"}.vcf`}
            className="
              mt-3
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              py-3
              text-xs
              font-bold
              text-slate-700
              shadow-sm
              transition
              hover:bg-slate-50
              hover:shadow-md
              active:scale-[0.98]
            "
          >
            <Download className="h-4 w-4 text-[#601D1E]" />
            Save Contact
          </a>

          {/* =================================================
              CARD LINK
              ================================================= */}

          <div className="mt-5">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Digital Card Link
            </label>

            <div
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-3
                py-2.5
              "
            >
              <input
                type="text"
                readOnly
                value={cardUrl}
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-[10px]
                  text-slate-500
                  outline-none
                "
              />
            </div>
          </div>

          {/* =================================================
              CLOSE
              ================================================= */}

          <button
            type="button"
            onClick={onClose}
            className="
              mt-3
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
    </div>
  );
}
