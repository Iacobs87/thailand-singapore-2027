import raw from "@/data/trip-data.json";
import type { Day, Intensity, Timezone, TripData } from "./trip-types";

export const trip = raw as unknown as TripData;

/** Fixed UTC offsets. Thailand and Singapore have no DST; Romania is UTC+2 in January. */
const UTC_OFFSET_HOURS: Record<Timezone, number> = {
  "Asia/Bangkok": 7,
  "Asia/Singapore": 8,
  "Europe/Bucharest": 2,
};

export const TZ_LABEL: Record<Timezone, string> = {
  "Asia/Bangkok": "ora Thailandei (UTC+7)",
  "Asia/Singapore": "ora Singapore (UTC+8)",
  "Europe/Bucharest": "ora României (UTC+2)",
};

/** "2027-01-05T07:00" in a given zone → UTC milliseconds. */
export function localToUtcMs(local: string, tz: Timezone): number {
  const [d, t = "00:00"] = local.split("T");
  const [y, m, day] = d.split("-").map(Number);
  const [h, min] = t.split(":").map(Number);
  return Date.UTC(y, m - 1, day, h, min) - UTC_OFFSET_HOURS[tz] * 3_600_000;
}

/** Real flight duration, accounting for the timezone change. */
export function flightDuration(
  depLocal: string | null,
  depTz: Timezone,
  arrLocal: string | null,
  arrTz: Timezone,
): string | null {
  if (!depLocal || !arrLocal) return null;
  const mins = Math.round((localToUtcMs(arrLocal, arrTz) - localToUtcMs(depLocal, depTz)) / 60_000);
  return `${Math.floor(mins / 60)}h${String(mins % 60).padStart(2, "0")}`;
}

export function timeOf(local: string | null): string {
  return local ? local.split("T")[1] : "—";
}

const DATE_FMT = new Intl.DateTimeFormat("ro-RO", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const SHORT_FMT = new Intl.DateTimeFormat("ro-RO", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

export function formatDate(iso: string, short = false): string {
  return (short ? SHORT_FMT : DATE_FMT).format(new Date(`${iso}T00:00:00Z`));
}

/** Today's date (YYYY-MM-DD) as seen in a given time zone. */
export function todayIn(tz: Timezone): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(),
  );
}

/** Day 1 = Jan 1 (departure). */
export function dayNumber(iso: string): number {
  return (
    Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${trip.dates.departureFromRomania}T00:00:00Z`)) / 86_400_000) + 1
  );
}

export const INTENSITY: Record<Intensity, { label: string; cls: string; dot: string }> = {
  travel: { label: "Zi de transfer", cls: "bg-sky-100 text-sky-900", dot: "bg-sky-500" },
  relaxed: { label: "Relaxat", cls: "bg-emerald-100 text-emerald-900", dot: "bg-emerald-500" },
  balanced: { label: "Echilibrat", cls: "bg-amber-100 text-amber-900", dot: "bg-amber-500" },
  active: { label: "Activ", cls: "bg-rose-100 text-rose-900", dot: "bg-rose-500" },
};

export function isOptional(activity: string): boolean {
  return /^opțional/i.test(activity.trim());
}

export function destinationForDate(iso: string) {
  return trip.destinations.find((d) => iso >= d.checkIn && iso < d.checkOut);
}

export function timezoneForDay(day: Day): Timezone {
  return destinationForDate(day.date)?.timezone ?? (day.date === trip.dates.departureFromRomania ? "Europe/Bucharest" : "Asia/Bangkok");
}

export function eur(n: number): string {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function money(n: number, currency: string): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "THB" ? 0 : 2,
  }).format(n);
}

export function rangeEur([lo, hi]: [number, number]): string {
  return `${eur(lo)} – ${eur(hi)}`;
}

export const BUDGET_LABELS: Record<string, string> = {
  accommodation: "Cazare",
  foodAndDrinks: "Mâncare și băuturi",
  activitiesAndEntertainment: "Activități și distracție",
  transportIncludingRegionalFlights: "Transport (incl. zboruri regionale)",
  miscellaneous: "Diverse",
};

export function mapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function mapsSearch(q: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
