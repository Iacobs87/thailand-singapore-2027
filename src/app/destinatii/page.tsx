import type { Metadata } from "next";
import { Card, ExtLink, Note, PageTitle, StatusBadge } from "@/components/ui";
import { formatDate, mapsLink, mapsSearch, rangeEur, trip, TZ_LABEL } from "@/lib/trip";

export const metadata: Metadata = { title: "Destinații" };

const GRADIENTS: Record<string, string> = {
  bangkok: "from-amber-400 via-orange-400 to-rose-500",
  singapore: "from-sky-400 via-indigo-400 to-violet-500",
  krabi: "from-lagoon-200 via-lagoon-500 to-lagoon-700",
  yaonoi: "from-emerald-300 via-teal-400 to-cyan-600",
  phuket: "from-orange-300 via-coral-500 to-pink-600",
};
const EMOJI: Record<string, string> = { bangkok: "🛕", singapore: "🌆", krabi: "🧗", yaonoi: "🚲", phuket: "🌅" };

export default function Destinatii() {
  return (
    <>
      <PageTitle title="Destinații" subtitle="Zone recomandate pentru cazare, ce vedeți și cum vă deplasați. Hotelurile nu sunt încă rezervate." />
      <div className="space-y-4">
        {trip.destinations.map((d, i) => {
          const acc = trip.budget.accommodationByDestinationEuro[d.id];
          return (
            <section key={d.id} id={d.id} className="scroll-mt-28">
              <Card className="overflow-hidden p-0 sm:p-0">
                <div className={`flex items-end justify-between bg-gradient-to-br ${GRADIENTS[d.id]} px-4 py-5 text-white sm:px-5`}>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-white/85">
                      Etapa {i + 1} · {d.country}
                    </p>
                    <h2 className="text-2xl font-semibold drop-shadow-sm">{d.name}</h2>
                    <p className="text-sm text-white/90">
                      {formatDate(d.checkIn, true)} → {formatDate(d.checkOut, true)} · {d.nights} nopți
                    </p>
                  </div>
                  <span className="text-4xl" aria-hidden>
                    {EMOJI[d.id]}
                  </span>
                </div>
                <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-5">
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-lagoon-900">Unde să stați</h3>
                    <ul className="space-y-0.5 text-sm">
                      {d.suggestedAreas.map((a) => (
                        <li key={a}>
                          📍 <ExtLink href={mapsSearch(`${a}, ${d.name.split(" (")[0]}`)}>{a}</ExtLink>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                      <span>Hotel:</span>
                      <StatusBadge status={d.hotelStatus} />
                    </div>
                    {acc && <p className="mt-1 text-xs text-stone-500">Estimare cazare: {rangeEur(acc.total)} total</p>}
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-lagoon-900">Ce vedeți</h3>
                    <ul className="space-y-0.5 text-sm">
                      {d.highlights.map((h) => (
                        <li key={h}>• {h}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-lagoon-900">Logistică</h3>
                    <ul className="space-y-0.5 text-sm">
                      {d.logistics.map((l) => (
                        <li key={l}>• {l}</li>
                      ))}
                      <li className="text-stone-500">🕒 {TZ_LABEL[d.timezone]}</li>
                    </ul>
                    <p className="mt-2 text-sm">
                      <ExtLink href={mapsLink(d.coordinates[0], d.coordinates[1])}>Deschide în Google Maps</ExtLink>
                    </p>
                  </div>
                </div>
                {d.notes.length > 0 && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                    <Note>
                      {d.notes.map((n) => (
                        <p key={n}>💡 {n}</p>
                      ))}
                    </Note>
                  </div>
                )}
              </Card>
            </section>
          );
        })}
      </div>
    </>
  );
}
