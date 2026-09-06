import { PROGRAM_CATEGORY_LABEL, type ProgramCategory } from "@/types";

const STYLE: Record<ProgramCategory, string> = {
  masjid: "bg-brand-100 text-brand-800",
  pendidikan: "bg-amber-100 text-amber-800",
  "produktif-umkm": "bg-violet-100 text-violet-800",
  "sumur-air-bersih": "bg-sky-100 text-sky-800",
};

export function CategoryBadge({ kategori }: { kategori: ProgramCategory }) {
  return (
    <span className={`badge ${STYLE[kategori]}`}>
      {PROGRAM_CATEGORY_LABEL[kategori]}
    </span>
  );
}
