import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { BloodTypeSelector } from "@/components/BloodTypeSelector";
import { CitySelector } from "@/components/CitySelector";
import { COMPATIBILITY, type BloodType } from "@/lib/blood";
import { CheckCircle2, Loader2, Phone, MessageCircle, HeartPulse, Frown, Lock } from "lucide-react";

export const Route = createFileRoute("/find")({
  head: () => ({
    meta: [
      { title: "Find Donor — RaktSetu" },
      { name: "description", content: "Search compatible blood donors near you across Gujarat." },
      { property: "og:title", content: "Find Donor — RaktSetu" },
      { property: "og:description", content: "Search compatible blood donors near you in seconds." },
    ],
  }),
  component: FindPage,
});

type Donor = {
  id: string;
  name: string;
  blood_type: string;
  phone: string;
  city: string;
  available: boolean;
  donations_count: number;
  verified: boolean;
};

function FindPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [bloodType, setBloodType] = useState<BloodType | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<"normal" | "urgent" | "critical">("normal");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSignedIn(!!session);
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const search = async () => {
    if (!bloodType) return;
    setLoading(true);
    setSearched(true);
    setExpandedId(null);
    const compatible = COMPATIBILITY[bloodType];
    let q = supabase.from("donors").select("*").in("blood_type", compatible);
    if (city) q = q.eq("city", city);
    const { data, error } = await q.order("available", { ascending: false }).order("verified", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Search failed. Try again.");
      return;
    }
    setDonors(data ?? []);
  };

  const sendRequest = async (donor: Donor) => {
    const { error } = await supabase.from("blood_requests").insert({
      blood_type: donor.blood_type,
      hospital: "Direct request",
      city: donor.city,
      urgency,
      contact_phone: donor.phone,
    });
    if (error) toast.error("Failed to send request");
    else toast.success(`Request sent to ${donor.name}`);
  };

  const available = donors.filter((d) => d.available).length;

  if (!authChecked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 pt-10">
        <div className="rs-card p-8 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center">
            <Lock className="text-primary" size={24} />
          </div>
          <h1 className="font-serif font-bold text-2xl">Sign in required</h1>
          <p className="rs-body-sm">
            To protect donor privacy, contact details are only visible to signed-in users.
          </p>
          <Link to="/admin" className="rs-btn rs-btn-primary w-full">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
      <header className="space-y-2">
        <div className="rs-eyebrow">Nearby Donors</div>
        <h1 className="font-serif font-bold text-4xl leading-tight">
          Find <span style={{ color: "#dc2626" }}>Donor</span>
        </h1>
        <p className="rs-body">Search verified donors by blood type</p>
      </header>

      <div className="rs-card p-5 space-y-5">
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider">
            Blood Type Needed
          </label>
          <BloodTypeSelector value={bloodType} onChange={setBloodType} />
        </div>

        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider">
            City
          </label>
          <CitySelector value={city} onChange={setCity} />
        </div>

        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider">
            Urgency
          </label>
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
                    ? "bg-primary/15 border-primary text-foreground"
                    : "bg-card border-border text-muted-foreground"
                }`}
              >
                {u.e} {u.l}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={search}
          disabled={!bloodType || loading}
          className="rs-btn rs-btn-primary w-full"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <HeartPulse size={18} />}
          {loading ? "Searching…" : "Find Donors"}
        </button>
      </div>

      {/* Results */}
      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rs-skeleton h-20 rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && searched && donors.length === 0 && (
        <div className="rs-card p-8 text-center space-y-3">
          <Frown size={40} className="mx-auto text-muted-foreground" />
          <div className="font-serif font-bold text-lg">No Donors Found</div>
          <p className="rs-body-sm">
            Try Emergency SOS to alert nearby donors instantly.
          </p>
        </div>
      )}

      {!loading && donors.length > 0 && (
        <div className="space-y-3">
          <div className="rs-eyebrow px-1">
            <span className="text-success">● {available} Available</span>
            <span className="mx-2 text-text-muted">·</span>
            <span className="text-muted-foreground">{donors.length} Compatible</span>
          </div>

          {donors.map((d, i) => {
            const isExpanded = expandedId === d.id;
            return (
              <div
                key={d.id}
                className={`rs-card transition-all animate-rs-fade-up ${
                  d.available ? "rs-card-hover" : "opacity-50"
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : d.id)}
                  className="w-full p-4 flex items-center gap-4 text-left"
                >
                  <div
                    className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-sm border-2 ${
                      d.available
                        ? "bg-primary/15 border-primary text-primary"
                        : "bg-muted border-border text-muted-foreground"
                    }`}
                  >
                    {d.blood_type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold truncate">{d.name}</span>
                      {d.verified && (
                        <CheckCircle2 size={14} className="text-success shrink-0" />
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
                      {d.donations_count} donations • {d.city}
                    </div>
                  </div>
                  <div
                    className={`shrink-0 px-2.5 py-1 rounded-full rs-pill ${
                      d.available
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d.available ? "● Available" : "○ Busy"}
                  </div>
                </button>

                {isExpanded && d.available && (
                  <div className="px-4 pb-4 pt-1 grid grid-cols-3 gap-2 animate-rs-fade-up">
                    <a
                      href={`tel:${d.phone}`}
                      className="rs-btn rs-btn-secondary !py-2.5"
                    >
                      <Phone size={14} /> Call
                    </a>
                    <a
                      href={`https://wa.me/${d.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rs-btn rs-btn-secondary !py-2.5"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                    <button
                      onClick={() => sendRequest(d)}
                      className="rs-btn rs-btn-primary !py-2.5"
                    >
                      🩸 Request
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
