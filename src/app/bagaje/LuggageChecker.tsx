"use client";
import { Card, Note, SectionTitle } from "@/components/ui";
import { trip } from "@/lib/trip";
import type { AirlineLimit } from "@/lib/trip-types";
import { useLocalStorage } from "@/lib/useLocalStorage";

type Role = "main" | "personal" | "hold" | "home";
const ROLE_LABEL: Record<Role, string> = {
  main: "Bagaj de mână principal",
  personal: "Obiect personal",
  hold: "Bagaj de cală (cu taxă)",
  home: "Nu îl iau",
};

interface BagState {
  dims: [number, number, number]; // measured, cm; 0 = not measured
  weightKg: number;
  owner: 1 | 2;
  role: Role;
}

const bags = [...trip.luggage.planned.map((b) => ({ ...b, optional: false })), ...trip.luggage.optional.map((b) => ({ ...b, optional: true }))];

const initial: Record<string, BagState> = Object.fromEntries(
  bags.map((b, i) => [
    b.id,
    { dims: [0, 0, 0], weightKg: 0, owner: (i % 2 === 0 ? 1 : 2) as 1 | 2, role: (b.optional ? "personal" : "main") as Role },
  ]),
);

/** Compare sorted dimensions so the bag can be oriented any way. Returns list of overages in cm. */
function dimCheck(dims: [number, number, number], max: [number, number, number]) {
  const d = [...dims].sort((a, b) => b - a);
  const m = [...max].sort((a, b) => b - a);
  return d.map((v, i) => Math.max(0, v - m[i]));
}

export function LuggageChecker() {
  const [state, setState] = useLocalStorage<Record<string, BagState>>("luggage", initial);
  const get = (id: string) => state[id] ?? initial[id];
  const set = (id: string, patch: Partial<BagState>) => setState({ ...state, [id]: { ...get(id), ...patch } });

  return (
    <>
      <div className="space-y-3">
        {bags.map((b) => {
          const s = get(b.id);
          const measured = s.dims.every((x) => x > 0);
          return (
            <Card key={b.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-lagoon-900">
                    🎒 {b.model} <span className="font-normal text-stone-500">· {b.volumeLiters} L</span>
                    {b.optional && <span className="ml-2 rounded bg-stone-100 px-1.5 py-0.5 text-xs text-stone-600">opțional</span>}
                  </h3>
                  <p className="mt-0.5 text-xs text-amber-800">Din plan: {b.dimensionsCm}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-6">
                {(["Lungime", "Lățime", "Înălțime"] as const).map((lbl, i) => (
                  <label key={lbl} className="block">
                    <span className="text-xs text-stone-500">{lbl} (cm)</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={s.dims[i] || ""}
                      placeholder="—"
                      onChange={(e) => {
                        const dims = [...s.dims] as [number, number, number];
                        dims[i] = Number(e.target.value) || 0;
                        set(b.id, { dims });
                      }}
                      className="w-full rounded-lg border border-stone-300 px-2 py-1.5 tabular-nums"
                    />
                  </label>
                ))}
                <label className="block">
                  <span className="text-xs text-stone-500">Greutate plin (kg)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={0.1}
                    value={s.weightKg || ""}
                    placeholder="—"
                    onChange={(e) => set(b.id, { weightKg: Number(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-stone-300 px-2 py-1.5 tabular-nums"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-stone-500">Al cui</span>
                  <select
                    value={s.owner}
                    onChange={(e) => set(b.id, { owner: Number(e.target.value) as 1 | 2 })}
                    className="w-full rounded-lg border border-stone-300 bg-white px-2 py-1.5"
                  >
                    <option value={1}>Persoana 1</option>
                    <option value={2}>Persoana 2</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-stone-500">Rol</span>
                  <select
                    value={s.role}
                    onChange={(e) => set(b.id, { role: e.target.value as Role })}
                    className="w-full rounded-lg border border-stone-300 bg-white px-2 py-1.5"
                  >
                    {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABEL[r]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {(s.role === "main" || s.role === "personal") && (
                <div className="mt-3 space-y-1.5">
                  {!measured && <p className="text-sm text-stone-500">Introdu toate cele trei dimensiuni pentru verificare.</p>}
                  {measured &&
                    trip.luggage.airlineLimits.map((a) => <DimResult key={a.id} airline={a} dims={s.dims} role={s.role as "main" | "personal"} />)}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <SectionTitle>Greutate bagaj de mână per persoană</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2].map((owner) => {
          const cabin = bags.filter((b) => {
            const s = get(b.id);
            return s.owner === owner && (s.role === "main" || s.role === "personal");
          });
          const kg = cabin.reduce((sum, b) => sum + get(b.id).weightKg, 0);
          return (
            <Card key={owner}>
              <p className="font-medium text-lagoon-900">Persoana {owner}</p>
              <p className="text-sm text-stone-600">{cabin.length ? cabin.map((b) => b.model).join(" + ") : "Niciun bagaj de mână"}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{kg.toFixed(1)} kg</p>
              <ul className="mt-2 space-y-1 text-sm">
                {trip.luggage.airlineLimits.map((a) => {
                  const over = kg - a.combinedCarryOnKgPerPerson;
                  return (
                    <li key={a.id} className={over > 0 ? "font-medium text-rose-700" : "text-emerald-700"}>
                      {over > 0 ? "⚠️" : "✓"} {a.airline}: limită {a.combinedCarryOnKgPerPerson} kg combinat
                      {over > 0 && ` — depășire ${over.toFixed(1)} kg`}
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>

      <SectionTitle>Reguli de verificat</SectionTitle>
      <div className="space-y-2">
        {trip.luggage.rulesToVerify.map((r) => (
          <Note key={r} tone="warn">
            {r}
          </Note>
        ))}
      </div>
    </>
  );
}

function DimResult({ airline, dims, role }: { airline: AirlineLimit; dims: [number, number, number]; role: "main" | "personal" }) {
  const max = role === "main" ? airline.mainBagMaxCm : airline.personalItemMaxCm;
  const over = dimCheck(dims, max);
  const exceeds = over.some((x) => x > 0);
  return (
    <p
      className={`rounded-lg px-2.5 py-1.5 text-sm ${exceeds ? "bg-rose-50 font-medium text-rose-800" : "bg-emerald-50 text-emerald-800"}`}
      role={exceeds ? "alert" : undefined}
    >
      {exceeds ? "⚠️ Depășește" : "✓ În limită"} — {airline.airline}, {role === "main" ? "geantă principală" : "obiect personal"} max{" "}
      {max.join(" × ")} cm
      {exceeds && ` (cu ${over.filter((x) => x > 0).map((x) => `${x} cm`).join(", ")} peste)`}
    </p>
  );
}
