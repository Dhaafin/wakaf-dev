import Link from "next/link";

export function ProfilKontak() {
  return (
    <>
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-brand-950">
          Hubungi Kami
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="card p-4">
            <p className="text-xs uppercase tracking-wide text-brand-400">
              Kantor
            </p>
            <p className="mt-1 text-sm text-brand-700">
              Jl. Melati Raya No. 18, Kel. Sukamaju,
              <br />
              Kec. Cilodong, Kota Depok, Jawa Barat 16415
            </p>
          </div>
          <div className="card p-4">
            <p className="text-xs uppercase tracking-wide text-brand-400">
              Telepon &amp; Email
            </p>
            <p className="mt-1 text-sm text-brand-700">
              (021) 1234-5678 · WA 0812-3456-7890
              <br />
              info@kbm.or.id
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12">
        <div className="rounded-2xl bg-brand-900 p-8 text-white sm:p-10">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold">
                Ikut menumbuhkan manfaat
              </h2>
              <p className="mt-2 max-w-xl text-sm text-brand-100/90">
                Wakaf, infaq, shadaqah, dan zakat Anda dikelola dengan
                pencatatan yang bisa diperiksa kapan saja di halaman
                transparansi.
              </p>
            </div>
            <Link
              href="/program"
              className="btn bg-white text-brand-900 hover:bg-brand-50"
            >
              Lihat Program
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
