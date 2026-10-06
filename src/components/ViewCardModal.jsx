import { useRef, useState } from "react";

import { QRCodeSVG } from "qrcode.react";

import { X, Download, Share2, Link, Check, Copy } from "lucide-react";

import BusinessCard from "./BusinessCard";

import { createCardUrl } from "../utils/card";

/* =========================================================
   VIEW CARD MODAL
   ========================================================= */

export default function ViewCardModal({ card, onClose }) {
  const qrRef = useRef(null);

  const [copied, setCopied] = useState(false);

  if (!card) return null;

  /* =========================================================
     CREATE SHORT USER NAME

     Example:

     Dipak Kondhalkar
     ↓
     dipakkondhalkar
     ========================================================= */

  const getShortName = () => {
    return (
      card.fullName
        ?.trim()
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase() || "businesscard"
    );
  };

  /* =========================================================
     CARD URL

     createCardUrl should return:

     https://domain.com/card/dipakkondhalkar
     ========================================================= */

  const cardUrl = createCardUrl(card);

  /* =========================================================
     SAFE FILE NAME
     ========================================================= */

  const getSafeFileName = () => {
    return (
      card.fullName
        ?.trim()
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase() || "business-card"
    );
  };

  /* =========================================================
     CREATE QR IMAGE

     This creates the same branded QR image shown
     on the screen.
     ========================================================= */

  const createQRImage = async () => {
    const qrContainer = qrRef.current;

    if (!qrContainer) {
      throw new Error("QR code not found");
    }

    const svg = qrContainer.querySelector("svg");

    if (!svg) {
      throw new Error("QR SVG not found");
    }

    const serializer = new XMLSerializer();

    const svgData = serializer.serializeToString(svg);

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });

    const svgUrl = URL.createObjectURL(svgBlob);

    try {
      const image = new Image();

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = svgUrl;
      });

      /* =====================================================
         FINAL IMAGE SIZE
         ===================================================== */

      const size = 1000;

      const canvas = document.createElement("canvas");

      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas is not supported");
      }

      /* =====================================================
         WHITE BACKGROUND
         ===================================================== */

      context.fillStyle = "#ffffff";

      context.fillRect(0, 0, size, size);

      /* =====================================================
         DRAW QR
         ===================================================== */

      context.drawImage(image, 0, 0, size, size);

      /* =====================================================
         CENTER BRANDING
         ===================================================== */

      const centerWidth = 400;

      const centerHeight = 145;

      const centerX = (size - centerWidth) / 2;

      const centerY = (size - centerHeight) / 2;

      /* White center box */

      context.fillStyle = "#ffffff";

      context.beginPath();

      context.roundRect(centerX, centerY, centerWidth, centerHeight, 25);

      context.fill();

      /* =====================================================
         COMPANY NAME
         ===================================================== */

      context.textAlign = "center";

      context.textBaseline = "middle";

      context.fillStyle = "#601D1E";

      context.font = "800 30px Arial, sans-serif";

      context.fillText("AARYANS GROUP", size / 2, centerY + 38);

      /* =====================================================
         COMPANY TYPE
         ===================================================== */

      context.fillStyle = "#475569";

      context.font = "600 22px Arial, sans-serif";

      context.fillText("OF COMPANIES", size / 2, centerY + 73);

      /* =====================================================
         WEBSITE
         ===================================================== */

      context.fillStyle = "#601D1E";

      context.font = "500 21px Arial, sans-serif";

      context.fillText("www.aaryans.group", size / 2, centerY + 108);

      /* =====================================================
         CREATE PNG
         ===================================================== */

      const pngBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png", 1);
      });

      if (!pngBlob) {
        throw new Error("Could not create PNG");
      }

      return pngBlob;
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  };

  /* =========================================================
     DOWNLOAD QR
     ========================================================= */

  const handleDownloadQR = async () => {
    try {
      const pngBlob = await createQRImage();

      const url = URL.createObjectURL(pngBlob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${getSafeFileName()}.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("QR download failed:", error);
    }
  };

  /* =========================================================
     SHARE QR
     ========================================================= */

  const handleShare = async () => {
    try {
      const pngBlob = await createQRImage();

      const file = new File([pngBlob], `${getSafeFileName()}.png`, {
        type: "image/png",
      });

      /* Native share */

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          title: `${card.fullName || "Aaryans"} - QR Code`,

          text: `Digital business card for ${card.fullName || "Aaryans"}`,

          files: [file],
        });

        return;
      }

      /* Fallback download */

      const url = URL.createObjectURL(pngBlob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${getSafeFileName()}.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      console.error("QR sharing failed:", error);
    }
  };

  /* =========================================================
     COPY SHORT CARD LINK

     NO POPUP

     Button changes:
     Copy → Check
     for 1.5 seconds.
     ========================================================= */

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  /* =========================================================
     UI
     ========================================================= */

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
        backdrop-blur-sm
      "
    >
      {/* =====================================================
          MODAL
          ===================================================== */}

      <div
        className="
          relative
          my-8
          max-h-[92vh]
          w-full
          max-w-4xl
          overflow-y-auto
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >
        {/* ===================================================
            CLOSE
            =================================================== */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute
            right-4
            top-4
            z-10
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-slate-200
            bg-white
            text-slate-500
            shadow-sm
            transition
            hover:bg-slate-100
            hover:text-slate-800
            active:scale-95
          "
        >
          <X className="h-5 w-5" />
        </button>

        {/* ===================================================
            HEADER
            =================================================== */}

        <div
          className="
            border-b
            border-slate-200
            px-6
            py-5
            sm:px-8
          "
        >
          <h2
            className="
              text-xl
              font-bold
              text-slate-800
              sm:text-2xl
            "
          >
            Digital Card Preview
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Preview the card and share it using the QR code.
          </p>
        </div>

        {/* ===================================================
            CONTENT
            =================================================== */}

        <div
          className="
            grid
            gap-8
            p-6
            md:grid-cols-2
            md:p-8
          "
        >
          {/* =================================================
              BUSINESS CARD
              ================================================= */}

          <div
            className="
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                w-full
                max-w-md
              "
            >
              <BusinessCard card={card} />
            </div>
          </div>

          {/* =================================================
              QR SECTION
              ================================================= */}

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
            "
          >
            <div
              className="
                w-full
                max-w-sm
                rounded-3xl
                border
                border-slate-200
                bg-slate-50
                p-6
                shadow-sm
              "
            >
              {/* QR TITLE */}

              <div
                className="
                  mb-5
                  text-center
                "
              >
                <h3
                  className="
                    text-lg
                    font-bold
                    text-slate-800
                  "
                >
                  Scan to View Card
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-500
                  "
                >
                  Scan this QR code with any phone to open the digital card.
                </p>
              </div>

              {/* =================================================
                  QR CODE
                  ================================================= */}

              <div
                ref={qrRef}
                className="
                  mx-auto
                  flex
                  h-[270px]
                  w-[270px]
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-3
                  shadow-sm
                "
              >
                <div
                  className="
                    relative
                    flex
                    items-center
                    justify-center
                  "
                >
                  <QRCodeSVG
                    value={cardUrl}
                    size={245}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#601D1E"
                  />

                  {/* CENTER BRANDING */}

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

              {/* =================================================
                  DESCRIPTION
                  ================================================= */}

              <p
                className="
                  mt-4
                  text-center
                  text-xs
                  text-slate-500
                "
              >
                Download or share this QR code with anyone.
              </p>

              {/* =================================================
                  DOWNLOAD + SHARE
                  ================================================= */}

              <div
                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#601D1E]
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    hover:bg-[#491719]
                    hover:shadow-md
                    active:scale-95
                  "
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-[#601D1E]/20
                    bg-[#601D1E]/5
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-[#601D1E]
                    transition-all
                    hover:bg-[#601D1E]/10
                    hover:shadow-sm
                    active:scale-95
                  "
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>

              {/* =================================================
                  CARD LINK
                  ================================================= */}

              <div className="mt-5">
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-xs
                      font-semibold
                      text-slate-600
                    "
                  >
                    Card Link
                  </span>

                  <span
                    className="
                      text-[10px]
                      font-medium
                      text-slate-400
                    "
                  >
                    {getShortName()}
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-2
                  "
                >
                  <Link
                    className="
                      ml-2
                      h-4
                      w-4
                      shrink-0
                      text-[#601D1E]
                    "
                  />

                  {/* SHORT LINK */}

                  <input
                    type="text"
                    value={cardUrl}
                    readOnly
                    title={cardUrl}
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-1
                      text-xs
                      font-medium
                      text-slate-700
                      outline-none
                    "
                  />

                  {/* COPY BUTTON */}

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    title={copied ? "Copied" : "Copy card link"}
                    aria-label={copied ? "Copied" : "Copy card link"}
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      transition-all
                      active:scale-90
                      ${
                        copied
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }
                    `}
                  >
                    {copied ? (
                      <Check
                        className="
                          h-4
                          w-4
                          animate-pulse
                        "
                      />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* SHORT LINK PREVIEW */}

                <div
                  className="
                    mt-2
                    truncate
                    text-center
                    text-[10px]
                    text-slate-400
                  "
                >
                  /card/{getShortName()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
