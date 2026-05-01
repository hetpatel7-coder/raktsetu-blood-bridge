import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { BLOOD_TYPES, CITIES } from "@/lib/blood";
import { Lock, Trash2, Search } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — RaktSetu" },
      { name: "description", content: "RaktSetu admin dashboard." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(sessionStorage.getItem("rs-admin") === "1");
    }
  }, []);
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  return <Dashboard />;
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === "admin123") {
      sessionStorage.setItem("rs-admin", "1");
      onSuccess();
    } else {
      setShake(true);
      toast.error("Wrong password");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className={`rs-card p-8 w-full max-w-sm space-y-5 ${shake ? "animate-rs-shake" : ""}`}
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center">
            <Lock className="text-primary" size={24} />
          </div>
          <h1 className="font-serif font-bold text-3xl">
            Admin <span style={{ color: "#dc2626" }}>Access</span>
          </h1>
          <p className="rs-body-sm">Enter password to continue</p>
        </div>
        <input
          type="password"
          autoFocus
          className="rs-input text-center"
          placeholder="••••••••"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button type="submit" className="rs-btn rs-btn-primary w-full">
          Login
        </button>
        <p className="font-mono text-[10px] text-text-muted text-center" style={{ letterSpacing: "1px" }}>
          DEMO · admin123
        </p>
      </form>
    </div>
  );
}

type Donor = {
  id: string; name: string; blood_type: string; phone: string;
  city: string; available: boolean; verified: boolean; donations_count: number;
  created_at: string;
};
type Req = {
  id: string; patient_name: string | null; blood_type: string; hospital: string;
  urgency: string; contact_phone: string; status: string; created_at: string;
};

function Dashboard() {
  const [tab, setTab] = useState<"overview" | "donors" | "requests">("overview");
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<Req[]>([]);
  const [sosCount, setSosCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [d, r, s] = await Promise.all([
      supabase.from("donors").select("*").order("created_at", { ascending: false }),
      supabase.from("blood_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("sos_alerts").select("id", { count: "exact", head: true }).eq("status", "active"),
    ]);
    setDonors((d.data as Donor[]) ?? []);
    setRequests((r.data as Req[]) ?? []);
    setSosCount(s.count ?? 0);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const totalDonors = donors.length;
  const availableNow = donors.filter((d) => d.available).length;
  const totalReq = requests.length;
  const fulfilled = requests.filter((r) => r.status === "fulfilled").length;
  const successRate = totalReq ? Math.round((fulfilled / totalReq) * 100) : 0;

  const stats = [
    { l: "Total Donors", v: totalDonors },
    { l: "Available Now", v: availableNow },
    { l: "Total Requests", v: totalReq },
    { l: "Fulfilled", v: fulfilled },
    { l: "Active SOS", v: sosCount },
    { l: "Success Rate", v: `${successRate}%` },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-5">
      <header className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="rs-eyebrow">Control Center</div>
          <h1 className="font-serif font-bold text-4xl leading-tight">
            Admin <span style={{ color: "#dc2626" }}>Dashboard</span>
          </h1>
          <p className="rs-body">Dashboard for hospitals and blood banks</p>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem("rs-admin"); location.reload(); }}
          className="rs-btn rs-btn-secondary !py-2 !px-3"
        >
          Logout
        </button>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.l} className="rs-card p-4">
            <div className="font-mono font-bold text-2xl text-primary">{s.v}</div>
            <div className="font-mono text-[10px] uppercase text-muted-foreground tracking-wider mt-1">
              {s.l}
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-3 gap-2 p-1 bg-card border border-border rounded-2xl">
        {(["overview", "donors", "requests"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <div className="rs-skeleton h-40 rounded-2xl" />}

      {!loading && tab === "overview" && (
        <Overview donors={donors} requests={requests} />
      )}
      {!loading && tab === "donors" && (
        <DonorsTab donors={donors} reload={load} />
      )}
      {!loading && tab === "requests" && (
        <RequestsTab requests={requests} reload={load} />
      )}
    </div>
  );
}

function Overview({ donors, requests }: { donors: Donor[]; requests: Req[] }) {
  const max = Math.max(1, ...BLOOD_TYPES.map((b) => donors.filter((d) => d.blood_type === b).length));
  const recent = requests.slice(0, 10);
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="rs-card p-5">
        <h3 className="font-serif font-bold text-xl mb-4">Blood Type Distribution</h3>
        <div className="space-y-2">
          {BLOOD_TYPES.map((b) => {
            const c = donors.filter((d) => d.blood_type === b).length;
            const w = (c / max) * 100;
            return (
              <div key={b} className="flex items-center gap-3">
                <div className="w-10 font-mono text-xs font-bold text-primary">{b}</div>
                <div className="flex-1 h-6 bg-input rounded-md overflow-hidden">
                  <div className="h-full bg-primary rounded-md transition-all" style={{ width: `${w}%` }} />
                </div>
                <div className="w-8 text-right font-mono text-xs">{c}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rs-card p-5">
        <h3 className="font-serif font-bold text-xl mb-4">By City</h3>
        <div className="space-y-2">
          {CITIES.map((c) => {
            const n = donors.filter((d) => d.city === c).length;
            return (
              <div key={c} className="flex items-center justify-between">
                <span className="font-mono text-sm">{c}</span>
                <span className="font-mono text-sm font-bold text-primary">{n}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rs-card p-5 lg:col-span-2">
        <h3 className="font-serif font-bold text-xl mb-4">Recent Activity</h3>
        {recent.length === 0 && (
          <p className="font-mono text-xs text-muted-foreground">No activity yet.</p>
        )}
        <div className="space-y-2">
          {recent.map((r) => (
            <div key={r.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary flex items-center justify-center font-mono font-bold text-primary text-xs">
                {r.blood_type}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm truncate">{r.hospital}</div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {formatDistanceToNowStrict(new Date(r.created_at), { addSuffix: true })}
                </div>
              </div>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                r.status === "fulfilled" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"
              }`}>
                {r.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DonorsTab({ donors, reload }: { donors: Donor[]; reload: () => void }) {
  const [q, setQ] = useState("");
  const filtered = donors.filter(
    (d) =>
      !q ||
      d.name.toLowerCase().includes(q.toLowerCase()) ||
      d.phone.includes(q) ||
      d.city.toLowerCase().includes(q.toLowerCase()) ||
      d.blood_type.toLowerCase() === q.toLowerCase()
  );

  const toggle = async (d: Donor) => {
    const { error } = await supabase.from("donors").update({ available: !d.available }).eq("id", d.id);
    if (error) toast.error("Update failed");
    else { toast.success("Updated"); reload(); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this donor?")) return;
    const { error } = await supabase.from("donors").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted"); reload(); }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, phone, city, blood type..."
          className="rs-input pl-10"
        />
      </div>
      <div className="font-mono text-xs text-muted-foreground">
        Showing {filtered.length} / {donors.length}
      </div>
      <div className="rs-card overflow-hidden">
        {filtered.map((d, i) => (
          <div
            key={d.id}
            className={`flex items-center gap-3 p-3 ${
              i < filtered.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary flex items-center justify-center font-mono font-bold text-primary text-xs shrink-0">
              {d.blood_type}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-serif font-bold truncate flex items-center gap-1.5">
                {d.name}
                {d.verified && <span className="text-success text-xs">✓</span>}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground truncate">
                {d.phone} • {d.city}
              </div>
            </div>
            <button
              onClick={() => toggle(d)}
              className={`px-2 py-1 rounded-full font-mono text-[10px] font-bold ${
                d.available ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
              }`}
            >
              {d.available ? "ON" : "OFF"}
            </button>
            <button
              onClick={() => remove(d.id)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center font-mono text-sm text-muted-foreground">
            No donors match.
          </div>
        )}
      </div>
    </div>
  );
}

function RequestsTab({ requests, reload }: { requests: Req[]; reload: () => void }) {
  const [filter, setFilter] = useState<"all" | "active" | "fulfilled">("all");
  const filtered = requests.filter((r) => filter === "all" || r.status === filter);

  const fulfill = async (id: string) => {
    const { error } = await supabase.from("blood_requests").update({ status: "fulfilled" }).eq("id", id);
    if (error) toast.error("Update failed");
    else { toast.success("Marked fulfilled"); reload(); }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["all", "active", "fulfilled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold transition-all ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="rs-card overflow-hidden">
        {filtered.map((r, i) => (
          <div
            key={r.id}
            className={`flex items-center gap-3 p-3 ${
              i < filtered.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary flex items-center justify-center font-mono font-bold text-primary text-xs shrink-0">
              {r.blood_type}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-serif font-bold truncate">{r.hospital}</div>
              <div className="font-mono text-[11px] text-muted-foreground truncate">
                {r.contact_phone} • {formatDistanceToNowStrict(new Date(r.created_at), { addSuffix: true })}
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
              r.urgency === "critical" ? "bg-primary text-primary-foreground" :
              r.urgency === "urgent" ? "bg-warning/20 text-warning" : "bg-success/20 text-success"
            }`}>
              {r.urgency.toUpperCase()}
            </span>
            {r.status === "active" ? (
              <button
                onClick={() => fulfill(r.id)}
                className="rs-btn rs-btn-secondary !py-1.5 !px-2 text-[10px]"
              >
                FULFILL
              </button>
            ) : (
              <span className="font-mono text-[10px] text-success">DONE</span>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center font-mono text-sm text-muted-foreground">
            No requests.
          </div>
        )}
      </div>
    </div>
  );
}


