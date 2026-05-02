import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-IDUWrsFe.js";
import { c as createLucideIcon, z as zt, s as supabase, d as BLOOD_TYPES, e as CITIES, f as Search } from "./router-dIrcSwBL.js";
import { f as formatDistanceToNowStrict } from "./formatDistanceToNowStrict-C-ZHkocT.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function AdminPage() {
  const [authed, setAuthed] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(sessionStorage.getItem("rs-admin") === "1");
    }
  }, []);
  if (!authed) return /* @__PURE__ */ jsxRuntimeExports.jsx(Login, { onSuccess: () => setAuthed(true) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, {});
}
function Login({
  onSuccess
}) {
  const [pw, setPw] = reactExports.useState("");
  const [shake, setShake] = reactExports.useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (pw === "admin123") {
      sessionStorage.setItem("rs-admin", "1");
      onSuccess();
    } else {
      setShake(true);
      zt.error("Wrong password");
      setTimeout(() => setShake(false), 500);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[80vh] flex items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: `rs-card p-8 w-full max-w-sm space-y-5 ${shake ? "animate-rs-shake" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "text-primary", size: 24 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif font-bold text-3xl", children: [
        "Admin ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          color: "#dc2626"
        }, children: "Access" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rs-body-sm", children: "Enter password to continue" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", autoFocus: true, className: "rs-input text-center", placeholder: "••••••••", value: pw, onChange: (e) => setPw(e.target.value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "rs-btn rs-btn-primary w-full", children: "Login" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-text-muted text-center", style: {
      letterSpacing: "1px"
    }, children: "DEMO · admin123" })
  ] }) });
}
function Dashboard() {
  const [tab, setTab] = reactExports.useState("overview");
  const [donors, setDonors] = reactExports.useState([]);
  const [requests, setRequests] = reactExports.useState([]);
  const [sosCount, setSosCount] = reactExports.useState(0);
  const [loading, setLoading] = reactExports.useState(true);
  const load = async () => {
    const [d, r, s] = await Promise.all([supabase.from("donors").select("*").order("created_at", {
      ascending: false
    }), supabase.from("blood_requests").select("*").order("created_at", {
      ascending: false
    }), supabase.from("sos_alerts").select("id", {
      count: "exact",
      head: true
    }).eq("status", "active")]);
    setDonors(d.data ?? []);
    setRequests(r.data ?? []);
    setSosCount(s.count ?? 0);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const totalDonors = donors.length;
  const availableNow = donors.filter((d) => d.available).length;
  const totalReq = requests.length;
  const fulfilled = requests.filter((r) => r.status === "fulfilled").length;
  const successRate = totalReq ? Math.round(fulfilled / totalReq * 100) : 0;
  const stats = [{
    l: "Total Donors",
    v: totalDonors
  }, {
    l: "Available Now",
    v: availableNow
  }, {
    l: "Total Requests",
    v: totalReq
  }, {
    l: "Fulfilled",
    v: fulfilled
  }, {
    l: "Active SOS",
    v: sosCount
  }, {
    l: "Success Rate",
    v: `${successRate}%`
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-eyebrow", children: "Control Center" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif font-bold text-4xl leading-tight", children: [
          "Admin ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            color: "#dc2626"
          }, children: "Dashboard" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rs-body", children: "Dashboard for hospitals and blood banks" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        sessionStorage.removeItem("rs-admin");
        location.reload();
      }, className: "rs-btn rs-btn-secondary !py-2 !px-3", children: "Logout" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-bold text-2xl text-primary", children: s.v }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase text-muted-foreground tracking-wider mt-1", children: s.l })
    ] }, s.l)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 p-1 bg-card border border-border rounded-2xl", children: ["overview", "donors", "requests"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t), className: `py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`, children: t.toUpperCase() }, t)) }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-skeleton h-40 rounded-2xl" }),
    !loading && tab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(Overview, { donors, requests }),
    !loading && tab === "donors" && /* @__PURE__ */ jsxRuntimeExports.jsx(DonorsTab, { donors, reload: load }),
    !loading && tab === "requests" && /* @__PURE__ */ jsxRuntimeExports.jsx(RequestsTab, { requests, reload: load })
  ] });
}
function Overview({
  donors,
  requests
}) {
  const max = Math.max(1, ...BLOOD_TYPES.map((b) => donors.filter((d) => d.blood_type === b).length));
  const recent = requests.slice(0, 10);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif font-bold text-xl mb-4", children: "Blood Type Distribution" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: BLOOD_TYPES.map((b) => {
        const c = donors.filter((d) => d.blood_type === b).length;
        const w = c / max * 100;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 font-mono text-xs font-bold text-primary", children: b }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-6 bg-input rounded-md overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary rounded-md transition-all", style: {
            width: `${w}%`
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 text-right font-mono text-xs", children: c })
        ] }, b);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif font-bold text-xl mb-4", children: "By City" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: CITIES.map((c) => {
        const n = donors.filter((d) => d.city === c).length;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm", children: c }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-bold text-primary", children: n })
        ] }, c);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-5 lg:col-span-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif font-bold text-xl mb-4", children: "Recent Activity" }),
      recent.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No activity yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: recent.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2 border-b border-border last:border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 border border-primary flex items-center justify-center font-mono font-bold text-primary text-xs", children: r.blood_type }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm truncate", children: r.hospital }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] text-muted-foreground", children: formatDistanceToNowStrict(new Date(r.created_at), {
            addSuffix: true
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-mono text-[10px] px-2 py-0.5 rounded-full ${r.status === "fulfilled" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"}`, children: r.status.toUpperCase() })
      ] }, r.id)) })
    ] })
  ] });
}
function DonorsTab({
  donors,
  reload
}) {
  const [q, setQ] = reactExports.useState("");
  const filtered = donors.filter((d) => !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.phone.includes(q) || d.city.toLowerCase().includes(q.toLowerCase()) || d.blood_type.toLowerCase() === q.toLowerCase());
  const toggle = async (d) => {
    const {
      error
    } = await supabase.from("donors").update({
      available: !d.available
    }).eq("id", d.id);
    if (error) zt.error("Update failed");
    else {
      zt.success("Updated");
      reload();
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this donor?")) return;
    const {
      error
    } = await supabase.from("donors").delete().eq("id", id);
    if (error) zt.error("Delete failed");
    else {
      zt.success("Deleted");
      reload();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search by name, phone, city, blood type...", className: "rs-input pl-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-muted-foreground", children: [
      "Showing ",
      filtered.length,
      " / ",
      donors.length
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card overflow-hidden", children: [
      filtered.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 p-3 ${i < filtered.length - 1 ? "border-b border-border" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 border border-primary flex items-center justify-center font-mono font-bold text-primary text-xs shrink-0", children: d.blood_type }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-serif font-bold truncate flex items-center gap-1.5", children: [
            d.name,
            d.verified && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-success text-xs", children: "✓" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[11px] text-muted-foreground truncate", children: [
            d.phone,
            " • ",
            d.city
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggle(d), className: `px-2 py-1 rounded-full font-mono text-[10px] font-bold ${d.available ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`, children: d.available ? "ON" : "OFF" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(d.id), className: "p-2 text-muted-foreground hover:text-primary transition-colors", "aria-label": "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
      ] }, d.id)),
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center font-mono text-sm text-muted-foreground", children: "No donors match." })
    ] })
  ] });
}
function RequestsTab({
  requests,
  reload
}) {
  const [filter, setFilter] = reactExports.useState("all");
  const filtered = requests.filter((r) => filter === "all" || r.status === filter);
  const fulfill = async (id) => {
    const {
      error
    } = await supabase.from("blood_requests").update({
      status: "fulfilled"
    }).eq("id", id);
    if (error) zt.error("Update failed");
    else {
      zt.success("Marked fulfilled");
      reload();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["all", "active", "fulfilled"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(f), className: `px-3 py-1.5 rounded-full font-mono text-xs font-bold transition-all ${filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`, children: f.toUpperCase() }, f)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card overflow-hidden", children: [
      filtered.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 p-3 ${i < filtered.length - 1 ? "border-b border-border" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 border border-primary flex items-center justify-center font-mono font-bold text-primary text-xs shrink-0", children: r.blood_type }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif font-bold truncate", children: r.hospital }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[11px] text-muted-foreground truncate", children: [
            r.contact_phone,
            " • ",
            formatDistanceToNowStrict(new Date(r.created_at), {
              addSuffix: true
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${r.urgency === "critical" ? "bg-primary text-primary-foreground" : r.urgency === "urgent" ? "bg-warning/20 text-warning" : "bg-success/20 text-success"}`, children: r.urgency.toUpperCase() }),
        r.status === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => fulfill(r.id), className: "rs-btn rs-btn-secondary !py-1.5 !px-2 text-[10px]", children: "FULFILL" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-success", children: "DONE" })
      ] }, r.id)),
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center font-mono text-sm text-muted-foreground", children: "No requests." })
    ] })
  ] });
}
export {
  AdminPage as component
};
