import { useState } from "react";
import { QrCode } from "lucide-react";

import { PHONE_REGEX } from "../config";
import { buildCard } from "../utils/card";

/* =========================================================
   CREATE CARD FORM
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

    /* =====================================================
       PHONE VALIDATION
       ===================================================== */

    if (!PHONE_REGEX.test(formData.phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    /* =====================================================
       CREATE CARD
       ===================================================== */

    const newCard = buildCard(formData);

    /*
      Parent handles:
      - saving card
      - opening QR popup
    */

    onCreate(newCard);

    /* Reset form */

    setFormData(EMPTY_FORM);
  };

  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-xl
        md:p-10
      "
    >
      {/* ===================================================
          HEADER
          =================================================== */}

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-[#5B1B20]
              shadow-sm
            "
          >
            <QrCode className="h-5 w-5 text-[#E2BA6E]" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Create Digital Card
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Create a digital business card and generate its QR code.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          ERROR
          =================================================== */}

      {error && (
        <div
          className="
            mb-5
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-3
            text-xs
            font-semibold
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* ===================================================
          FORM
          =================================================== */}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NAME */}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Full Name
          </label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3.5
              py-2.5
              text-sm
              outline-none
              transition
              focus:border-[#5B1B20]
              focus:ring-2
              focus:ring-[#5B1B20]/10
            "
          />
        </div>

        {/* TITLE */}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Designation / Role
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Director"
            required
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3.5
              py-2.5
              text-sm
              outline-none
              transition
              focus:border-[#5B1B20]
              focus:ring-2
              focus:ring-[#5B1B20]/10
            "
          />
        </div>

        {/* EMAIL */}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="abc@aaryansgroup.org"
            required
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3.5
              py-2.5
              text-sm
              outline-none
              transition
              focus:border-[#5B1B20]
              focus:ring-2
              focus:ring-[#5B1B20]/10
            "
          />
        </div>

        {/* PHONE */}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
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
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3.5
              py-2.5
              text-sm
              outline-none
              transition
              focus:border-[#5B1B20]
              focus:ring-2
              focus:ring-[#5B1B20]/10
            "
          />
        </div>

        {/* ADDRESS */}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Address
          </label>

          <textarea
            name="address"
            rows="4"
            value={formData.address}
            onChange={handleChange}
            placeholder="Level 9, A Wing Part, Tower B1..."
            required
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3.5
              py-2.5
              text-sm
              outline-none
              transition
              focus:border-[#5B1B20]
              focus:ring-2
              focus:ring-[#5B1B20]/10
            "
          />
        </div>

        {/* ===================================================
            GENERATE BUTTON
            =================================================== */}

        <button
          type="submit"
          className="
            group
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#5B1B20]
            py-3.5
            font-bold
            text-white
            shadow-lg
            transition-all
            duration-200
            hover:bg-[#732328]
            hover:shadow-xl
            active:scale-[0.98]
          "
        >
          <QrCode
            className="
              h-5
              w-5
              text-[#E2BA6E]
              transition-transform
              duration-200
              group-hover:scale-110
            "
          />
          Generate QR Code
        </button>
      </form>
    </div>
  );
}
