import { useState } from "react";
import { QrCode } from "lucide-react";

import { PHONE_REGEX } from "../config";
import { buildCard } from "../utils/card";

/* =========================================================
   CREATE CARD FORM  (generates the QR code)
   ========================================================= */

const EMPTY_FORM = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  address: "",
};

export default function CardForm({ onCreate }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    /* PHONE VALIDATION */
    if (!PHONE_REGEX.test(formData.phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    const newCard = buildCard(formData);

    /* Saves the card + opens the QR popup (handled by the parent) */
    onCreate(newCard);

    setFormData(EMPTY_FORM);
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border">
      <h2 className="text-2xl font-bold text-slate-900">Create Digital Card</h2>

      <p className="text-xs text-slate-500 mt-1 mb-8">
        Generate a self-contained QR code that can be scanned from any phone.
      </p>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NAME */}
        <div>
          <label className="block text-xs font-semibold mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="w-full px-3.5 py-2.5 border rounded-xl outline-none"
          />
        </div>

        {/* TITLE */}
        <div>
          <label className="block text-xs font-semibold mb-1.5">
            Designation / Role
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Director"
            required
            className="w-full px-3.5 py-2.5 border rounded-xl outline-none"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-xs font-semibold mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="abc@aaryansgroup.org"
            required
            className="w-full px-3.5 py-2.5 border rounded-xl outline-none"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-xs font-semibold mb-1.5">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setFormData({
                ...formData,
                phone: value,
              });
            }}
            maxLength={10}
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            placeholder="9876543210"
            required
            className="w-full px-3.5 py-2.5 border rounded-xl outline-none"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="block text-xs font-semibold mb-1.5">Address</label>
          <textarea
            name="address"
            rows="4"
            value={formData.address}
            onChange={handleChange}
            placeholder="Level 9, A Wing Part, Tower B1..."
            required
            className="w-full px-3.5 py-2.5 border rounded-xl outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#5B1B20] hover:bg-[#732328] text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <QrCode className="w-5 h-5 text-[#E2BA6E]" />
          Generate QR Code
        </button>
      </form>
    </div>
  );
}
