import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import toast from "react-hot-toast";
import { a as BloodTypeSelector, s as supabase, C as COMPATIBILITY } from "./router-BKiHaXnY.js";
import { C as CitySelector } from "./CitySelector-BrVCJ73t.js";
import { Loader2, HeartPulse, Frown, CheckCircle2, Phone, MessageCircle } from "lucide-react";
import "@tanstack/react-router";
import "@supabase/supabase-js";
function FindPage() {
  const [bloodType, setBloodType] = useState(null);
  const [city, setCity] = useState(null);
  const [urgency, setUrgency] = useState("normal");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [donors, setDonors] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
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
      toast.error("Search failed. Try again.");
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
    if (error) toast.error("Failed to send request");
    else toast.success(`Request sent to ${donor.name}`);
  };
  const available = donors.filter((d) => d.available).length;
  return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "rs-eyebrow", children: "Nearby Donors" }),
      /* @__PURE__ */ jsxs("h1", { className: "font-serif font-bold text-4xl leading-tight", children: [
        "Find ",
        /* @__PURE__ */ jsx("span", { style: {
          color: "#dc2626"
        }, children: "Donor" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "rs-body", children: "Search verified donors by blood type" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rs-card p-5 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider", children: "Blood Type Needed" }),
        /* @__PURE__ */ jsx(BloodTypeSelector, { value: bloodType, onChange: setBloodType })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider", children: "City" }),
        /* @__PURE__ */ jsx(CitySelector, { value: city, onChange: setCity })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider", children: "Urgency" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: [{
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
        }].map((u) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setUrgency(u.k), className: `py-2.5 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all active:scale-95 ${urgency === u.k ? "bg-primary/15 border-primary text-foreground" : "bg-card border-border text-muted-foreground"}`, children: [
          u.e,
          " ",
          u.l
        ] }, u.k)) })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: search, disabled: !bloodType || loading, className: "rs-btn rs-btn-primary w-full", children: [
        loading ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin", size: 18 }) : /* @__PURE__ */ jsx(HeartPulse, { size: 18 }),
        loading ? "Searching…" : "Find Donors"
      ] })
    ] }),
    loading && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx("div", { className: "rs-skeleton h-20 rounded-2xl" }, i)) }),
    !loading && searched && donors.length === 0 && /* @__PURE__ */ jsxs("div", { className: "rs-card p-8 text-center space-y-3", children: [
      /* @__PURE__ */ jsx(Frown, { size: 40, className: "mx-auto text-muted-foreground" }),
      /* @__PURE__ */ jsx("div", { className: "font-serif font-bold text-lg", children: "No Donors Found" }),
      /* @__PURE__ */ jsx("p", { className: "rs-body-sm", children: "Try Emergency SOS to alert nearby donors instantly." })
    ] }),
    !loading && donors.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "rs-eyebrow px-1", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-success", children: [
          "● ",
          available,
          " Available"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "mx-2 text-text-muted", children: "·" }),
        /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
          donors.length,
          " Compatible"
        ] })
      ] }),
      donors.map((d, i) => {
        const isExpanded = expandedId === d.id;
        return /* @__PURE__ */ jsxs("div", { className: `rs-card transition-all animate-rs-fade-up ${d.available ? "rs-card-hover" : "opacity-50"}`, style: {
          animationDelay: `${i * 40}ms`
        }, children: [
          /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setExpandedId(isExpanded ? null : d.id), className: "w-full p-4 flex items-center gap-4 text-left", children: [
            /* @__PURE__ */ jsx("div", { className: `shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-sm border-2 ${d.available ? "bg-primary/15 border-primary text-primary" : "bg-muted border-border text-muted-foreground"}`, children: d.blood_type }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "font-serif font-bold truncate", children: d.name }),
                d.verified && /* @__PURE__ */ jsx(CheckCircle2, { size: 14, className: "text-success shrink-0" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "font-mono text-[11px] text-muted-foreground mt-0.5", children: [
                d.donations_count,
                " donations • ",
                d.city
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `shrink-0 px-2.5 py-1 rounded-full rs-pill ${d.available ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`, children: d.available ? "● Available" : "○ Busy" })
          ] }),
          isExpanded && d.available && /* @__PURE__ */ jsxs("div", { className: "px-4 pb-4 pt-1 grid grid-cols-3 gap-2 animate-rs-fade-up", children: [
            /* @__PURE__ */ jsxs("a", { href: `tel:${d.phone}`, className: "rs-btn rs-btn-secondary !py-2.5", children: [
              /* @__PURE__ */ jsx(Phone, { size: 14 }),
              " Call"
            ] }),
            /* @__PURE__ */ jsxs("a", { href: `https://wa.me/${d.phone.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "rs-btn rs-btn-secondary !py-2.5", children: [
              /* @__PURE__ */ jsx(MessageCircle, { size: 14 }),
              " WhatsApp"
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => sendRequest(d), className: "rs-btn rs-btn-primary !py-2.5", children: "🩸 Request" })
          ] })
        ] }, d.id);
      })
    ] })
  ] });
}
export {
  FindPage as component
};
