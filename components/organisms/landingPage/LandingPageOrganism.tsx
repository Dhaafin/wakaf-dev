import Link from "next/link";
import { HomeStats } from "./molecules/HomeStats";
import { FeaturedPrograms } from "./molecules/FeaturedPrograms";
import {
  PROGRAM_TYPE_ORDER,
  PROGRAM_TYPE_LABEL,
  PROGRAM_TYPE_DESC,
} from "@/types";

export function LandingPageOrganism() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(600px circle at 15% 20%, #1e9a4c 0, transparent 45%), radial-gradient(500px circle at 85% 10%, #44b06a 0, transparent 40%)",
          }}
        />
        <div className="container-app relative py-12 sm:py-24">
          <div className="max-w-2xl animate-fade-in">
            <span className="badge bg-white/10 text-brand-100">
              Wakaf uang &amp; aset · tercatat &amp; transparan
            </span>
            <h1 className="mt-4 font-serif text-[1.9rem] font-bold leading-[1.15] sm:text-5xl">
              Wakaf yang manfaatnya{" "}
              <span className="text-brand-300">terus mengalir</span>.
            </h1>
            <p className="mt-4 text-base text-brand-100/90 sm:text-lg">
              Wakaf, infaq, shadaqah, dan zakat dalam satu kanal. Mulai dari
              Rp10.000, dikelola nazhir &amp; amil profesional, progresnya bisa
              Anda pantau, dan Anda menerima bukti resmi.
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

          <div className="relative mt-10 sm:mt-14">
            <HomeStats />
          </div>
        </div>
      </section>

      {/* JENIS PROGRAM */}
      <section className="container-app py-14">
        <h2 className="text-center font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
          Pilih jenis kebaikan
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-brand-600">
          Setiap jenis punya ketentuan dan cara pengelolaan yang berbeda.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAM_TYPE_ORDER.map((jenis) => (
            <Link
              key={jenis}
              href={`/program#${jenis}`}
              className="card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-serif text-lg font-semibold text-brand-950">
                {PROGRAM_TYPE_LABEL[jenis]}
              </h3>
              <p className="mt-2 text-sm text-brand-600">
                {PROGRAM_TYPE_DESC[jenis]}
              </p>
              <span className="mt-3 inline-block text-sm font-semibold text-brand-700 group-hover:text-brand-900">
                Lihat program →
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/zakat" className="btn-outline">
            🧮 Hitung zakat dulu
          </Link>
        </div>
      </section>

      {/* CARA KERJA */}
      <section className="container-app py-14">
        <h2 className="text-center font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
          Empat langkah, selesai
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: "01",
              t: "Pilih jenis & program",
              d: "Wakaf uang, wakaf melalui uang, infaq & shadaqah, atau zakat.",
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
              t: "Terima bukti resmi",
              d: "Sertifikat wakaf / bukti donasi / bukti setor zakat, bernomor unik & bisa diverifikasi.",
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

      {/* FEATURED PROGRAMS SECTION */}
      <FeaturedPrograms />

      {/* CTA TRUST */}
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
