import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { Flame, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { b as BLOOD_TYPES, s as supabase } from "./router-BKiHaXnY.js";
import "react-hot-toast";
import "@supabase/supabase-js";
const CITIES = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"];
const LEVEL_BG = {
  critical: "#7f1d1d",
  low: "#78350f",
  moderate: "#713f12",
  good: "#14532d"
};
const LEVEL_LABEL = {
  critical: "CRITICAL",
  low: "LOW",
  moderate: "MODERATE",
  good: "GOOD"
};
function getLevel(count) {
  if (count === 0) return "critical";
  if (count <= 2) return "low";
  if (count <= 5) return "moderate";
  return "good";
}
function emptyCounts() {
  const out = {};
  for (const c of CITIES) {
    out[c] = {};
    for (const b of BLOOD_TYPES) out[c][b] = 0;
  }
  return out;
}
function timeAgo(d) {
  if (!d) return "—";
  const s = Math.floor((Date.now() - d.getTime()) / 1e3);
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min${m > 1 ? "s" : ""} ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}
function AnimatedNumber({
  value,
  duration = 800
}) {
  const [n, setN] = useState(0);
  const startRef = useRef(null);
  const fromRef = useRef(0);
  useEffect(() => {
    fromRef.current = n;
    startRef.current = null;
    let raf = 0;
    const tick = (t) => {
      if (startRef.current == null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(fromRef.current + (value - fromRef.current) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return /* @__PURE__ */ jsx(Fragment, { children: n });
}
function HeatmapPage() {
  const [counts, setCounts] = useState(() => emptyCounts());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [, force] = useState(0);
  const firstLoad = useRef(true);
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const {
        data,
        error: e
      } = await supabase.from("donors").select("city, blood_type, available").eq("available", true);
      if (e) throw e;
      const next = emptyCounts();
      for (const r of data ?? []) {
        const c = r.city;
        const b = r.blood_type;
        if (CITIES.includes(c) && BLOOD_TYPES.includes(b)) {
          next[c][b]++;
        }
      }
      setCounts(next);
      setUpdatedAt(/* @__PURE__ */ new Date());
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
    const poll = setInterval(() => fetchData(true), 6e4);
    const tick = setInterval(() => force((n) => n + 1), 15e3);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
    };
  }, []);
  const cityTotals = useMemo(() => {
    const out = {};
    for (const c of CITIES) out[c] = BLOOD_TYPES.reduce((s, b) => s + counts[c][b], 0);
    return out;
  }, [counts]);
  const cityWorst = useMemo(() => {
    const out = {};
    for (const c of CITIES) {
      let worst = BLOOD_TYPES[0];
      let worstCount = Infinity;
      for (const b of BLOOD_TYPES) {
        if (counts[c][b] < worstCount) {
          worstCount = counts[c][b];
          worst = b;
        }
      }
      out[c] = {
        type: worst,
        count: worstCount,
        level: getLevel(worstCount)
      };
    }
    return out;
  }, [counts]);
  const criticalCells = useMemo(() => {
    const out = [];
    for (const c of CITIES) for (const b of BLOOD_TYPES) if (counts[c][b] === 0) out.push({
      city: c,
      type: b
    });
    return out;
  }, [counts]);
  const statewideTotals = useMemo(() => {
    const out = {};
    for (const b of BLOOD_TYPES) out[b] = CITIES.reduce((s, c) => s + counts[c][b], 0);
    return out;
  }, [counts]);
  const mostNeeded = useMemo(() => {
    return [...BLOOD_TYPES].map((b) => ({
      type: b,
      count: statewideTotals[b]
    })).sort((a, b) => a.count - b.count).slice(0, 3);
  }, [statewideTotals]);
  const scrollToCity = (city) => {
    const el = document.getElementById(`city-${city}`);
    if (el) el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-10", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-2 animate-rs-fade-up", children: [
      /* @__PURE__ */ jsxs("div", { className: "rs-eyebrow flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Flame, { size: 11 }),
        " Live Heatmap"
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "font-serif font-bold text-4xl sm:text-5xl leading-tight", children: [
        "Blood ",
        /* @__PURE__ */ jsx("span", { style: {
          color: "#dc2626"
        }, children: "Stock" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "rs-body", children: "Real-time shortage map across Gujarat" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pt-1", children: [
        /* @__PURE__ */ jsxs("span", { className: "rs-pill text-text-muted", children: [
          "Updated ",
          timeAgo(updatedAt)
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => fetchData(), className: "rs-pill text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors", "aria-label": "Refresh", children: [
          /* @__PURE__ */ jsx(RefreshCw, { size: 11 }),
          " Refresh"
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "rs-card p-4 border-primary/40 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "rs-pill text-primary", children: "Error" }),
        /* @__PURE__ */ jsx("p", { className: "rs-body mt-1", children: error })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => fetchData(), className: "rs-btn rs-btn-secondary", children: "Retry" })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "rs-eyebrow", children: "Cities" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0", children: CITIES.map((c) => {
        const total = cityTotals[c];
        const hasCritical = BLOOD_TYPES.some((b) => counts[c][b] === 0);
        const hasLow = BLOOD_TYPES.some((b) => counts[c][b] >= 1 && counts[c][b] <= 2);
        const status = hasCritical ? "critical" : hasLow ? "low" : "good";
        const worst = cityWorst[c];
        return /* @__PURE__ */ jsxs("button", { onClick: () => scrollToCity(c), className: "rs-card rs-card-hover text-left p-4 min-w-[200px] flex-shrink-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "font-serif font-bold text-lg", children: [
              "📍 ",
              c
            ] }),
            /* @__PURE__ */ jsx("span", { className: "rs-pill px-2 py-0.5 rounded", style: {
              background: LEVEL_BG[status],
              color: "#fff"
            }, children: status === "critical" ? "CRITICAL" : status === "low" ? "LOW STOCK" : "STABLE" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 font-mono text-2xl font-bold", children: loading ? "—" : /* @__PURE__ */ jsx(AnimatedNumber, { value: total }) }),
          /* @__PURE__ */ jsx("div", { className: "rs-body-sm mt-0.5", children: "total available" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "rs-pill text-text-muted", children: "Most needed" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-sm px-2 py-0.5 rounded", style: {
              background: "#1a0707",
              color: "#dc2626"
            }, children: worst.type })
          ] })
        ] }, c);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "rs-eyebrow", children: "Heatmap" }),
      /* @__PURE__ */ jsx("div", { className: "rs-card p-4 overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-separate", style: {
        borderSpacing: 4
      }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "text-left", children: /* @__PURE__ */ jsx("span", { className: "rs-pill text-text-muted", children: "City" }) }),
          BLOOD_TYPES.map((b) => /* @__PURE__ */ jsx("th", { children: /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-xs px-2 py-1 rounded inline-block", style: {
            background: "#1a0707",
            color: "#dc2626",
            letterSpacing: "0.5px"
          }, children: b }) }, b))
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: CITIES.map((c, ci) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsxs("td", { className: "pr-3 align-middle", children: [
            /* @__PURE__ */ jsxs("div", { className: "font-bold text-sm", children: [
              "📍 ",
              c
            ] }),
            /* @__PURE__ */ jsx("div", { className: "rs-pill text-text-muted", children: c.toLowerCase() })
          ] }),
          BLOOD_TYPES.map((b, bi) => {
            const count = counts[c][b];
            const level = getLevel(count);
            const idx = ci * BLOOD_TYPES.length + bi;
            return /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("div", { title: `${c} — ${b}: ${count} donor${count === 1 ? "" : "s"} available`, className: `flex items-center justify-center rounded-lg transition-all duration-300 hover:brightness-150 cursor-default ${level === "critical" ? "animate-rs-pulse-soft" : ""}`, style: {
              minWidth: 52,
              minHeight: 52,
              background: LEVEL_BG[level],
              border: "1px solid rgba(255,255,255,0.05)",
              animation: loading ? void 0 : `rs-fade-up 400ms ease-out ${idx * 30}ms both`
            }, children: /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-white text-base", children: loading ? "·" : /* @__PURE__ */ jsx(AnimatedNumber, { value: count }) }) }) }, b);
          })
        ] }, c)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "rs-card p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-6 gap-y-3", children: [
      /* @__PURE__ */ jsx("span", { className: "rs-pill text-text-muted", children: "Legend" }),
      ["good", "moderate", "low", "critical"].map((lv) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-block w-4 h-4 rounded", style: {
          background: LEVEL_BG[lv],
          border: "1px solid rgba(255,255,255,0.05)"
        } }),
        /* @__PURE__ */ jsxs("span", { className: "rs-pill", children: [
          LEVEL_LABEL[lv],
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-text-muted ml-1", children: lv === "good" ? "(6+)" : lv === "moderate" ? "(3–5)" : lv === "low" ? "(1–2)" : "(0)" })
        ] })
      ] }, lv))
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "rs-eyebrow flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 11 }),
        " Critical Shortages"
      ] }),
      criticalCells.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rs-card p-6 flex items-center gap-3", style: {
        borderColor: "rgba(34,197,94,0.4)"
      }, children: [
        /* @__PURE__ */ jsx(CheckCircle2, { size: 24, className: "text-success" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-serif font-bold text-lg text-success", children: "All blood types stocked across Gujarat ✓" }),
          /* @__PURE__ */ jsx("div", { className: "rs-body-sm", children: "No critical shortages detected." })
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: criticalCells.map(({
        city,
        type
      }, i) => /* @__PURE__ */ jsx("div", { className: "rs-card p-4 relative animate-rs-pulse-glow", style: {
        borderLeft: "3px solid #dc2626",
        animationDelay: `${i * 80}ms`
      }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-serif font-bold", style: {
            fontSize: 28,
            color: "#dc2626",
            lineHeight: 1
          }, children: type }),
          /* @__PURE__ */ jsx("div", { className: "rs-body-sm mt-1", children: city }),
          /* @__PURE__ */ jsx("div", { className: "font-mono text-xs mt-2", style: {
            color: "#dc2626",
            letterSpacing: "0.5px"
          }, children: "0 DONORS AVAILABLE" })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/requests", className: "rs-btn rs-btn-primary !py-2 !px-3 text-[10px]", children: "Post Request" })
      ] }) }, `${city}-${type}`)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "rs-eyebrow", children: "City Breakdown" }),
      CITIES.map((c) => {
        const total = cityTotals[c];
        const hasCritical = BLOOD_TYPES.some((b) => counts[c][b] === 0);
        const hasLow = BLOOD_TYPES.some((b) => counts[c][b] >= 1 && counts[c][b] <= 2);
        const status = hasCritical ? "critical" : hasLow ? "low" : "good";
        const max = Math.max(1, ...BLOOD_TYPES.map((b) => counts[c][b]));
        return /* @__PURE__ */ jsxs("div", { id: `city-${c}`, className: "rs-card p-5 scroll-mt-24", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "font-serif font-bold text-xl", children: [
                "📍 ",
                c
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rs-body-sm", children: [
                total,
                " donors available"
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "rs-pill px-2 py-0.5 rounded", style: {
              background: LEVEL_BG[status],
              color: "#fff"
            }, children: status === "critical" ? "CRITICAL" : status === "low" ? "LOW STOCK" : "STABLE" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: BLOOD_TYPES.map((b, i) => {
            const v = counts[c][b];
            const lv = getLevel(v);
            const pct = v / max * 100;
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "font-mono font-bold text-xs w-10", style: {
                color: "#dc2626"
              }, children: b }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 h-6 rounded overflow-hidden", style: {
                background: "#0c0c0c"
              }, children: /* @__PURE__ */ jsx("div", { className: "h-full rounded transition-all duration-700 ease-out", style: {
                width: loading ? "0%" : `${pct}%`,
                background: LEVEL_BG[lv],
                transitionDelay: `${i * 60}ms`
              } }) }),
              /* @__PURE__ */ jsx("div", { className: "font-mono font-bold text-sm w-8 text-right", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: v }) })
            ] }, b);
          }) })
        ] }, c);
      })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "rs-eyebrow", children: "Statewide Priority" }),
      /* @__PURE__ */ jsxs("div", { className: "rs-card p-6", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-serif font-bold text-2xl mb-1", children: [
          "Most Needed ",
          /* @__PURE__ */ jsx("span", { style: {
            color: "#dc2626"
          }, children: "Across Gujarat" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "rs-body-sm mb-6", children: "Lowest available donor counts statewide" }),
        /* @__PURE__ */ jsx("div", { className: "flex items-end justify-center gap-4 sm:gap-8 flex-wrap", children: mostNeeded.map((m, i) => {
          const sizes = [120, 92, 76];
          const fonts = [44, 32, 26];
          const glow = ["0 0 60px rgba(220,38,38,0.7)", "0 0 32px rgba(220,38,38,0.45)", "0 0 20px rgba(220,38,38,0.3)"];
          return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "rs-pill text-text-muted mb-2", children: [
              "#",
              i + 1
            ] }),
            /* @__PURE__ */ jsx("div", { className: "rounded-2xl flex items-center justify-center font-serif font-bold text-white", style: {
              width: sizes[i],
              height: sizes[i],
              fontSize: fonts[i],
              background: "linear-gradient(135deg, oklch(0.58 0.22 27), oklch(0.42 0.18 27))",
              boxShadow: glow[i]
            }, children: m.type }),
            /* @__PURE__ */ jsxs("div", { className: "rs-body-sm mt-3", children: [
              "Only ",
              /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-foreground", children: m.count }),
              " ",
              "donor",
              m.count === 1 ? "" : "s",
              " statewide"
            ] })
          ] }, m.type);
        }) })
      ] })
    ] })
  ] });
}
export {
  HeatmapPage as component
};
