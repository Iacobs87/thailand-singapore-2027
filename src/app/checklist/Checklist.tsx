"use client";
import { useRef, useState } from "react";
import { Card, ExtLink, SectionTitle } from "@/components/ui";
import { progress, useChecklist } from "@/lib/checklist-state";
import { trip } from "@/lib/trip";
import { STORAGE_PREFIX, useLocalStorage } from "@/lib/useLocalStorage";

export function Checklist() {
  const [state, setState] = useChecklist();
  const [notes, setNotes] = useLocalStorage("notes", "");
  const [newItem, setNewItem] = useState("");
  const { done, total } = progress(state);

  return (
    <>
      <Card>
        <p className="mb-3 text-sm text-stone-600">
          {done} din {total} bifate
        </p>
        <ul className="space-y-1">
          {trip.checklist.map((c) => (
            <CheckRow
              key={c.id}
              label={c.label}
              checked={!!state.done[c.id]}
              onToggle={(v) => setState({ ...state, done: { ...state.done, [c.id]: v } })}
            />
          ))}
          {state.custom.map((c) => (
            <CheckRow
              key={c.id}
              label={c.label}
              checked={c.done}
              onToggle={(v) => setState({ ...state, custom: state.custom.map((x) => (x.id === c.id ? { ...x, done: v } : x)) })}
              onDelete={() => setState({ ...state, custom: state.custom.filter((x) => x.id !== c.id) })}
            />
          ))}
        </ul>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const label = newItem.trim();
            if (!label) return;
            setState({ ...state, custom: [...state.custom, { id: crypto.randomUUID(), label, done: false }] });
            setNewItem("");
          }}
        >
          <input
            aria-label="Element nou"
            placeholder="Adaugă un element…"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-lg bg-lagoon-600 px-3 py-2 text-sm font-medium text-white hover:bg-lagoon-700">
            Adaugă
          </button>
        </form>
      </Card>

      <SectionTitle>Linkuri utile</SectionTitle>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {trip.officialLinks.map((l) => (
          <li key={l.url}>
            <ExtLink href={l.url}>{l.label}</ExtLink>
          </li>
        ))}
      </ul>

      <SectionTitle>Notițe</SectionTitle>
      <Card>
        <textarea
          aria-label="Notițe"
          rows={8}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ore de check-in, numere de telefon ale hotelurilor, idei de restaurante… (nu puneți aici coduri de rezervare sau date de pașaport)"
          className="w-full rounded-lg border border-stone-300 p-3 text-sm"
        />
      </Card>

      <SectionTitle>Copiere între telefoane</SectionTitle>
      <DataTransfer />
    </>
  );
}

function CheckRow({
  label,
  checked,
  onToggle,
  onDelete,
}: {
  label: string;
  checked: boolean;
  onToggle: (v: boolean) => void;
  onDelete?: () => void;
}) {
  return (
    <li className="flex items-center gap-2">
      <label className="flex flex-1 cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-sand-50">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-lagoon-600"
        />
        <span className={`text-sm ${checked ? "text-stone-400 line-through" : ""}`}>{label}</span>
      </label>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Șterge: ${label}`}
          className="rounded px-2 py-1 text-stone-400 hover:bg-rose-50 hover:text-rose-700"
        >
          ✕
        </button>
      )}
    </li>
  );
}

/** Export / import everything this site saved in localStorage, as a JSON file. */
function DataTransfer() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const doExport = () => {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(STORAGE_PREFIX)) data[k] = JSON.parse(localStorage.getItem(k) ?? "null");
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `vacanta-2027-date-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const doImport = async (file: File) => {
    try {
      const data = JSON.parse(await file.text()) as Record<string, unknown>;
      let n = 0;
      for (const [k, v] of Object.entries(data)) {
        if (k.startsWith(STORAGE_PREFIX)) {
          localStorage.setItem(k, JSON.stringify(v));
          n++;
        }
      }
      setMsg(`Importat (${n} secțiuni). Pagina se reîncarcă…`);
      setTimeout(() => location.reload(), 800);
    } catch {
      setMsg("Fișier invalid.");
    }
  };

  return (
    <Card>
      <p className="text-sm text-stone-600">
        Exportați un fișier cu bifele, notițele, bugetul, cheltuielile și bagajele, trimiteți-l pe celălalt telefon și importați-l acolo.
        Importul înlocuiește datele de pe acel telefon.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={doExport} className="rounded-lg border border-lagoon-600 px-3 py-2 text-sm font-medium text-lagoon-700">
          ⬇️ Exportă datele
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-lagoon-600 px-3 py-2 text-sm font-medium text-lagoon-700"
        >
          ⬆️ Importă
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])}
        />
      </div>
      {msg && <p className="mt-2 text-sm text-lagoon-700">{msg}</p>}
    </Card>
  );
}
