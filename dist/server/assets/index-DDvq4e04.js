import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { s as supabase, S as SosModal } from "./router-BKiHaXnY.js";
import { Siren, Search, HeartHandshake, ListChecks, Settings } from "lucide-react";
import "react-hot-toast";
import "@supabase/supabase-js";
function useCountUp(target, duration = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (target <= 0) {
      setN(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t) => {
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
  loading
}) {
  const n = useCountUp(value);
  return /* @__PURE__ */ jsxs("div", { className: "rs-card rs-card-hover p-4 sm:p-5", children: [
    loading ? /* @__PURE__ */ jsx("div", { className: "rs-skeleton h-9 w-16 rounded-md mb-2" }) : /* @__PURE__ */ jsx("div", { className: "font-mono font-medium text-3xl sm:text-4xl text-primary leading-none", children: n }),
    /* @__PURE__ */ jsx("div", { className: "rs-pill text-muted-foreground mt-2", children: label })
  ] });
}
function HomePage() {
  const [sosOpen, setSosOpen] = useState(false);
  const [stats, setStats] = useState({
    donors: 0,
    saved: 0,
    today: 0,
    cities: 5
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      const [d, s, t] = await Promise.all([supabase.from("donors").select("*", {
        count: "exact",
        head: true
      }).eq("available", true), supabase.from("blood_requests").select("*", {
        count: "exact",
        head: true
      }).eq("status", "fulfilled"), supabase.from("blood_requests").select("*", {
        count: "exact",
        head: true
      }).gte("created_at", today.toISOString())]);
      setStats({
        donors: d.count ?? 0,
        saved: s.count ?? 0,
        today: t.count ?? 0,
        cities: 5
      });
      setLoading(false);
    })();
  }, []);
  const actions = [{
    to: "/find",
    emoji: "🔍",
    title: "Find Donor",
    accent: "Donor",
    desc: "Search verified donors by blood type",
    icon: Search
  }, {
    to: "/register",
    emoji: "🩸",
    title: "Be a Donor",
    accent: "Donor",
    desc: "Register and join our network",
    icon: HeartHandshake
  }, {
    to: "/requests",
    emoji: "📋",
    title: "Live Requests",
    accent: "Live",
    desc: "View active requests near you",
    icon: ListChecks
  }, {
    to: "/admin",
    emoji: "⚙️",
    title: "Admin Panel",
    accent: "Admin",
    desc: "Dashboard for hospitals and blood banks",
    icon: Settings
  }];
  return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 pt-6 lg:pt-10 space-y-10", children: [
    /* @__PURE__ */ jsxs("header", { className: "text-center lg:text-left pt-2 space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "rs-tagline-gu", children: "Ek Boond · Ek Zindagi" }),
      /* @__PURE__ */ jsxs("h1", { className: "font-serif font-black text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight", children: [
        /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "Rakt" }),
        /* @__PURE__ */ jsx("span", { style: {
          color: "#dc2626"
        }, children: "Setu" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "rs-tagline-en", children: "One Drop, One Life — Gujarat's Blood Bridge" })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-3 animate-rs-fade-up", children: [
      /* @__PURE__ */ jsx("div", { className: "rs-eyebrow", children: "Live Network" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsx(StatCard, { value: stats.donors, label: "Active Donors", loading }),
        /* @__PURE__ */ jsx(StatCard, { value: stats.saved, label: "Lives Saved", loading }),
        /* @__PURE__ */ jsx(StatCard, { value: stats.today, label: "Requests Today", loading }),
        /* @__PURE__ */ jsx(StatCard, { value: stats.cities, label: "Cities Covered", loading })
      ] })
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: () => setSosOpen(true), className: "w-full rounded-2xl p-5 text-left animate-rs-pulse-glow", style: {
      background: "linear-gradient(135deg, #ef4444, #991b1b)",
      boxShadow: "0 8px 24px -8px rgba(220, 38, 38, 0.6)"
    }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Siren, { size: 22, className: "text-white shrink-0" }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "font-mono uppercase text-white", style: {
          fontSize: 13,
          letterSpacing: "1px",
          fontWeight: 500
        }, children: "Emergency SOS — Need Blood Now" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1", style: {
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 300,
          fontSize: 11,
          color: "rgba(255,255,255,0.65)"
        }, children: "Alerts all compatible donors instantly" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("a", { href: `https://wa.me/?text=${encodeURIComponent(`🩸 RaktSetu — Real-time blood donor network for Gujarat.

Find verified donors near you in seconds, or register to save lives.

raktsetu.lovable.app

— Ek Boond, Ek Zindagi`)}`, target: "_blank", rel: "noopener noreferrer", className: "-mt-6 mx-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-mono uppercase active:scale-95 transition-transform", style: {
      background: "rgba(37,211,102,0.08)",
      border: "1px solid rgba(37,211,102,0.25)",
      color: "#25d366",
      fontSize: 11,
      letterSpacing: "1px"
    }, children: "💬 Share RaktSetu with someone who might need it" }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-3 animate-rs-fade-up", style: {
      animationDelay: "60ms"
    }, children: [
      /* @__PURE__ */ jsx("div", { className: "rs-eyebrow", children: "Quick Actions" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: actions.map((a, i) => {
        const [pre, post] = a.title.split(a.accent);
        return /* @__PURE__ */ jsxs(Link, { to: a.to, className: "rs-card rs-card-hover p-5 block group", style: {
          animationDelay: `${i * 60}ms`
        }, children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl mb-3", children: a.emoji }),
          /* @__PURE__ */ jsxs("div", { className: "font-serif font-bold text-lg leading-tight", children: [
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: pre }),
            /* @__PURE__ */ jsx("span", { style: {
              color: "#dc2626"
            }, children: a.accent }),
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: post })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rs-body-sm mt-1.5", children: a.desc })
        ] }, a.to);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "rs-eyebrow", children: "How It Works" }),
      /* @__PURE__ */ jsxs("h2", { className: "font-serif font-bold text-3xl leading-tight", children: [
        "Three Steps to ",
        /* @__PURE__ */ jsx("span", { style: {
          color: "#dc2626"
        }, children: "Save" }),
        " a Life"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-3 gap-3 pt-2", children: [{
        n: "01",
        t: "Select Blood Type & Location",
        d: "Choose blood group and city. We instantly query thousands of verified donors."
      }, {
        n: "02",
        t: "AI Finds Compatible Donors",
        d: "Our engine ranks donors by compatibility, proximity, and availability in real time."
      }, {
        n: "03",
        t: "Connect Directly in Seconds",
        d: "Call or WhatsApp the donor directly. No middleman. No delay. Life saved."
      }].map((s) => /* @__PURE__ */ jsxs("div", { className: "rs-card p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "font-mono", style: {
          fontSize: 10,
          letterSpacing: "2px",
          color: "#dc2626",
          fontWeight: 500
        }, children: [
          "STEP ",
          s.n
        ] }),
        /* @__PURE__ */ jsx("div", { className: "font-serif font-bold text-lg mt-2 leading-snug", children: s.t }),
        /* @__PURE__ */ jsx("div", { className: "rs-body-sm mt-2 leading-relaxed", children: s.d })
      ] }, s.n)) })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "pt-8 pb-6 text-center space-y-1.5", children: [
      /* @__PURE__ */ jsx("p", { className: "font-serif font-bold", style: {
        fontSize: 13,
        color: "#333"
      }, children: "RaktSetu · Gujarat, India" }),
      /* @__PURE__ */ jsx("p", { className: "font-mono", style: {
        fontSize: 10,
        color: "#dc2626",
        letterSpacing: "1px",
        textTransform: "uppercase"
      }, children: "Saving lives · one connection at a time" })
    ] }),
    /* @__PURE__ */ jsx(SosModal, { open: sosOpen, onClose: () => setSosOpen(false) })
  ] });
}
export {
  HomePage as component
};
