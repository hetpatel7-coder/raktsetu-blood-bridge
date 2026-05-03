import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { BottomSheet } from "@/components/BottomSheet";
import { BloodTypeSelector } from "@/components/BloodTypeSelector";
import { CitySelector } from "@/components/CitySelector";
import type { BloodType } from "@/lib/blood";
import { Phone, Plus, Loader2, CheckCircle, Siren } from "lucide-react";

export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      { title: "Live Requests — RaktSetu" },
      { name: "description", content: "Active blood requests and SOS alerts across Gujarat in real-time." },
      { property: "og:title", content: "Live Requests — RaktSetu" },
      { property: "og:description", content: "See live blood requests and SOS alerts in real-time." },
    ],
  }),
  component: RequestsPage,
});

type BloodRequest = {
  id: string;
  patient_name: string | null;
  blood_type: string;
  hospital: string;
  city: string | null;
  urgency: string;
  contact_phone: string;
  status: string;
  created_at: string;
};

type SosAlert = {
  id: string;
  blood_type: string;
  hospital: string;
  contact_phone: string;
  status: string;
  created_at: string;
};

const URGENCY_RANK: Record<string, number> = { critical: 0, urgent: 1, normal: 2 };

function RequestsPage() {
  const [tab, setTab] = useState<"requests" | "sos">("requests");
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [sos, setSos] = useState<SosAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [postOpen, setPostOpen] = useState(false);

  const load = async () => {
    const [r, s] = await Promise.all([
      supabase
        .from("blood_requests")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false }),
      supabase
        .from("sos_alerts")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false }),
    ]);
    const sorted = (r.data ?? []).sort(
      (a, b) =>
        (URGENCY_RANK[a.urgency] ?? 9) - (URGENCY_RANK[b.urgency] ?? 9) ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setRequests(sorted);
    setSos(s.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("rs-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blood_requests" },
        (p) => {
          load();
          if (p.eventType === "INSERT") toast.success("🩸 New blood request!");
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sos_alerts" },
        (p) => {
          load();
          if (p.eventType === "INSERT") toast.error("🚨 New SOS alert!");
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const markFulfilled = async (id: string) => {
    const { error } = await supabase
      .from("blood_requests")
      .update({ status: "fulfilled" })
      .eq("id", id);
    if (error) toast.error("Failed to update");
    else toast.success("Marked fulfilled");
  };

  const resolveSos = async (id: string) => {
    const { error } = await supabase.from("sos_alerts").update({ status: "resolved" }).eq("id", id);
    if (error) toast.error("Failed to update");
    else toast.success("SOS resolved");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-5">
      <header className="flex items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="rs-eyebrow">Live Request</div>
          <h1 className="font-serif font-bold text-4xl leading-tight">
            Live <span style={{ color: "#dc2626" }}>Requests</span>
          </h1>
          <p className="rs-body">View active requests near you</p>
        </div>
        <button onClick={() => setPostOpen(true)} className="rs-btn rs-btn-primary !py-2.5 !px-3">
          <Plus size={14} /> Post
        </button>
      </header>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-card border border-border rounded-2xl">
        {(
          [
            { k: "requests", l: `Requests (${requests.length})` },
            { k: "sos", l: `SOS (${sos.length})` },
          ] as const
        ).map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
              tab === t.k ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {t.l.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rs-skeleton h-24 rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && tab === "requests" && (
        <div className="space-y-3">
          {requests.length === 0 && (
            <div className="rs-card p-8 text-center font-mono text-sm text-muted-foreground">
              No active requests. 🙌
            </div>
          )}
          {requests.map((r, i) => {
            const tone =
              r.urgency === "critical"
                ? "border-primary bg-primary/8"
                : r.urgency === "urgent"
                ? "border-warning/60 bg-warning/5"
                : "border-success/40 bg-success/5";
            const badge =
              r.urgency === "critical"
                ? "bg-primary text-primary-foreground"
                : r.urgency === "urgent"
                ? "bg-warning/20 text-warning"
                : "bg-success/20 text-success";
            return (
              <div
                key={r.id}
                className={`border rounded-2xl p-4 animate-rs-fade-up ${tone}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center font-mono font-bold text-primary text-sm">
                    {r.blood_type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-bold">
                        {r.patient_name || "Anonymous"}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full rs-pill ${badge}`}>
                        {r.urgency}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground mt-1 truncate">
                      {r.hospital}
                      {r.city ? ` • ${r.city}` : ""}
                    </div>
                    <div className="font-mono text-[10px] text-text-muted mt-0.5">
                      {formatDistanceToNowStrict(new Date(r.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <a href={`tel:${r.contact_phone}`} className="rs-btn rs-btn-primary !py-2.5">
                    <Phone size={14} /> Call
                  </a>
                  <button
                    onClick={() => markFulfilled(r.id)}
                    className="rs-btn rs-btn-secondary !py-2.5"
                  >
                    <CheckCircle size={14} /> Fulfilled
                  </button>
                </div>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `🚨 URGENT BLOOD NEEDED 🚨\n\nBlood Type: ${r.blood_type}\nHospital: ${r.hospital}\nCity: ${r.city ?? "—"}\nUrgency: ${r.urgency}\nContact: ${r.contact_phone}\n\nPlease help or share with someone who can donate. Every minute counts.\n\n— Shared via RaktSetu App\nhttps://raktsetu-blood-bridge.vercel.app`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-[10px] py-2.5 font-mono uppercase active:scale-95 transition-transform"
                  style={{
                    background: "rgba(37,211,102,0.1)",
                    border: "1px solid rgba(37,211,102,0.3)",
                    color: "#25d366",
                    fontSize: 11,
                    letterSpacing: "1px",
                  }}
                >
                  💬 Share on WhatsApp
                </a>
              </div>
            );
          })}
        </div>
      )}

      {!loading && tab === "sos" && (
        <div className="space-y-3">
          {sos.length === 0 && (
            <div className="rs-card p-8 text-center font-mono text-sm text-muted-foreground">
              No active SOS alerts. 🙏
            </div>
          )}
          {sos.map((s, i) => (
            <div
              key={s.id}
              className="border-2 border-primary rounded-2xl p-4 animate-rs-pulse-glow animate-rs-fade-up bg-primary/5"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-sm">
                  {s.blood_type}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Siren size={14} className="text-primary" />
                    <span className="font-serif font-bold">Active Emergency</span>
                  </div>
                  <div className="rs-body-sm mt-1 truncate">
                    {s.hospital}
                  </div>
                  <div
                    className="font-mono mt-0.5"
                    style={{ fontSize: 10, color: "#555", letterSpacing: "0.5px" }}
                  >
                    {formatDistanceToNowStrict(new Date(s.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <a href={`tel:${s.contact_phone}`} className="rs-btn rs-btn-sos !py-3">
                  <Phone size={14} /> Call Now
                </a>
                <button
                  onClick={() => resolveSos(s.id)}
                  className="rs-btn rs-btn-secondary !py-3"
                >
                  <CheckCircle size={14} /> Resolve
                </button>
              </div>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🚨 SOS BLOOD ALERT 🚨\n\nEMERGENCY: ${s.blood_type} blood needed\nHospital: ${s.hospital}\nCall NOW: ${s.contact_phone}\n\n— RaktSetu Emergency Alert\nhttps://raktsetu-blood-bridge.vercel.app`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-[10px] py-2.5 font-mono uppercase active:scale-95 transition-transform"
                style={{
                  background: "rgba(37,211,102,0.1)",
                  border: "1px solid rgba(37,211,102,0.3)",
                  color: "#25d366",
                  fontSize: 11,
                  letterSpacing: "1px",
                }}
              >
                💬 Share on WhatsApp
              </a>
            </div>
          ))}
        </div>
      )}

      <PostRequestModal open={postOpen} onClose={() => setPostOpen(false)} />
    </div>
  );
}

function PostRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [bt, setBt] = useState<BloodType | null>(null);
  const [hospital, setHospital] = useState("");
  const [city, setCity] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<"normal" | "urgent" | "critical">("normal");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!bt || !hospital.trim() || !phone.trim()) {
      toast.error("Blood type, hospital, and phone are required");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("blood_requests").insert({
      patient_name: name.trim() || null,
      blood_type: bt,
      hospital: hospital.trim(),
      city,
      urgency,
      contact_phone: phone.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to post");
      return;
    }
    toast.success("Request posted!");
    setName(""); setBt(null); setHospital(""); setCity(null); setUrgency("normal"); setPhone("");
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Post Request">
      <div className="space-y-4">
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase">
            Patient Name (optional)
          </label>
          <input className="rs-input" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
        </div>
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase">Blood Type</label>
          <BloodTypeSelector value={bt} onChange={setBt} />
        </div>
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase">Hospital</label>
          <input className="rs-input" value={hospital} onChange={(e) => setHospital(e.target.value)} maxLength={120} />
        </div>
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase">City</label>
          <CitySelector value={city} onChange={setCity} />
        </div>
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase">Urgency</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { k: "normal", e: "🟢", l: "Normal" },
              { k: "urgent", e: "🟡", l: "Urgent" },
              { k: "critical", e: "🔴", l: "Critical" },
            ].map((u) => (
              <button
                key={u.k}
                type="button"
                onClick={() => setUrgency(u.k as typeof urgency)}
                className={`py-2.5 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all active:scale-95 ${
                  urgency === u.k
                    ? "bg-primary/15 border-primary"
                    : "bg-card border-border text-muted-foreground"
                }`}
              >
                {u.e} {u.l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase">Contact Phone</label>
          <input className="rs-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} />
        </div>
        <button onClick={submit} disabled={loading} className="rs-btn rs-btn-primary w-full">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          {loading ? "Posting…" : "Post Request"}
        </button>
      </div>
    </BottomSheet>
  );
}
