import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Donor Map — RaktSetu" },
      { name: "description", content: "Live map of blood donors across Gujarat." },
      { property: "og:title", content: "Donor Map — RaktSetu" },
      { property: "og:description", content: "See donor locations on a live interactive map." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  // Client-only — Leaflet needs window
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    import("@/components/DonorMap").then((m) => setComp(() => m.DonorMap));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-4">
      <header>
        <h1 className="font-serif font-bold text-3xl">
          Donor <span className="text-primary">Map</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          Live donor locations across Gujarat
        </p>
      </header>
      {Comp ? <Comp /> : <div className="rs-skeleton h-[60vh] rounded-2xl" />}
    </div>
  );
}
