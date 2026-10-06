import { CheckCircle2, X } from "lucide-react";

/* =========================================================
   SUCCESS TOAST
   ========================================================= */

export default function SuccessToast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-[100] bg-white border border-[#E2BA6E] shadow-2xl rounded-2xl p-4 flex items-center gap-3">
      <CheckCircle2 className="w-6 h-6 text-green-600" />
      <div>
        <p className="font-bold text-sm">Changes Saved</p>
        <p className="text-xs text-slate-500">{message}</p>
      </div>
      <button onClick={onClose}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
