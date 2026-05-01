import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Donor Leaderboard — RaktSetu" },
      { name: "description", content: "Top blood donors saving lives across Gujarat." },
      { property: "og:title", content: "Donor Leaderboard — RaktSetu" },
      { property: "og:description", content: "Gujarat's heroes — ranked by donations." },
    ],
  }),
  component: LeaderboardPage,
});

type Donor = {
  id: string;
  name: string;
  blood_type: string;
  city: string;
  donations_count: number;
  verified: boolean;
};

const MEDAL = {
  gold: { color: "#f59e0b", glow: "0 0 40px rgba(245,158,11,0.55)", emoji: "🥇" },
  silver: { color: "#94a3b8", glow: "0 0 28px rgba(148,163,184,0.45)", emoji: "🥈" },
  bronze: { color: "#b45309", glow: "0 0 28px rgba(180,83,9,0.45)", emoji: "🥉" },
} as const;

function LeaderboardPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("donors")
        .select("id, name, blood_type, city, donations_count, verified")
        .order("donations_count", { ascending: false })
        .limit(20);
      setDonors((data ?? []) as Donor[]);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    if (donors.length === 0) return null;
    const total = donors.reduce((s, d) => s + (d.donations_count || 0), 0);
    const btCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    for (const d of donors) {
      btCounts[d.blood_type] = (btCounts[d.blood_type] || 0) + (d.donations_count || 0);
      cityCounts[d.city] = (cityCounts[d.city] || 0) + (d.donations_count || 0);
    }
    const topBt = Object.entries(btCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    return { total, topBt, topCity };
  }, [donors]);

  const top3 = donors.slice(0, 3);
  const rest = donors.slice(3);
  const [first, second, third] = top3;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-8">
      {/* Header */}
      <header className="space-y-2 animate-rs-fade-up">
        <div className="rs-eyebrow flex items-center gap-2">
          <Trophy size={11} /> Donor Leaderboard
        </div>
        <h1 className="font-serif font-bold text-4xl sm:text-5xl leading-tight">
          Gujarat's <span style={{ color: "#dc2626" }}>Heroes</span>
        </h1>
        <p className="rs-body">Top donors saving lives across Gujarat</p>
      </header>

      {/* Stats bar */}
      {stats && (
        <section className="grid grid-cols-3 gap-3">
          <StatBox label="Total Donations" value={String(stats.total)} />
          <StatBox label="Top Blood Type" value={stats.topBt} />
          <StatBox label="Most Active City" value={stats.topCity} />
        </section>
      )}

      {loading && (
        <div className="space-y-3">
          <div className="rs-skeleton h-64 rounded-2xl" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="rs-skeleton h-14 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && donors.length === 0 && (
        <div className="rs-card p-10 text-center space-y-4">
          <div className="text-5xl">🩸</div>
          <div className="font-serif font-bold text-2xl">No donors yet. Be the first hero.</div>
          <Link to="/register" className="rs-btn rs-btn-primary inline-flex">
            Register as Donor
          </Link>
        </div>
      )}

      {!loading && donors.length > 0 && (
        <>
          {/* Podium */}
          <section className="pt-4">
            <div className="grid grid-cols-3 gap-3 sm:gap-5 items-end">
              <PodiumCard donor={second} medal="silver" rank={2} size="md" />
              <PodiumCard donor={first} medal="gold" rank={1} size="lg" />
              <PodiumCard donor={third} medal="bronze" rank={3} size="md" />
            </div>
          </section>

          {/* Ranks 4-20 */}
          {rest.length > 0 && (
            <section className="space-y-2">
              <div className="rs-eyebrow">Ranks 4–{donors.length}</div>
              <div className="rs-card overflow-hidden">
                {rest.map((d, i) => {
                  const rank = i + 4;
                  const altBg = i % 2 === 0 ? "#111111" : "#0e0e0e";
                  return (
                    <div
                      key={d.id}
                      className="group flex items-center gap-3 px-4 py-3 transition-all border-l-2 border-transparent hover:border-primary animate-rs-fade-up"
                      style={{ background: altBg, animationDelay: `${i * 30}ms` }}
                    >
                      <div
                        className="font-mono font-bold w-8 text-center"
                        style={{ color: "#dc2626", fontSize: 14 }}
                      >
                        {rank}
                      </div>
                      <div
                        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs"
                        style={{
                          background: "#1a0707",
                          color: "#dc2626",
                          border: "1px solid rgba(220,38,38,0.3)",
                        }}
                      >
                        {d.blood_type}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-bold truncate">{d.name}</span>
                          {d.verified && (
                            <CheckCircle2 size={13} className="text-success shrink-0" />
                          )}
                        </div>
                        <div className="rs-pill text-text-muted truncate">{d.city}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-base">{d.donations_count}</div>
                        <div className="rs-pill text-text-muted">donations</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rs-card p-4">
      <div className="rs-pill text-text-muted">{label}</div>
      <div className="font-mono font-bold text-2xl mt-1.5" style={{ color: "#dc2626" }}>
        {value}
      </div>
    </div>
  );
}

function PodiumCard({
  donor,
  medal,
  rank,
  size,
}: {
  donor: Donor | undefined;
  medal: keyof typeof MEDAL;
  rank: number;
  size: "lg" | "md";
}) {
  if (!donor) {
    return <div className="rs-card p-4 opacity-30 text-center font-mono text-xs">—</div>;
  }
  const m = MEDAL[medal];
  const isLg = size === "lg";
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-2xl sm:text-3xl mb-1" aria-hidden>
        {m.emoji}
      </div>
      <div
        className="rs-card p-4 sm:p-5 w-full animate-rs-fade-up"
        style={{
          border: `2px solid ${m.color}`,
          boxShadow: m.glow,
          animationDelay: `${(4 - rank) * 80}ms`,
        }}
      >
        <div
          className="mx-auto rounded-full flex items-center justify-center font-mono font-bold text-white mb-3"
          style={{
            width: isLg ? 64 : 52,
            height: isLg ? 64 : 52,
            fontSize: isLg ? 20 : 16,
            background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)`,
            boxShadow: m.glow,
          }}
        >
          {donor.blood_type}
        </div>
        <div
          className="font-serif font-bold leading-tight truncate"
          style={{ fontSize: isLg ? 18 : 15 }}
        >
          {donor.name}
        </div>
        <div className="rs-pill text-text-muted mt-1 truncate">📍 {donor.city}</div>
        <div
          className="font-mono font-bold mt-3 leading-none"
          style={{ fontSize: isLg ? 48 : 34, color: m.color }}
        >
          {donor.donations_count}
        </div>
        <div className="rs-pill text-text-muted mt-1">Donations</div>
        {donor.verified && (
          <div className="flex items-center justify-center gap-1 mt-2 text-success">
            <CheckCircle2 size={12} />
            <span className="rs-pill" style={{ color: "var(--success)" }}>
              Verified
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
