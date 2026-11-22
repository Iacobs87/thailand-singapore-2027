"use client";
import { trip } from "./trip";
import { useLocalStorage } from "./useLocalStorage";

export interface CustomItem {
  id: string;
  label: string;
  done: boolean;
}
export interface ChecklistState {
  done: Record<string, boolean>;
  custom: CustomItem[];
}

const initial: ChecklistState = {
  done: Object.fromEntries(trip.checklist.map((c) => [c.id, c.done])),
  custom: [],
};

export function useChecklist() {
  return useLocalStorage<ChecklistState>("checklist", initial);
}

export function progress(state: ChecklistState) {
  const total = trip.checklist.length + state.custom.length;
  const done = trip.checklist.filter((c) => state.done[c.id]).length + state.custom.filter((c) => c.done).length;
  return { total, done };
}
