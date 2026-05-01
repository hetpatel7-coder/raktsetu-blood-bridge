import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { BottomSheet } from "./BottomSheet";
import { BloodTypeSelector } from "./BloodTypeSelector";
import type { BloodType } from "@/lib/blood";
import { Loader2, Siren } from "lucide-react";

export function SosModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [bloodType, setBloodType] = useState<BloodType | null>(null);
  const [hospital, setHospital] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!bloodType || !hospital.trim() || !phone.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("sos_alerts").insert({
      blood_type: bloodType,
      hospital: hospital.trim(),
      contact_phone: phone.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to send. Try again.");
      return;
    }
    toast.success("🚨 SOS sent. Donors are being alerted.");
    setBloodType(null);
    setHospital("");
    setPhone("");
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="🚨 Emergency SOS">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-mono text-muted-foreground mb-2">
            BLOOD TYPE
          </label>
          <BloodTypeSelector value={bloodType} onChange={setBloodType} />
        </div>
        <div>
          <label className="block text-sm font-mono text-muted-foreground mb-2">
            HOSPITAL
          </label>
          <input
            className="rs-input"
            placeholder="e.g. Apollo Hospital"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            maxLength={120}
          />
        </div>
        <div>
          <label className="block text-sm font-mono text-muted-foreground mb-2">
            CONTACT PHONE
          </label>
          <input
            className="rs-input"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
          />
        </div>
        <button
          onClick={submit}
          disabled={loading}
          className="rs-btn rs-btn-sos w-full animate-rs-pulse-glow"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Siren size={18} />
          )}
          {loading ? "SENDING..." : "SEND SOS ALERT"}
        </button>
      </div>
    </BottomSheet>
  );
}
