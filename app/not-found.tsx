import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-serif text-6xl font-bold text-brand-200">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-brand-950">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 max-w-sm text-sm text-brand-600">
        Tautan mungkin salah atau halaman sudah dipindahkan.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Kembali ke beranda
      </Link>
    </div>
  );
}
