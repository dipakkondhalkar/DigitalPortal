import { useRef, useState } from "react";

import { QRCodeSVG } from "qrcode.react";

import { X, Download, Share2, Link, Check, Copy } from "lucide-react";

import aaryansLogo from "../assets/image.png";

import BusinessCard from "./BusinessCard";

import { createCardUrl } from "../utils/card";

/* =========================================================
   VIEW CARD MODAL
   ========================================================= */

export default function ViewCardModal({ card, onClose }) {
  const qrRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (!card) return null;

  /* =========================================================
     CARD URL
     ========================================================= */

  const cardUrl = createCardUrl(card);

  /* =========================================================
     SAFE FILE NAME
     ========================================================= */

  const getSafeFileName = () => {
    return (
      card.fullName
        ?.trim()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase() || "business-card"
    );
  };

  /* =========================================================
     CONVERT LOGO TO DATA URL
     ========================================================= */

  const imageToDataUrl = async (imageUrl) => {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error("Unable to load Aaryans logo.");
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
     CREATE FINAL QR PNG

     SAME QR AS PREVIEW
     SAME LOGO
     SAME URL
     ========================================================= */

  const createQRImage = async () => {
    const svg = qrRef.current?.querySelector("svg");

    if (!svg) {
      throw new Error("QR code not found.");
    }

    const clonedSvg = svg.cloneNode(true);

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

    /* Keep original QR viewBox */

    const originalViewBox = svg.getAttribute("viewBox");

    if (originalViewBox) {
      clonedSvg.setAttribute("viewBox", originalViewBox);
    }

    /* Final square PNG */

    const finalSize = 1200;

    clonedSvg.setAttribute("width", finalSize);

    clonedSvg.setAttribute("height", finalSize);

    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const svgData = new XMLSerializer().serializeToString(clonedSvg);

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

      canvas.width = finalSize;
      canvas.height = finalSize;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas is not supported.");
      }

      /* White background */

      context.fillStyle = "#ffffff";

      context.fillRect(0, 0, finalSize, finalSize);

      /* Exact QR */

      context.imageSmoothingEnabled = false;

      context.drawImage(image, 0, 0, finalSize, finalSize);

      const pngBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png", 1);
      });

      if (!pngBlob) {
        throw new Error("Unable to create QR image.");
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
    if (downloading) return;

    try {
      setDownloading(true);

      const pngBlob = await createQRImage();

      const downloadUrl = URL.createObjectURL(pngBlob);

      const link = document.createElement("a");

      link.href = downloadUrl;

      link.download = `${getSafeFileName()}-qr.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);
    } catch (error) {
      console.error("QR download failed:", error);

      alert("Unable to download QR code.");
    } finally {
      setDownloading(false);
    }
  };

  /* =========================================================
     SHARE QR IMAGE
     ========================================================= */

  const handleShare = async () => {
    if (sharing) return;

    try {
      setSharing(true);

      const pngBlob = await createQRImage();

      const file = new File([pngBlob], `${getSafeFileName()}-qr.png`, {
        type: "image/png",
      });

      const shareMessage = `QR code for ${
        card.fullName || "Business"
      } Digit Card.`;

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          title: shareMessage,
          text: shareMessage,
          files: [file],
        });

        return;
      }

      /* Browser fallback */

      const downloadUrl = URL.createObjectURL(pngBlob);

      const link = document.createElement("a");

      link.href = downloadUrl;

      link.download = `${getSafeFileName()}-qr.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);

      alert(
        "This browser cannot share image files. The QR image has been downloaded instead.",
      );
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      console.error("QR sharing failed:", error);

      alert("Unable to share QR code.");
    } finally {
      setSharing(false);
    }
  };

  /* =========================================================
     COPY CARD LINK
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
        p-3
        sm:p-5
        backdrop-blur-sm
      "
    >
      {/* =====================================================
          MAIN MODAL

          CENTERED IN SCREEN
          ===================================================== */}

      <div
        className="
          relative
          flex
          max-h-[94vh]
          w-full
          max-w-6xl
          flex-col
          overflow-hidden
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
            z-30
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
            shadow-md
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
            shrink-0
            border-b
            border-slate-200
            bg-white
            px-5
            py-5
            sm:px-8
          "
        >
          <h2
            className="
              text-center
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
              text-center
              text-sm
              text-slate-500
            "
          >
            Preview your digital card and share it using the QR code.
          </p>
        </div>

        {/* ===================================================
            MAIN CONTENT

            IMPORTANT CHANGE:
            ITEMS ARE NOW PROPERLY CENTERED.
            =================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            scrollbar-hide
          "
        >
          <div
            className="
              grid
              min-h-full
              w-full
              grid-cols-1
              items-center
              justify-items-center
              gap-8
              px-5
              py-8
              sm:px-8
              md:grid-cols-2
              md:gap-10
              lg:gap-14
              lg:px-12
              lg:py-10
            "
          >
            {/* =================================================
                BUSINESS CARD PREVIEW

                CENTERED
                ================================================= */}

            <div
              className="
                flex
                w-full
                items-center
                justify-center
                self-center
              "
            >
              <div
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    w-full
                    max-w-[420px]
                  "
                >
                  <BusinessCard card={card} />
                </div>
              </div>
            </div>

            {/* =================================================
                QR SECTION

                CENTERED
                ================================================= */}

            <div
              className="
                flex
                w-full
                items-center
                justify-center
                self-center
              "
            >
              <div
                className="
                  w-full
                  max-w-[390px]
                  rounded-3xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-5
                  shadow-sm
                  sm:p-6
                "
              >
                {/* =============================================
                    QR TITLE
                    ============================================= */}

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
                      mx-auto
                      mt-1
                      max-w-[300px]
                      text-xs
                      leading-5
                      text-slate-500
                    "
                  >
                    Scan this QR code with any phone to open the digital card.
                  </p>
                </div>

                {/* =============================================
                    QR OUTER BOX
                    ============================================= */}

                <div
                  className="
                    mx-auto
                    flex
                    aspect-square
                    w-full
                    max-w-[280px]
                    items-center
                    justify-center
                    rounded-[22px]
                    border
                    border-slate-200
                    bg-slate-50
                    p-3
                    shadow-inner
                  "
                >
                  {/* =========================================
                      QR INNER BOX
                      ========================================= */}

                  <div
                    ref={qrRef}
                    className="
                      flex
                      aspect-square
                      w-full
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-[16px]
                      bg-white
                      p-0
                      shadow-sm
                    "
                  >
                    {/* =======================================
                        SAME QR
                        ======================================= */}

                    <QRCodeSVG
                      value={cardUrl}
                      size={220}
                      level="H"
                      includeMargin={true}
                      fgColor="#601D1E"
                      bgColor="#ffffff"
                      imageSettings={{
                        src: aaryansLogo,
                        width: 72,
                        height: 44,
                        excavate: true,
                      }}
                    />
                  </div>
                </div>

                {/* =============================================
                    SCAN MESSAGE
                    ============================================= */}

                <div
                  className="
                    mx-auto
                    mt-3
                    flex
                    max-w-[280px]
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#f7f0e5]
                    px-3
                    py-2
                  "
                >
                  <p
                    className="
                      text-center
                      text-[9px]
                      font-medium
                      text-[#601D1E]
                    "
                  >
                    Scan with any phone to open the card
                  </p>
                </div>

                {/* =============================================
                    DOWNLOAD + SHARE
                    ============================================= */}

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-2
                    gap-2.5
                  "
                >
                  {/* DOWNLOAD */}

                  <button
                    type="button"
                    onClick={handleDownloadQR}
                    disabled={downloading}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1.5
                      rounded-xl
                      bg-[#601D1E]
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-[#491719]
                      active:scale-95
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <Download className="h-4 w-4" />

                    {downloading ? "Downloading..." : "Download"}
                  </button>

                  {/* SHARE */}

                  <button
                    type="button"
                    onClick={handleShare}
                    disabled={sharing}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1.5
                      rounded-xl
                      border
                      border-[#601D1E]/20
                      bg-[#601D1E]/5
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-[#601D1E]
                      transition
                      hover:bg-[#601D1E]/10
                      active:scale-95
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <Share2 className="h-4 w-4" />

                    {sharing ? "Sharing..." : "Share"}
                  </button>
                </div>

                {/* =============================================
                    CARD LINK
                    ============================================= */}

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

                  <div
                    className="
                      mt-2
                      text-center
                      text-[10px]
                      text-slate-400
                    "
                  >
                    Complete card link
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
