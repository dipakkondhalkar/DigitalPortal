import { useState } from "react";
import { X } from "lucide-react";

/* =========================================================
   EDIT MODAL
   ========================================================= */

export default function EditCardModal({ card, onSave, onClose }) {
  const [editingCard, setEditingCard] = useState(card);

  if (!card) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editingCard);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full my-8 max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute right-4 top-4">
          <X />
        </button>

        <h2 className="text-xl font-bold mb-5">Edit Card</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={editingCard.fullName}
            onChange={(e) =>
              setEditingCard({ ...editingCard, fullName: e.target.value })
            }
            placeholder="Full Name"
            required
            className="w-full border rounded-xl p-3 text-sm"
          />

          <input
            value={editingCard.title}
            onChange={(e) =>
              setEditingCard({ ...editingCard, title: e.target.value })
            }
            placeholder="Designation"
            required
            className="w-full border rounded-xl p-3 text-sm"
          />

          <input
            type="email"
            value={editingCard.email}
            onChange={(e) =>
              setEditingCard({ ...editingCard, email: e.target.value })
            }
            placeholder="Email"
            required
            className="w-full border rounded-xl p-3 text-sm"
          />

          <input
            value={editingCard.phone}
            onChange={(e) =>
              setEditingCard({
                ...editingCard,
                phone: e.target.value.replace(/\D/g, "").slice(0, 10),
              })
            }
            maxLength={10}
            inputMode="numeric"
            placeholder="Phone"
            required
            className="w-full border rounded-xl p-3 text-sm"
          />

          <textarea
            value={editingCard.address}
            onChange={(e) =>
              setEditingCard({ ...editingCard, address: e.target.value })
            }
            rows="4"
            placeholder="Address"
            required
            className="w-full border rounded-xl p-3 text-sm"
          />

          <button
            type="submit"
            className="w-full bg-[#5B1B20] text-white py-3 rounded-xl font-bold text-sm"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
