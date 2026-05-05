import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { supabase } from "@/integrations/supabase/client";
import { BLOOD_TYPES, CITY_COORDS, type BloodType } from "@/lib/blood";
import { Locate, Loader2 } from "lucide-react";

type Donor = {
  id: string;
  name: string;
  blood_type: string;
  city: string;
  available: boolean;
  lat: number | null;
  lng: number | null;
};

export function DonorMap() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBt, setFilterBt] = useState<BloodType | "all">("all");
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [23.0225, 72.5714],
      zoom: 11,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Load donors
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("donors_public")
        .select("id, name, blood_type, city, available, lat, lng");
      setDonors(data ?? []);
      setLoading(false);
    })();
  }, []);

  // Render markers
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();

    const filtered = donors.filter((d) => {
      if (onlyAvailable && !d.available) return false;
      if (filterBt !== "all" && d.blood_type !== filterBt) return false;
      return true;
    });

    filtered.forEach((d) => {
      const [lat, lng] =
        d.lat != null && d.lng != null
          ? [d.lat, d.lng]
          : CITY_COORDS[d.city] ?? [23.0225, 72.5714];

      const color = d.available ? "#dc2626" : "#555";
      const html = `
        <div style="
          width:34px;height:34px;border-radius:50%;
          background:${color};color:white;font-family:'Courier New',monospace;
          font-weight:700;font-size:11px;display:flex;align-items:center;justify-content:center;
          border:2px solid #080808;box-shadow:0 0 12px ${color}aa;">
          ${d.blood_type}
        </div>`;
      const icon = L.divIcon({
        html,
        className: "",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      L.marker([lat, lng], { icon })
        .bindPopup(
          `<div style="font-family:Georgia,serif;">
            <div style="font-weight:700;font-size:14px;">${d.name}</div>
            <div style="font-family:'Courier New',monospace;font-size:11px;color:#888;margin-top:2px;">
              ${d.blood_type} • ${d.city} • ${d.available ? "Available" : "Busy"}
            </div>
            <a href="tel:${d.phone}" style="
              display:inline-block;margin-top:8px;padding:6px 12px;
              background:#dc2626;color:white;border-radius:8px;text-decoration:none;
              font-family:'Courier New',monospace;font-weight:700;font-size:11px;">
              📞 CALL
            </a>
          </div>`
        )
        .addTo(layer);
    });
  }, [donors, filterBt, onlyAvailable]);

  const myLocation = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current!.setView([pos.coords.latitude, pos.coords.longitude], 13);
      },
      () => {}
    );
  };

  return (
    <div className="relative h-[calc(100vh-8rem)] lg:h-[calc(100vh-7rem)] -mx-4 sm:-mx-6 lg:mx-0 lg:rounded-2xl overflow-hidden border-y lg:border border-border">
      {/* Controls overlay */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-col gap-2 pointer-events-none">
        <div className="flex gap-2 flex-wrap pointer-events-auto">
          <select
            value={filterBt}
            onChange={(e) => setFilterBt(e.target.value as BloodType | "all")}
            className="rs-input !py-2 !px-3 text-xs max-w-[140px]"
          >
            <option value="all">All Types</option>
            {BLOOD_TYPES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <button
            onClick={() => setOnlyAvailable((v) => !v)}
            className={`px-3 py-2 rounded-xl border font-mono text-xs font-bold transition-all ${
              onlyAvailable
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground"
            }`}
          >
            AVAILABLE ONLY
          </button>
          <button
            onClick={myLocation}
            className="px-3 py-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-primary font-mono text-xs font-bold transition-all"
          >
            <Locate size={14} className="inline -mt-0.5 mr-1" /> ME
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-card/90 backdrop-blur-md border border-border rounded-xl p-3 font-mono text-[10px] space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary rs-glow" /> Available
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-muted-foreground" /> Unavailable
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}

      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
