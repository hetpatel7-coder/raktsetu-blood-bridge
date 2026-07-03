import { CheckCircle2, ShieldAlert } from "lucide-react";

/**
 * HOSPITAL VERIFIED — donor has donations_count > 0 (verified at a real blood bank).
 * SELF DECLARED   — new donor with donations_count = 0 (declaration only).
 */
export function DonorBadge({ donationsCount }: { donationsCount: number }) {
  const verified = donationsCount > 0;
  if (verified) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full font-mono uppercase"
        style={{
          background: "rgba(34,197,94,0.12)",
          border: "1px solid rgba(34,197,94,0.35)",
          color: "#22c55e",
          fontSize: 9,
          letterSpacing: "1px",
          padding: "3px 8px",
          lineHeight: 1,
        }}
      >
        <CheckCircle2 size={10} strokeWidth={2.5} /> Hospital Verified
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-mono uppercase"
      style={{
        background: "rgba(234,179,8,0.12)",
        border: "1px solid rgba(234,179,8,0.35)",
        color: "#eab308",
        fontSize: 9,
        letterSpacing: "1px",
        padding: "3px 8px",
        lineHeight: 1,
      }}
    >
      <ShieldAlert size={10} strokeWidth={2.5} /> Self Declared
    </span>
  );
}
