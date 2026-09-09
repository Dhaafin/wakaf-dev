import Link from "next/link";

export function CtaTrustBanner({
  title = "Amanah yang bisa Anda periksa",
  description = "Setiap penyaluran dana dilaporkan lengkap dengan bukti pada halaman transparansi. Data laporan terhubung langsung dengan pencatatan internal — bukan sekadar gambar.",
  buttonText = "Buka Laporan",
  buttonHref = "/transparansi",
}: {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}) {
  return (
    <div className="rounded-2xl bg-brand-900 p-8 text-white sm:p-12">
      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <h2 className="font-serif text-2xl font-bold">{title}</h2>
          <p className="mt-2 max-w-xl text-sm text-brand-100/90">
            {description}
          </p>
        </div>
        <Link
          href={buttonHref}
          className="btn bg-white text-brand-900 hover:bg-brand-50"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
