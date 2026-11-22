import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { Checklist } from "./Checklist";

export const metadata: Metadata = { title: "Checklist" };

export default function ChecklistPage() {
  return (
    <>
      <PageTitle
        title="Checklist și notițe"
        subtitle="Bifele și notițele se salvează în browserul acestui telefon. Folosiți Export/Import ca să le copiați pe celălalt telefon."
      />
      <Checklist />
    </>
  );
}
