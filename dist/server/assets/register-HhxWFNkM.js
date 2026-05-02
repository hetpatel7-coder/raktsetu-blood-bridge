import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-IDUWrsFe.js";
import { c as createLucideIcon, a as BloodTypeSelector, L as LoaderCircle, H as HeartHandshake, z as zt, s as supabase } from "./router-dIrcSwBL.js";
import { C as CitySelector } from "./CitySelector-Ca4BmNLR.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode);
function RegisterPage() {
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [bloodType, setBloodType] = reactExports.useState(null);
  const [city, setCity] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(null);
  const submit = async () => {
    if (!name.trim() || !phone.trim() || !bloodType || !city) {
      zt.error("Please fill all fields");
      return;
    }
    setLoading(true);
    const {
      error
    } = await supabase.from("donors").insert({
      name: name.trim(),
      phone: phone.trim(),
      blood_type: bloodType,
      city,
      available: true
    });
    setLoading(false);
    if (error) {
      zt.error("Registration failed. Try again.");
      return;
    }
    zt.success("Welcome to RaktSetu!");
    setDone({
      name: name.trim(),
      bloodType
    });
  };
  if (done) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto px-4 pt-10 text-center space-y-6 animate-rs-fade-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-7xl", children: "🎉" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif font-bold text-4xl text-success", children: "You're a Hero" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-6 rs-glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-eyebrow text-muted-foreground mb-3", style: {
          color: "#888"
        }, children: "Donor Card" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center font-mono font-medium text-primary", children: done.bloodType }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif font-bold text-xl", children: done.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono mt-0.5", style: {
              fontSize: 9,
              letterSpacing: "1.5px",
              color: "#3b82f6",
              textTransform: "uppercase",
              fontWeight: 500
            }, children: "Verified" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rs-body px-4", children: "You'll receive alerts when someone nearby needs your blood." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rs-btn rs-btn-secondary inline-flex", children: "Back to Home" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 pt-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-eyebrow", children: "Join the Network" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif font-bold text-4xl leading-tight", children: [
        "Be a ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          color: "#dc2626"
        }, children: "Donor" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rs-body", children: "Register and join our network" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-5 rs-glow bg-gradient-to-br from-primary/15 to-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-serif font-bold text-xl leading-snug", children: [
        "One donation. ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          color: "#dc2626"
        }, children: "Three" }),
        " lives."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-body-sm mt-1.5", children: "India needs 2.5 crore units every year." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-5 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider", children: "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "rs-input", value: name, onChange: (e) => setName(e.target.value), placeholder: "Your name", maxLength: 80 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider", children: "Phone Number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "rs-input", type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "+91 98765 43210", maxLength: 20 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider", children: "Blood Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BloodTypeSelector, { value: bloodType, onChange: setBloodType })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider", children: "City" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CitySelector, { value: city, onChange: setCity })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-muted-foreground mb-3 uppercase tracking-wider", children: "Eligibility" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: ["Age 18–65 years", "Weight above 45 kg", "No major illness in last 6 months", "Not donated in last 3 months"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2.5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16, className: "text-success shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t })
      ] }, t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: submit, disabled: loading, className: "rs-btn rs-btn-primary w-full", children: [
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin", size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(HeartHandshake, { size: 18 }),
      loading ? "Registering…" : "Register as Donor"
    ] })
  ] });
}
export {
  RegisterPage as component
};
