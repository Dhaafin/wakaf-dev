import { ProgramDetail } from "@/components/program-detail";

export default function ProgramDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <ProgramDetail slug={params.slug} />;
}
