import Link from "next/link";
import { PROGRAM_TYPE_TERMS, type Program } from "@/types";
import { formatRupiah, formatNumber } from "@/lib/format";
import { ProgramImage } from "@/components/organisms/program/molecules/ProgramImage";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";

export function ProgramCard({ program }: { program: Program }) {
  return (
    <Link
      href={`/program/${program.slug}`}
      className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-100">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <ProgramImage
            imageUrl={program.imageUrl}
            kategori={program.kategori}
            alt={program.nama}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
        <div className="absolute left-3 top-3">
          <CategoryBadge kategori={program.kategori} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-brand-500">📍 {program.lokasi}</p>
        <h3 className="mt-1.5 line-clamp-2 font-serif text-lg font-semibold leading-snug text-brand-950">
          {program.nama}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-brand-600">
          {program.ringkasan}
        </p>

        <div className="mt-4">
          <ProgressBar
            terkumpul={program.terkumpul}
            target={program.target}
            showLabel={false}
          />
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-xs text-brand-500">Terkumpul</p>
              <p className="text-sm font-bold text-brand-800">
                {formatRupiah(program.terkumpul)}
              </p>
            </div>
            <p className="text-xs text-brand-500">
              dari {formatRupiah(program.target)}
            </p>
          </div>
          <p className="mt-2 text-xs text-brand-400">
            {formatNumber(program.jumlahWakif)}{" "}
            {PROGRAM_TYPE_TERMS[program.program_type].pemberiJamak} telah
            berpartisipasi
          </p>
        </div>
      </div>
    </Link>
  );
}
