import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { LuggageChecker } from "./LuggageChecker";

export const metadata: Metadata = { title: "Bagaje" };

export default function Bagaje() {
  return (
    <>
      <PageTitle
        title="Bagaje"
        subtitle="Introduceți dimensiunile și greutatea măsurate. Limitele companiilor sunt cele din plan — verificați-le pe site-urile oficiale înainte de zbor."
      />
      <LuggageChecker />
    </>
  );
}
