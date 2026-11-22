import type { Metadata } from "next";
import { PrintButton } from "./PrintButton";
import { BUDGET_LABELS, dayNumber, eur, flightDuration, formatDate, rangeEur, timeOf, trip } from "@/lib/trip";

export const metadata: Metadata = { title: "Itinerar printabil" };

export default function Print() {
  const b = trip.budget;
  return (
    <article className="text-sm">
      <div className="no-print mb-4 flex items-center justify-between">
        <p className="text-stone-600">Versiune pentru print sau „Salvează ca PDF”.</p>
        <PrintButton />
      </div>

      <h1 className="text-2xl font-semibold">{trip.title}</h1>
      <p className="text-stone-600">
        {formatDate(trip.dates.departureFromRomania)} – {formatDate(trip.dates.returnFlightDate)} · {trip.travelers} persoane ·{" "}
        {trip.dates.nights} nopți
      </p>

      <h2 className="mt-5 border-b pb-1 text-lg font-semibold">Zboruri</h2>
      <table className="mt-2 w-full">
        <tbody>
          {trip.flights.map((f) => (
            <tr key={f.id} className="border-b border-stone-100 align-top">
              <td className="py-1 pr-2 whitespace-nowrap">{formatDate(f.date, true)}</td>
              <td className="py-1 pr-2">
                {f.airline} — {f.route}
              </td>
              <td className="py-1 pr-2 whitespace-nowrap tabular-nums">
                {timeOf(f.departureLocal)} → {timeOf(f.arrivalLocal)}
                {(() => {
                  const d = flightDuration(f.departureLocal, f.departureTimezone, f.arrivalLocal, f.arrivalTimezone);
                  return d ? ` (${d})` : "";
                })()}
              </td>
              <td className="py-1">{f.statusRo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-5 border-b pb-1 text-lg font-semibold">Itinerar</h2>
      {trip.days.map((d) => (
        <div key={d.date} className="print-break border-b border-stone-100 py-1.5">
          <p className="font-semibold">
            Ziua {dayNumber(d.date)} · {formatDate(d.date)} — {d.place}: {d.theme}
          </p>
          <p className="text-stone-700">{d.activities.join(" · ")}</p>
        </div>
      ))}

      <h2 className="mt-5 border-b pb-1 text-lg font-semibold">Transferuri</h2>
      <table className="mt-2 w-full">
        <tbody>
          {trip.transfers.map((t) => (
            <tr key={t.date + t.route} className="border-b border-stone-100 align-top">
              <td className="py-1 pr-2 whitespace-nowrap">{formatDate(t.date, true)}</td>
              <td className="py-1 pr-2">
                {t.route}
                <span className="block text-stone-500">{t.recommended}</span>
              </td>
              <td className="py-1 pr-2">{t.durationDoorToDoor}</td>
              <td className="py-1 pr-2 whitespace-nowrap">{rangeEur(t.costEuroForTwo)}</td>
              <td className="py-1">{t.statusRo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-5 border-b pb-1 text-lg font-semibold">Buget (estimare, 2 persoane)</h2>
      <table className="mt-2 w-full max-w-md">
        <tbody>
          {Object.entries(b.targetBreakdownEuro).map(([k, v]) => (
            <tr key={k} className="border-b border-stone-100">
              <td className="py-1">{BUDGET_LABELS[k] ?? k}</td>
              <td className="py-1 text-right tabular-nums">{eur(v)}</td>
            </tr>
          ))}
          <tr className="font-semibold">
            <td className="py-1">Total țintă</td>
            <td className="py-1 text-right tabular-nums">{eur(b.targetTotalEuro)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-1 text-stone-600">
        Scenarii: {eur(b.scenarioEstimatesEuro.economy)} – {eur(b.scenarioEstimatesEuro.comfortable)}. Zboruri regionale cotate separat: USD{" "}
        {b.regionalFlightsQuotedUsdForTwo.total} pentru 2 (incluse în Transport). Exclus: {b.excludes.join(", ")}.
      </p>

      <h2 className="mt-5 border-b pb-1 text-lg font-semibold">De verificat</h2>
      <ul className="mt-2 list-disc pl-5">
        {trip.assumptions.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-stone-500">{trip.disclaimer}</p>
    </article>
  );
}
