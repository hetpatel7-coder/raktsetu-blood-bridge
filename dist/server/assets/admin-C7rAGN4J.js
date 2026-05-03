import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import toast from "react-hot-toast";
import { z } from "zod";
import { s as supabase, b as BLOOD_TYPES, c as CITIES } from "./router-D_2it_03.js";
import { Lock, LogOut, Search, Trash2 } from "lucide-react";
import "@tanstack/react-router";
import "@supabase/supabase-js";
function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const checkAdmin = async (uid) => {
    if (!uid) {
      setIsAdmin(false);
      return;
    }
    const {
      data,
      error
    } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
    setIsAdmin(!error && !!data);
  };
  useEffect(() => {
    const {
      data: sub
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      setTimeout(() => {
        void checkAdmin(uid).finally(() => setLoading(false));
      }, 0);
    });
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      void checkAdmin(uid).finally(() => setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-[60vh] flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "rs-skeleton h-12 w-48 rounded-xl" }) });
  }
  if (!userId) return /* @__PURE__ */ jsx(AuthForm, {});
  if (!isAdmin) return /* @__PURE__ */ jsx(NotAuthorized, {});
  return /* @__PURE__ */ jsx(Dashboard, {});
}
function NotAuthorized() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-[60vh] flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "rs-card p-8 max-w-sm text-center space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(Lock, { className: "text-primary", size: 24 }) }),
    /* @__PURE__ */ jsx("h1", { className: "font-serif font-bold text-2xl", children: "Not Authorized" }),
    /* @__PURE__ */ jsx("p", { className: "rs-body-sm", children: "Your account does not have admin access." }),
    /* @__PURE__ */ jsx("button", { onClick: () => supabase.auth.signOut(), className: "rs-btn rs-btn-secondary w-full", children: "Sign out" })
  ] }) });
}
const credSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72)
});
function AuthForm() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const parsed = credSchema.safeParse({
      email,
      password
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        const {
          error
        } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        toast.success("Signed in");
      } else {
        const {
          error
        } = await supabase.auth.signUp({
          ...parsed.data,
          options: {
            emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/admin` : void 0
          }
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-[80vh] flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "rs-card p-8 w-full max-w-sm space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(Lock, { className: "text-primary", size: 24 }) }),
      /* @__PURE__ */ jsxs("h1", { className: "font-serif font-bold text-3xl", children: [
        "Admin ",
        /* @__PURE__ */ jsx("span", { style: {
          color: "#dc2626"
        }, children: "Access" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "rs-body-sm", children: mode === "signin" ? "Sign in to continue" : "Create an admin account" })
    ] }),
    /* @__PURE__ */ jsx("input", { type: "email", autoFocus: true, required: true, autoComplete: "email", className: "rs-input", placeholder: "you@hospital.org", value: email, onChange: (e) => setEmail(e.target.value) }),
    /* @__PURE__ */ jsx("input", { type: "password", required: true, autoComplete: mode === "signin" ? "current-password" : "new-password", className: "rs-input", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value) }),
    /* @__PURE__ */ jsx("button", { type: "submit", disabled: busy, className: "rs-btn rs-btn-primary w-full disabled:opacity-60", children: busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account" }),
    /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setMode(mode === "signin" ? "signup" : "signin"), className: "block w-full font-mono text-[11px] text-muted-foreground hover:text-primary", children: mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in" }),
    /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-text-muted text-center", style: {
      letterSpacing: "1px"
    }, children: "ADMIN ROLE REQUIRED · GRANTED VIA BACKEND" })
  ] }) });
}
function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sosList, setSosList] = useState([]);
  const [sosCount, setSosCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {
    }
  });
  const askConfirm = (title, message, onConfirm) => setConfirmState({
    open: true,
    title,
    message,
    onConfirm
  });
  const load = async () => {
    const [d, r, s] = await Promise.all([supabase.from("donors").select("*").order("created_at", {
      ascending: false
    }), supabase.from("blood_requests").select("*").order("created_at", {
      ascending: false
    }), supabase.from("sos_alerts").select("*").order("created_at", {
      ascending: false
    })]);
    setDonors(d.data ?? []);
    setRequests(r.data ?? []);
    const sosArr = s.data ?? [];
    setSosList(sosArr);
    setSosCount(sosArr.filter((x) => x.status === "active").length);
    setLoading(false);
  };
  useEffect(() => {
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
  return /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-end justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "rs-eyebrow", children: "Control Center" }),
        /* @__PURE__ */ jsxs("h1", { className: "font-serif font-bold text-4xl leading-tight", children: [
          "Admin ",
          /* @__PURE__ */ jsx("span", { style: {
            color: "#dc2626"
          }, children: "Dashboard" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "rs-body", children: "Dashboard for hospitals and blood banks" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => supabase.auth.signOut(), className: "rs-btn rs-btn-secondary !py-2 !px-3 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(LogOut, { size: 14 }),
        " Logout"
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: stats.map((s) => /* @__PURE__ */ jsxs("div", { className: "rs-card p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "font-mono font-bold text-2xl text-primary", children: s.v }),
      /* @__PURE__ */ jsx("div", { className: "font-mono text-[10px] uppercase text-muted-foreground tracking-wider mt-1", children: s.l })
    ] }, s.l)) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2 p-1 bg-card border border-border rounded-2xl", children: ["overview", "donors", "requests", "sos"].map((t) => /* @__PURE__ */ jsx("button", { onClick: () => setTab(t), className: `py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`, children: t.toUpperCase() }, t)) }),
    loading && /* @__PURE__ */ jsx("div", { className: "rs-skeleton h-40 rounded-2xl" }),
    !loading && tab === "overview" && /* @__PURE__ */ jsx(Overview, { donors, requests }),
    !loading && tab === "donors" && /* @__PURE__ */ jsx(DonorsTab, { donors, reload: load, askConfirm }),
    !loading && tab === "requests" && /* @__PURE__ */ jsx(RequestsTab, { requests, reload: load, askConfirm }),
    !loading && tab === "sos" && /* @__PURE__ */ jsx(SosTab, { sos: sosList, reload: load, askConfirm }),
    /* @__PURE__ */ jsx(ConfirmDialog, { open: confirmState.open, title: confirmState.title, message: confirmState.message, onCancel: () => setConfirmState((s) => ({
      ...s,
      open: false
    })), onConfirm: async () => {
      await confirmState.onConfirm();
      setConfirmState((s) => ({
        ...s,
        open: false
      }));
    } })
  ] });
}
function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel
}) {
  if (!open) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4", children: /* @__PURE__ */ jsxs("div", { className: "rs-card p-6 max-w-sm w-full space-y-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-serif font-bold text-xl", children: title }),
    /* @__PURE__ */ jsx("p", { className: "rs-body-sm", children: message }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "rs-btn rs-btn-secondary", children: "Cancel" }),
      /* @__PURE__ */ jsx("button", { onClick: onConfirm, className: "rs-btn rs-btn-primary", children: "Delete" })
    ] })
  ] }) });
}
function Overview({
  donors,
  requests
}) {
  const max = Math.max(1, ...BLOOD_TYPES.map((b) => donors.filter((d) => d.blood_type === b).length));
  const recent = requests.slice(0, 10);
  return /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "rs-card p-5", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-serif font-bold text-xl mb-4", children: "Blood Type Distribution" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: BLOOD_TYPES.map((b) => {
        const c = donors.filter((d) => d.blood_type === b).length;
        const w = c / max * 100;
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 font-mono text-xs font-bold text-primary", children: b }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 h-6 bg-input rounded-md overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-primary rounded-md transition-all", style: {
            width: `${w}%`
          } }) }),
          /* @__PURE__ */ jsx("div", { className: "w-8 text-right font-mono text-xs", children: c })
        ] }, b);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rs-card p-5", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-serif font-bold text-xl mb-4", children: "By City" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: CITIES.map((c) => {
        const n = donors.filter((d) => d.city === c).length;
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "font-mono text-sm", children: c }),
          /* @__PURE__ */ jsx("span", { className: "font-mono text-sm font-bold text-primary", children: n })
        ] }, c);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rs-card p-5 lg:col-span-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-serif font-bold text-xl mb-4", children: "Recent Activity" }),
      recent.length === 0 && /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No activity yet." }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: recent.map((r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 py-2 border-b border-border last:border-0", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 border border-primary flex items-center justify-center font-mono font-bold text-primary text-xs", children: r.blood_type }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "font-mono text-sm truncate", children: r.hospital }),
          /* @__PURE__ */ jsx("div", { className: "font-mono text-[10px] text-muted-foreground", children: formatDistanceToNowStrict(new Date(r.created_at), {
            addSuffix: true
          }) })
        ] }),
        /* @__PURE__ */ jsx("span", { className: `font-mono text-[10px] px-2 py-0.5 rounded-full ${r.status === "fulfilled" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"}`, children: r.status.toUpperCase() })
      ] }, r.id)) })
    ] })
  ] });
}
function DonorsTab({
  donors,
  reload,
  askConfirm
}) {
  const [q, setQ] = useState("");
  const filtered = donors.filter((d) => !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.phone.includes(q) || d.city.toLowerCase().includes(q.toLowerCase()) || d.blood_type.toLowerCase() === q.toLowerCase());
  const toggle = async (d) => {
    const {
      error
    } = await supabase.from("donors").update({
      available: !d.available
    }).eq("id", d.id);
    if (error) toast.error("Update failed");
    else {
      toast.success("Updated");
      reload();
    }
  };
  const remove = (d) => {
    askConfirm("Delete donor?", `Permanently remove ${d.name} from the donor list.`, async () => {
      const {
        error
      } = await supabase.from("donors").delete().eq("id", d.id);
      if (error) toast.error("Delete failed");
      else {
        toast.success("Donor deleted");
        reload();
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search by name, phone, city, blood type...", className: "rs-input pl-10" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "font-mono text-xs text-muted-foreground", children: [
      "Showing ",
      filtered.length,
      " / ",
      donors.length
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rs-card overflow-hidden", children: [
      filtered.map((d, i) => /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-3 p-3 ${i < filtered.length - 1 ? "border-b border-border" : ""}`, children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 border border-primary flex items-center justify-center font-mono font-bold text-primary text-xs shrink-0", children: d.blood_type }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "font-serif font-bold truncate flex items-center gap-1.5", children: [
            d.name,
            d.verified && /* @__PURE__ */ jsx("span", { className: "text-success text-xs", children: "✓" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "font-mono text-[11px] text-muted-foreground truncate", children: [
            d.phone,
            " • ",
            d.city
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => toggle(d), className: `px-2 py-1 rounded-full font-mono text-[10px] font-bold ${d.available ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`, children: d.available ? "ON" : "OFF" }),
        /* @__PURE__ */ jsx("button", { onClick: () => remove(d), className: "p-2 text-muted-foreground hover:text-primary transition-colors", "aria-label": "Delete", children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
      ] }, d.id)),
      filtered.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center font-mono text-sm text-muted-foreground", children: "No donors match." })
    ] })
  ] });
}
function RequestsTab({
  requests,
  reload,
  askConfirm
}) {
  const [filter, setFilter] = useState("all");
  const filtered = requests.filter((r) => filter === "all" || r.status === filter);
  const fulfill = async (id) => {
    const {
      error
    } = await supabase.from("blood_requests").update({
      status: "fulfilled"
    }).eq("id", id);
    if (error) toast.error("Update failed");
    else {
      toast.success("Marked fulfilled");
      reload();
    }
  };
  const remove = (r) => {
    askConfirm("Delete request?", `Permanently delete the request for ${r.hospital}.`, async () => {
      const {
        error
      } = await supabase.from("blood_requests").delete().eq("id", r.id);
      if (error) toast.error("Delete failed");
      else {
        toast.success("Request deleted");
        reload();
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: ["all", "active", "fulfilled"].map((f) => /* @__PURE__ */ jsx("button", { onClick: () => setFilter(f), className: `px-3 py-1.5 rounded-full font-mono text-xs font-bold transition-all ${filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`, children: f.toUpperCase() }, f)) }),
    /* @__PURE__ */ jsxs("div", { className: "rs-card overflow-hidden", children: [
      filtered.map((r, i) => /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-3 p-3 ${i < filtered.length - 1 ? "border-b border-border" : ""}`, children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 border border-primary flex items-center justify-center font-mono font-bold text-primary text-xs shrink-0", children: r.blood_type }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "font-serif font-bold truncate", children: r.hospital }),
          /* @__PURE__ */ jsxs("div", { className: "font-mono text-[11px] text-muted-foreground truncate", children: [
            r.contact_phone,
            " • ",
            formatDistanceToNowStrict(new Date(r.created_at), {
              addSuffix: true
            })
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${r.urgency === "critical" ? "bg-primary text-primary-foreground" : r.urgency === "urgent" ? "bg-warning/20 text-warning" : "bg-success/20 text-success"}`, children: r.urgency.toUpperCase() }),
        r.status === "active" ? /* @__PURE__ */ jsx("button", { onClick: () => fulfill(r.id), className: "rs-btn rs-btn-secondary !py-1.5 !px-2 text-[10px]", children: "FULFILL" }) : /* @__PURE__ */ jsx("span", { className: "font-mono text-[10px] text-success", children: "DONE" }),
        /* @__PURE__ */ jsx("button", { onClick: () => remove(r), className: "p-2 text-muted-foreground hover:text-primary transition-colors", "aria-label": "Delete", children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
      ] }, r.id)),
      filtered.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center font-mono text-sm text-muted-foreground", children: "No requests." })
    ] })
  ] });
}
function SosTab({
  sos,
  reload,
  askConfirm
}) {
  const resolve = async (id) => {
    const {
      error
    } = await supabase.from("sos_alerts").update({
      status: "resolved"
    }).eq("id", id);
    if (error) toast.error("Update failed");
    else {
      toast.success("SOS resolved");
      reload();
    }
  };
  const remove = (s) => {
    askConfirm("Delete SOS alert?", `Permanently delete the SOS for ${s.hospital}.`, async () => {
      const {
        error
      } = await supabase.from("sos_alerts").delete().eq("id", s.id);
      if (error) toast.error("Delete failed");
      else {
        toast.success("SOS deleted");
        reload();
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "rs-card overflow-hidden", children: [
    sos.map((s, i) => /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-3 p-3 ${i < sos.length - 1 ? "border-b border-border" : ""}`, children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 border border-primary flex items-center justify-center font-mono font-bold text-primary text-xs shrink-0", children: s.blood_type }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "font-serif font-bold truncate", children: s.hospital }),
        /* @__PURE__ */ jsxs("div", { className: "font-mono text-[11px] text-muted-foreground truncate", children: [
          s.contact_phone,
          " • ",
          formatDistanceToNowStrict(new Date(s.created_at), {
            addSuffix: true
          })
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${s.status === "active" ? "bg-primary text-primary-foreground" : "bg-success/20 text-success"}`, children: s.status.toUpperCase() }),
      s.status === "active" && /* @__PURE__ */ jsx("button", { onClick: () => resolve(s.id), className: "rs-btn rs-btn-secondary !py-1.5 !px-2 text-[10px]", children: "RESOLVE" }),
      /* @__PURE__ */ jsx("button", { onClick: () => remove(s), className: "p-2 text-muted-foreground hover:text-primary transition-colors", "aria-label": "Delete", children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
    ] }, s.id)),
    sos.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center font-mono text-sm text-muted-foreground", children: "No SOS alerts." })
  ] });
}
export {
  AdminPage as component
};
