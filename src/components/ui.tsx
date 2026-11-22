import type { StatusRo } from "@/lib/trip-types";

const STATUS_CLS: Record<StatusRo, string> = {
  Planificat: "bg-sky-50 text-sky-800 ring-sky-200",
  Rezervat: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  "De verificat": "bg-amber-50 text-amber-900 ring-amber-300",
};
const STATUS_ICON: Record<StatusRo, string> = { Planificat: "○", Rezervat: "✓", "De verificat": "!" };

export function StatusBadge({ status }: { status: StatusRo }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_CLS[status]}`}
    >
      <span aria-hidden>{STATUS_ICON[status]}</span>
      {status}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`print-break rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-semibold tracking-tight text-lagoon-900 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-stone-600">{subtitle}</p>}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-8 text-lg font-semibold text-lagoon-900">{children}</h2>;
}

export function Note({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  const cls = tone === "warn" ? "border-amber-300 bg-amber-50 text-amber-950" : "border-lagoon-200 bg-lagoon-50 text-lagoon-900";
  return <div className={`rounded-xl border px-3 py-2 text-sm ${cls}`}>{children}</div>;
}

export function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-lagoon-700 underline underline-offset-2 hover:text-lagoon-900">
      {children}
    </a>
  );
}
