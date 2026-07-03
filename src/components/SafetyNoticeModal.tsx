import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onCancel: () => void;
  onProceed: () => void;
};

/**
 * Legal disclaimer shown before any Call / WhatsApp action on a donor card.
 * Dark card, red border, DM Sans body.
 */
export function SafetyNoticeModal({ open, onCancel, onProceed }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-notice-title"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 animate-rs-fade-up"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl p-6 space-y-5"
        style={{
          background: "#0a0a0a",
          border: "1.5px solid #dc2626",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          boxShadow: "0 20px 60px rgba(220,38,38,0.25), 0 0 0 1px rgba(220,38,38,0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.4)" }}
          >
            <AlertTriangle size={18} color="#dc2626" />
          </div>
          <h2
            id="safety-notice-title"
            className="font-serif font-bold text-xl"
            style={{ color: "#f5f5f0" }}
          >
            Safety Notice
          </h2>
        </div>

        <p style={{ color: "#c8c8c0", fontSize: 14, lineHeight: 1.6 }}>
          RaktSetu connects donors and patients for emergency situations only. All blood
          transfusions must be performed at a certified hospital under qualified medical
          supervision. RaktSetu is not a medical service and bears no medical liability.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rs-btn rs-btn-secondary !py-3 order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onProceed}
            className="rs-btn rs-btn-primary !py-3 order-1 sm:order-2"
          >
            I Understand — Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
