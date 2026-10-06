import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import BusinessCard from "../components/BusinessCard";
import { downloadVCard } from "../utils/card";
import { STORAGE_KEYS } from "../config";

/* =========================================================
   PUBLIC CARD PAGE  (opened when the QR code is scanned)
   ========================================================= */

export default function PublicCardView() {
  const { id } = useParams();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams(window.location.search);
      const encodedData = params.get("data");

      // URLSearchParams.get() already decodes the value,
      // so do NOT call decodeURIComponent() here.
      if (encodedData) {
        try {
          const qrCard = JSON.parse(encodedData);

          if (qrCard && String(qrCard.id) === String(id)) {
            setCard(qrCard);
            setLoading(false);
            return;
          }

          console.warn("QR card ID does not match route ID.");
        } catch (qrError) {
          console.error("QR data JSON error:", qrError);
        }
      }

      // Same-device fallback for cards created before the new QR format.
      try {
        const savedCards = localStorage.getItem(STORAGE_KEYS.cards);

        if (savedCards) {
          const localCards = JSON.parse(savedCards);
          const localCard = localCards.find(
            (item) => String(item.id) === String(id),
          );

          if (localCard) {
            setCard(localCard);
            setLoading(false);
            return;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f0e5] flex items-center justify-center px-5">
        <div className="bg-white rounded-[35px] shadow-xl p-10 text-center max-w-xl w-full">
          <div className="w-12 h-12 border-4 border-[#E2BA6E] border-t-[#5B1B20] rounded-full animate-spin mx-auto mb-5" />
          <h1 className="text-xl font-bold text-[#321b1e]">
            Loading Business Card...
          </h1>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-[#f7f0e5] flex items-center justify-center px-5">
        <div className="bg-white rounded-[35px] shadow-xl p-10 text-center max-w-xl w-full">
          <div className="text-6xl mb-5">⚠️</div>

          <h1 className="text-3xl font-bold text-[#321b1e] mb-4">
            Card Not Found
          </h1>

          <p className="text-gray-500 text-lg">
            This QR code does not contain a valid business card.
          </p>

          <p className="text-sm text-gray-400 mt-5">
            Please create a new QR code from the latest deployed website.
          </p>

          <Link
            to="/"
            className="inline-flex mt-6 px-6 py-3 rounded-xl bg-[#5B1B20] text-white font-bold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f0e5] py-8 px-4">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        <BusinessCard card={card} />

        <div className="text-center mt-6">
          <button
            onClick={() => downloadVCard(card)}
            className="px-7 py-3 rounded-full bg-[#E2BA6E] text-[#5B1B20] font-bold shadow-lg hover:bg-[#d4a94f] transition"
          >
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );
}
