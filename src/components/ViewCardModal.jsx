import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Download, Share2, Link, Check } from "lucide-react";

import BusinessCard from "./BusinessCard";
import { createCardUrl } from "../utils/card";

/* =========================================================
   VIEW (EYE) MODAL
   ========================================================= */

export default function ViewCardModal({ card, onClose }) {
  const qrRef = useRef(null);

  if (!card) return null;

  const cardUrl = createCardUrl(card);

  /* =========================================================
     GET SAFE FILE NAME
     ========================================================= */

  const getSafeName = () => {
    return (
      card.fullName?.replace(/[^a-z0-9]/gi, "-").toLowerCase() ||
      "business-card"
    );
  };

  /* =========================================================
     CONVERT QR SVG → PNG
     ========================================================= */

  const createQRImage = async () => {
    const svg = qrRef.current?.querySelector("svg");

    if (!svg) {
      throw new Error("QR code not found");
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

      const canvas = document.createElement("canvas");

      const size = 800;

      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas is not supported");
      }

      /* White background */
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, size, size);

      /* Draw QR */
      context.drawImage(image, 0, 0, size, size);

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
     DOWNLOAD QR CODE
     ========================================================= */

  const handleDownloadQR = async () => {
    try {
      const pngBlob = await createQRImage();

      const url = URL.createObjectURL(pngBlob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `aaryans-qr-${getSafeName()}.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("QR download failed:", error);

      alert("Unable to download QR code.");
    }
  };

  /* =========================================================
     SHARE QR CODE
     ========================================================= */

  const handleShare = async () => {
    try {
      const pngBlob = await createQRImage();

      const file = new File([pngBlob], `aaryans-qr-${getSafeName()}.png`, {
        type: "image/png",
      });

      /* =====================================================
         MOBILE / SUPPORTED BROWSERS

         This opens the native share menu.

         Example:
         WhatsApp
         Telegram
         Gmail
         Bluetooth
         Google Drive
         Nearby Share
         etc.
         ===================================================== */

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

      /* =====================================================
         FALLBACK

         If browser cannot share files, download QR.
         ===================================================== */

      const url = URL.createObjectURL(pngBlob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `aaryans-qr-${getSafeName()}.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      alert(
        "This browser does not support direct QR sharing. The QR code has been downloaded.",
      );
    } catch (error) {
      /* User cancelled share */
      if (error?.name === "AbortError") {
        return;
      }

      console.error("QR sharing failed:", error);

      alert("Unable to share QR code.");
    }
  };

  /* =========================================================
     COPY CARD LINK
     ========================================================= */

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);

      alert("Card link copied successfully!");
    } catch (error) {
      console.error("Copy failed:", error);

      alert("Unable to copy the card link.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
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
            hover:shadow-md
            active:scale-95
          "
        >
          <X className="h-5 w-5" />
        </button>

        {/* ===================================================
            HEADER
            =================================================== */}

        <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Digital Card Preview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Preview the card and share it using the QR code.
          </p>
        </div>

        {/* ===================================================
            CONTENT
            =================================================== */}

        <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
          {/* =================================================
              BUSINESS CARD
              ================================================= */}

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <BusinessCard card={card} />
            </div>
          </div>

          {/* =================================================
              QR SECTION
              ================================================= */}

          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              {/* QR TITLE */}

              <div className="mb-5 text-center">
                <h3 className="text-lg font-bold text-slate-800">
                  Scan to View Card
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
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
                  h-[230px]
                  w-[230px]
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
                <QRCodeSVG
                  value={cardUrl}
                  size={200}
                  level="H"
                  includeMargin
                  bgColor="#ffffff"
                  fgColor="#601D1E"
                />
              </div>

              <p className="mt-4 text-center text-xs text-slate-500">
                Download or share this QR code with anyone.
              </p>

              {/* =================================================
                  ACTION BUTTONS
                  ================================================= */}

              <div className="mt-5 grid grid-cols-2 gap-3">
                {/* DOWNLOAD */}

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

                {/* SHARE */}

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

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    Card Link
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
                  <Link className="ml-2 h-4 w-4 shrink-0 text-slate-400" />

                  <input
                    type="text"
                    value={cardUrl}
                    readOnly
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-1
                      text-xs
                      text-slate-600
                      outline-none
                    "
                  />

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    title="Copy card link"
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-slate-100
                      text-slate-600
                      transition
                      hover:bg-slate-200
                      active:scale-95
                    "
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
