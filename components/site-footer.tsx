"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-16 border-t border-brand-100 bg-white">
      <div className="container-app grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLogo />
          <p className="mt-3 text-sm text-brand-600">
            Yayasan Khazanah Berkah Mulia mengelola wakaf uang dan aset secara
            amanah, profesional, dan transparan.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-900">Program</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-600">
            <li>
              <Link href="/program?kategori=masjid" className="hover:text-brand-800">
                Masjid & Rumah Ibadah
              </Link>
            </li>
            <li>
              <Link href="/program?kategori=pendidikan" className="hover:text-brand-800">
                Pendidikan
              </Link>
            </li>
            <li>
              <Link
                href="/program?kategori=produktif-umkm"
                className="hover:text-brand-800"
              >
                Wakaf Produktif
              </Link>
            </li>
            <li>
              <Link
                href="/program?kategori=sumur-air-bersih"
                className="hover:text-brand-800"
              >
                Sumur & Air Bersih
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-900">Tautan</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-600">
            <li>
              <Link href="/transparansi" className="hover:text-brand-800">
                Laporan Transparansi
              </Link>
            </li>
            <li>
              <Link href="/verifikasi" className="hover:text-brand-800">
                Verifikasi Sertifikat
              </Link>
            </li>
            <li>
              <Link href="/riwayat" className="hover:text-brand-800">
                Riwayat Wakaf Saya
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-brand-800">
                Panel Admin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-900">Legalitas</h4>
          <p className="mt-3 text-sm text-brand-600">
            Terdaftar di Badan Wakaf Indonesia (BWI).
            <br />
            SK Menteri Agama No. 00.00.0/2026.
          </p>
          <p className="mt-3 text-xs text-brand-400">
            Situs ini adalah demo. Tidak ada transaksi keuangan nyata.
          </p>
        </div>
      </div>
      <div className="border-t border-brand-100 py-5">
        <p className="container-app text-center text-xs text-brand-400">
          © {new Date().getFullYear()} Yayasan Khazanah Berkah Mulia — Demo Wakaf Digital.
        </p>
      </div>
    </footer>
  );
}
