import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-IDUWrsFe.js";
import { s as supabase, T as Trophy, b as Link } from "./router-dIrcSwBL.js";
import { C as CircleCheck } from "./circle-check-GaPsBfnK.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const MEDAL = {
  gold: {
    color: "#f59e0b",
    glow: "0 0 40px rgba(245,158,11,0.55)",
    emoji: "🥇"
  },
  silver: {
    color: "#94a3b8",
    glow: "0 0 28px rgba(148,163,184,0.45)",
    emoji: "🥈"
  },
  bronze: {
    color: "#b45309",
    glow: "0 0 28px rgba(180,83,9,0.45)",
    emoji: "🥉"
  }
};
function LeaderboardPage() {
  const [donors, setDonors] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data
      } = await supabase.from("donors").select("id, name, blood_type, city, donations_count, verified").order("donations_count", {
        ascending: false
      }).limit(20);
      setDonors(data ?? []);
      setLoading(false);
    })();
  }, []);
  const stats = reactExports.useMemo(() => {
    if (donors.length === 0) return null;
    const total = donors.reduce((s, d) => s + (d.donations_count || 0), 0);
    const btCounts = {};
    const cityCounts = {};
    for (const d of donors) {
      btCounts[d.blood_type] = (btCounts[d.blood_type] || 0) + (d.donations_count || 0);
      cityCounts[d.city] = (cityCounts[d.city] || 0) + (d.donations_count || 0);
    }
    const topBt = Object.entries(btCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    return {
      total,
      topBt,
      topCity
    };
  }, [donors]);
  const top3 = donors.slice(0, 3);
  const rest = donors.slice(3);
  const [first, second, third] = top3;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-2 animate-rs-fade-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-eyebrow flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 11 }),
        " Donor Leaderboard"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif font-bold text-4xl sm:text-5xl leading-tight", children: [
        "Gujarat's ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          color: "#dc2626"
        }, children: "Heroes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rs-body", children: "Top donors saving lives across Gujarat" })
    ] }),
    stats && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBox, { label: "Total Donations", value: String(stats.total) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBox, { label: "Top Blood Type", value: stats.topBt }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBox, { label: "Most Active City", value: stats.topCity })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-skeleton h-64 rounded-2xl" }),
      [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-skeleton h-14 rounded-xl" }, i))
    ] }),
    !loading && donors.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-10 text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl", children: "🩸" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif font-bold text-2xl", children: "No donors yet. Be the first hero." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "rs-btn rs-btn-primary inline-flex", children: "Register as Donor" })
    ] }),
    !loading && donors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 sm:gap-5 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PodiumCard, { donor: second, medal: "silver", rank: 2, size: "md" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PodiumCard, { donor: first, medal: "gold", rank: 1, size: "lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PodiumCard, { donor: third, medal: "bronze", rank: 3, size: "md" })
      ] }) }),
      rest.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-eyebrow", children: [
          "Ranks 4–",
          donors.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-card overflow-hidden", children: rest.map((d, i) => {
          const rank = i + 4;
          const altBg = i % 2 === 0 ? "#111111" : "#0e0e0e";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group flex items-center gap-3 px-4 py-3 transition-all border-l-2 border-transparent hover:border-primary animate-rs-fade-up", style: {
            background: altBg,
            animationDelay: `${i * 30}ms`
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-bold w-8 text-center", style: {
              color: "#dc2626",
              fontSize: 14
            }, children: rank }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs", style: {
              background: "#1a0707",
              color: "#dc2626",
              border: "1px solid rgba(220,38,38,0.3)"
            }, children: d.blood_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif font-bold truncate", children: d.name }),
                d.verified && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13, className: "text-success shrink-0" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-pill text-text-muted truncate", children: d.city })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-bold text-base", children: d.donations_count }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-pill text-text-muted", children: "donations" })
            ] })
          ] }, d.id);
        }) })
      ] })
    ] })
  ] });
}
function StatBox({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-pill text-text-muted", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-bold text-2xl mt-1.5", style: {
      color: "#dc2626"
    }, children: value })
  ] });
}
function PodiumCard({
  donor,
  medal,
  rank,
  size
}) {
  if (!donor) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-card p-4 opacity-30 text-center font-mono text-xs", children: "—" });
  }
  const m = MEDAL[medal];
  const isLg = size === "lg";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl sm:text-3xl mb-1", "aria-hidden": true, children: m.emoji }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-4 sm:p-5 w-full animate-rs-fade-up", style: {
      border: `2px solid ${m.color}`,
      boxShadow: m.glow,
      animationDelay: `${(4 - rank) * 80}ms`
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto rounded-full flex items-center justify-center font-mono font-bold text-white mb-3", style: {
        width: isLg ? 64 : 52,
        height: isLg ? 64 : 52,
        fontSize: isLg ? 20 : 16,
        background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)`,
        boxShadow: m.glow
      }, children: donor.blood_type }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif font-bold leading-tight truncate", style: {
        fontSize: isLg ? 18 : 15
      }, children: donor.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-pill text-text-muted mt-1 truncate", children: [
        "📍 ",
        donor.city
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-bold mt-3 leading-none", style: {
        fontSize: isLg ? 48 : 34,
        color: m.color
      }, children: donor.donations_count }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-pill text-text-muted mt-1", children: "Donations" }),
      donor.verified && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mt-2 text-success", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rs-pill", style: {
          color: "var(--success)"
        }, children: "Verified" })
      ] })
    ] })
  ] });
}
export {
  LeaderboardPage as component
};
