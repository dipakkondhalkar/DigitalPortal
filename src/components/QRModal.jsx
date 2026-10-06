import { QRCodeSVG } from "qrcode.react";
import { Check, Download, X } from "lucide-react";

import { createCardUrl, generateVCard } from "../utils/card";

/* =========================================================
   QR POPUP (shown after a card is generated)
   ========================================================= */

export default function QRModal({ card, onClose }) {
  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-7 max-w-sm w-full text-center relative my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400"
        >
          <X />
        </button>

        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Check className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-bold">QR Code Generated!</h3>

        <p className="text-xs text-slate-500 mt-2 mb-5">
          Scan this QR code from any phone.
        </p>

        <div className="bg-slate-50 p-5 rounded-2xl border flex justify-center">
          <QRCodeSVG
            value={createCardUrl(card)}
            size={230}
            level="H"
            includeMargin={true}
          />
        </div>

        <a
          href={`data:text/vcard;charset=utf-8,${encodeURIComponent(
            generateVCard(card),
          )}`}
          download={`${card.fullName}.vcf`}
          className="mt-5 w-full bg-[#E2BA6E] hover:bg-[#d4a94f] text-[#5B1B20] py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition"
        >
          <Download className="w-4 h-4 text-[#5B1B20]" />
          Save Contact
        </a>

        <button
          onClick={onClose}
          className="mt-2 w-full bg-slate-100 py-3 rounded-xl text-xs font-bold"
        >
          Close
        </button>
      </div>
    </div>
  );
}
