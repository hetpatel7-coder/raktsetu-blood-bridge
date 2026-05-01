import { Link, useLocation } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Siren } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/find", label: "Find" },
  { to: "/register", label: "Donate" },
  { to: "/requests", label: "Requests" },
  { to: "/map", label: "Map" },
  { to: "/heatmap", label: "Heatmap" },
] as const;

export function DesktopNav({ onSos }: { onSos: () => void }) {
  const { pathname } = useLocation();
  return (
    <header className="hidden lg:block sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 rounded-lg font-mono transition-colors ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{
                  fontSize: 11,
                  letterSpacing: "1.5px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={onSos} className="rs-btn rs-btn-sos !py-2.5 !px-4">
          <Siren size={16} /> Emergency SOS
        </button>
      </div>
    </header>
  );
}
