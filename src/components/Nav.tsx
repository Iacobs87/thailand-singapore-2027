"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_ITEMS = [
  { href: "/", label: "Acasă", icon: "🏠" },
  { href: "/itinerar/", label: "Itinerar", icon: "📅" },
  { href: "/transport/", label: "Transport", icon: "✈️" },
  { href: "/buget/", label: "Buget", icon: "💶" },
  { href: "/destinatii/", label: "Destinații", icon: "🏝️" },
  { href: "/bagaje/", label: "Bagaje", icon: "🎒" },
  { href: "/checklist/", label: "Checklist", icon: "✅" },
  { href: "/harta/", label: "Hartă", icon: "🗺️" },
  { href: "/de-verificat/", label: "De verificat", icon: "⚠️" },
];

const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);

export function Nav() {
  const pathname = norm(usePathname() || "/");
  return (
    <header className="no-print sticky top-0 z-40 border-b border-lagoon-900/10 bg-lagoon-700 text-white shadow-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-2.5">
          <Link href="/" className="font-semibold tracking-tight">
            🌴 Thailanda & Singapore <span className="font-normal text-lagoon-100">· ian. 2027</span>
          </Link>
          <Link href="/print/" className="rounded-md px-2 py-1 text-sm text-lagoon-100 hover:bg-white/10">
            🖨️ <span className="hidden sm:inline">Printează</span>
          </Link>
        </div>
        <nav aria-label="Navigare principală" className="scrollbar-none -mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
          <ul className="flex gap-1 pb-2">
            {NAV_ITEMS.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
                      active ? "bg-white font-medium text-lagoon-900" : "text-lagoon-50 hover:bg-white/10"
                    }`}
                  >
                    <span aria-hidden>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
