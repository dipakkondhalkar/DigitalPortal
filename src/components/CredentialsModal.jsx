import { useState } from "react";
import { X } from "lucide-react";

/* =========================================================
   UPDATE ADMIN CREDENTIALS MODAL
   ========================================================= */

export default function CredentialsModal({ adminCreds, onSave, onClose }) {
  const [newUsername, setNewUsername] = useState(adminCreds?.username || "");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      username: newUsername.trim(),
      password: newPassword || adminCreds.password,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full relative">
        <button onClick={onClose} className="absolute right-4 top-4">
          <X />
        </button>

        <h2 className="font-bold text-lg mb-5">Update Admin Credentials</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full border rounded-xl p-3 text-sm"
          />

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (leave blank to keep current)"
            autoComplete="new-password"
            className="w-full border rounded-xl p-3 text-sm"
          />

          <button
            type="submit"
            className="w-full bg-[#5B1B20] text-white py-3 rounded-xl font-bold text-sm"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
