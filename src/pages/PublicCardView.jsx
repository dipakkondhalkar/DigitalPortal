import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, Share2 } from "lucide-react";

import BusinessCard from "../components/BusinessCard";
import { downloadVCard } from "../utils/card";
import { STORAGE_KEYS } from "../config";

/* =========================================================
   PUBLIC CARD PAGE
   ========================================================= */

const createNameSlug = (name) => {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
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

      setError("Card Not Found");
      setLoading(false);
    } catch (err) {
      console.error("Public card error:", err);

      setError("Card Not Found");
      setLoading(false);
    }
  }, [id]);

  /* =========================================================
     DOWNLOAD CARD
     
     No external package required.
     Downloads ONLY the card information as a standalone
     HTML card file. Buttons are NOT included.
     ========================================================= */

  const handleDownloadCard = () => {
    if (!card) return;

    const cardHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${card.fullName || "Business Card"}</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 30px;
      background: #f7f0e5;
      font-family: Arial, Helvetica, sans-serif;
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
      box-shadow: 0 18px 45px rgba(59, 24, 26, 0.18);
    }

    .top {
      background: #681F22;
      padding: 25px 18px 24px;
      text-align: center;
    }

    .logo {
      max-width: 170px;
      max-height: 70px;
      object-fit: contain;
      margin-bottom: 8px;
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
      margin: 14px auto;
    }

    .name-box {
      background: white;
      border-radius: 16px;
      padding: 22px 15px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.18);
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
      margin: 12px auto 8px;
    }

    .title {
      color: #4A4A4A;
      font-size: 14px;
    }

    .details {
      background: #FAF8F5;
      padding: 22px 18px;
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
        src="${window.location.origin}/src/assets/image.png"
        alt="Aaryans"
      />

      <div class="company">
        Aaryans Group of Companies
      </div>

      <div class="divider"></div>

      <div class="name-box">

        <div class="name">
          ${escapeHtml(card.fullName || "")}
        </div>

        <div class="small-line"></div>

        <div class="title">
          ${escapeHtml(card.title || "")}
        </div>

      </div>

    </div>

    <div class="details">

      ${
        card.email
          ? `
        <div class="detail">
          <div class="icon">✉</div>
          <div class="value">${escapeHtml(card.email)}</div>
        </div>
      `
          : ""
      }

      ${
        card.phone
          ? `
        <div class="detail">
          <div class="icon">☎</div>
          <div class="value">+91 ${escapeHtml(card.phone)}</div>
        </div>
      `
          : ""
      }

      ${
        card.address
          ? `
        <div class="detail">
          <div class="icon">●</div>
          <div class="value">${escapeHtml(card.address)}</div>
        </div>
      `
          : ""
      }

      <div class="detail">
        <div class="icon">🌐</div>
        <div class="value">www.aaryans.group</div>
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

    const link = document.createElement("a");

    const fileName = `${card.fullName || "business-card"}`
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, "-");

    link.href = url;
    link.download = `${fileName}-business-card.html`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =========================================================
     ESCAPE HTML
     ========================================================= */

  const escapeHtml = (value) => {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  /* =========================================================
     SHARE CARD
     ========================================================= */

  const handleShare = async () => {
    if (!card) return;

    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${card.fullName} - Aaryans Group`,
          text: `${card.fullName} - ${card.title || "Business Card"}`,
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(shareUrl);

      alert("Business card link copied.");
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
      <div className="flex min-h-screen items-center justify-center bg-[#f7f0e5] px-5">
        <div className="w-full max-w-xl rounded-[35px] bg-white p-10 text-center shadow-xl">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#E2BA6E] border-t-[#5B1B20]" />

          <h1 className="text-xl font-bold text-[#321b1e]">
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
      <div className="flex min-h-screen items-center justify-center bg-[#f7f0e5] px-5">
        <div className="w-full max-w-xl rounded-[35px] bg-white p-10 text-center shadow-xl">
          <div className="mb-5 text-6xl">⚠️</div>

          <h1 className="mb-4 text-3xl font-bold text-[#321b1e]">
            Card Not Found
          </h1>

          <p className="text-lg text-gray-500">
            This QR code does not contain a valid business card.
          </p>

          <p className="mt-5 text-sm text-gray-400">
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
     DISPLAY BUSINESS CARD
     ========================================================= */

  return (
    <div className="min-h-screen bg-[#f7f0e5] px-4 py-8">
      <div className="mx-auto flex max-w-xl flex-col items-center">
        {/* ================================================
            ONLY BUSINESS CARD
            ================================================ */}

        <BusinessCard card={card} />

        {/* ================================================
            DOWNLOAD + SHARE BUTTONS
            OUTSIDE THE CARD
            ================================================ */}

        <div className="mt-4 flex items-center justify-center gap-2">
          {/* DOWNLOAD */}

          <button
            type="button"
            onClick={handleDownloadCard}
            className="
              flex
              items-center
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
            <Download className="h-3.5 w-3.5" />
            Download Card
          </button>

          {/* SHARE */}

          <button
            type="button"
            onClick={handleShare}
            className="
              flex
              items-center
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
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>

        {/* ================================================
            SAVE CONTACT
            BELOW DOWNLOAD + SHARE
            ================================================ */}

        <div className="mt-3 text-center">
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
