"use client";
import Link from "next/link";
import { progress, useChecklist } from "@/lib/checklist-state";
import { Card } from "./ui";

export function ChecklistProgress() {
  const [state] = useChecklist();
  const { done, total } = progress(state);
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-stone-500">Progres rezervări și pregătiri</p>
        <Link href="/checklist/" className="text-sm text-lagoon-700 underline underline-offset-2">
          Deschide
        </Link>
      </div>
      <p className="mt-1 text-2xl font-semibold text-lagoon-900">
        {done} / {total}
      </p>
      <div
        className="mt-2 h-2.5 overflow-hidden rounded-full bg-sand-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progres checklist"
      >
        <div className="h-full rounded-full bg-lagoon-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-stone-500">Salvat doar pe acest dispozitiv.</p>
    </Card>
  );
}
