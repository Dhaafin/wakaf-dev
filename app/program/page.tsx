import { Suspense } from "react";
import { ProgramBrowser } from "@/components/program-browser";
import { ProgramGridSkeleton } from "@/components/program-card-skeleton";

export const metadata = { title: "Program — KBM" };

export default function ProgramListPage() {
  return (
    <div className="container-app py-10">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl font-bold text-brand-950 sm:text-4xl">
          Program
        </h1>
        <p className="mt-2 text-brand-600">
          Program dikelompokkan menurut jenisnya: wakaf uang, wakaf melalui
          uang, infaq &amp; shadaqah, dan zakat. Progres tiap program diperbarui
          otomatis setiap ada dana baru yang masuk.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="mt-8">
            <ProgramGridSkeleton />
          </div>
        }
      >
        <ProgramBrowser />
      </Suspense>
    </div>
  );
}
