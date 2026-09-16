import { PROGRAM_CATEGORY_LABEL, type ProgramCategory } from "@/types";

const STYLE: Record<string, string> = {
  masjid: "bg-brand-100 text-brand-800",
  pendidikan: "bg-amber-100 text-amber-800",
  "produktif-umkm": "bg-violet-100 text-violet-800",
  "sumur-air-bersih": "bg-sky-100 text-sky-800",
  kemanusiaan: "bg-rose-100 text-rose-800",
  "sosial-dhuafa": "bg-teal-100 text-teal-800",
};

export function CategoryBadge({
  kategori,
  className = "",
}: {
  kategori: ProgramCategory | string;
  className?: string;
}) {
  const badgeStyle =
    STYLE[kategori] || "bg-brand-50 text-brand-800 border border-brand-200/60";
  const label =
    (PROGRAM_CATEGORY_LABEL as Record<string, string>)[kategori] || kategori;

  return (
    <span className={`badge ${badgeStyle} ${className}`.trim()}>
      {label}
    </span>
  );
}
