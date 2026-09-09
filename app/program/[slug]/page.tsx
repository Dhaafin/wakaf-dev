import { Suspense } from "react";
import { ProgramDetailOrganism } from "@/components/organisms/program/ProgramDetailOrganism";

export default function ProgramDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="container-app py-10">
          <div className="skeleton h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <ProgramDetailOrganism slug={params.slug} />
    </Suspense>
  );
}

