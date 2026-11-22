"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { trip } from "@/lib/trip";
import type { LatLng } from "@/lib/trip-types";

type View = "all" | "andaman";

const LEG_STYLE = {
  flight: { color: "#e8664a", dashArray: "6 8", weight: 2.5 },
  boat: { color: "#0284c7", dashArray: "2 6", weight: 3 },
  ground: { color: "#146864", dashArray: undefined, weight: 3 },
} as const;

function coordsOf(id: string): LatLng | undefined {
  return trip.destinations.find((d) => d.id === id)?.coordinates ?? trip.mapPoints.find((p) => p.id === id)?.coordinates;
}

/** OpenStreetMap tiles via Leaflet — no API key needed. */
export function TripMap() {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const [view, setView] = useState<View>("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current || mapRef.current) return;
      const map = L.map(el.current, { scrollWheelZoom: false });
      mapRef.current = map;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      for (const leg of trip.route) {
        const a = coordsOf(leg.from);
        const b = coordsOf(leg.to);
        if (a && b) L.polyline([a, b], { ...LEG_STYLE[leg.mode], opacity: 0.9 }).addTo(map);
      }
      for (const p of trip.mapPoints) {
        L.circleMarker(p.coordinates, { radius: 5, color: "#fff", weight: 2, fillColor: p.kind === "airport" ? "#e8664a" : "#0284c7", fillOpacity: 1 })
          .bindPopup(`${p.kind === "airport" ? "✈️" : "⛴️"} ${p.label}`)
          .addTo(map);
      }
      trip.destinations.forEach((d, i) => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="background:#146864;color:#fff;border:2px solid #fff;border-radius:9999px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font:600 13px system-ui;box-shadow:0 1px 4px rgba(0,0,0,.35)">${i + 1}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });
        L.marker(d.coordinates, { icon, title: d.name })
          .bindPopup(`<strong>${i + 1}. ${d.name}</strong><br>${d.checkIn.slice(8)}–${d.checkOut.slice(8)} ian. · ${d.nights} nopți<br><em>Zonă aproximativă</em>`)
          .addTo(map);
      });
      fit(map, "all", L);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    (async () => {
      const L = (await import("leaflet")).default;
      if (mapRef.current) fit(mapRef.current, view, L);
    })();
  }, [view]);

  return (
    <div>
      <div className="mb-2 flex gap-2" role="group" aria-label="Zonă hartă">
        {(
          [
            ["all", "Tot traseul"],
            ["andaman", "Krabi – Ko Yao Noi – Phuket"],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            type="button"
            aria-pressed={view === v}
            onClick={() => setView(v)}
            className={`rounded-full px-3 py-1.5 text-sm ${view === v ? "bg-lagoon-700 text-white" : "border border-stone-300 bg-white"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div ref={el} className="h-[60vh] min-h-[360px] w-full overflow-hidden rounded-2xl border border-stone-200 bg-lagoon-50" />
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
        <li>
          <span className="text-lagoon-700">━━</span> terestru
        </li>
        <li>
          <span className="text-coral-600">╍╍</span> zbor
        </li>
        <li>
          <span className="text-sky-600">┈┈</span> barcă
        </li>
      </ul>
    </div>
  );
}

function fit(map: import("leaflet").Map, view: View, L: typeof import("leaflet")) {
  const ids = view === "all" ? null : ["krabi", "yaonoi", "phuket", "kbv", "hkt", "nopparat", "manoh", "bangrong"];
  const pts = [...trip.destinations, ...trip.mapPoints].filter((p) => !ids || ids.includes(p.id)).map((p) => p.coordinates);
  map.fitBounds(L.latLngBounds(pts), { padding: [30, 30] });
}
