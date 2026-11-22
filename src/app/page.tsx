import Link from "next/link";
import { ChecklistProgress } from "@/components/ChecklistProgress";
import { TripStatus } from "@/components/TripStatus";
import { Card, Note, SectionTitle, StatusBadge } from "@/components/ui";
import { eur, formatDate, trip } from "@/lib/trip";

export default function Dashboard() {
  const b = trip.budget;
  const toVerify = [...trip.flights, ...trip.transfers].filter((x) => x.statusRo === "De verificat").length;
  return (
    <>
      <section className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-lagoon-900 sm:text-3xl">{trip.title}</h1>
        <p className="mt-1 text-sm text-stone-600">
          {formatDate(trip.dates.departureFromRomania)} – {formatDate(trip.dates.returnFlightDate)} · {trip.travelers} persoane ·{" "}
          {trip.dates.nights} nopți de cazare · {trip.destinations.length} destinații
        </p>
      </section>

      <TripStatus />

      <SectionTitle>Traseu</SectionTitle>
      <ol className="grid gap-2 sm:grid-cols-5">
        {trip.destinations.map((d, i) => (
          <li key={d.id}>
            <Link
              href={`/destinatii/#${d.id}`}
              className="block h-full rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition hover:border-lagoon-500"
            >
              <span className="text-xs font-medium text-coral-600">Etapa {i + 1}</span>
              <span className="block font-semibold text-lagoon-900">{d.name}</span>
              <span className="block text-sm text-stone-600">
                {formatDate(d.checkIn, true)} → {formatDate(d.checkOut, true)}
              </span>
              <span className="mt-1 flex items-center justify-between gap-2 text-sm">
                <span className="font-medium">{d.nights} nopți</span>
                <StatusBadge status={d.hotelStatus} />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <SectionTitle>Rezumat</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-stone-500">Buget estimat (2 pers.)</p>
          <p className="mt-1 text-2xl font-semibold text-lagoon-900">~{eur(b.targetTotalEuro)}</p>
          <p className="mt-1 text-xs text-stone-500">
            Scenarii: {eur(b.scenarioEstimatesEuro.economy)} economic · {eur(b.scenarioEstimatesEuro.comfortable)} confortabil.
            Fără zborurile Turkish Airlines.
          </p>
          <Link href="/buget/" className="mt-2 inline-block text-sm text-lagoon-700 underline underline-offset-2">
            Detalii buget
          </Link>
        </Card>
        <ChecklistProgress />
        <Card>
          <p className="text-sm text-stone-500">De verificat</p>
          <p className="mt-1 text-2xl font-semibold text-amber-700">{toVerify} transporturi</p>
          <p className="mt-1 text-xs text-stone-500">Zboruri și bărci fără confirmare, plus {trip.assumptions.length} presupuneri.</p>
          <Link href="/de-verificat/" className="mt-2 inline-block text-sm text-lagoon-700 underline underline-offset-2">
            Vezi lista
          </Link>
        </Card>
      </div>

      <div className="mt-6">
        <Note tone="warn">
          <strong>18 ianuarie:</strong> zborul din Phuket pleacă la 09:00 — fiți la aeroport în jur de 06:00.
        </Note>
      </div>
    </>
  );
}
