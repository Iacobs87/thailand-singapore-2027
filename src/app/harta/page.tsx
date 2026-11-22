import type { Metadata } from "next";
import { Card, ExtLink, PageTitle, SectionTitle } from "@/components/ui";
import { formatDate, mapsLink, trip } from "@/lib/trip";
import { TripMap } from "./TripMap";

export const metadata: Metadata = { title: "Hartă" };

export default function Harta() {
  return (
    <>
      <PageTitle
        title="Hartă și traseu"
        subtitle="Pinii arată zone aproximative, nu hoteluri. Harta are nevoie de internet; linkurile Google Maps de mai jos funcționează oricând."
      />
      <TripMap />

      <SectionTitle>Etape în ordine</SectionTitle>
      <ol className="grid gap-2 sm:grid-cols-2">
        {trip.destinations.map((d, i) => (
          <li key={d.id}>
            <Card className="flex items-center justify-between gap-3 p-3 sm:p-3">
              <span>
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-lagoon-700 text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <strong>{d.name}</strong>
                <span className="block pl-8 text-xs text-stone-500">
                  {formatDate(d.checkIn, true)} → {formatDate(d.checkOut, true)}
                </span>
              </span>
              <ExtLink href={mapsLink(d.coordinates[0], d.coordinates[1])}>Maps</ExtLink>
            </Card>
          </li>
        ))}
      </ol>

      <SectionTitle>Aeroporturi și porturi</SectionTitle>
      <ul className="grid gap-1 text-sm sm:grid-cols-2">
        {trip.mapPoints.map((p) => (
          <li key={p.id}>
            {p.kind === "airport" ? "✈️" : "⛴️"} <ExtLink href={mapsLink(p.coordinates[0], p.coordinates[1])}>{p.label}</ExtLink>
          </li>
        ))}
      </ul>
    </>
  );
}
