import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Search, Eye, Trash2, Edit } from "lucide-react";

import { createCardUrl } from "../utils/card";

/* =========================================================
   CARD DATABASE  (Read / Search / View / Edit / Delete)
   ========================================================= */

export default function CardDatabase({ cards, onView, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  const query = search.toLowerCase();

  const filteredCards = cards.filter(
    (card) =>
      card.fullName.toLowerCase().includes(query) ||
      card.email.toLowerCase().includes(query),
  );

  return (
    <>
      <div className="bg-white p-5 rounded-2xl border shadow-sm mb-6 flex justify-between items-center gap-3">
        <div className="relative w-80 max-w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm"
          />
        </div>

        <div className="text-xs text-slate-500">
          Total:
          <b className="ml-1 text-slate-900">{cards.length}</b>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-center">QR</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCards.map((card) => (
                <tr key={card.id} className="border-b hover:bg-slate-50">
                  <td className="p-4">
                    <b>{card.fullName}</b>
                    <div className="text-xs text-slate-500">{card.title}</div>
                  </td>

                  <td className="p-4 text-xs">
                    <div>{card.email}</div>
                    <div className="text-slate-500">+91 {card.phone}</div>
                  </td>

                  <td className="p-4 text-center">
                    <div className="inline-block">
                      <QRCodeSVG
                        value={createCardUrl(card)}
                        size={70}
                        level="H"
                      />
                    </div>
                  </td>

                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onView(card)}
                      className="p-2 text-slate-600"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onEdit({ ...card })}
                      className="p-2 text-amber-600"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDelete(card.id)}
                      className="p-2 text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCards.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400">
                    No cards found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
