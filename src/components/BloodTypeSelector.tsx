import { BLOOD_TYPES, type BloodType } from "@/lib/blood";

export function BloodTypeSelector({
  value,
  onChange,
}: {
  value: BloodType | null;
  onChange: (b: BloodType) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {BLOOD_TYPES.map((bt) => {
        const active = value === bt;
        return (
          <button
            key={bt}
            type="button"
            onClick={() => onChange(bt)}
            className={`font-mono font-bold py-3 rounded-xl border transition-all active:scale-95 ${
              active
                ? "bg-primary text-primary-foreground border-primary rs-glow"
                : "bg-card text-muted-foreground border-border hover:border-primary/60 hover:text-foreground"
            }`}
          >
            {bt}
          </button>
        );
      })}
    </div>
  );
}
