import { flightDuration, timeOf, trip } from "./trip";
import type { Flight, StatusRo, Transfer } from "./trip-types";

export type TimelineItem =
  | { kind: "flight"; date: string; flight: Flight; title: string; when: string; status: StatusRo }
  | { kind: "transfer"; date: string; transfer: Transfer; title: string; when: string; status: StatusRo };

const leavesHotel = (t: Transfer) => /^hotel/i.test(t.route);

/** All movements (flights + ground/boat transfers) in chronological order. */
export function movements(): TimelineItem[] {
  const dates = [...new Set([...trip.flights.map((f) => f.date), ...trip.transfers.map((t) => t.date)])].sort();
  const items: TimelineItem[] = [];
  for (const date of dates) {
    const ts = trip.transfers.filter((t) => t.date === date);
    const fs = trip.flights.filter((f) => f.date === date);
    const toItem = (t: Transfer): TimelineItem => ({
      kind: "transfer",
      date,
      transfer: t,
      title: t.route,
      when: `${t.recommended} · ${t.durationDoorToDoor}`,
      status: t.statusRo,
    });
    items.push(...ts.filter(leavesHotel).map(toItem));
    for (const f of fs) {
      const dur = flightDuration(f.departureLocal, f.departureTimezone, f.arrivalLocal, f.arrivalTimezone);
      items.push({
        kind: "flight",
        date,
        flight: f,
        title: `${f.airline}: ${f.route}`,
        when: `${timeOf(f.departureLocal)} → ${timeOf(f.arrivalLocal)}${dur ? ` · zbor ${dur}` : ""}`,
        status: f.statusRo,
      });
    }
    items.push(...ts.filter((t) => !leavesHotel(t)).map(toItem));
  }
  return items;
}
