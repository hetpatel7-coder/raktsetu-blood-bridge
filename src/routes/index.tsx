import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { SosModal } from "@/components/SosModal";
import { Search, HeartHandshake, ListChecks, Settings, Siren } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RaktSetu — Real-Time Blood Donor Network" },
      {
        name: "description",
        content:
          "Find blood donors near you in seconds. Built for Gujarat. Ek Boond, Ek Zindagi.",
      },
      { property: "og:title", content: "RaktSetu — Real-Time Blood Donor Network" },
      {
        property: "og:description",
        content: "Find compatible blood donors near you. Save lives in seconds.",
      },
    ],
  }),
  component: HomePage,
});

function useCountUp(target: number, duration = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (target <= 0) {
      setN(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function StatCard({
  value,
  label,
  loading,
}: {
  value: number;
  label: string;
  loading: boolean;
}) {
  const n = useCountUp(value);
  return (
    <div className="rs-card rs-card-hover p-4 sm:p-5">
      {loading ? (
        <div className="rs-skeleton h-9 w-16 rounded-md mb-2" />
      ) : (
        <div className="font-mono font-bold text-3xl sm:text-4xl text-primary leading-none">
          {n}
        </div>
      )}
      <div className="font-mono text-[11px] sm:text-xs text-muted-foreground mt-2 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function HomePage() {
  const [sosOpen, setSosOpen] = useState(false);
  const [stats, setStats] = useState({
    donors: 0,
    saved: 0,
    today: 0,
    cities: 5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [d, s, t] = await Promise.all([
        supabase
          .from("donors")
          .select("*", { count: "exact", head: true })
          .eq("available", true),
        supabase
          .from("blood_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "fulfilled"),
        supabase
          .from("blood_requests")
          .select("*", { count: "exact", head: true })
          .gte("created_at", today.toISOString()),
      ]);
      setStats({
        donors: d.count ?? 0,
        saved: s.count ?? 0,
        today: t.count ?? 0,
        cities: 5,
      });
      setLoading(false);
    })();
  }, []);

  const actions = [
    {
      to: "/find" as const,
      emoji: "🔍",
      title: "Find Donor",
      desc: "Search compatible donors near you",
      icon: Search,
    },
    {
      to: "/register" as const,
      emoji: "🩸",
      title: "Be a Donor",
      desc: "Join the network in 30 seconds",
      icon: HeartHandshake,
    },
    {
      to: "/requests" as const,
      emoji: "📋",
      title: "Live Requests",
      desc: "See active blood requests",
      icon: ListChecks,
    },
    {
      to: "/admin" as const,
      emoji: "⚙️",
      title: "Admin Panel",
      desc: "Manage donors and requests",
      icon: Settings,
    },
  ];

  return (
    <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 pt-6 lg:pt-10 space-y-8">
      {/* Header (mobile shows logo) */}
      <header className="lg:hidden flex flex-col items-center text-center pt-4">
        <Logo size={36} />
        <p className="font-mono text-xs text-muted-foreground mt-2">
          Ek Boond, Ek Zindagi
        </p>
      </header>

      <header className="hidden lg:block">
        <h1 className="font-serif text-5xl font-bold leading-tight">
          Real-time blood donor network
          <span className="block text-primary mt-1">for Gujarat.</span>
        </h1>
        <p className="font-mono text-sm text-muted-foreground mt-3 max-w-xl">
          Ek Boond, Ek Zindagi — One Drop, One Life.
        </p>
      </header>

      {/* Live stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-rs-fade-up">
        <StatCard value={stats.donors} label="Active Donors" loading={loading} />
        <StatCard value={stats.saved} label="Lives Saved" loading={loading} />
        <StatCard value={stats.today} label="Requests Today" loading={loading} />
        <StatCard value={stats.cities} label="Cities Covered" loading={loading} />
      </section>

      {/* SOS */}
      <button
        onClick={() => setSosOpen(true)}
        className="rs-btn rs-btn-sos w-full !py-5 text-base animate-rs-pulse-glow"
      >
        <Siren size={22} />
        EMERGENCY SOS — Need Blood NOW
      </button>

      {/* Actions */}
      <section
        className="grid grid-cols-2 gap-3 animate-rs-fade-up"
        style={{ animationDelay: "60ms" }}
      >
        {actions.map((a, i) => (
          <Link
            key={a.to}
            to={a.to}
            className="rs-card rs-card-hover p-5 block group"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="text-3xl mb-3">{a.emoji}</div>
            <div className="font-serif font-bold text-lg group-hover:text-primary transition-colors">
              {a.title}
            </div>
            <div className="font-mono text-xs text-muted-foreground mt-1">
              {a.desc}
            </div>
          </Link>
        ))}
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="font-serif font-bold text-2xl">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { n: "01", t: "Select Blood Type", d: "Pick the type you need" },
            { n: "02", t: "AI Finds Nearest Donor", d: "We match compatible donors" },
            { n: "03", t: "Connect in Seconds", d: "Call or WhatsApp instantly" },
          ].map((s) => (
            <div key={s.n} className="rs-card p-5">
              <div className="font-mono font-bold text-primary text-sm mb-2">
                STEP {s.n}
              </div>
              <div className="font-serif font-bold text-lg">{s.t}</div>
              <div className="font-mono text-xs text-muted-foreground mt-1">
                {s.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 pb-6 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          RaktSetu • Made for Gujarat 🇮🇳
        </p>
        <p className="font-mono text-[10px] text-text-muted mt-1">
          Saving lives one connection at a time
        </p>
      </footer>

      <SosModal open={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}
