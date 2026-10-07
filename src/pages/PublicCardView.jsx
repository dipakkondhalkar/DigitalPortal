import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, Share2 } from "lucide-react";

import BusinessCard from "../components/BusinessCard";
import { downloadVCard } from "../utils/card";
import { STORAGE_KEYS } from "../config";
import aaryansLogo from "../assets/image.png";

/* =========================================================
   PUBLIC CARD PAGE

   Supports:
   /card/dipakkondhalkar
   /card/old-card-id
   /card/id?data=...

   Actions:
   - Download Card
   - Share Card Image
   - Save Contact
   ========================================================= */

/* =========================================================
   CREATE NAME SLUG
   ========================================================= */

const createNameSlug = (name) => {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
};

/* =========================================================
   ESCAPE HTML
   ========================================================= */

const escapeHtml = (value) => {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/* =========================================================
   LOAD IMAGE
   ========================================================= */

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(new Error("Unable to load image."));
    };

    image.src = src;
  });
};

/* =========================================================
   ROUNDED RECTANGLE
   ========================================================= */

const roundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();

  ctx.moveTo(x + r, y);

  ctx.lineTo(x + width - r, y);

  ctx.quadraticCurveTo(x + width, y, x + width, y + r);

  ctx.lineTo(x + width, y + height - r);

  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);

  ctx.lineTo(x + r, y + height);

  ctx.quadraticCurveTo(x, y + height, x, y + height - r);

  ctx.lineTo(x, y + r);

  ctx.quadraticCurveTo(x, y, x + r, y);

  ctx.closePath();
};

/* =========================================================
   DRAW TEXT
   ========================================================= */

const drawText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = String(text || "").split(" ");

  let line = "";
  let lines = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line.length > 0 ? `${line} ${words[i]}` : words[i];

    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line.length > 0) {
      lines.push(line);
      line = words[i];
    } else {
      line = testLine;
    }
  }

  if (line) {
    lines.push(line);
  }

  lines.forEach((currentLine, index) => {
    ctx.fillText(currentLine, x, y + index * lineHeight);
  });

  return lines.length;
};

export default function PublicCardView() {
  const { id } = useParams();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD CARD
     ========================================================= */

  useEffect(() => {
    try {
      setLoading(true);
      setError("");
      setCard(null);

      /* =====================================================
         1. CHECK QR DATA
         ===================================================== */

      const params = new URLSearchParams(window.location.search);

      const encodedData = params.get("data");

      if (encodedData) {
        try {
          const qrCard = JSON.parse(encodedData);

          if (qrCard) {
            const qrId = String(qrCard.id || "");

            const qrNameSlug = createNameSlug(qrCard.fullName);

            if (
              qrId === String(id) ||
              qrNameSlug === String(id).toLowerCase()
            ) {
              setCard(qrCard);
              setLoading(false);
              return;
            }

            console.warn("QR card does not match the URL.");
          }
        } catch (qrError) {
          console.error("QR data JSON error:", qrError);
        }
      }

      /* =====================================================
         2. CHECK LOCAL STORAGE
         ===================================================== */

      try {
        const savedCards = localStorage.getItem(STORAGE_KEYS.cards);

        if (savedCards) {
          const localCards = JSON.parse(savedCards);

          if (Array.isArray(localCards)) {
            const requestedId = String(id || "").toLowerCase();

            const localCard = localCards.find((item) => {
              const originalId = String(item.id || "").toLowerCase();

              const nameSlug = createNameSlug(item.fullName);

              return originalId === requestedId || nameSlug === requestedId;
            });

            if (localCard) {
              setCard(localCard);
              setLoading(false);
              return;
            }
          }
        }
      } catch (storageError) {
        console.error("Local card read error:", storageError);
      }

      /* =====================================================
         3. CARD NOT FOUND
         ===================================================== */

      setError("Card Not Found");
      setLoading(false);
    } catch (err) {
      console.error("Public card error:", err);

      setError("Card Not Found");
      setLoading(false);
    }
  }, [id]);

  /* =========================================================
     DOWNLOAD CARD AS HTML
     ========================================================= */

  const handleDownloadCard = async () => {
    if (!card) return;

    try {
      const response = await fetch(aaryansLogo);

      if (!response.ok) {
        throw new Error("Unable to load logo.");
      }

      const logoBlob = await response.blob();

      const logoBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          resolve(reader.result);
        };

        reader.onerror = () => {
          reject(new Error("Logo conversion failed."));
        };

        reader.readAsDataURL(logoBlob);
      });

      const cardHtml = `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>
${escapeHtml(card.fullName || "Business Card")}
</title>

<style>

* {
  box-sizing: border-box;
}

body {

  margin: 0;

  padding: 30px;

  background: #f7f0e5;

  font-family:
    Arial,
    Helvetica,
    sans-serif;

  display: flex;

  justify-content: center;

  align-items: flex-start;
}

.card {

  width: 330px;

  overflow: hidden;

  border-radius: 20px;

  border: 1px solid #ded5ca;

  background: #faf8f4;

  box-shadow:
    0 18px 45px
    rgba(59,24,26,0.18);
}

.top {

  background: #681F22;

  padding:
    25px
    18px
    24px;

  text-align: center;
}

.logo {

  width: auto;

  max-width: 180px;

  height: 70px;

  object-fit: contain;

  display: block;

  margin:
    0 auto 8px;
}

.company {

  color: #E2BA6E;

  font-size: 13px;

  font-weight: bold;
}

.divider {

  width: 50px;

  height: 2px;

  background: #E2BA6E;

  margin:
    14px auto;
}

.name-box {

  background: white;

  border-radius: 16px;

  padding:
    22px 15px;

  text-align: center;

  box-shadow:
    0 10px 25px
    rgba(0,0,0,0.18);
}

.name {

  color: #681F22;

  font-size: 21px;

  font-weight: 800;

  text-transform: uppercase;

  line-height: 1.2;

  word-break: break-word;
}

.small-line {

  width: 40px;

  height: 2px;

  background: #E2BA6E;

  margin:
    12px auto 8px;
}

.title {

  color: #4A4A4A;

  font-size: 14px;
}

.details {

  background: #FAF8F5;

  padding:
    22px 18px;
}

.detail {

  display: flex;

  gap: 10px;

  margin-bottom: 15px;

  color: #444;

  font-size: 12px;

  line-height: 1.5;
}

.icon {

  width: 28px;

  height: 28px;

  min-width: 28px;

  border-radius: 8px;

  background: #681F22;

  color: #E2BA6E;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 13px;
}

.value {

  word-break: break-word;

  padding-top: 5px;
}

.bottom-line {

  height: 1px;

  background: #ddd3c8;

  margin-top: 18px;
}

.brand {

  background: #681F22;

  color: #E2BA6E;

  text-align: center;

  padding: 10px;

  font-size: 8px;

  font-weight: bold;

  letter-spacing: 2px;

  text-transform: uppercase;
}

</style>

</head>

<body>

<div class="card">

  <div class="top">

    <img
      class="logo"
      src="${logoBase64}"
      alt="Aaryans"
    />

    <div class="company">
      Aaryans Group of Companies
    </div>

    <div class="divider"></div>

    <div class="name-box">

      <div class="name">
        ${escapeHtml(card.fullName)}
      </div>

      <div class="small-line"></div>

      <div class="title">
        ${escapeHtml(card.title)}
      </div>

    </div>

  </div>

  <div class="details">

    ${
      card.email
        ? `
          <div class="detail">

            <div class="icon">
              ✉
            </div>

            <div class="value">
              ${escapeHtml(card.email)}
            </div>

          </div>
        `
        : ""
    }

    ${
      card.phone
        ? `
          <div class="detail">

            <div class="icon">
              ☎
            </div>

            <div class="value">
              +91 ${escapeHtml(card.phone)}
            </div>

          </div>
        `
        : ""
    }

    ${
      card.address
        ? `
          <div class="detail">

            <div class="icon">
              ●
            </div>

            <div class="value">
              ${escapeHtml(card.address)}
            </div>

          </div>
        `
        : ""
    }

    <div class="detail">

      <div class="icon">
        🌐
      </div>

      <div class="value">
        www.aaryans.group
      </div>

    </div>

    <div class="bottom-line"></div>

  </div>

  <div class="brand">
    Aaryans Group of Companies
  </div>

</div>

</body>

</html>
`;

      const blob = new Blob([cardHtml], {
        type: "text/html;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);

      const fileName = `${card.fullName || "business-card"}`
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "-");

      const link = document.createElement("a");

      link.href = url;

      link.download = `${fileName}-business-card.html`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error("Card download error:", downloadError);

      alert("Unable to download the business card.");
    }
  };

  /* =========================================================
     CREATE ACTUAL CARD IMAGE
     ========================================================= */

  const createCardImage = async () => {
    const scale = 2;

    const width = 660;
    const height = 1040;

    const canvas = document.createElement("canvas");

    canvas.width = width * scale;

    canvas.height = height * scale;

    const ctx = canvas.getContext("2d");

    ctx.scale(scale, scale);

    /* =====================================================
       BACKGROUND
       ===================================================== */

    ctx.fillStyle = "#f7f0e5";

    ctx.fillRect(0, 0, width, height);

    /* =====================================================
       CARD SHADOW
       ===================================================== */

    ctx.shadowColor = "rgba(59,24,26,0.20)";

    ctx.shadowBlur = 30;

    ctx.shadowOffsetY = 12;

    /* =====================================================
       CARD BACKGROUND
       ===================================================== */

    roundedRect(ctx, 20, 20, width - 40, height - 40, 40);

    ctx.fillStyle = "#faf8f4";

    ctx.fill();

    ctx.shadowColor = "transparent";

    /* =====================================================
       TOP BROWN SECTION
       ===================================================== */

    ctx.save();

    roundedRect(ctx, 20, 20, width - 40, 520, 40);

    ctx.clip();

    ctx.fillStyle = "#681F22";

    ctx.fillRect(20, 20, width - 40, 520);

    ctx.restore();

    /* =====================================================
       LOGO
       ===================================================== */

    try {
      const logo = await loadImage(aaryansLogo);

      const logoMaxWidth = 330;

      const logoMaxHeight = 120;

      const logoRatio = Math.min(
        logoMaxWidth / logo.width,

        logoMaxHeight / logo.height,
      );

      const logoWidth = logo.width * logoRatio;

      const logoHeight = logo.height * logoRatio;

      ctx.drawImage(
        logo,

        (width - logoWidth) / 2,

        55,

        logoWidth,

        logoHeight,
      );
    } catch (logoError) {
      console.error("Canvas logo error:", logoError);
    }

    /* =====================================================
       COMPANY NAME
       ===================================================== */

    ctx.textAlign = "center";

    ctx.fillStyle = "#E2BA6E";

    ctx.font = "bold 25px Arial";

    ctx.fillText("Aaryans Group of Companies", width / 2, 220);

    /* =====================================================
       GOLD DIVIDER
       ===================================================== */

    ctx.fillStyle = "#E2BA6E";

    ctx.fillRect(width / 2 - 50, 245, 100, 3);

    /* =====================================================
       NAME WHITE BOX
       ===================================================== */

    ctx.shadowColor = "rgba(0,0,0,0.18)";

    ctx.shadowBlur = 20;

    roundedRect(ctx, 70, 285, width - 140, 185, 30);

    ctx.fillStyle = "#ffffff";

    ctx.fill();

    ctx.shadowColor = "transparent";

    /* =====================================================
       NAME
       ===================================================== */

    ctx.fillStyle = "#681F22";

    ctx.font = "800 38px Arial";

    ctx.textAlign = "center";

    drawText(
      ctx,
      String(card.fullName || "").toUpperCase(),
      width / 2,
      345,
      width - 190,
      45,
    );

    /* =====================================================
       SMALL GOLD LINE
       ===================================================== */

    ctx.fillStyle = "#E2BA6E";

    ctx.fillRect(width / 2 - 35, 395, 70, 3);

    /* =====================================================
       DESIGNATION
       ===================================================== */

    ctx.fillStyle = "#4A4A4A";

    ctx.font = "500 24px Arial";

    ctx.fillText(card.title || "", width / 2, 435);

    /* =====================================================
       CONTACT SECTION
       ===================================================== */

    ctx.fillStyle = "#FAF8F5";

    ctx.fillRect(20, 540, width - 40, 430);

    let currentY = 600;

    const drawContactRow = (icon, text) => {
      /* ICON BOX */

      roundedRect(ctx, 60, currentY - 24, 55, 55, 12);

      ctx.fillStyle = "#681F22";

      ctx.fill();

      /* ICON */

      ctx.fillStyle = "#E2BA6E";

      ctx.font = "22px Arial";

      ctx.textAlign = "center";

      ctx.fillText(icon, 87, currentY + 12);

      /* TEXT */

      ctx.fillStyle = "#444444";

      ctx.font = "500 21px Arial";

      ctx.textAlign = "left";

      drawText(ctx, text, 135, currentY + 5, 455, 28);

      currentY += 85;
    };

    if (card.email) {
      drawContactRow("✉", card.email);
    }

    if (card.phone) {
      drawContactRow("☎", `+91 ${card.phone}`);
    }

    if (card.address) {
      drawContactRow("●", card.address);
    }

    drawContactRow("🌐", "www.aaryans.group");

    /* =====================================================
       BOTTOM DIVIDER
       ===================================================== */

    ctx.fillStyle = "#ddd3c8";

    ctx.fillRect(60, 920, width - 120, 2);

    /* =====================================================
       BRAND STRIP
       ===================================================== */

    ctx.fillStyle = "#681F22";

    ctx.fillRect(20, 970, width - 40, 70);

    ctx.fillStyle = "#E2BA6E";

    ctx.font = "bold 16px Arial";

    ctx.textAlign = "center";

    ctx.fillText("AARYANS GROUP OF COMPANIES", width / 2, 1013);

    /* =====================================================
       RETURN CANVAS
       ===================================================== */

    return canvas;
  };

  /* =========================================================
     SHARE ACTUAL CARD IMAGE
     ========================================================= */

  const handleShare = async () => {
    if (!card) return;

    try {
      /* =====================================================
         CHECK IMAGE SHARE SUPPORT
         ===================================================== */

      if (navigator.share && navigator.canShare) {
        const canvas = await createCardImage();

        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, "image/png");
        });

        if (!blob) {
          throw new Error("Unable to create card image.");
        }

        const file = new File(
          [blob],
          `${card.fullName || "business-card"}-business-card.png`,
          {
            type: "image/png",
          },
        );

        const shareData = {
          title: `${card.fullName} - Aaryans Group`,
          text: `${card.fullName} - ${card.title || "Business Card"}`,
          files: [file],
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);

          return;
        }
      }

      /* =====================================================
         FALLBACK
         ===================================================== */

      const shareUrl = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title: `${card.fullName} - Aaryans Group`,
          text: `${card.fullName} - ${card.title || "Business Card"}`,
          url: shareUrl,
        });

        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);

        alert(
          "Card image sharing is not supported by this browser. Card link copied.",
        );

        return;
      }

      alert("Card sharing is not supported on this browser.");
    } catch (shareError) {
      if (shareError?.name !== "AbortError") {
        console.error("Share error:", shareError);
      }
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f7f0e5]
          px-5
        "
      >
        <div
          className="
            w-full
            max-w-xl
            rounded-[35px]
            bg-white
            p-10
            text-center
            shadow-xl
          "
        >
          <div
            className="
              mx-auto
              mb-5
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-[#E2BA6E]
              border-t-[#5B1B20]
            "
          />

          <h1
            className="
              text-xl
              font-bold
              text-[#321b1e]
            "
          >
            Loading Business Card...
          </h1>
        </div>
      </div>
    );
  }

  /* =========================================================
     CARD NOT FOUND
     ========================================================= */

  if (error || !card) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f7f0e5]
          px-5
        "
      >
        <div
          className="
            w-full
            max-w-xl
            rounded-[35px]
            bg-white
            p-10
            text-center
            shadow-xl
          "
        >
          <div className="mb-5 text-6xl">⚠️</div>

          <h1
            className="
              mb-4
              text-3xl
              font-bold
              text-[#321b1e]
            "
          >
            Card Not Found
          </h1>

          <p className="text-lg text-gray-500">
            This QR code does not contain a valid business card.
          </p>

          <p
            className="
              mt-5
              text-sm
              text-gray-400
            "
          >
            Please create a new QR code from the latest deployed website.
          </p>

          <Link
            to="/"
            className="
              mt-6
              inline-flex
              rounded-xl
              bg-[#5B1B20]
              px-6
              py-3
              font-bold
              text-white
              transition
              hover:bg-[#431417]
            "
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================================
     PUBLIC BUSINESS CARD
     ========================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-[#f7f0e5]
        px-4
        py-8
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-xl
          flex-col
          items-center
        "
      >
        {/* =================================================
            BUSINESS CARD
            ================================================= */}

        <BusinessCard card={card} />

        {/* =================================================
            DOWNLOAD + SHARE
            OUTSIDE CARD
            ================================================= */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-center
            gap-2
          "
        >
          {/* DOWNLOAD */}

          <button
            type="button"
            onClick={handleDownloadCard}
            className="
              flex
              items-center
              justify-center
              gap-1.5
              rounded-full
              bg-[#5B1B20]
              px-4
              py-2
              text-[11px]
              font-bold
              text-white
              shadow-md
              transition
              hover:bg-[#732328]
              hover:shadow-lg
              active:scale-95
            "
          >
            <Download
              className="
                h-3.5
                w-3.5
              "
            />
            Download Card
          </button>

          {/* SHARE */}

          <button
            type="button"
            onClick={handleShare}
            className="
              flex
              items-center
              justify-center
              gap-1.5
              rounded-full
              border
              border-[#5B1B20]
              bg-white
              px-4
              py-2
              text-[11px]
              font-bold
              text-[#5B1B20]
              shadow-sm
              transition
              hover:bg-[#f8eee3]
              hover:shadow-md
              active:scale-95
            "
          >
            <Share2
              className="
                h-3.5
                w-3.5
              "
            />
            Share
          </button>
        </div>

        {/* =================================================
            SAVE CONTACT
            ================================================= */}

        <div
          className="
            mt-3
            text-center
          "
        >
          <button
            type="button"
            onClick={() => downloadVCard(card)}
            className="
              rounded-full
              bg-[#E2BA6E]
              px-4
              py-1.5
              text-[11px]
              font-bold
              text-[#5B1B20]
              shadow-md
              transition
              hover:bg-[#d4a94f]
              hover:shadow-lg
              active:scale-95
            "
          >
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );
}
