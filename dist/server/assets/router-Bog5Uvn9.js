import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useLocation, Link, createRootRoute, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Home, Search, HeartHandshake, Trophy, ListChecks, Map, Flame, Settings, Droplet, Siren, X, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
const appCss = "/assets/styles-DC0M9V5Z.css";
const ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/find", label: "Find", icon: Search },
  { to: "/register", label: "Donate", icon: HeartHandshake },
  { to: "/leaderboard", label: "Top", icon: Trophy },
  { to: "/requests", label: "Requests", icon: ListChecks },
  { to: "/map", label: "Map", icon: Map },
  { to: "/heatmap", label: "Heatmap", icon: Flame },
  { to: "/admin", label: "Admin", icon: Settings }
];
function MobileNav() {
  const { pathname } = useLocation();
  return /* @__PURE__ */ jsx("nav", { className: "lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-8", children: ITEMS.map(({ to, label, icon: Icon }) => {
    const active = pathname === to;
    return /* @__PURE__ */ jsxs(
      Link,
      {
        to,
        className: `flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] relative transition-colors ${active ? "text-primary" : "text-muted-foreground"}`,
        children: [
          active && /* @__PURE__ */ jsx("span", { className: "absolute top-0 inset-x-3 h-[2px] bg-primary rounded-full" }),
          /* @__PURE__ */ jsx(Icon, { size: 18 }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "font-mono",
              style: {
                fontSize: 8,
                letterSpacing: "0.5px",
                fontWeight: 500,
                textTransform: "uppercase"
              },
              children: label
            }
          )
        ]
      },
      to
    );
  }) }) });
}
function Logo({ size = 28 }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-primary rounded-full blur-md opacity-50 animate-rs-pulse-soft" }),
      /* @__PURE__ */ jsx(
        Droplet,
        {
          size,
          className: "relative text-primary fill-primary animate-rs-pulse-soft"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "leading-tight", children: /* @__PURE__ */ jsxs("div", { className: "font-serif font-bold text-xl tracking-tight", children: [
      /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "Rakt" }),
      /* @__PURE__ */ jsx("span", { style: { color: "#dc2626" }, children: "Setu" })
    ] }) })
  ] });
}
const NAV = [
  { to: "/", label: "Home" },
  { to: "/find", label: "Find" },
  { to: "/register", label: "Donate" },
  { to: "/leaderboard", label: "🏆 Top" },
  { to: "/requests", label: "Requests" },
  { to: "/map", label: "Map" },
  { to: "/heatmap", label: "Heatmap" }
];
function DesktopNav({ onSos }) {
  const { pathname } = useLocation();
  return /* @__PURE__ */ jsx("header", { className: "hidden lg:block sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 h-16 flex items-center justify-between", children: [
    /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(Logo, {}) }),
    /* @__PURE__ */ jsx("nav", { className: "flex items-center gap-1", children: NAV.map((item) => {
      const active = pathname === item.to;
      return /* @__PURE__ */ jsx(
        Link,
        {
          to: item.to,
          className: `px-4 py-2 rounded-lg font-mono transition-colors ${active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`,
          style: {
            fontSize: 11,
            letterSpacing: "1.5px",
            fontWeight: 500,
            textTransform: "uppercase"
          },
          children: item.label
        },
        item.to
      );
    }) }),
    /* @__PURE__ */ jsxs("button", { onClick: onSos, className: "rs-btn rs-btn-sos !py-2.5 !px-4", children: [
      /* @__PURE__ */ jsx(Siren, { size: 16 }),
      " Emergency SOS"
    ] })
  ] }) });
}
function createSupabaseClient() {
  const SUPABASE_URL = "https://tacojptglmwsqejpzpxh.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhY29qcHRnbG13c3FlanB6cHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MDA5NzcsImV4cCI6MjA5MzE3Njk3N30.Uf2v677ADvRbt_K8x2PgcxF-TpBUmBdnfu2X-McrX70";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
function BottomSheet({
  open,
  onClose,
  title,
  children
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 rs-backdrop animate-rs-fade-up",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:max-w-md sm:mx-4 bg-card border border-border rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-rs-slide-up shadow-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif font-bold text-xl", children: title }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "p-2 rounded-full hover:bg-accent transition-colors",
            "aria-label": "Close",
            children: /* @__PURE__ */ jsx(X, { size: 20, className: "text-muted-foreground" })
          }
        )
      ] }),
      children
    ] })
  ] });
}
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const CITIES = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"];
const COMPATIBILITY = {
  "O+": ["O+", "O-"],
  "O-": ["O-"],
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "AB-": ["A-", "B-", "AB-", "O-"]
};
const CITY_COORDS = {
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.8311],
  Vadodara: [22.3072, 73.1812],
  Rajkot: [22.3039, 70.8022],
  Gandhinagar: [23.2156, 72.6369]
};
function BloodTypeSelector({
  value,
  onChange
}) {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: BLOOD_TYPES.map((bt) => {
    const active = value === bt;
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(bt),
        className: `font-mono font-bold py-3 rounded-xl border transition-all active:scale-95 ${active ? "bg-primary text-primary-foreground border-primary rs-glow" : "bg-card text-muted-foreground border-border hover:border-primary/60 hover:text-foreground"}`,
        children: bt
      },
      bt
    );
  }) });
}
function SosModal({ open, onClose }) {
  const [bloodType, setBloodType] = useState(null);
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
      contact_phone: phone.trim()
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
  return /* @__PURE__ */ jsx(BottomSheet, { open, onClose, title: "Emergency SOS", children: /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block rs-eyebrow text-muted-foreground mb-2", style: { color: "#888" }, children: "Blood Type" }),
      /* @__PURE__ */ jsx(BloodTypeSelector, { value: bloodType, onChange: setBloodType })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block rs-eyebrow text-muted-foreground mb-2", style: { color: "#888" }, children: "Hospital" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "rs-input",
          placeholder: "e.g. Apollo Hospital",
          value: hospital,
          onChange: (e) => setHospital(e.target.value),
          maxLength: 120
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block rs-eyebrow text-muted-foreground mb-2", style: { color: "#888" }, children: "Contact Phone" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "rs-input",
          type: "tel",
          placeholder: "+91 98765 43210",
          value: phone,
          onChange: (e) => setPhone(e.target.value),
          maxLength: 20
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: submit,
        disabled: loading,
        className: "rs-btn rs-btn-sos w-full animate-rs-pulse-glow",
        children: [
          loading ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin", size: 18 }) : /* @__PURE__ */ jsx(Siren, { size: 18 }),
          loading ? "Sending…" : "Send SOS Alert"
        ]
      }
    )
  ] }) });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center space-y-3", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-serif font-black text-primary", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif font-bold", children: "Page Not Found" }),
    /* @__PURE__ */ jsx("p", { className: "rs-body-sm", children: "This page doesn't exist." }),
    /* @__PURE__ */ jsx("a", { href: "/", className: "mt-4 inline-block rs-btn rs-btn-primary", children: "Go Home" })
  ] }) });
}
const Route$8 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#dc2626" },
      { title: "RaktSetu — Real-Time Blood Donor Network" },
      {
        name: "description",
        content: "Find blood donors near you in seconds. RaktSetu connects donors and recipients across Gujarat. Ek Boond, Ek Zindagi."
      },
      { name: "author", content: "RaktSetu" },
      { property: "og:title", content: "RaktSetu — Real-Time Blood Donor Network" },
      {
        property: "og:description",
        content: "Find compatible blood donors near you. Save lives in seconds."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      {
        rel: "icon",
        href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%A9%B8%3C/text%3E%3C/svg%3E"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "dark", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { className: "bg-background text-foreground", children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const [sosOpen, setSosOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DesktopNav, { onSos: () => setSosOpen(true) }),
    /* @__PURE__ */ jsx("main", { className: "min-h-screen pb-24 lg:pb-0", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(MobileNav, {}),
    /* @__PURE__ */ jsx(SosModal, { open: sosOpen, onClose: () => setSosOpen(false) }),
    /* @__PURE__ */ jsx(
      Toaster,
      {
        position: "top-center",
        toastOptions: {
          style: {
            background: "#111111",
            color: "#f5f5f0",
            border: "1px solid #1f1f1f",
            fontFamily: "DM Mono, ui-monospace, monospace",
            fontSize: "13px",
            borderRadius: "12px"
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#111111" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "#111111" } }
        }
      }
    )
  ] });
}
const $$splitComponentImporter$7 = () => import("./requests-DSHS2eFW.js");
const Route$7 = createFileRoute("/requests")({
  head: () => ({
    meta: [{
      title: "Live Requests — RaktSetu"
    }, {
      name: "description",
      content: "Active blood requests and SOS alerts across Gujarat in real-time."
    }, {
      property: "og:title",
      content: "Live Requests — RaktSetu"
    }, {
      property: "og:description",
      content: "See live blood requests and SOS alerts in real-time."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./register-BTHnUrfZ.js");
const Route$6 = createFileRoute("/register")({
  head: () => ({
    meta: [{
      title: "Be a Donor — RaktSetu"
    }, {
      name: "description",
      content: "Join Gujarat's blood donor network in 30 seconds. Save lives."
    }, {
      property: "og:title",
      content: "Be a Donor — RaktSetu"
    }, {
      property: "og:description",
      content: "Join the network. Save lives. 30 seconds."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./map-GXnqsNY6.js");
const Route$5 = createFileRoute("/map")({
  head: () => ({
    meta: [{
      title: "Donor Map — RaktSetu"
    }, {
      name: "description",
      content: "Live map of blood donors across Gujarat."
    }, {
      property: "og:title",
      content: "Donor Map — RaktSetu"
    }, {
      property: "og:description",
      content: "See donor locations on a live interactive map."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./leaderboard-QyCGruj3.js");
const Route$4 = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [{
      title: "Donor Leaderboard — RaktSetu"
    }, {
      name: "description",
      content: "Top blood donors saving lives across Gujarat."
    }, {
      property: "og:title",
      content: "Donor Leaderboard — RaktSetu"
    }, {
      property: "og:description",
      content: "Gujarat's heroes — ranked by donations."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./heatmap-DpZQfuvg.js");
const Route$3 = createFileRoute("/heatmap")({
  head: () => ({
    meta: [{
      title: "Blood Stock Heatmap — RaktSetu"
    }, {
      name: "description",
      content: "Real-time city-wise blood shortage heatmap across Gujarat."
    }, {
      property: "og:title",
      content: "Blood Stock Heatmap — RaktSetu"
    }, {
      property: "og:description",
      content: "Live shortage map across 5 Gujarat cities."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./find-CltWHM1M.js");
const Route$2 = createFileRoute("/find")({
  head: () => ({
    meta: [{
      title: "Find Donor — RaktSetu"
    }, {
      name: "description",
      content: "Search compatible blood donors near you across Gujarat."
    }, {
      property: "og:title",
      content: "Find Donor — RaktSetu"
    }, {
      property: "og:description",
      content: "Search compatible blood donors near you in seconds."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin-DKvTyDhd.js");
const Route$1 = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin Dashboard — RaktSetu"
    }, {
      name: "description",
      content: "RaktSetu admin dashboard."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-BGgfw20l.js");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "RaktSetu — Real-Time Blood Donor Network"
    }, {
      name: "description",
      content: "Find blood donors near you in seconds. Built for Gujarat. Ek Boond, Ek Zindagi."
    }, {
      property: "og:title",
      content: "RaktSetu — Real-Time Blood Donor Network"
    }, {
      property: "og:description",
      content: "Find compatible blood donors near you. Save lives in seconds."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const RequestsRoute = Route$7.update({
  id: "/requests",
  path: "/requests",
  getParentRoute: () => Route$8
});
const RegisterRoute = Route$6.update({
  id: "/register",
  path: "/register",
  getParentRoute: () => Route$8
});
const MapRoute = Route$5.update({
  id: "/map",
  path: "/map",
  getParentRoute: () => Route$8
});
const LeaderboardRoute = Route$4.update({
  id: "/leaderboard",
  path: "/leaderboard",
  getParentRoute: () => Route$8
});
const HeatmapRoute = Route$3.update({
  id: "/heatmap",
  path: "/heatmap",
  getParentRoute: () => Route$8
});
const FindRoute = Route$2.update({
  id: "/find",
  path: "/find",
  getParentRoute: () => Route$8
});
const AdminRoute = Route$1.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$8
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$8
});
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  FindRoute,
  HeatmapRoute,
  LeaderboardRoute,
  MapRoute,
  RegisterRoute,
  RequestsRoute
};
const routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  BottomSheet as B,
  COMPATIBILITY as C,
  SosModal as S,
  BloodTypeSelector as a,
  BLOOD_TYPES as b,
  CITIES as c,
  CITY_COORDS as d,
  router as r,
  supabase as s
};
