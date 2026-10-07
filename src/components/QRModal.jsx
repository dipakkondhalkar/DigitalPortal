import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Download, Share2, X, Smartphone } from "lucide-react";

import aaryansLogo from "../assets/image.png";

import { createCardUrl, generateVCard } from "../utils/card";

/* =========================================================
   QR POPUP
   ========================================================= */

export default function QRModal({ card, onClose }) {
  const qrRef = useRef(null);

  if (!card) return null;

  /* =========================================================
     OLD WORKING QR URL

     Example:

     /card/card-id?data=FULL_CARD_DATA

     The complete card data remains inside the QR.
     ========================================================= */

  const cardUrl = createCardUrl(card);

  /* =========================================================
     CONVERT IMAGE TO DATA URL

     This is important because the logo must be embedded
     inside the downloaded/shared QR image.
     ========================================================= */

  const imageToDataUrl = async (imageUrl) => {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error("Unable to load company logo.");
    }

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  };

  /* =========================================================
     CREATE QR PNG BLOB

     This function creates the final QR image with:

     - QR code
     - Aaryans logo
     - White background

     It is used by BOTH:
     - Download QR
     - Share QR
     ========================================================= */

  const createQRBlob = async () => {
    const svg = qrRef.current?.querySelector("svg");

    if (!svg) {
      throw new Error("QR code not found.");
    }

    /* Clone SVG so we don't modify the visible QR */

    const clonedSvg = svg.cloneNode(true);

    /* =======================================================
       EMBED LOGO INTO SVG
       ======================================================= */

    const logoDataUrl = await imageToDataUrl(aaryansLogo);

    const imageElement = clonedSvg.querySelector("image");

    if (imageElement) {
      imageElement.setAttribute("href", logoDataUrl);

      imageElement.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        logoDataUrl,
      );
    }

    /* =======================================================
       SET EXPLICIT SVG SIZE
       ======================================================= */

    const size = 1000;

    clonedSvg.setAttribute("width", size);
    clonedSvg.setAttribute("height", size);

    clonedSvg.setAttribute("viewBox", "0 0 220 220");

    /* =======================================================
       SERIALIZE SVG
       ======================================================= */

    const svgData = new XMLSerializer().serializeToString(clonedSvg);

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });

    const svgUrl = URL.createObjectURL(svgBlob);

    /* =======================================================
       CONVERT SVG TO PNG
       ======================================================= */

    return await new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");

          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            URL.revokeObjectURL(svgUrl);
            reject(new Error("Canvas is not supported."));
            return;
          }

          /* White background */

          ctx.fillStyle = "#ffffff";

          ctx.fillRect(0, 0, size, size);

          /* Draw QR + logo */

          ctx.drawImage(img, 0, 0, size, size);

          URL.revokeObjectURL(svgUrl);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Unable to create QR image."));
                return;
              }

              resolve(blob);
            },
            "image/png",
            1,
          );
        } catch (error) {
          URL.revokeObjectURL(svgUrl);
          reject(error);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(svgUrl);

        reject(new Error("Unable to convert QR to image."));
      };

      img.src = svgUrl;
    });
  };

  /* =========================================================
     DOWNLOAD QR CODE
     ========================================================= */

  const handleDownloadQR = async () => {
    try {
      const qrBlob = await createQRBlob();

      const downloadUrl = URL.createObjectURL(qrBlob);

      const link = document.createElement("a");

      link.href = downloadUrl;

      link.download = `${card.fullName || "business-card"}-QR.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);
    } catch (error) {
      console.error("QR download failed:", error);
    }
  };

  /* =========================================================
     SHARE ACTUAL QR IMAGE
     ========================================================= */

  const handleShareQR = async () => {
    try {
      const qrBlob = await createQRBlob();

      const file = new File(
        [qrBlob],
        `${card.fullName || "business-card"}-QR.png`,
        {
          type: "image/png",
        },
      );

      /* =====================================================
         CHECK WHETHER DEVICE SUPPORTS FILE SHARING
         ===================================================== */

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          title: `${card.fullName || "Business"} Digital Card`,

          text: `QR code for ${card.fullName || "this"} digital business card.`,

          files: [file],
        });

        return;
      }

      /* =====================================================
         FALLBACK

         If browser doesn't support sharing image files,
         download the QR instead of sharing the long URL.
         ===================================================== */

      const downloadUrl = URL.createObjectURL(qrBlob);

      const link = document.createElement("a");

      link.href = downloadUrl;

      link.download = `${card.fullName || "business-card"}-QR.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);

      console.log(
        "This browser does not support image sharing. QR downloaded instead.",
      );
    } catch (error) {
      console.error("QR sharing failed:", error);
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
          scrollbar-hide
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

          {/* SUCCESS ICON */}

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

          {/* TITLE */}

          <h3 className="text-center text-lg font-bold">QR Code Generated</h3>

          <p className="mt-1 text-center text-[10px] text-white/75">
            Your digital business card is ready
          </p>
        </div>

        {/* ===================================================
            CONTENT
            =================================================== */}

        <div className="px-5 pb-5 pt-4">
          {/* =================================================
              PERSON NAME
              ================================================= */}

          <div className="mb-3 text-center">
            <p className="text-sm font-bold text-slate-800">{card.fullName}</p>

            {card.title && (
              <p className="mt-0.5 text-[10px] text-slate-500">{card.title}</p>
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
              {/* =================================================
                  QR CODE + HORIZONTAL COMPANY LOGO
                  ================================================= */}

              <QRCodeSVG
                value={cardUrl}
                size={220}
                level="H"
                includeMargin={true}
                fgColor="#601D1E"
                bgColor="#ffffff"
                className="h-full w-full"
                imageSettings={{
                  src: aaryansLogo,

                  /* Horizontal logo */

                  width: 72,
                  height: 44,

                  /* Clear area around logo */

                  excavate: true,
                }}
              />
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
            {/* DOWNLOAD QR */}

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

            {/* SHARE QR */}

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
