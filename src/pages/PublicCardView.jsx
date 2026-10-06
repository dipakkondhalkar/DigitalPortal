import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import BusinessCard from "../components/BusinessCard";
import { downloadVCard } from "../utils/card";
import { STORAGE_KEYS } from "../config";

/* =========================================================
   PUBLIC CARD PAGE
   Supports:
   /card/dipakkondhalkar
   /card/old-card-id
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

            /*
              Accept either:

              /card/original-id

              OR

              /card/dipakkondhalkar
            */
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

              /*
                Support both old and new URLs:

                /card/1759738291234-abc123

                /card/dipakkondhalkar
              */
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
            className="mt-6 inline-flex rounded-xl bg-[#5B1B20] px-6 py-3 font-bold text-white transition hover:bg-[#431417]"
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
        <BusinessCard card={card} />

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => downloadVCard(card)}
            className="rounded-full bg-[#E2BA6E] px-7 py-3 font-bold text-[#5B1B20] shadow-lg transition hover:bg-[#d4a94f]"
          >
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );
}
