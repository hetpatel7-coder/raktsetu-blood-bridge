import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { BloodTypeSelector } from "@/components/BloodTypeSelector";
import { CitySelector } from "@/components/CitySelector";
import type { BloodType } from "@/lib/blood";
import { Check, Loader2, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Be a Donor — RaktSetu" },
      { name: "description", content: "Join Gujarat's blood donor network in 30 seconds. Save lives." },
      { property: "og:title", content: "Be a Donor — RaktSetu" },
      { property: "og:description", content: "Join the network. Save lives. 30 seconds." },
    ],
  }),
  component: RegisterPage,
});

const DECLARATION_ITEMS = [
  "No fever or illness in last 7 days",
  "No antibiotics taken in last 14 days",
  "Not donated blood in last 56 days",
  "No HIV, Hepatitis B/C, or TB",
  "Weight above 50 kg",
  "Age between 18 and 65 years",
] as const;

function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodType, setBloodType] = useState<BloodType | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [checks, setChecks] = useState<boolean[]>(() => DECLARATION_ITEMS.map(() => false));
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ name: string; bloodType: string } | null>(null);

  const allChecked = checks.every(Boolean);

  const toggleCheck = (i: number) =>
    setChecks((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const submit = async () => {
    if (!name.trim() || !phone.trim() || !bloodType || !city) {
      toast.error("Please fill all fields");
      return;
    }
    if (!allChecked) {
      toast.error("You must meet all criteria to register as a donor. This ensures patient safety.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("donors").insert({
      name: name.trim(),
      phone: phone.trim(),
      blood_type: bloodType,
      city,
      available: true,
      last_declaration_date: new Date().toISOString(),
    });
    setLoading(false);
    if (error) {
      toast.error("Registration failed. Try again.");
      return;
    }
    toast.success("Welcome to RaktSetu!");
    setDone({ name: name.trim(), bloodType });
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10 text-center space-y-6 animate-rs-fade-up">
        <div className="text-7xl">🎉</div>
        <h1 className="font-serif font-bold text-4xl text-success">You're a Hero</h1>
        <div className="rs-card p-6 rs-glow">
          <div className="rs-eyebrow text-muted-foreground mb-3" style={{ color: "#888" }}>
            Donor Card
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center font-mono font-medium text-primary">
              {done.bloodType}
            </div>
            <div className="text-left">
              <div className="font-serif font-bold text-xl">{done.name}</div>
              <div
                className="font-mono mt-0.5"
                style={{
                  fontSize: 9,
                  letterSpacing: "1.5px",
                  color: "#eab308",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Self Declared
              </div>
            </div>
          </div>
        </div>
        <p className="rs-body px-4">
          You'll receive alerts when someone nearby needs your blood.
        </p>
        <a href="/" className="rs-btn rs-btn-secondary inline-flex">
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
      <header className="space-y-2">
        <div className="rs-eyebrow">Join the Network</div>
        <h1 className="font-serif font-bold text-4xl leading-tight">
          Be a <span style={{ color: "#dc2626" }}>Donor</span>
        </h1>
        <p className="rs-body">Register and join our network</p>
      </header>

      <div className="rs-card p-5 rs-glow bg-gradient-to-br from-primary/15 to-card">
        <div className="font-serif font-bold text-xl leading-snug">
          One donation. <span style={{ color: "#dc2626" }}>Three</span> lives.
        </div>
        <div className="rs-body-sm mt-1.5">
          India needs 2.5 crore units every year.
        </div>
      </div>

      <div className="rs-card p-5 space-y-5">
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider">
            Full Name
          </label>
          <input
            className="rs-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={80}
          />
        </div>
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider">
            Phone Number
          </label>
          <input
            className="rs-input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            maxLength={20}
          />
        </div>
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider">
            Blood Type
          </label>
          <BloodTypeSelector value={bloodType} onChange={setBloodType} />
        </div>
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider">
            City
          </label>
          <CitySelector value={city} onChange={setCity} />
        </div>
      </div>

      {/* Mandatory Health Declaration */}
      <div
        className="rs-card p-5"
        style={{
          border: allChecked ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(220,38,38,0.35)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="font-mono text-xs uppercase tracking-wider" style={{ color: "#dc2626" }}>
            Mandatory Health Declaration
          </div>
        </div>
        <p className="rs-body-sm mb-4" style={{ color: "#8a8a80" }}>
          All 6 must be true. This protects patients receiving your blood.
        </p>
        <ul className="space-y-2">
          {DECLARATION_ITEMS.map((label, i) => {
            const isOn = checks[i];
            return (
              <li key={label}>
                <label
                  className="flex items-start gap-3 cursor-pointer rounded-xl p-2.5 transition-colors"
                  style={{
                    background: isOn ? "rgba(34,197,94,0.06)" : "transparent",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleCheck(i)}
                    aria-pressed={isOn}
                    aria-label={label}
                    className="shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all"
                    style={{
                      background: isOn ? "#22c55e" : "transparent",
                      border: isOn ? "1.5px solid #22c55e" : "1.5px solid #3a3a3a",
                    }}
                  >
                    {isOn && <Check size={13} strokeWidth={3} color="#0a0a0a" />}
                  </button>
                  <span
                    className="text-sm leading-snug select-none"
                    style={{ color: isOn ? "#f5f5f0" : "#c8c8c0" }}
                    onClick={() => toggleCheck(i)}
                  >
                    {label}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        {!allChecked && (
          <p
            className="mt-3 font-mono text-[11px]"
            style={{ color: "#dc2626", letterSpacing: "0.3px" }}
          >
            ⚠ You must meet all criteria to register as a donor.
          </p>
        )}
      </div>

      <button
        onClick={submit}
        disabled={loading || !allChecked}
        className="rs-btn rs-btn-primary w-full"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <HeartHandshake size={18} />}
        {loading ? "Registering…" : "Register as Donor"}
      </button>
    </div>
  );
}
