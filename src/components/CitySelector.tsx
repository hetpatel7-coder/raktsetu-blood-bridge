import { CITIES } from "@/lib/blood";

export function CitySelector({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
      {CITIES.map((c) => {
        const active = value === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={`shrink-0 px-4 py-2 rounded-full font-mono text-sm border transition-all active:scale-95 ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/60"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
