"use client";
import { useCallback, useEffect, useState } from "react";

export const STORAGE_PREFIX = "trip2027:";

/** State persisted in this browser's localStorage. Renders `initial` first, then loads the stored value. */
export function useLocalStorage<T>(key: string, initial: T) {
  const fullKey = STORAGE_PREFIX + key;
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(fullKey);
      if (stored !== null) setValue(JSON.parse(stored) as T);
    } catch {
      /* ignore corrupt entries */
    }
    setLoaded(true);
  }, [fullKey]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(fullKey, JSON.stringify(v));
        } catch {
          /* storage full or disabled */
        }
        return v;
      });
    },
    [fullKey],
  );

  return [value, update, loaded] as const;
}
