import { Suspense } from "react";
import { ProgramBrowserOrganism } from "@/components/organisms/program/ProgramBrowserOrganism";
import { ProgramGridSkeleton } from "@/components/molecules/ProgramCardSkeleton";

export const metadata = {
  title: "Program Kebaikan & Wakaf — Yayasan Khazanah Berkah Mulia",
  description: "Jelajahi dan tunaikan donasi serta wakaf untuk berbagai program keagamaan, pendidikan, dan pemberdayaan masyarakat.",
};

export default function ProgramListPage() {
  return (
    <main className="min-h-screen pb-16 bg-sand-50/50">
      <Suspense
        fallback={
          <div className="container-app py-10">
            <ProgramGridSkeleton />
          </div>
        }
      >
        <ProgramBrowserOrganism />
      </Suspense>
    </main>
  );
}
