import type { Metadata } from "next";
import { Card, ExtLink, Note, PageTitle, SectionTitle, StatusBadge } from "@/components/ui";
import { formatDate, trip } from "@/lib/trip";

export const metadata: Metadata = { title: "De verificat" };

export default function DeVerificat() {
  const unconfirmed = [
    ...trip.flights.filter((f) => f.statusRo !== "Rezervat").map((f) => ({ date: f.date, label: `${f.airline}: ${f.route}`, status: f.statusRo })),
    ...trip.transfers.filter((t) => t.statusRo === "De verificat").map((t) => ({ date: t.date, label: t.route, status: t.statusRo })),
    ...trip.destinations.filter((d) => d.hotelStatus !== "Rezervat").map((d) => ({ date: d.checkIn, label: `Hotel ${d.name}`, status: d.hotelStatus })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageTitle title="Presupuneri / De verificat" subtitle="Tot ce nu e confirmat. Când rezervați ceva, schimbați statusul în src/data/trip-data.json." />

      <Note tone="warn">{trip.disclaimer}</Note>

      <SectionTitle>Presupuneri</SectionTitle>
      <Card>
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          {trip.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Card>

      <SectionTitle>Neconfirmate încă</SectionTitle>
      <Card>
        <ul className="divide-y divide-stone-100">
          {unconfirmed.map((u) => (
            <li key={u.label} className="flex items-center justify-between gap-2 py-2 text-sm">
              <span>
                <span className="text-stone-500">{formatDate(u.date, true)} · </span>
                {u.label}
              </span>
              <StatusBadge status={u.status} />
            </li>
          ))}
        </ul>
      </Card>

      <SectionTitle>Formalități de intrare</SectionTitle>
      <ul className="space-y-1 text-sm">
        {trip.officialLinks
          .filter((l) => /arrival/i.test(l.label))
          .map((l) => (
            <li key={l.url}>
              <ExtLink href={l.url}>{l.label}</ExtLink>
            </li>
          ))}
      </ul>
    </>
  );
}
