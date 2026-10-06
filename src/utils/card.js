import { COMPANY_NAME, COMPANY_WEBSITE } from "../config";

/* =========================================================
   CREATE PUBLIC QR URL
   ========================================================= */

export function createCardUrl(card) {
  const payload = {
    id: card.id,
    fullName: card.fullName || "",
    title: card.title || "",
    email: card.email || "",
    phone: card.phone || "",
    address: card.address || "",
    company: card.company || COMPANY_NAME,
    website: card.website || COMPANY_WEBSITE,
  };

  const url = new URL(
    `/card/${encodeURIComponent(card.id)}`,
    window.location.origin,
  );

  // Store complete card data inside the QR URL.
  url.searchParams.set("data", JSON.stringify(payload));

  return url.toString();
}

/* =========================================================
   VCARD
   ========================================================= */

export function generateVCard(card) {
  if (!card) return "";

  return `BEGIN:VCARD
VERSION:3.0
FN:${card.fullName || ""}
TITLE:${card.title || ""}
ORG:Aaryans Group of Companies
TEL;TYPE=CELL:${card.phone || ""}
EMAIL:${card.email || ""}
ADR;TYPE=WORK:;;${(card.address || "").replace(/\n/g, ", ")}
URL:https://www.aaryans.group
END:VCARD`;
}

/* =========================================================
   DOWNLOAD VCARD
   ========================================================= */

export function downloadVCard(card) {
  const vcard = generateVCard(card);

  const blob = new Blob([vcard], {
    type: "text/vcard;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `${card.fullName || "business-card"}.vcf`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/* =========================================================
   BUILD NEW CARD OBJECT
   ========================================================= */

export function buildCard(formData) {
  const cleanName =
    formData.fullName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "card";

  return {
    id: `${cleanName}-${Date.now()}`,

    fullName: formData.fullName.trim(),

    title: formData.title.trim(),

    email: formData.email.trim(),

    phone: formData.phone.trim(),

    address: formData.address.trim(),

    company: COMPANY_NAME,

    website: COMPANY_WEBSITE,

    createdAt: new Date().toLocaleDateString("en-IN"),
  };
}
