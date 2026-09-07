import { Suspense } from "react";
import { ProgramDetail } from "@/components/program-detail";

export default function ProgramDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Suspense: ProgramDetail memakai useSearchParams (prefill ?nominal= dari
  // kalkulator zakat).
  return (
    <Suspense
      fallback={
        <div className="container-app py-10">
          <div className="skeleton h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <ProgramDetail slug={params.slug} />
    </Suspense>
  );
}
