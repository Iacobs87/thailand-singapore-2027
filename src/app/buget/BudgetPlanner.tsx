"use client";
import { useState } from "react";
import { Card, Note, SectionTitle } from "@/components/ui";
import { BUDGET_LABELS, eur, money, rangeEur, trip } from "@/lib/trip";
import { useLocalStorage } from "@/lib/useLocalStorage";

const b = trip.budget;
type Currency = "EUR" | "THB" | "SGD" | "USD";
const CURRENCIES: Currency[] = ["THB", "SGD", "EUR", "USD"];

interface Rates {
  USD: number;
  THB: number;
  SGD: number;
}
interface Expense {
  id: string;
  date: string;
  amount: number;
  currency: Currency;
  category: string;
  note: string;
}

const defaultRates: Rates = {
  USD: b.defaultExchangeRates.EURperUSD,
  THB: b.defaultExchangeRates.EURperTHB,
  SGD: b.defaultExchangeRates.EURperSGD,
};

function NumberInput({
  value,
  onChange,
  step = 1,
  label,
  className = "",
}: {
  value: number;
  onChange: (n: number) => void;
  step?: number;
  label: string;
  className?: string;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      aria-label={label}
      step={step}
      min={0}
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      className={`w-full rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-right tabular-nums focus:border-lagoon-500 ${className}`}
    />
  );
}

export function BudgetPlanner() {
  const [rates, setRates] = useLocalStorage<Rates>("rates", defaultRates);
  const [cats, setCats] = useLocalStorage<Record<string, number>>("budget-categories", b.targetBreakdownEuro);
  const [flightsUsd, setFlightsUsd] = useLocalStorage("regional-flights-usd", {
    airAsia: b.regionalFlightsQuotedUsdForTwo.airAsia,
    scoot: b.regionalFlightsQuotedUsdForTwo.scoot,
  });
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);

  const planned = Object.values(cats).reduce((s, n) => s + n, 0);
  const flightsUsdTotal = flightsUsd.airAsia + flightsUsd.scoot;
  const flightsEur = flightsUsdTotal * rates.USD;
  const toEur = (e: Expense) => (e.currency === "EUR" ? e.amount : e.amount * rates[e.currency]);

  const spentByCurrency = CURRENCIES.map((c) => ({
    c,
    total: expenses.filter((e) => e.currency === c).reduce((s, e) => s + e.amount, 0),
  })).filter((x) => x.total > 0);
  const spentEurApprox = expenses.reduce((s, e) => s + toEur(e), 0);

  return (
    <>
      <SectionTitle>Plan pe categorii (EUR)</SectionTitle>
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-stone-500">
              <th className="pb-2 font-medium">Categorie</th>
              <th className="pb-2 text-right font-medium">Bază</th>
              <th className="w-32 pb-2 text-right font-medium">Planul vostru</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(b.targetBreakdownEuro).map((k) => (
              <tr key={k} className="border-t border-stone-100">
                <td className="py-2 pr-2">{BUDGET_LABELS[k] ?? k}</td>
                <td className="py-2 text-right tabular-nums text-stone-500">{eur(b.targetBreakdownEuro[k])}</td>
                <td className="py-2 pl-2">
                  <NumberInput label={BUDGET_LABELS[k] ?? k} step={10} value={cats[k] ?? 0} onChange={(n) => setCats({ ...cats, [k]: n })} />
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-stone-200 font-semibold">
              <td className="py-2">Total</td>
              <td className="py-2 text-right tabular-nums text-stone-500">{eur(b.targetTotalEuro)}</td>
              <td className="py-2 text-right tabular-nums text-lagoon-900">{eur(planned)}</td>
            </tr>
          </tbody>
        </table>
        <button
          type="button"
          onClick={() => setCats(b.targetBreakdownEuro)}
          className="mt-2 text-sm text-lagoon-700 underline underline-offset-2"
        >
          Revino la valorile de bază
        </button>

        <div className="mt-4">
          <p className="mb-1 text-xs text-stone-500">Planul vostru față de scenarii</p>
          <ScenarioBar value={planned} />
        </div>
      </Card>

      <SectionTitle>Zboruri regionale (cotații în USD)</SectionTitle>
      <Card>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Thai AirAsia, 5 ian. (USD, 2 pers.)
            <NumberInput label="AirAsia USD" step={5} value={flightsUsd.airAsia} onChange={(n) => setFlightsUsd({ ...flightsUsd, airAsia: n })} />
          </label>
          <label className="text-sm">
            Scoot, 8 ian. (USD, 2 pers.)
            <NumberInput label="Scoot USD" step={5} value={flightsUsd.scoot} onChange={(n) => setFlightsUsd({ ...flightsUsd, scoot: n })} />
          </label>
        </div>
        <p className="mt-3 text-sm">
          Total: <strong>USD {flightsUsdTotal}</strong> ≈ <strong>{eur(flightsEur)}</strong>{" "}
          <span className="text-stone-500">la cursul presupus de mai jos</span>
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Aceste zboruri sunt deja incluse în categoria „Transport” de mai sus — nu le adăuga de două ori. Ele rămân în USD; conversia e
          doar orientativă.
        </p>
      </Card>

      <SectionTitle>Cursuri de schimb (presupuneri editabile)</SectionTitle>
      <Card>
        <Note tone="warn">{b.defaultExchangeRates.note}</Note>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {(["USD", "THB", "SGD"] as const).map((c) => (
            <label key={c} className="text-sm">
              1 {c} = … EUR
              <NumberInput label={`Curs ${c}`} step={0.001} value={rates[c]} onChange={(n) => setRates({ ...rates, [c]: n })} />
              <span className="text-xs text-stone-500">1 EUR ≈ {rates[c] > 0 ? (1 / rates[c]).toFixed(2) : "—"} {c}</span>
            </label>
          ))}
        </div>
      </Card>

      <SectionTitle>Intervale pe destinații (EUR, 2 pers.)</SectionTitle>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs text-stone-500">
              <th className="pb-2 font-medium">Destinație</th>
              <th className="pb-2 font-medium">Cazare</th>
              <th className="pb-2 font-medium">Mâncare</th>
              <th className="pb-2 font-medium">Activități</th>
            </tr>
          </thead>
          <tbody>
            {trip.destinations.map((d) => {
              const acc = b.accommodationByDestinationEuro[d.id];
              return (
                <tr key={d.id} className="border-t border-stone-100 align-top">
                  <td className="py-2 pr-2 font-medium">{d.name}</td>
                  <td className="py-2 pr-2">
                    {rangeEur(acc.total)}
                    <span className="block text-xs text-stone-500">
                      {acc.nights} nopți × {rangeEur(acc.perRoomNight)}/cameră
                    </span>
                  </td>
                  <td className="py-2 pr-2">{rangeEur(b.foodEuroForTwoByDestination[d.id])}</td>
                  <td className="py-2">{rangeEur(b.activitiesEuroForTwoByDestination[d.id])}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-stone-500">
          Transferuri principale: {rangeEur([b.mainTransferBudgetEuroForTwo.low, b.mainTransferBudgetEuroForTwo.high])} · Transport local
          și excursii: {rangeEur([b.localTransportAndExcursionsBudgetEuroForTwo.low, b.localTransportAndExcursionsBudgetEuroForTwo.high])}
        </p>
      </Card>

      <SectionTitle>Cheltuieli reale în vacanță</SectionTitle>
      <Card>
        <ExpenseForm categories={Object.keys(b.targetBreakdownEuro)} onAdd={(e) => setExpenses([e, ...expenses])} />
        {expenses.length > 0 ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {spentByCurrency.map(({ c, total }) => (
                <span key={c} className="rounded-full bg-sand-100 px-3 py-1 text-sm font-medium">
                  {money(total, c)}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm">
              Echivalent aproximativ: <strong>{eur(spentEurApprox)}</strong> din {eur(planned)} planificat{" "}
              <span className="text-stone-500">(la cursurile presupuse)</span>
            </p>
            <ul className="mt-3 divide-y divide-stone-100 text-sm">
              {expenses.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-2 py-2">
                  <span>
                    <span className="font-medium tabular-nums">{money(e.amount, e.currency)}</span>{" "}
                    <span className="text-stone-500">
                      · {BUDGET_LABELS[e.category] ?? e.category} · {e.date}
                    </span>
                    {e.note && <span className="block text-stone-600">{e.note}</span>}
                  </span>
                  <button
                    type="button"
                    aria-label="Șterge cheltuiala"
                    onClick={() => setExpenses(expenses.filter((x) => x.id !== e.id))}
                    className="rounded px-2 py-1 text-stone-400 hover:bg-rose-50 hover:text-rose-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 text-sm text-stone-500">Nicio cheltuială înregistrată. Sumele se păstrează în moneda originală.</p>
        )}
      </Card>

      <SectionTitle>Ce nu include bugetul</SectionTitle>
      <ul className="list-disc space-y-1 pl-5 text-sm text-stone-700">
        {b.excludes.map((x) => (
          <li key={x}>{x}</li>
        ))}
        {b.notes.map((x) => (
          <li key={x} className="text-stone-500">
            {x}
          </li>
        ))}
      </ul>
    </>
  );
}

function ScenarioBar({ value }: { value: number }) {
  const { economy, comfortable } = b.scenarioEstimatesEuro;
  const max = Math.max(comfortable * 1.1, value);
  const pos = (n: number) => `${Math.min(100, (n / max) * 100)}%`;
  return (
    <div>
      <div className="relative h-3 rounded-full bg-gradient-to-r from-emerald-200 via-amber-200 to-rose-200">
        <div className="absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded bg-lagoon-900" style={{ left: pos(value) }} aria-hidden />
      </div>
      <div className="relative mt-1 h-8 text-xs text-stone-500">
        <span className="absolute -translate-x-1/2" style={{ left: pos(economy) }}>
          Economic
          <br />
          {eur(economy)}
        </span>
        <span className="absolute -translate-x-1/2" style={{ left: pos(b.targetTotalEuro) }}>
          Țintă
          <br />
          {eur(b.targetTotalEuro)}
        </span>
        <span className="absolute -translate-x-1/2" style={{ left: pos(comfortable) }}>
          Confortabil
          <br />
          {eur(comfortable)}
        </span>
      </div>
    </div>
  );
}

function ExpenseForm({ categories, onAdd }: { categories: string[]; onAdd: (e: Expense) => void }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("THB");
  const [category, setCategory] = useState(categories[1] ?? categories[0]);
  const [note, setNote] = useState("");

  return (
    <form
      className="grid grid-cols-2 gap-2 sm:grid-cols-5"
      onSubmit={(ev) => {
        ev.preventDefault();
        const n = Number(amount.replace(",", "."));
        if (!(n > 0)) return;
        onAdd({
          id: crypto.randomUUID(),
          date: new Date().toISOString().slice(0, 10),
          amount: n,
          currency,
          category,
          note: note.trim(),
        });
        setAmount("");
        setNote("");
      }}
    >
      <input
        aria-label="Sumă"
        inputMode="decimal"
        placeholder="Sumă"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="rounded-lg border border-stone-300 px-2 py-1.5"
      />
      <select
        aria-label="Monedă"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="rounded-lg border border-stone-300 bg-white px-2 py-1.5"
      >
        {CURRENCIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <select
        aria-label="Categorie"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="col-span-2 rounded-lg border border-stone-300 bg-white px-2 py-1.5 sm:col-span-1"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {BUDGET_LABELS[c] ?? c}
          </option>
        ))}
      </select>
      <input
        aria-label="Notă"
        placeholder="Notă (opțional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="rounded-lg border border-stone-300 px-2 py-1.5"
      />
      <button type="submit" className="rounded-lg bg-lagoon-600 px-3 py-1.5 font-medium text-white hover:bg-lagoon-700">
        Adaugă
      </button>
    </form>
  );
}
