import { COMPANY_NAME, COMPANY_WEBSITE } from "../config";

/* =========================================================
   CREATE NAME SLUG
   Example:
   "Dipak Kondhalkar" -> "dipakkondhalkar"
   "Rahul Sharma"     -> "rahulsharma"
   ========================================================= */

export function createNameSlug(name) {
  return (
    String(name || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "") || "card"
  );
}

/* =========================================================
   CREATE PUBLIC CARD URL
   Example:

   https://digital-portal-orcin.vercel.app/card/dipakkondhalkar

   NO:
   ?data=...
   NO timestamp
   NO JSON
   ========================================================= */

export function createCardUrl(card) {
  if (!card) return "";

  const nameSlug = createNameSlug(card.fullName);

  return new URL(`/card/${nameSlug}`, window.location.origin).toString();
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
ORG:${card.company || COMPANY_NAME}
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
  if (!card) return;

  const vcard = generateVCard(card);

  const blob = new Blob([vcard], {
    type: "text/vcard;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;

  link.download = `${createNameSlug(card.fullName)}.vcf`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/* =========================================================
   BUILD NEW CARD
   ========================================================= */

export function buildCard(formData) {
  const cleanName =
    formData.fullName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "card";

  return {
    /*
      Internal ID.

      This can still contain timestamp because it is used
      internally by the application.

      It is NOT shown in the public URL.
    */
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
