import type { Metadata } from "next";
import { BudgetPlanner } from "./BudgetPlanner";
import { PageTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Buget" };

export default function Buget() {
  return (
    <>
      <PageTitle
        title="Buget pentru 2 persoane"
        subtitle="Estimări de planificare, nu oferte sau chitanțe. Valorile editate se salvează doar pe acest dispozitiv."
      />
      <BudgetPlanner />
    </>
  );
}
