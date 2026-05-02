import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
function MapPage() {
  const [Comp, setComp] = useState(null);
  useEffect(() => {
    import("./DonorMap-ooGJyXzk.js").then((m) => setComp(() => m.DonorMap));
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-4", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "rs-eyebrow", children: "Live Coverage" }),
      /* @__PURE__ */ jsxs("h1", { className: "font-serif font-bold text-4xl leading-tight", children: [
        "Donor ",
        /* @__PURE__ */ jsx("span", { style: {
          color: "#dc2626"
        }, children: "Map" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "rs-body", children: "Live donor locations across Gujarat" })
    ] }),
    Comp ? /* @__PURE__ */ jsx(Comp, {}) : /* @__PURE__ */ jsx("div", { className: "rs-skeleton h-[60vh] rounded-2xl" })
  ] });
}
export {
  MapPage as component
};
