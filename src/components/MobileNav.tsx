import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, HeartHandshake, ListChecks, Map, Flame, Settings } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/find", label: "Find", icon: Search },
  { to: "/register", label: "Donate", icon: HeartHandshake },
  { to: "/requests", label: "Requests", icon: ListChecks },
  { to: "/map", label: "Map", icon: Map },
  { to: "/heatmap", label: "Heatmap", icon: Flame },
  { to: "/admin", label: "Admin", icon: Settings },
] as const;

export function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border">
      <div className="grid grid-cols-7">
        {ITEMS.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] relative transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {active && (
                <span className="absolute top-0 inset-x-3 h-[2px] bg-primary rounded-full" />
              )}
              <Icon size={18} />
              <span
                className="font-mono"
                style={{
                  fontSize: 8,
                  letterSpacing: "0.5px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
