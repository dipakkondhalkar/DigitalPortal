import { useState } from "react";

import AdminHeader from "../components/AdminHeader";
import CardForm from "../components/CardForm";
import CardDatabase from "../components/CardDatabase";
import QRModal from "../components/QRModal";
import ViewCardModal from "../components/ViewCardModal";
import EditCardModal from "../components/EditCardModal";
import CredentialsModal from "../components/CredentialsModal";
import SuccessToast from "../components/SuccessToast";
import { PHONE_REGEX } from "../config";

/* =========================================================
   DASHBOARD  (shown after admin login)
   LEFT  : Create card form + QR generation
   RIGHT : Card database with all CRUD options
   ========================================================= */

export default function Dashboard({
  cards,
  setCards,
  adminCreds,
  setAdminCreds,
  onLogout,
}) {
  const [generatedCard, setGeneratedCard] = useState(null);
  const [viewCard, setViewCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [success, setSuccess] = useState("");

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  /* CREATE */
  const createCard = (newCard) => {
    setCards((previous) => [newCard, ...previous]);
    setGeneratedCard(newCard);
  };

  /* UPDATE */
  const saveEdit = (updatedCard) => {
    if (!PHONE_REGEX.test(updatedCard.phone)) {
      showSuccess("Phone must contain 10 valid digits.");
      return;
    }

    setCards((previous) =>
      previous.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
    );

    setEditingCard(null);
    showSuccess("Card details updated successfully!");
  };

  /* DELETE */
  const deleteCard = (id) => {
    setCards((previous) => previous.filter((card) => card.id !== id));
    showSuccess("Card deleted successfully!");
  };

  /* UPDATE CREDENTIALS */
  const saveCredentials = (creds) => {
    setAdminCreds(creds);
    setShowSettings(false);
    showSuccess("Admin credentials updated successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <SuccessToast message={success} onClose={() => setSuccess("")} />

      <AdminHeader
        onOpenCredentials={() => setShowSettings(true)}
        onLogout={onLogout}
      />

      <div className="max-w-[1600px] mx-auto p-4 md:p-8 grid lg:grid-cols-2 gap-8 items-start">
        {/* LEFT : FORM */}
        <div className="max-w-xl w-full mx-auto">
          <CardForm onCreate={createCard} />
        </div>

        {/* RIGHT : DATABASE (CRUD) */}
        <div className="max-w-6xl w-full min-w-0">
          <CardDatabase
            cards={cards}
            onView={setViewCard}
            onEdit={setEditingCard}
            onDelete={deleteCard}
          />
        </div>
      </div>

      <QRModal card={generatedCard} onClose={() => setGeneratedCard(null)} />

      <ViewCardModal card={viewCard} onClose={() => setViewCard(null)} />

      {editingCard && (
        <EditCardModal
          key={editingCard.id}
          card={editingCard}
          onSave={saveEdit}
          onClose={() => setEditingCard(null)}
        />
      )}

      {showSettings && (
        <CredentialsModal
          adminCreds={adminCreds}
          onSave={saveCredentials}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
