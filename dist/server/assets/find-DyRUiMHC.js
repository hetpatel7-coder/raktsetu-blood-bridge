import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-IDUWrsFe.js";
import { c as createLucideIcon, a as BloodTypeSelector, L as LoaderCircle, s as supabase, C as COMPATIBILITY, z as zt } from "./router-dIrcSwBL.js";
import { C as CitySelector } from "./CitySelector-Ca4BmNLR.js";
import { C as CircleCheck } from "./circle-check-GaPsBfnK.js";
import { P as Phone } from "./phone-Dtc5zV1L.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M16 16s-1.5-2-4-2-4 2-4 2", key: "epbg0q" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }]
];
const Frown = createLucideIcon("frown", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
      key: "mvr1a0"
    }
  ],
  ["path", { d: "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27", key: "auskq0" }]
];
const HeartPulse = createLucideIcon("heart-pulse", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      key: "1sd12s"
    }
  ]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode);
function FindPage() {
  const [bloodType, setBloodType] = reactExports.useState(null);
  const [city, setCity] = reactExports.useState(null);
  const [urgency, setUrgency] = reactExports.useState("normal");
  const [loading, setLoading] = reactExports.useState(false);
  const [searched, setSearched] = reactExports.useState(false);
  const [donors, setDonors] = reactExports.useState([]);
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const search = async () => {
    if (!bloodType) return;
    setLoading(true);
    setSearched(true);
    setExpandedId(null);
    const compatible = COMPATIBILITY[bloodType];
    let q = supabase.from("donors").select("*").in("blood_type", compatible);
    if (city) q = q.eq("city", city);
    const {
      data,
      error
    } = await q.order("available", {
      ascending: false
    }).order("verified", {
      ascending: false
    });
    setLoading(false);
    if (error) {
      zt.error("Search failed. Try again.");
      return;
    }
    setDonors(data ?? []);
  };
  const sendRequest = async (donor) => {
    const {
      error
    } = await supabase.from("blood_requests").insert({
      blood_type: donor.blood_type,
      hospital: "Direct request",
      city: donor.city,
      urgency,
      contact_phone: donor.phone
    });
    if (error) zt.error("Failed to send request");
    else zt.success(`Request sent to ${donor.name}`);
  };
  const available = donors.filter((d) => d.available).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-eyebrow", children: "Nearby Donors" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif font-bold text-4xl leading-tight", children: [
        "Find ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          color: "#dc2626"
        }, children: "Donor" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rs-body", children: "Search verified donors by blood type" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-5 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider", children: "Blood Type Needed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BloodTypeSelector, { value: bloodType, onChange: setBloodType })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider", children: "City" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CitySelector, { value: city, onChange: setCity })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider", children: "Urgency" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [{
          k: "normal",
          e: "🟢",
          l: "Normal"
        }, {
          k: "urgent",
          e: "🟡",
          l: "Urgent"
        }, {
          k: "critical",
          e: "🔴",
          l: "Critical"
        }].map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setUrgency(u.k), className: `py-2.5 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all active:scale-95 ${urgency === u.k ? "bg-primary/15 border-primary text-foreground" : "bg-card border-border text-muted-foreground"}`, children: [
          u.e,
          " ",
          u.l
        ] }, u.k)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: search, disabled: !bloodType || loading, className: "rs-btn rs-btn-primary w-full", children: [
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin", size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(HeartPulse, { size: 18 }),
        loading ? "Searching…" : "Find Donors"
      ] })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-skeleton h-20 rounded-2xl" }, i)) }),
    !loading && searched && donors.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-8 text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Frown, { size: 40, className: "mx-auto text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif font-bold text-lg", children: "No Donors Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rs-body-sm", children: "Try Emergency SOS to alert nearby donors instantly." })
    ] }),
    !loading && donors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-eyebrow px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-success", children: [
          "● ",
          available,
          " Available"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-2 text-text-muted", children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          donors.length,
          " Compatible"
        ] })
      ] }),
      donors.map((d, i) => {
        const isExpanded = expandedId === d.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rs-card transition-all animate-rs-fade-up ${d.available ? "rs-card-hover" : "opacity-50"}`, style: {
          animationDelay: `${i * 40}ms`
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setExpandedId(isExpanded ? null : d.id), className: "w-full p-4 flex items-center gap-4 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-sm border-2 ${d.available ? "bg-primary/15 border-primary text-primary" : "bg-muted border-border text-muted-foreground"}`, children: d.blood_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif font-bold truncate", children: d.name }),
                d.verified && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14, className: "text-success shrink-0" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[11px] text-muted-foreground mt-0.5", children: [
                d.donations_count,
                " donations • ",
                d.city
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `shrink-0 px-2.5 py-1 rounded-full rs-pill ${d.available ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`, children: d.available ? "● Available" : "○ Busy" })
          ] }),
          isExpanded && d.available && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 pt-1 grid grid-cols-3 gap-2 animate-rs-fade-up", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${d.phone}`, className: "rs-btn rs-btn-secondary !py-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14 }),
              " Call"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://wa.me/${d.phone.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "rs-btn rs-btn-secondary !py-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 14 }),
              " WhatsApp"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => sendRequest(d), className: "rs-btn rs-btn-primary !py-2.5", children: "🩸 Request" })
          ] })
        ] }, d.id);
      })
    ] })
  ] });
}
export {
  FindPage as component
};
