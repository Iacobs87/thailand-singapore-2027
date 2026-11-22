import type { Metadata } from "next";
import { Card, Note, PageTitle } from "@/components/ui";
import { dayNumber, destinationForDate, formatDate, INTENSITY, isOptional, timezoneForDay, trip, TZ_LABEL } from "@/lib/trip";
import { movements } from "@/lib/timeline";
import type { Intensity } from "@/lib/trip-types";

export const metadata: Metadata = { title: "Itinerar" };

export default function Itinerar() {
  const counts = trip.days.reduce<Record<Intensity, number>>(
    (acc, d) => ({ ...acc, [d.intensity]: acc[d.intensity] + 1 }),
    { travel: 0, relaxed: 0, balanced: 0, active: 0 },
  );
  const moves = movements();

  return (
    <>
      <PageTitle
        title="Itinerar zi cu zi"
        subtitle={`${trip.days.length} zile, de la plecare (1 ian.) până la zborul de întoarcere (18 ian.). Orele sunt locale destinației.`}
      />

      <Card className="mb-5">
        <p className="mb-2 text-sm font-medium text-stone-700">Echilibrul zilelor</p>
        <div className="flex h-3 overflow-hidden rounded-full" aria-hidden>
          {(Object.keys(counts) as Intensity[]).map((k) => (
            <div key={k} className={INTENSITY[k].dot} style={{ width: `${(counts[k] / trip.days.length) * 100}%` }} />
          ))}
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {(Object.keys(counts) as Intensity[]).map((k) => (
            <li key={k} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${INTENSITY[k].dot}`} aria-hidden />
              {INTENSITY[k].label}: <strong>{counts[k]}</strong>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-stone-500">Activitățile „opțional” nu sunt programări — se decid pe loc.</p>
      </Card>

      <ol className="space-y-3">
        {trip.days.map((day) => {
          const dest = destinationForDate(day.date);
          const firstDayHere = dest?.checkIn === day.date;
          const tz = timezoneForDay(day);
          const dayMoves = moves.filter((m) => m.date === day.date);
          return (
            <li key={day.date} id={day.date} className="scroll-mt-28">
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-coral-600">
                      Ziua {dayNumber(day.date)} · {formatDate(day.date)}
                    </p>
                    <h2 className="text-lg font-semibold text-lagoon-900">
                      {day.place} — {day.theme}
                    </h2>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${INTENSITY[day.intensity].cls}`}>
                    {INTENSITY[day.intensity].label}
                  </span>
                </div>

                <ul className="mt-3 space-y-1.5">
                  {day.activities.map((a) => (
                    <li key={a} className="flex gap-2 text-sm">
                      <span className="text-lagoon-500" aria-hidden>
                        ●
                      </span>
                      <span>
                        {a}
                        {isOptional(a) && (
                          <span className="ml-1.5 rounded bg-stone-100 px-1.5 py-0.5 text-xs text-stone-600">opțional</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-600">
                  {day.walkingHours && <span className="rounded-full bg-sand-100 px-2 py-0.5">🥾 Mers pe jos: {day.walkingHours} h</span>}
                  {day.cyclingHours && <span className="rounded-full bg-sand-100 px-2 py-0.5">🚲 Bicicletă: {day.cyclingHours} h</span>}
                  <span className="rounded-full bg-sand-100 px-2 py-0.5">🕒 {TZ_LABEL[tz]}</span>
                </div>

                {dayMoves.length > 0 && (
                  <div className="mt-3 space-y-1 rounded-xl bg-sky-50 p-2.5 text-sm text-sky-950">
                    {dayMoves.map((m) => (
                      <p key={m.title}>
                        {m.kind === "flight" ? "✈️" : m.transfer.mode === "boat" ? "⛴️" : "🚕"} <strong>{m.title}</strong> — {m.when}
                      </p>
                    ))}
                  </div>
                )}

                {firstDayHere && dest.notes.length > 0 && (
                  <div className="mt-3">
                    <Note>
                      {dest.notes.map((n) => (
                        <p key={n}>💡 {n}</p>
                      ))}
                    </Note>
                  </div>
                )}
              </Card>
            </li>
          );
        })}
      </ol>
    </>
  );
}
