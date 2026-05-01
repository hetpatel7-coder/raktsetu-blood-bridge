import { X } from "lucide-react";
import { useEffect } from "react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 rs-backdrop animate-rs-fade-up"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md sm:mx-4 bg-card border border-border rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-rs-slide-up shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif font-bold text-xl">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
