"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { dayNumber, formatDate, INTENSITY, todayIn, trip } from "@/lib/trip";
import { movements } from "@/lib/timeline";
import { Card, StatusBadge } from "./ui";

/** Countdown before the trip, "day X of 18" during it, plus today's plan and the next movement. */
export function TripStatus() {
  const [today, setToday] = useState<string | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      // Before departure use Romanian time; once travelling, Thailand time is close enough for "which day".
      const roToday = todayIn("Europe/Bucharest");
      const t = roToday < trip.dates.departureFromRomania ? roToday : todayIn("Asia/Bangkok");
      setToday(t);
      setDaysLeft(Math.round((Date.parse(`${trip.dates.departureFromRomania}T00:00:00Z`) - Date.parse(`${roToday}T00:00:00Z`)) / 86_400_000));
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!today || daysLeft === null) {
    return <Card className="h-36 animate-pulse bg-lagoon-50">{null}</Card>;
  }

  const last = trip.days[trip.days.length - 1].date;
  const before = today < trip.dates.departureFromRomania;
  const after = today > last;
  const day = trip.days.find((d) => d.date === today);
  const next = movements().find((m) => m.date >= today);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Card className="bg-gradient-to-br from-lagoon-600 to-lagoon-900 text-white">
        {before && (
          <>
            <p className="text-sm text-lagoon-100">Până la plecare</p>
            <p className="mt-1 text-5xl font-semibold tabular-nums">
              {daysLeft} <span className="text-2xl font-normal">{daysLeft === 1 ? "zi" : "zile"}</span>
            </p>
            <p className="mt-2 text-sm text-lagoon-100">Plecare din București: {formatDate(trip.dates.departureFromRomania)}</p>
          </>
        )}
        {!before && !after && day && (
          <>
            <p className="text-sm text-lagoon-100">Azi · {formatDate(today)}</p>
            <p className="mt-1 text-3xl font-semibold">
              Ziua {dayNumber(today)} <span className="text-lg font-normal text-lagoon-100">din {trip.days.length}</span>
            </p>
            <p className="mt-1 font-medium">
              {day.place} — {day.theme}
            </p>
            <ul className="mt-2 space-y-0.5 text-sm text-lagoon-50">
              {day.activities.map((a) => (
                <li key={a}>• {a}</li>
              ))}
            </ul>
            <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${INTENSITY[day.intensity].cls}`}>
              {INTENSITY[day.intensity].label}
            </span>
          </>
        )}
        {after && (
          <>
            <p className="text-sm text-lagoon-100">Călătoria s-a încheiat</p>
            <p className="mt-1 text-2xl font-semibold">Bine ați revenit! 🌺</p>
          </>
        )}
      </Card>

      <Card>
        <p className="text-sm text-stone-500">Următorul transfer</p>
        {next ? (
          <>
            <p className="mt-1 text-sm font-medium text-coral-600">{formatDate(next.date)}</p>
            <p className="mt-0.5 font-semibold text-lagoon-900">
              {next.kind === "flight" ? "✈️" : next.transfer.mode === "boat" ? "⛴️" : "🚕"} {next.title}
            </p>
            <p className="mt-1 text-sm text-stone-600">{next.when}</p>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={next.status} />
              <Link href="/transport/" className="text-sm text-lagoon-700 underline underline-offset-2">
                Toate transferurile
              </Link>
            </div>
          </>
        ) : (
          <p className="mt-1 text-stone-600">Nu mai sunt transferuri.</p>
        )}
      </Card>
    </div>
  );
}
