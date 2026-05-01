import { Droplet } from "lucide-react";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-50 animate-rs-pulse-soft" />
        <Droplet
          size={size}
          className="relative text-primary fill-primary animate-rs-pulse-soft"
        />
      </div>
      <div className="leading-tight">
        <div className="font-serif font-bold text-xl tracking-tight">
          <span className="text-foreground">Rakt</span>
          <span style={{ color: "#dc2626" }}>Setu</span>
        </div>
      </div>
    </div>
  );
}
