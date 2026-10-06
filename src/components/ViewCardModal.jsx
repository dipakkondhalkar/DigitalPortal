import { QRCodeSVG } from "qrcode.react";
import { X } from "lucide-react";

import BusinessCard from "./BusinessCard";
import { createCardUrl } from "../utils/card";

/* =========================================================
   VIEW (EYE) MODAL
   ========================================================= */

export default function ViewCardModal({ card, onClose }) {
  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute right-4 top-4">
          <X />
        </button>

        <h2 className="text-xl font-bold mb-6">Digital Card Preview</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <BusinessCard card={card} />
          </div>

          <div className="flex flex-col items-center justify-center">
            <QRCodeSVG
              value={createCardUrl(card)}
              size={200}
              level="H"
              includeMargin
            />
            <p className="text-xs text-slate-500 mt-3 text-center">
              Scan this QR from any device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
