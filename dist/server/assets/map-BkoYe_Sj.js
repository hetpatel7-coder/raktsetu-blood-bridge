import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-IDUWrsFe.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function MapPage() {
  const [Comp, setComp] = reactExports.useState(null);
  reactExports.useEffect(() => {
    import("./DonorMap-BMYhMuwI.js").then((m) => setComp(() => m.DonorMap));
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-eyebrow", children: "Live Coverage" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif font-bold text-4xl leading-tight", children: [
        "Donor ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          color: "#dc2626"
        }, children: "Map" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rs-body", children: "Live donor locations across Gujarat" })
    ] }),
    Comp ? /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-skeleton h-[60vh] rounded-2xl" })
  ] });
}
export {
  MapPage as component
};
