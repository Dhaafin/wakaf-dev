"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/atoms/BrandLogo";

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
              <Link href="/program#wakaf-uang" className="hover:text-brand-800">
                Wakaf Uang
              </Link>
            </li>
            <li>
              <Link
                href="/program#wakaf-melalui-uang"
                className="hover:text-brand-800"
              >
                Wakaf Melalui Uang
              </Link>
            </li>
            <li>
              <Link
                href="/program#infaq-shadaqah"
                className="hover:text-brand-800"
              >
                Infaq &amp; Shadaqah
              </Link>
            </li>
            <li>
              <Link href="/program#zakat" className="hover:text-brand-800">
                Zakat
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-900">Tautan</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-600">
            <li>
              <Link href="/profil" className="hover:text-brand-800">
                Profil Yayasan
              </Link>
            </li>
            <li>
              <Link href="/zakat" className="hover:text-brand-800">
                Kalkulator Zakat
              </Link>
            </li>
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
            Terdaftar &amp; diawasi Badan Wakaf Indonesia (BWI).
            <br />
            Reg. Nazhir Wakaf Uang: 3.3.00417
            <br />
            SK Kemenkumham AHU-0002841.AH.01.04/2021
          </p>
        </div>
      </div>
      <div className="border-t border-brand-100 py-5">
        <p className="container-app text-center text-xs text-brand-500">
          © {new Date().getFullYear()} Yayasan Khazanah Berkah Mulia. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
