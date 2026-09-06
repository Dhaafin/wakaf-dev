import Link from "next/link";
import { HomeStats } from "@/components/home/home-stats";
import { FeaturedPrograms } from "@/components/home/featured-programs";

export default function BerandaPage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(600px circle at 15% 20%, #2aa19d 0, transparent 45%), radial-gradient(500px circle at 85% 10%, #46bab6 0, transparent 40%)",
          }}
        />
        <div className="container-app relative py-16 sm:py-24">
          <div className="max-w-2xl animate-fade-in">
            <span className="badge bg-white/10 text-brand-100">
              Wakaf uang &amp; aset · tercatat &amp; transparan
            </span>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
              Wakaf yang manfaatnya{" "}
              <span className="text-brand-300">terus mengalir</span>.
            </h1>
            <p className="mt-4 text-base text-brand-100/90 sm:text-lg">
              Berwakaf mulai dari Rp10.000. Setiap rupiah dikelola nazhir
              profesional, progresnya bisa Anda pantau, dan Anda menerima
              sertifikat wakaf resmi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/program" className="btn-primary">
                Mulai Berwakaf
              </Link>
              <Link
                href="/transparansi"
                className="btn border border-white/25 text-white hover:bg-white/10"
              >
                Lihat Transparansi
              </Link>
            </div>
          </div>

          <div className="relative mt-14">
            <HomeStats />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CARA KERJA                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="container-app py-14">
        <h2 className="text-center font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
          Empat langkah, selesai
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: "01",
              t: "Pilih program",
              d: "Masjid, pendidikan, wakaf produktif, atau air bersih.",
            },
            {
              n: "02",
              t: "Isi & konfirmasi",
              d: "Nominal, atas nama sendiri/orang lain, publik atau anonim.",
            },
            {
              n: "03",
              t: "Bayar via Virtual Account",
              d: "Nomor VA terbit otomatis. Bayar sebelum waktu habis.",
            },
            {
              n: "04",
              t: "Terima sertifikat",
              d: "Sertifikat wakaf ber-nomor unik, bisa diunduh & diverifikasi.",
            },
          ].map((s) => (
            <div key={s.n} className="card p-6">
              <p className="font-serif text-3xl font-bold text-brand-200">
                {s.n}
              </p>
              <h3 className="mt-2 font-semibold text-brand-950">{s.t}</h3>
              <p className="mt-1 text-sm text-brand-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <FeaturedPrograms />

      {/* ---------------------------------------------------------------- */}
      {/* CTA TRUST                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="container-app pb-16">
        <div className="rounded-2xl bg-brand-900 p-8 text-white sm:p-12">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold">
                Amanah yang bisa Anda periksa
              </h2>
              <p className="mt-2 max-w-xl text-sm text-brand-100/90">
                Setiap penyaluran dana dilaporkan lengkap dengan bukti pada
                halaman transparansi. Data laporan terhubung langsung dengan
                pencatatan internal — bukan sekadar gambar.
              </p>
            </div>
            <Link
              href="/transparansi"
              className="btn bg-white text-brand-900 hover:bg-brand-50"
            >
              Buka Laporan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
