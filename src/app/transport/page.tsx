import type { Metadata } from "next";
import { Card, ExtLink, Note, PageTitle, SectionTitle, StatusBadge } from "@/components/ui";
import { flightDuration, formatDate, rangeEur, timeOf, trip, TZ_LABEL } from "@/lib/trip";

export const metadata: Metadata = { title: "Transport" };

export default function Transport() {
  const totalLo = trip.transfers.reduce((s, t) => s + t.costEuroForTwo[0], 0);
  const totalHi = trip.transfers.reduce((s, t) => s + t.costEuroForTwo[1], 0);
  return (
    <>
      <PageTitle
        title="Transport"
        subtitle="Durata zborului e calculată ținând cont de fusul orar. Durata „ușă la ușă” e separată și include drumul, așteptările și formalitățile."
      />

      <SectionTitle>Zboruri</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {trip.flights.map((f) => {
          const dur = flightDuration(f.departureLocal, f.departureTimezone, f.arrivalLocal, f.arrivalTimezone);
          return (
            <Card key={f.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-coral-600">{formatDate(f.date)}</p>
                  <h3 className="font-semibold text-lagoon-900">{f.route}</h3>
                  <p className="text-sm text-stone-600">{f.airline}</p>
                </div>
                <StatusBadge status={f.statusRo} />
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-stone-500">Plecare</dt>
                  <dd className="text-lg font-semibold tabular-nums">{timeOf(f.departureLocal)}</dd>
                  <dd className="text-xs text-stone-500">{TZ_LABEL[f.departureTimezone]}</dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-500">Sosire</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {timeOf(f.arrivalLocal)}
                    {f.arrivalLocal && f.arrivalLocal.slice(0, 10) !== f.date && (
                      <sup className="ml-0.5 text-xs text-coral-600">+1</sup>
                    )}
                  </dd>
                  <dd className="text-xs text-stone-500">{TZ_LABEL[f.arrivalTimezone]}</dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-500">Durata zborului</dt>
                  <dd className="text-lg font-semibold tabular-nums">{dur ?? "—"}</dd>
                  {!dur && <dd className="text-xs text-stone-500">oră lipsă în date</dd>}
                </div>
              </dl>
              {f.estimatedUsdForTwo != null && (
                <p className="mt-2 text-sm">
                  Cotație estimată:{" "}
                  <strong>
                    USD {f.estimatedUsdPerPerson}/pers. (USD {f.estimatedUsdForTwo} pentru 2)
                  </strong>{" "}
                  <span className="text-stone-500">— nu e preț de rezervare</span>
                </p>
              )}
              {f.notes && (
                <ul className="mt-2 space-y-0.5 text-sm text-stone-600">
                  {f.notes.map((n) => (
                    <li key={n}>• {n}</li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>

      <SectionTitle>Transferuri terestre și cu barca</SectionTitle>
      <div className="space-y-3">
        {trip.transfers.map((t) => (
          <Card key={t.date + t.route}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-coral-600">{formatDate(t.date)}</p>
                <h3 className="font-semibold text-lagoon-900">
                  {t.mode === "boat" ? "⛴️" : "🚕"} {t.route}
                </h3>
              </div>
              <StatusBadge status={t.statusRo} />
            </div>
            <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-stone-500">Recomandat</dt>
                <dd>{t.recommended}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-500">Ușă la ușă</dt>
                <dd className="font-medium">{t.durationDoorToDoor}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-500">Cost estimat (2 pers.)</dt>
                <dd className="font-medium">{rangeEur(t.costEuroForTwo)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-sm text-stone-600">Variante: {t.options.join(" · ")}</p>
            {t.mode === "boat" && (
              <div className="mt-2">
                <Note tone="warn">Operatorul, orarul și disponibilitatea bărcii nu sunt confirmate. Verifică cu hotelul sau la ghișeu.</Note>
              </div>
            )}
          </Card>
        ))}
      </div>
      <p className="mt-3 text-sm text-stone-600">
        Total estimat transferuri (fără zboruri): <strong>{rangeEur([totalLo, totalHi])}</strong> pentru 2 persoane.
      </p>

      <SectionTitle>Linkuri oficiale</SectionTitle>
      <ul className="flex flex-wrap gap-3 text-sm">
        {trip.officialLinks.map((l) => (
          <li key={l.url}>
            <ExtLink href={l.url}>{l.label}</ExtLink>
          </li>
        ))}
      </ul>
    </>
  );
}
