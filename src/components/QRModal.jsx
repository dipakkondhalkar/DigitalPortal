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

        /* QR */
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
     SHARE QR
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

      await navigator.clipboard.writeText(cardUrl);

      console.log("Card link copied.");
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
        p-3
        backdrop-blur-sm
      "
    >
      {/* =====================================================
          MODAL
          ===================================================== */}

      <div
        className="
          relative
          w-full
          max-w-[390px]
          max-h-[calc(100vh-24px)]
          overflow-y-auto
          rounded-[26px]
          bg-white
          shadow-2xl
        "
      >
        {/* ===================================================
            HEADER
            =================================================== */}

        <div
          className="
            relative
            bg-[#601D1E]
            px-5
            pb-5
            pt-5
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
              right-3
              top-3
              flex
              h-8
              w-8
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
            <X className="h-4 w-4" />
          </button>

          {/* SUCCESS */}

          <div
            className="
              mx-auto
              mb-2.5
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-white
              text-[#601D1E]
              shadow-md
            "
          >
            <Check className="h-6 w-6" strokeWidth={3} />
          </div>

          <h3 className="text-center text-lg font-bold">QR Code Generated</h3>

          <p className="mt-1 text-center text-[10px] text-white/75">
            Your digital business card is ready
          </p>
        </div>

        {/* ===================================================
            CONTENT
            =================================================== */}

        <div className="px-5 pb-5 pt-4">
          {/* NAME */}

          <div className="mb-3 text-center">
            <p className="text-sm font-bold text-slate-800">{card.fullName}</p>

            {card.title && (
              <p className="mt-0.5 text-[10px] text-slate-500">{card.title}</p>
            )}
          </div>

          {/* =================================================
              COMPACT SQUARE QR
              ================================================= */}

          <div
            className="
              mx-auto
              aspect-square
              w-full
              max-w-[250px]
              rounded-[22px]
              border
              border-slate-200
              bg-slate-50
              p-3
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
                rounded-[16px]
                bg-white
                p-2
                shadow-sm
              "
            >
              {/* QR */}

              <QRCodeSVG
                value={cardUrl}
                size={220}
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
                  w-[82px]
                  -translate-x-1/2
                  -translate-y-1/2
                  flex-col
                  items-center
                  justify-center
                  rounded-lg
                  bg-white
                  px-1.5
                  py-1.5
                  text-center
                  shadow-sm
                "
              >
                <div
                  className="
                    text-[7px]
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
                    mt-0.5
                    text-[5.5px]
                    font-semibold
                    leading-tight
                    text-slate-600
                  "
                >
                  OF COMPANIES
                </div>

                <div
                  className="
                    mt-0.5
                    text-[5px]
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
              mt-3
              flex
              max-w-[250px]
              items-center
              justify-center
              gap-1.5
              rounded-lg
              bg-[#f7f0e5]
              px-3
              py-2
            "
          >
            <Smartphone className="h-3.5 w-3.5 text-[#601D1E]" />

            <p className="text-[9px] font-medium text-[#601D1E]">
              Scan with any phone to open the card
            </p>
          </div>

          {/* =================================================
              DOWNLOAD + SHARE
              ================================================= */}

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {/* DOWNLOAD */}

            <button
              type="button"
              onClick={handleDownloadQR}
              className="
                flex
                items-center
                justify-center
                gap-1.5
                rounded-xl
                bg-[#601D1E]
                py-2.5
                text-[10px]
                font-bold
                text-white
                shadow-md
                transition
                hover:bg-[#732328]
                active:scale-[0.97]
              "
            >
              <Download className="h-3.5 w-3.5" />
              Download QR
            </button>

            {/* SHARE */}

            <button
              type="button"
              onClick={handleShareQR}
              className="
                flex
                items-center
                justify-center
                gap-1.5
                rounded-xl
                bg-[#E2BA6E]
                py-2.5
                text-[10px]
                font-bold
                text-[#5B1B20]
                shadow-md
                transition
                hover:bg-[#d4a94f]
                active:scale-[0.97]
              "
            >
              <Share2 className="h-3.5 w-3.5" />
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
              mt-2.5
              flex
              w-full
              items-center
              justify-center
              gap-1.5
              rounded-xl
              border
              border-slate-200
              bg-white
              py-2.5
              text-[10px]
              font-bold
              text-slate-700
              shadow-sm
              transition
              hover:bg-slate-50
              active:scale-[0.98]
            "
          >
            <Download className="h-3.5 w-3.5 text-[#601D1E]" />
            Save Contact
          </a>

          {/* =================================================
              CLOSE
              ================================================= */}

          <button
            type="button"
            onClick={onClose}
            className="
              mt-2
              w-full
              rounded-xl
              bg-slate-100
              py-2.5
              text-[10px]
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
