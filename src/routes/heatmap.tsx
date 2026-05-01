import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BLOOD_TYPES, type BloodType } from "@/lib/blood";

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "Blood Stock Heatmap — RaktSetu" },
      { name: "description", content: "Real-time city-wise blood shortage heatmap across Gujarat." },
      { property: "og:title", content: "Blood Stock Heatmap — RaktSetu" },
      { property: "og:description", content: "Live shortage map across 5 Gujarat cities." },
    ],
  }),
  component: HeatmapPage,
});

const CITIES = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"] as const;
type City = (typeof CITIES)[number];

type Level = "critical" | "low" | "moderate" | "good";

const LEVEL_BG: Record<Level, string> = {
  critical: "#7f1d1d",
  low: "#78350f",
  moderate: "#713f12",
  good: "#14532d",
};
const LEVEL_LABEL: Record<Level, string> = {
  critical: "CRITICAL",
  low: "LOW",
  moderate: "MODERATE",
  good: "GOOD",
};

function getLevel(count: number): Level {
  if (count === 0) return "critical";
  if (count <= 2) return "low";
  if (count <= 5) return "moderate";
  return "good";
}

type Counts = Record<City, Record<BloodType, number>>;
function emptyCounts(): Counts {
  const out = {} as Counts;
  for (const c of CITIES) {
    out[c] = {} as Record<BloodType, number>;
    for (const b of BLOOD_TYPES) out[c][b] = 0;
  }
  return out;
}

function timeAgo(d: Date | null): string {
  if (!d) return "—";
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min${m > 1 ? "s" : ""} ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

/* ---------------- AnimatedNumber ---------------- */
function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [n, setN] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  useEffect(() => {
    fromRef.current = n;
    startRef.current = null;
    let raf = 0;
    const tick = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(fromRef.current + (value - fromRef.current) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{n}</>;
}

/* ---------------- Page ---------------- */
function HeatmapPage() {
  const [counts, setCounts] = useState<Counts>(() => emptyCounts());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [, force] = useState(0);
  const firstLoad = useRef(true);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data, error: e } = await supabase
        .from("donors")
        .select("city, blood_type, available")
        .eq("available", true);
      if (e) throw e;
      const next = emptyCounts();
      for (const r of data ?? []) {
        const c = r.city as City;
        const b = r.blood_type as BloodType;
        if (CITIES.includes(c) && (BLOOD_TYPES as readonly string[]).includes(b)) {
          next[c][b]++;
        }
      }
      setCounts(next);
      setUpdatedAt(new Date());
      setError(null);
      if (silent && !firstLoad.current) toast.success("Heatmap refreshed");
      firstLoad.current = false;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load donors";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const poll = setInterval(() => fetchData(true), 60_000);
    const tick = setInterval(() => force((n) => n + 1), 15_000);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Derived */
  const cityTotals = useMemo(() => {
    const out: Record<City, number> = {} as Record<City, number>;
    for (const c of CITIES) out[c] = BLOOD_TYPES.reduce((s, b) => s + counts[c][b], 0);
    return out;
  }, [counts]);

  const cityWorst = useMemo(() => {
    const out: Record<City, { type: BloodType; count: number; level: Level }> = {} as Record<
      City,
      { type: BloodType; count: number; level: Level }
    >;
    for (const c of CITIES) {
      let worst: BloodType = BLOOD_TYPES[0];
      let worstCount = Infinity;
      for (const b of BLOOD_TYPES) {
        if (counts[c][b] < worstCount) {
          worstCount = counts[c][b];
          worst = b;
        }
      }
      out[c] = { type: worst, count: worstCount, level: getLevel(worstCount) };
    }
    return out;
  }, [counts]);

  const criticalCells = useMemo(() => {
    const out: { city: City; type: BloodType }[] = [];
    for (const c of CITIES)
      for (const b of BLOOD_TYPES) if (counts[c][b] === 0) out.push({ city: c, type: b });
    return out;
  }, [counts]);

  const statewideTotals = useMemo(() => {
    const out: Record<BloodType, number> = {} as Record<BloodType, number>;
    for (const b of BLOOD_TYPES)
      out[b] = CITIES.reduce((s, c) => s + counts[c][b], 0);
    return out;
  }, [counts]);

  const mostNeeded = useMemo(() => {
    return [...BLOOD_TYPES]
      .map((b) => ({ type: b, count: statewideTotals[b] }))
      .sort((a, b) => a.count - b.count)
      .slice(0, 3);
  }, [statewideTotals]);

  const scrollToCity = (city: City) => {
    const el = document.getElementById(`city-${city}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-10">
      {/* Header */}
      <header className="space-y-2 animate-rs-fade-up">
        <div className="rs-eyebrow flex items-center gap-2">
          <Flame size={11} /> Live Heatmap
        </div>
        <h1 className="font-serif font-bold text-4xl sm:text-5xl leading-tight">
          Blood <span style={{ color: "#dc2626" }}>Stock</span>
        </h1>
        <p className="rs-body">Real-time shortage map across Gujarat</p>
        <div className="flex items-center gap-3 pt-1">
          <span className="rs-pill text-text-muted">Updated {timeAgo(updatedAt)}</span>
          <button
            onClick={() => fetchData()}
            className="rs-pill text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="rs-card p-4 border-primary/40 flex items-center justify-between">
          <div>
            <div className="rs-pill text-primary">Error</div>
            <p className="rs-body mt-1">{error}</p>
          </div>
          <button onClick={() => fetchData()} className="rs-btn rs-btn-secondary">
            Retry
          </button>
        </div>
      )}

      {/* Section 1 — City Overview Cards */}
      <section className="space-y-3">
        <div className="rs-eyebrow">Cities</div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CITIES.map((c) => {
            const total = cityTotals[c];
            const hasCritical = BLOOD_TYPES.some((b) => counts[c][b] === 0);
            const hasLow = BLOOD_TYPES.some((b) => counts[c][b] >= 1 && counts[c][b] <= 2);
            const status: Level = hasCritical ? "critical" : hasLow ? "low" : "good";
            const worst = cityWorst[c];
            return (
              <button
                key={c}
                onClick={() => scrollToCity(c)}
                className="rs-card rs-card-hover text-left p-4 min-w-[200px] flex-shrink-0"
              >
                <div className="flex items-center justify-between">
                  <div className="font-serif font-bold text-lg">📍 {c}</div>
                  <span
                    className="rs-pill px-2 py-0.5 rounded"
                    style={{
                      background: LEVEL_BG[status],
                      color: "#fff",
                    }}
                  >
                    {status === "critical" ? "CRITICAL" : status === "low" ? "LOW STOCK" : "STABLE"}
                  </span>
                </div>
                <div className="mt-3 font-mono text-2xl font-bold">
                  {loading ? "—" : <AnimatedNumber value={total} />}
                </div>
                <div className="rs-body-sm mt-0.5">total available</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rs-pill text-text-muted">Most needed</span>
                  <span
                    className="font-mono font-bold text-sm px-2 py-0.5 rounded"
                    style={{ background: "#1a0707", color: "#dc2626" }}
                  >
                    {worst.type}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 2 — Heatmap Table */}
      <section className="space-y-3">
        <div className="rs-eyebrow">Heatmap</div>
        <div className="rs-card p-4 overflow-x-auto">
          <table className="w-full border-separate" style={{ borderSpacing: 4 }}>
            <thead>
              <tr>
                <th className="text-left">
                  <span className="rs-pill text-text-muted">City</span>
                </th>
                {BLOOD_TYPES.map((b) => (
                  <th key={b}>
                    <span
                      className="font-mono font-bold text-xs px-2 py-1 rounded inline-block"
                      style={{ background: "#1a0707", color: "#dc2626", letterSpacing: "0.5px" }}
                    >
                      {b}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CITIES.map((c, ci) => (
                <tr key={c}>
                  <td className="pr-3 align-middle">
                    <div className="font-bold text-sm">📍 {c}</div>
                    <div className="rs-pill text-text-muted">{c.toLowerCase()}</div>
                  </td>
                  {BLOOD_TYPES.map((b, bi) => {
                    const count = counts[c][b];
                    const level = getLevel(count);
                    const idx = ci * BLOOD_TYPES.length + bi;
                    return (
                      <td key={b}>
                        <div
                          title={`${c} — ${b}: ${count} donor${count === 1 ? "" : "s"} available`}
                          className={`flex items-center justify-center rounded-lg transition-all duration-300 hover:brightness-150 cursor-default ${
                            level === "critical" ? "animate-rs-pulse-soft" : ""
                          }`}
                          style={{
                            minWidth: 52,
                            minHeight: 52,
                            background: LEVEL_BG[level],
                            border: "1px solid rgba(255,255,255,0.05)",
                            animation: loading
                              ? undefined
                              : `rs-fade-up 400ms ease-out ${idx * 30}ms both`,
                          }}
                        >
                          <span className="font-mono font-bold text-white text-base">
                            {loading ? "·" : <AnimatedNumber value={count} />}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3 — Legend */}
      <section className="rs-card p-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="rs-pill text-text-muted">Legend</span>
          {(["good", "moderate", "low", "critical"] as Level[]).map((lv) => (
            <div key={lv} className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 rounded"
                style={{ background: LEVEL_BG[lv], border: "1px solid rgba(255,255,255,0.05)" }}
              />
              <span className="rs-pill">
                {LEVEL_LABEL[lv]}{" "}
                <span className="text-text-muted ml-1">
                  {lv === "good"
                    ? "(6+)"
                    : lv === "moderate"
                    ? "(3–5)"
                    : lv === "low"
                    ? "(1–2)"
                    : "(0)"}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 — Critical Alerts */}
      <section className="space-y-3">
        <div className="rs-eyebrow flex items-center gap-2">
          <AlertTriangle size={11} /> Critical Shortages
        </div>
        {criticalCells.length === 0 ? (
          <div
            className="rs-card p-6 flex items-center gap-3"
            style={{ borderColor: "rgba(34,197,94,0.4)" }}
          >
            <CheckCircle2 size={24} className="text-success" />
            <div>
              <div className="font-serif font-bold text-lg text-success">
                All blood types stocked across Gujarat ✓
              </div>
              <div className="rs-body-sm">No critical shortages detected.</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {criticalCells.map(({ city, type }, i) => (
              <div
                key={`${city}-${type}`}
                className="rs-card p-4 relative animate-rs-pulse-glow"
                style={{
                  borderLeft: "3px solid #dc2626",
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div
                      className="font-serif font-bold"
                      style={{ fontSize: 28, color: "#dc2626", lineHeight: 1 }}
                    >
                      {type}
                    </div>
                    <div className="rs-body-sm mt-1">{city}</div>
                    <div
                      className="font-mono text-xs mt-2"
                      style={{ color: "#dc2626", letterSpacing: "0.5px" }}
                    >
                      0 DONORS AVAILABLE
                    </div>
                  </div>
                  <Link to="/requests" className="rs-btn rs-btn-primary !py-2 !px-3 text-[10px]">
                    Post Request
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 5 — City Detail Breakdown */}
      <section className="space-y-4">
        <div className="rs-eyebrow">City Breakdown</div>
        {CITIES.map((c) => {
          const total = cityTotals[c];
          const hasCritical = BLOOD_TYPES.some((b) => counts[c][b] === 0);
          const hasLow = BLOOD_TYPES.some((b) => counts[c][b] >= 1 && counts[c][b] <= 2);
          const status: Level = hasCritical ? "critical" : hasLow ? "low" : "good";
          const max = Math.max(1, ...BLOOD_TYPES.map((b) => counts[c][b]));
          return (
            <div key={c} id={`city-${c}`} className="rs-card p-5 scroll-mt-24">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-serif font-bold text-xl">📍 {c}</div>
                  <div className="rs-body-sm">{total} donors available</div>
                </div>
                <span
                  className="rs-pill px-2 py-0.5 rounded"
                  style={{ background: LEVEL_BG[status], color: "#fff" }}
                >
                  {status === "critical" ? "CRITICAL" : status === "low" ? "LOW STOCK" : "STABLE"}
                </span>
              </div>
              <div className="space-y-2">
                {BLOOD_TYPES.map((b, i) => {
                  const v = counts[c][b];
                  const lv = getLevel(v);
                  const pct = (v / max) * 100;
                  return (
                    <div key={b} className="flex items-center gap-3">
                      <div
                        className="font-mono font-bold text-xs w-10"
                        style={{ color: "#dc2626" }}
                      >
                        {b}
                      </div>
                      <div
                        className="flex-1 h-6 rounded overflow-hidden"
                        style={{ background: "#0c0c0c" }}
                      >
                        <div
                          className="h-full rounded transition-all duration-700 ease-out"
                          style={{
                            width: loading ? "0%" : `${pct}%`,
                            background: LEVEL_BG[lv],
                            transitionDelay: `${i * 60}ms`,
                          }}
                        />
                      </div>
                      <div className="font-mono font-bold text-sm w-8 text-right">
                        <AnimatedNumber value={v} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Section 6 — Most Needed Statewide */}
      <section className="space-y-3">
        <div className="rs-eyebrow">Statewide Priority</div>
        <div className="rs-card p-6">
          <h2 className="font-serif font-bold text-2xl mb-1">
            Most Needed <span style={{ color: "#dc2626" }}>Across Gujarat</span>
          </h2>
          <p className="rs-body-sm mb-6">Lowest available donor counts statewide</p>
          <div className="flex items-end justify-center gap-4 sm:gap-8 flex-wrap">
            {mostNeeded.map((m, i) => {
              const sizes = [120, 92, 76];
              const fonts = [44, 32, 26];
              const glow = [
                "0 0 60px rgba(220,38,38,0.7)",
                "0 0 32px rgba(220,38,38,0.45)",
                "0 0 20px rgba(220,38,38,0.3)",
              ];
              return (
                <div key={m.type} className="flex flex-col items-center text-center">
                  <div className="rs-pill text-text-muted mb-2">#{i + 1}</div>
                  <div
                    className="rounded-2xl flex items-center justify-center font-serif font-bold text-white"
                    style={{
                      width: sizes[i],
                      height: sizes[i],
                      fontSize: fonts[i],
                      background:
                        "linear-gradient(135deg, oklch(0.58 0.22 27), oklch(0.42 0.18 27))",
                      boxShadow: glow[i],
                    }}
                  >
                    {m.type}
                  </div>
                  <div className="rs-body-sm mt-3">
                    Only <span className="font-mono font-bold text-foreground">{m.count}</span>{" "}
                    donor{m.count === 1 ? "" : "s"} statewide
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
