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

function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodType, setBloodType] = useState<BloodType | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ name: string; bloodType: string } | null>(null);

  const submit = async () => {
    if (!name.trim() || !phone.trim() || !bloodType || !city) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("donors").insert({
      name: name.trim(),
      phone: phone.trim(),
      blood_type: bloodType,
      city,
      available: true,
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
        <h1 className="font-serif font-bold text-3xl text-success">You're a Hero!</h1>
        <div className="rs-card p-6 rs-glow">
          <div className="font-mono text-xs text-muted-foreground uppercase mb-3">
            Donor Card
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center font-mono font-bold text-primary">
              {done.bloodType}
            </div>
            <div className="text-left">
              <div className="font-serif font-bold text-xl">{done.name}</div>
              <div className="font-mono text-xs text-muted-foreground">Verified Donor</div>
            </div>
          </div>
        </div>
        <p className="font-mono text-sm text-muted-foreground px-4">
          You'll receive alerts when someone nearby needs your blood.
        </p>
        <a href="/" className="rs-btn rs-btn-secondary inline-flex">
          BACK TO HOME
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
      <header>
        <h1 className="font-serif font-bold text-3xl">
          Be a <span className="text-primary">Donor</span>
        </h1>
        <p className="font-mono text-sm text-muted-foreground mt-1">
          Join the network. Save lives. 30 seconds.
        </p>
      </header>

      <div className="rs-card p-5 rs-glow bg-gradient-to-br from-primary/15 to-card">
        <div className="font-serif font-bold text-lg leading-snug">
          One donation can save up to <span className="text-primary">3 lives</span>
        </div>
        <div className="font-mono text-xs text-muted-foreground mt-1">
          India needs 2.5 crore units every year
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

      <div className="rs-card p-5">
        <div className="font-mono text-xs text-muted-foreground mb-3 uppercase tracking-wider">
          Eligibility
        </div>
        <ul className="space-y-2.5">
          {[
            "Age 18–65 years",
            "Weight above 45 kg",
            "No major illness in last 6 months",
            "Not donated in last 3 months",
          ].map((t) => (
            <li key={t} className="flex items-center gap-2.5 text-sm">
              <Check size={16} className="text-success shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={submit} disabled={loading} className="rs-btn rs-btn-primary w-full">
        {loading ? <Loader2 className="animate-spin" size={18} /> : <HeartHandshake size={18} />}
        {loading ? "REGISTERING..." : "REGISTER AS DONOR"}
      </button>
    </div>
  );
}
