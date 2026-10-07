import { useState } from "react";
import { Download, Share2, X, Link, Check, Copy } from "lucide-react";
import BusinessCard from "./BusinessCard";
import { createCardUrl } from "../utils/card";
import aaryansLogo from "../assets/image.png";
import QRCode from "qrcode";

/* =========================================================
   VIEW CARD MODAL
   ========================================================= */

export default function ViewCardModal({ card, onClose }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (!card) return null;

  /* =========================================================
     ORIGINAL WORKING CARD URL
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
     IMAGE TO DATA URL
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
     LOAD IMAGE
     ========================================================= */

  const loadImage = async (src) => {
    return await new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = reject;

      image.src = src;
    });
  };

  /* =========================================================
     CREATE QR IMAGE
     
     IMPORTANT:

     Final image:
     1200 x 1200

     QR:
     1000 x 1000

     Equal:
     100px left
     100px right
     100px top
     100px bottom

     Therefore QR is perfectly centered.
     ========================================================= */

  const createQRImage = async () => {
    /* =======================================================
       FINAL IMAGE
       ======================================================= */

    const finalSize = 1200;

    const canvas = document.createElement("canvas");

    canvas.width = finalSize;
    canvas.height = finalSize;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas is not supported.");
    }

    /* =======================================================
       WHITE BACKGROUND
       ======================================================= */

    context.fillStyle = "#ffffff";

    context.fillRect(0, 0, finalSize, finalSize);

    /* =======================================================
       QR SIZE

       1000 x 1000

       This leaves exactly 100px on every side.
       ======================================================= */

    const qrSize = 1000;

    const qrX = (finalSize - qrSize) / 2;

    const qrY = (finalSize - qrSize) / 2;

    /* =======================================================
       TEMPORARY QR CANVAS
       ======================================================= */

    const qrCanvas = document.createElement("canvas");

    qrCanvas.width = qrSize;
    qrCanvas.height = qrSize;

    /* =======================================================
       GENERATE QR

       SAME CARD URL.

       HIGH ERROR CORRECTION FOR LOGO.
       ======================================================= */

    await QRCode.toCanvas(qrCanvas, cardUrl, {
      width: qrSize,
      margin: 4,
      errorCorrectionLevel: "H",

      color: {
        dark: "#601D1E",
        light: "#FFFFFF",
      },
    });

    /* =======================================================
       DRAW QR EXACTLY IN CENTER

       IMPORTANT:
       Do NOT change these coordinates.
       ======================================================= */

    context.imageSmoothingEnabled = false;

    context.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    /* =======================================================
       LOAD AARYANS LOGO
       ======================================================= */

    const logoDataUrl = await imageToDataUrl(aaryansLogo);

    const logo = await loadImage(logoDataUrl);

    /* =======================================================
       LOGO WHITE BACKGROUND

       Center of QR.
       ======================================================= */

    const logoBoxWidth = 330;
    const logoBoxHeight = 200;

    const logoBoxX = (finalSize - logoBoxWidth) / 2;

    const logoBoxY = (finalSize - logoBoxHeight) / 2;

    context.fillStyle = "#ffffff";

    context.beginPath();

    context.roundRect(logoBoxX, logoBoxY, logoBoxWidth, logoBoxHeight, 30);

    context.fill();

    /* =======================================================
       DRAW AARYANS LOGO

       Centered exactly.
       ======================================================= */

    const logoWidth = 230;
    const logoHeight = 140;

    const logoX = (finalSize - logoWidth) / 2;

    const logoY = (finalSize - logoHeight) / 2;

    context.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

    /* =======================================================
       CREATE FINAL PNG
       ======================================================= */

    const pngBlob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png", 1);
    });

    if (!pngBlob) {
      throw new Error("Unable to create QR image.");
    }

    return pngBlob;
  };

  /* =========================================================
     DOWNLOAD QR
     ========================================================= */

  const handleDownloadQR = async () => {
    if (downloading) return;

    try {
      setDownloading(true);

      const pngBlob = await createQRImage();

      const url = URL.createObjectURL(pngBlob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${getSafeFileName()}-qr.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("QR download failed:", error);

      alert("Unable to download QR code.");
    } finally {
      setDownloading(false);
    }
  };

  /* =========================================================
     SHARE QR

     Actual PNG image is shared.

     Example message:

     QR code for Dipak Kondhalkar Digit Card.
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

      /* =====================================================
         SHARE ACTUAL IMAGE
         ===================================================== */

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

      /* =====================================================
         FALLBACK

         Download actual QR image.
         ===================================================== */

      const url = URL.createObjectURL(pngBlob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${getSafeFileName()}-qr.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
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
          max-w-5xl
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
            z-20
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
            Preview your digital card and share it using the QR code.
          </p>
        </div>

        {/* ===================================================
            MAIN CONTENT
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
                    mt-1
                    text-xs
                    leading-5
                    text-slate-500
                  "
                >
                  Scan this QR code with any phone to open the digital card.
                </p>
              </div>

              {/* =============================================
                  QR PREVIEW BOX

                  250 x 250

                  QR is EXACTLY CENTERED.
                  ============================================= */}

              <div
                className="
                  mx-auto
                  flex
                  h-[250px]
                  w-[250px]
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
                    QR

                    220 x 220

                    15px approximately on each side.
                    ========================================= */}

                <div
                  className="
                    flex
                    h-[220px]
                    w-[220px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[16px]
                    bg-white
                    p-0
                    shadow-sm
                  "
                >
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
                  MESSAGE
                  ============================================= */}

              <div
                className="
                  mx-auto
                  mt-3
                  flex
                  max-w-[250px]
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
  );
}
