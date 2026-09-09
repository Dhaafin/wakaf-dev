import Link from "next/link";
import { formatRupiah } from "@/lib/format";

export function HasilPanel({
  adaInput,
  rows,
  wajib,
  zakat,
  satuan = "",
  pesanBelumWajib,
  programSlug,
}: {
  adaInput: boolean;
  rows: [string, number][];
  wajib: boolean;
  zakat: number;
  satuan?: string;
  pesanBelumWajib: string;
  programSlug: string;
}) {
  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div className="card p-6">
        <h2 className="font-serif text-lg font-bold text-brand-950">
          Hasil perhitungan
        </h2>

        <dl className="mt-4 space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-4 border-b border-brand-50 pb-2"
            >
              <dt className="text-brand-500">{k}</dt>
              <dd className="font-semibold text-brand-900">{formatRupiah(v)}</dd>
            </div>
          ))}
        </dl>

        {!adaInput ? (
          <p className="mt-5 text-sm text-brand-500">
            Isi kolom di samping untuk melihat hasil perhitungan.
          </p>
        ) : wajib ? (
          <>
            <div className="mt-5 rounded-xl bg-brand-50 p-4 text-center">
              <p className="text-xs text-brand-600">
                Zakat yang perlu ditunaikan
              </p>
              <p className="mt-1 font-serif text-2xl font-bold text-brand-800">
                {formatRupiah(zakat)}
                <span className="text-sm font-normal text-brand-500">
                  {satuan}
                </span>
              </p>
            </div>
            <Link
              href={`/program/${programSlug}?nominal=${zakat}`}
              className="btn-primary mt-4 w-full"
            >
              Tunaikan zakat sekarang
            </Link>
            <p className="mt-2 text-center text-xs text-brand-400">
              Nominal akan otomatis terisi pada form pembayaran.
            </p>
          </>
        ) : (
          <>
            <div className="mt-5 rounded-xl bg-amber-50 p-4">
              <p className="text-sm text-amber-800">{pesanBelumWajib}</p>
            </div>
            <Link
              href="/program#infaq-shadaqah"
              className="btn-outline mt-4 w-full"
            >
              Lihat program infaq &amp; shadaqah
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
