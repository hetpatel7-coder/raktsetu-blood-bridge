import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-IDUWrsFe.js";
import { c as createLucideIcon, s as supabase, z as zt, S as Siren, B as BottomSheet, a as BloodTypeSelector, L as LoaderCircle } from "./router-dIrcSwBL.js";
import { C as CitySelector } from "./CitySelector-Ca4BmNLR.js";
import { f as formatDistanceToNowStrict } from "./formatDistanceToNowStrict-C-ZHkocT.js";
import { P as Phone } from "./phone-Dtc5zV1L.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode);
const URGENCY_RANK = {
  critical: 0,
  urgent: 1,
  normal: 2
};
function RequestsPage() {
  const [tab, setTab] = reactExports.useState("requests");
  const [requests, setRequests] = reactExports.useState([]);
  const [sos, setSos] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [postOpen, setPostOpen] = reactExports.useState(false);
  const load = async () => {
    const [r, s] = await Promise.all([supabase.from("blood_requests").select("*").eq("status", "active").order("created_at", {
      ascending: false
    }), supabase.from("sos_alerts").select("*").eq("status", "active").order("created_at", {
      ascending: false
    })]);
    const sorted = (r.data ?? []).sort((a, b) => (URGENCY_RANK[a.urgency] ?? 9) - (URGENCY_RANK[b.urgency] ?? 9) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setRequests(sorted);
    setSos(s.data ?? []);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
    const ch = supabase.channel("rs-live").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "blood_requests"
    }, (p) => {
      load();
      if (p.eventType === "INSERT") zt.success("🩸 New blood request!");
    }).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "sos_alerts"
    }, (p) => {
      load();
      if (p.eventType === "INSERT") zt.error("🚨 New SOS alert!");
    }).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);
  const markFulfilled = async (id) => {
    const {
      error
    } = await supabase.from("blood_requests").update({
      status: "fulfilled"
    }).eq("id", id);
    if (error) zt.error("Failed to update");
    else zt.success("Marked fulfilled");
  };
  const resolveSos = async (id) => {
    const {
      error
    } = await supabase.from("sos_alerts").update({
      status: "resolved"
    }).eq("id", id);
    if (error) zt.error("Failed to update");
    else zt.success("SOS resolved");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-eyebrow", children: "Live Request" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif font-bold text-4xl leading-tight", children: [
          "Live ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            color: "#dc2626"
          }, children: "Requests" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rs-body", children: "View active requests near you" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setPostOpen(true), className: "rs-btn rs-btn-primary !py-2.5 !px-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
        " Post"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 p-1 bg-card border border-border rounded-2xl", children: [{
      k: "requests",
      l: `Requests (${requests.length})`
    }, {
      k: "sos",
      l: `SOS (${sos.length})`
    }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t.k), className: `py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${tab === t.k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`, children: t.l.toUpperCase() }, t.k)) }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-skeleton h-24 rounded-2xl" }, i)) }),
    !loading && tab === "requests" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      requests.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-card p-8 text-center font-mono text-sm text-muted-foreground", children: "No active requests. 🙌" }),
      requests.map((r, i) => {
        const tone = r.urgency === "critical" ? "border-primary bg-primary/8" : r.urgency === "urgent" ? "border-warning/60 bg-warning/5" : "border-success/40 bg-success/5";
        const badge = r.urgency === "critical" ? "bg-primary text-primary-foreground" : r.urgency === "urgent" ? "bg-warning/20 text-warning" : "bg-success/20 text-success";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `border rounded-2xl p-4 animate-rs-fade-up ${tone}`, style: {
          animationDelay: `${i * 40}ms`
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center font-mono font-bold text-primary text-sm", children: r.blood_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif font-bold", children: r.patient_name || "Anonymous" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full rs-pill ${badge}`, children: r.urgency })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-muted-foreground mt-1 truncate", children: [
                r.hospital,
                r.city ? ` • ${r.city}` : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] text-text-muted mt-0.5", children: formatDistanceToNowStrict(new Date(r.created_at), {
                addSuffix: true
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${r.contact_phone}`, className: "rs-btn rs-btn-primary !py-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14 }),
              " Call"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => markFulfilled(r.id), className: "rs-btn rs-btn-secondary !py-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 14 }),
              " Fulfilled"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://wa.me/?text=${encodeURIComponent(`🚨 URGENT BLOOD NEEDED 🚨

Blood Type: ${r.blood_type}
Hospital: ${r.hospital}
City: ${r.city ?? "—"}
Urgency: ${r.urgency}
Contact: ${r.contact_phone}

Please help or share with someone who can donate. Every minute counts.

— Shared via RaktSetu App
raktsetu.lovable.app`)}`, target: "_blank", rel: "noopener noreferrer", className: "mt-2 w-full inline-flex items-center justify-center gap-2 rounded-[10px] py-2.5 font-mono uppercase active:scale-95 transition-transform", style: {
            background: "rgba(37,211,102,0.1)",
            border: "1px solid rgba(37,211,102,0.3)",
            color: "#25d366",
            fontSize: 11,
            letterSpacing: "1px"
          }, children: "💬 Share on WhatsApp" })
        ] }, r.id);
      })
    ] }),
    !loading && tab === "sos" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      sos.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-card p-8 text-center font-mono text-sm text-muted-foreground", children: "No active SOS alerts. 🙏" }),
      sos.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-primary rounded-2xl p-4 animate-rs-pulse-glow animate-rs-fade-up bg-primary/5", style: {
        animationDelay: `${i * 40}ms`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-sm", children: s.blood_type }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Siren, { size: 14, className: "text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif font-bold", children: "Active Emergency" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-body-sm mt-1 truncate", children: s.hospital }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono mt-0.5", style: {
              fontSize: 10,
              color: "#555",
              letterSpacing: "0.5px"
            }, children: formatDistanceToNowStrict(new Date(s.created_at), {
              addSuffix: true
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${s.contact_phone}`, className: "rs-btn rs-btn-sos !py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14 }),
            " Call Now"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => resolveSos(s.id), className: "rs-btn rs-btn-secondary !py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 14 }),
            " Resolve"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://wa.me/?text=${encodeURIComponent(`🚨 SOS BLOOD ALERT 🚨

EMERGENCY: ${s.blood_type} blood needed
Hospital: ${s.hospital}
Call NOW: ${s.contact_phone}

— RaktSetu Emergency Alert
raktsetu.lovable.app`)}`, target: "_blank", rel: "noopener noreferrer", className: "mt-2 w-full inline-flex items-center justify-center gap-2 rounded-[10px] py-2.5 font-mono uppercase active:scale-95 transition-transform", style: {
          background: "rgba(37,211,102,0.1)",
          border: "1px solid rgba(37,211,102,0.3)",
          color: "#25d366",
          fontSize: 11,
          letterSpacing: "1px"
        }, children: "💬 Share on WhatsApp" })
      ] }, s.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PostRequestModal, { open: postOpen, onClose: () => setPostOpen(false) })
  ] });
}
function PostRequestModal({
  open,
  onClose
}) {
  const [name, setName] = reactExports.useState("");
  const [bt, setBt] = reactExports.useState(null);
  const [hospital, setHospital] = reactExports.useState("");
  const [city, setCity] = reactExports.useState(null);
  const [urgency, setUrgency] = reactExports.useState("normal");
  const [phone, setPhone] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const submit = async () => {
    if (!bt || !hospital.trim() || !phone.trim()) {
      zt.error("Blood type, hospital, and phone are required");
      return;
    }
    setLoading(true);
    const {
      error
    } = await supabase.from("blood_requests").insert({
      patient_name: name.trim() || null,
      blood_type: bt,
      hospital: hospital.trim(),
      city,
      urgency,
      contact_phone: phone.trim()
    });
    setLoading(false);
    if (error) {
      zt.error("Failed to post");
      return;
    }
    zt.success("Request posted!");
    setName("");
    setBt(null);
    setHospital("");
    setCity(null);
    setUrgency("normal");
    setPhone("");
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BottomSheet, { open, onClose, title: "Post Request", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase", children: "Patient Name (optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "rs-input", value: name, onChange: (e) => setName(e.target.value), maxLength: 80 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase", children: "Blood Type" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BloodTypeSelector, { value: bt, onChange: setBt })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase", children: "Hospital" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "rs-input", value: hospital, onChange: (e) => setHospital(e.target.value), maxLength: 120 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase", children: "City" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CitySelector, { value: city, onChange: setCity })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase", children: "Urgency" }),
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
      }].map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setUrgency(u.k), className: `py-2.5 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all active:scale-95 ${urgency === u.k ? "bg-primary/15 border-primary" : "bg-card border-border text-muted-foreground"}`, children: [
        u.e,
        " ",
        u.l
      ] }, u.k)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase", children: "Contact Phone" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "rs-input", type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), maxLength: 20 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: submit, disabled: loading, className: "rs-btn rs-btn-primary w-full", children: [
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin", size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
      loading ? "Posting…" : "Post Request"
    ] })
  ] }) });
}
export {
  RequestsPage as component
};
