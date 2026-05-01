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
        <div className="font-mono font-medium text-3xl sm:text-4xl text-primary leading-none">
          {n}
        </div>
      )}
      <div className="rs-pill text-muted-foreground mt-2">
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
      accent: "Donor",
      desc: "Search verified donors by blood type",
      icon: Search,
    },
    {
      to: "/register" as const,
      emoji: "🩸",
      title: "Be a Donor",
      accent: "Donor",
      desc: "Register and join our network",
      icon: HeartHandshake,
    },
    {
      to: "/requests" as const,
      emoji: "📋",
      title: "Live Requests",
      accent: "Live",
      desc: "View active requests near you",
      icon: ListChecks,
    },
    {
      to: "/admin" as const,
      emoji: "⚙️",
      title: "Admin Panel",
      accent: "Admin",
      desc: "Dashboard for hospitals and blood banks",
      icon: Settings,
    },
  ];

  return (
    <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 pt-6 lg:pt-10 space-y-10">
      {/* Hero */}
      <header className="text-center lg:text-left pt-2 space-y-3">
        <div className="rs-tagline-gu">Ek Boond · Ek Zindagi</div>
        <h1 className="font-serif font-black text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
          <span className="text-foreground">Rakt</span>
          <span style={{ color: "#dc2626" }}>Setu</span>
        </h1>
        <p className="rs-tagline-en">
          One Drop, One Life — Gujarat's Blood Bridge
        </p>
      </header>

      {/* Live stats */}
      <section className="space-y-3 animate-rs-fade-up">
        <div className="rs-eyebrow">Live Network</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard value={stats.donors} label="Active Donors" loading={loading} />
          <StatCard value={stats.saved} label="Lives Saved" loading={loading} />
          <StatCard value={stats.today} label="Requests Today" loading={loading} />
          <StatCard value={stats.cities} label="Cities Covered" loading={loading} />
        </div>
      </section>

      {/* SOS */}
      <button
        onClick={() => setSosOpen(true)}
        className="w-full rounded-2xl p-5 text-left animate-rs-pulse-glow"
        style={{
          background: "linear-gradient(135deg, #ef4444, #991b1b)",
          boxShadow: "0 8px 24px -8px rgba(220, 38, 38, 0.6)",
        }}
      >
        <div className="flex items-center gap-3">
          <Siren size={22} className="text-white shrink-0" />
          <div className="min-w-0">
            <div
              className="font-mono uppercase text-white"
              style={{ fontSize: 13, letterSpacing: "1px", fontWeight: 500 }}
            >
              Emergency SOS — Need Blood Now
            </div>
            <div
              className="mt-1"
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 300,
                fontSize: 11,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              Alerts all compatible donors instantly
            </div>
          </div>
        </div>
      </button>

      {/* Share with someone */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          `🩸 RaktSetu — Real-time blood donor network for Gujarat.\n\nFind verified donors near you in seconds, or register to save lives.\n\nraktsetu.lovable.app\n\n— Ek Boond, Ek Zindagi`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="-mt-6 mx-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-mono uppercase active:scale-95 transition-transform"
        style={{
          background: "rgba(37,211,102,0.08)",
          border: "1px solid rgba(37,211,102,0.25)",
          color: "#25d366",
          fontSize: 11,
          letterSpacing: "1px",
        }}
      >
        💬 Share RaktSetu with someone who might need it
      </a>

      {/* Actions */}
      <section className="space-y-3 animate-rs-fade-up" style={{ animationDelay: "60ms" }}>
        <div className="rs-eyebrow">Quick Actions</div>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((a, i) => {
            const [pre, post] = a.title.split(a.accent);
            return (
              <Link
                key={a.to}
                to={a.to}
                className="rs-card rs-card-hover p-5 block group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="text-3xl mb-3">{a.emoji}</div>
                <div className="font-serif font-bold text-lg leading-tight">
                  <span className="text-foreground">{pre}</span>
                  <span style={{ color: "#dc2626" }}>{a.accent}</span>
                  <span className="text-foreground">{post}</span>
                </div>
                <div className="rs-body-sm mt-1.5">{a.desc}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <div className="rs-eyebrow">How It Works</div>
        <h2 className="font-serif font-bold text-3xl leading-tight">
          Three Steps to <span style={{ color: "#dc2626" }}>Save</span> a Life
        </h2>
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          {[
            {
              n: "01",
              t: "Select Blood Type & Location",
              d: "Choose blood group and city. We instantly query thousands of verified donors.",
            },
            {
              n: "02",
              t: "AI Finds Compatible Donors",
              d: "Our engine ranks donors by compatibility, proximity, and availability in real time.",
            },
            {
              n: "03",
              t: "Connect Directly in Seconds",
              d: "Call or WhatsApp the donor directly. No middleman. No delay. Life saved.",
            },
          ].map((s) => (
            <div key={s.n} className="rs-card p-5">
              <div
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "2px",
                  color: "#dc2626",
                  fontWeight: 500,
                }}
              >
                STEP {s.n}
              </div>
              <div className="font-serif font-bold text-lg mt-2 leading-snug">
                {s.t}
              </div>
              <div className="rs-body-sm mt-2 leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 pb-6 text-center space-y-1.5">
        <p
          className="font-serif font-bold"
          style={{ fontSize: 13, color: "#333" }}
        >
          RaktSetu · Gujarat, India
        </p>
        <p
          className="font-mono"
          style={{
            fontSize: 10,
            color: "#dc2626",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Saving lives · one connection at a time
        </p>
      </footer>

      <SosModal open={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}
