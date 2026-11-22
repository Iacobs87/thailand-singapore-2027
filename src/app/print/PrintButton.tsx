"use client";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-lg bg-lagoon-600 px-3 py-2 font-medium text-white hover:bg-lagoon-700">
      🖨️ Printează / PDF
    </button>
  );
}
