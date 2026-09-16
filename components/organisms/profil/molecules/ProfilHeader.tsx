import { YAYASAN } from "@/lib/config";

export function ProfilHeader() {
  return (
    <>
      <header className="max-w-2xl">
        <span className="badge bg-brand-100 text-brand-800">Profil Lembaga</span>
        <h1 className="mt-3 font-serif text-3xl font-bold text-brand-950 sm:text-4xl">
          {YAYASAN.nama}
        </h1>
        <p className="mt-3 text-brand-600">
          Lembaga penghimpun dan pengelola wakaf, infaq, shadaqah, serta zakat
          yang berkomitmen pada tata kelola amanah, produktif, dan terbuka untuk
          diperiksa publik.
        </p>
      </header>

      <p className="mt-4 text-xs text-brand-400">
        Data pada halaman ini masih contoh untuk keperluan demo.
      </p>

      {/* Latar belakang */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-brand-950">
          Latar Belakang
        </h2>
        <div className="mt-3 space-y-3 text-brand-700">
          <p>
            {YAYASAN.nama} ({YAYASAN.singkatan}) didirikan sebagai wujud nyata
            kontribusi dalam membumikan wakaf di Indonesia. Berangkat dari
            keyakinan bahwa harta yang diwakafkan akan terus mengalirkan manfaat,
            yayasan menghimpun dana umat dan mengelolanya agar berdampak jangka
            panjang.
          </p>
          <p>
            Selain wakaf, KBM juga menerima infaq, shadaqah, dan zakat sehingga
            masyarakat dapat menunaikan berbagai bentuk kebaikan melalui satu
            kanal yang tercatat rapi dan dapat ditelusuri.
          </p>
        </div>
      </section>
    </>
  );
}
