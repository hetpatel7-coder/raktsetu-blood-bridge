import { T as jsxRuntimeExports } from "./worker-entry-IDUWrsFe.js";
import { e as CITIES } from "./router-dIrcSwBL.js";
function CitySelector({
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none", children: CITIES.map((c) => {
    const active = value === c;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(c),
        className: `shrink-0 px-4 py-2 rounded-full font-mono text-sm border transition-all active:scale-95 ${active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/60"}`,
        children: c
      },
      c
    );
  }) });
}
export {
  CitySelector as C
};
