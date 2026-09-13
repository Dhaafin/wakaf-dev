"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import {
  formatRupiah,
  formatRupiahCompact,
  formatNumber,
  formatTanggal,
  persen,
} from "@/lib/format";
import { ProgramImage } from "./molecules/ProgramImage";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";
import { PROGRAM_TYPE_LABEL, PROGRAM_TYPE_TERMS } from "@/types";
import { WakafForm } from "./molecules/WakafForm";
import { EmptyState } from "@/components/atoms/EmptyState";

export function ProgramDetailOrganism({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nominalAwal = Number(searchParams.get("nominal")) || undefined;
  const { data: program, loading, error } = useAsync(
    () => api.getProgram(slug),
    [slug],
  );

  if (loading) {
    return (
      <div className="container-app py-10">
        <div className="skeleton h-64 w-full rounded-2xl" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-40 w-full rounded-xl" />
          </div>
          <div className="skeleton h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="container-app py-16">
        <EmptyState
          title="Program tidak ditemukan"
          desc="Mungkin tautannya salah atau program sudah tidak tersedia."
          action={
            <Link href="/program" className="btn-primary">
              Lihat semua program
            </Link>
          }
        />
      </div>
    );
  }

  const totalDisalurkan = program.disbursements.reduce(
    (s, d) => s + d.nominal,
    0,
  );

  return (
    <article className="container-app py-8">
      <nav className="mb-4 text-sm text-brand-500">
        <Link href="/program" className="hover:text-brand-800">
          Program
        </Link>{" "}
        / <span className="text-brand-700">{program.nama}</span>
      </nav>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-brand-100 sm:aspect-[21/9]">
        <ProgramImage
          imageUrl={program.imageUrl}
          kategori={program.kategori}
          alt={program.nama}
          sizes="100vw"
          priority
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="badge bg-white/90 text-brand-800">
            {PROGRAM_TYPE_LABEL[program.program_type]}
          </span>
          <CategoryBadge kategori={program.kategori} />
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="text-sm font-medium text-brand-500">
            📍 {program.lokasi}
          </p>
          <h1 className="mt-1.5 font-serif text-3xl font-bold leading-tight text-brand-950">
            {program.nama}
          </h1>

          <div className="mt-5 card p-5">
            <ProgressBar
              terkumpul={program.terkumpul}
              target={program.target}
              showLabel={false}
            />
            <div className="mt-3 grid grid-cols-1 divide-y divide-brand-100 sm:grid-cols-3 sm:gap-3 sm:divide-y-0 sm:text-center">
              <div className="flex items-baseline justify-between py-2 sm:block sm:py-0">
                <p className="order-2 font-serif text-base font-bold text-brand-800 sm:order-none sm:text-lg">
                  {formatRupiah(program.terkumpul)}
                </p>
                <p className="text-xs text-brand-500">terkumpul</p>
              </div>
              <div className="flex items-baseline justify-between py-2 sm:block sm:py-0">
                <p className="order-2 font-serif text-base font-bold text-brand-800 sm:order-none sm:text-lg">
                  {persen(program.terkumpul, program.target)}%
                </p>
                <p className="text-xs text-brand-500">
                  dari {formatRupiahCompact(program.target)}
                </p>
              </div>
              <div className="flex items-baseline justify-between py-2 sm:block sm:py-0">
                <p className="order-2 font-serif text-base font-bold text-brand-800 sm:order-none sm:text-lg">
                  {formatNumber(program.jumlahWakif)}
                </p>
                <p className="text-xs text-brand-500">
                  {PROGRAM_TYPE_TERMS[program.program_type].pemberiJamak}
                </p>
              </div>
            </div>
          </div>

          <section className="prose prose-sm mt-8 max-w-none">
            <h2 className="font-serif text-xl font-bold text-brand-950">
              Tentang program ini
            </h2>
            <p className="mt-2 whitespace-pre-line text-brand-700">
              {program.deskripsi}
            </p>
          </section>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="card p-4">
              <dt className="text-brand-400">
                {PROGRAM_TYPE_TERMS[program.program_type].pengelola} pengelola
              </dt>
              <dd className="mt-0.5 font-semibold text-brand-900">
                {program.nazhir}
              </dd>
            </div>
            <div className="card p-4">
              <dt className="text-brand-400">Dibuka sejak</dt>
              <dd className="mt-0.5 font-semibold text-brand-900">
                {formatTanggal(program.createdAt)}
              </dd>
            </div>
          </dl>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-brand-950">
              Penyaluran dana
            </h2>
            {program.disbursements.length === 0 ? (
              <p className="mt-2 text-sm text-brand-500">
                Belum ada penyaluran. Dana yang terkumpul sedang dihimpun sampai
                mencukupi tahap pertama.
              </p>
            ) : (
              <>
                <p className="mt-1 text-sm text-brand-500">
                  Total tersalurkan: {formatRupiah(totalDisalurkan)}
                </p>
                <ol className="mt-4 space-y-3">
                  {program.disbursements.map((d) => (
                    <li key={d.id} className="card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-brand-900">
                            {d.judul}
                          </p>
                          <p className="text-xs text-brand-500">
                            {formatTanggal(d.tanggal)}
                          </p>
                        </div>
                        <span className="badge bg-brand-100 text-brand-800">
                          {formatRupiah(d.nominal)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-brand-600">
                        {d.deskripsi}
                      </p>
                      {d.buktiImageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={d.buktiImageUrl}
                          alt={`Bukti: ${d.judul}`}
                          className="mt-3 max-h-56 w-full rounded-xl object-cover"
                        />
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <WakafForm
            program={program}
            nominalAwal={nominalAwal}
            onCreated={(txId) => router.push(`/wakaf/${txId}`)}
          />
        </div>
      </div>
    </article>
  );
}
