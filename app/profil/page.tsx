import Link from "next/link";
import { YAYASAN } from "@/lib/config";

// ============================================================================
// PROFIL YAYASAN
// ----------------------------------------------------------------------------
// !!! SELURUH ISI HALAMAN INI MASIH DATA DUMMY !!!
// Struktur mengikuti pola profil lembaga wakaf (rujukan wakafmulia.org):
//   latar belakang -> visi -> misi/tujuan -> legalitas -> pengurus -> kontak.
//
// Nama pengurus, nomor akta/SK/NIB/NPWP/registrasi nazhir, alamat, telepon, dan
// email di bawah SEMUANYA KARANGAN — dibuat berformat wajar supaya tampilan
// demo tidak terlihat kosong. JANGAN dipakai sebagai data resmi. Ganti seluruh
// konstanta bertanda TODO(compro) begitu company profile resmi KBM tersedia.
// ============================================================================

export const metadata = { title: "Profil Yayasan — KBM" };

// TODO(compro): ganti seluruh isi konstanta di bawah dengan data resmi KBM.
// Semua nilai saat ini adalah dummy.
const TUJUAN = [
  "Menghimpun dan mengelola dana wakaf, infaq, shadaqah, dan zakat secara amanah dan profesional.",
  "Mengembangkan wakaf produktif agar manfaatnya berkelanjutan bagi penerima manfaat.",
  "Meningkatkan literasi wakaf dan zakat di masyarakat.",
  "Menyalurkan manfaat pada bidang ibadah, pendidikan, kesehatan, dan pemberdayaan ekonomi.",
  "Menyelenggarakan pelaporan yang terbuka dan mudah diperiksa publik.",
  "Membangun kemitraan dengan lembaga pemerintah, swasta, dan komunitas.",
];

const MISI = [
  "Membangun sistem penghimpunan digital yang mudah diakses dari mana saja.",
  "Mengelola aset wakaf secara produktif dengan tata kelola yang terukur.",
  "Menyalurkan manfaat tepat sasaran dan melaporkannya secara terbuka.",
  "Mendampingi penerima manfaat agar naik kelas, bukan sekadar menerima bantuan.",
];

const LEGALITAS: [string, string][] = [
  ["Akta Pendirian", "No. 42 / 18 Februari 2021"],
  ["SK Kemenkumham RI", "AHU-0002841.AH.01.04 Tahun 2021"],
  ["Nomor Induk Berusaha (NIB)", "1274000512983"],
  ["Registrasi Nazhir Wakaf Uang (BWI)", "3.3.00417"],
  ["NPWP Yayasan", "91.234.567.8-045.000"],
];

const PENGURUS: [string, string][] = [
  ["Pembina", "H. Abdul Rahman Hakim, S.E."],
  ["Ketua Pengurus", "Muhammad Fadhil Ramadhan, S.H."],
  ["Sekretaris", "Nurul Aisyah Rahmawati, S.Pd."],
  ["Bendahara", "Siti Khadijah Amelia, S.E., Ak."],
  ["Pengawas", "Drs. H. Bambang Wijayanto, M.M."],
  ["Nazhir Wakaf Uang", "Ahmad Zulfikar Nugroho, S.H.I."],
];

export default function ProfilPage() {
  return (
    <div className="container-app max-w-4xl py-10">
      {/* ------------------------- Header ------------------------- */}
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

      {/* Catatan kecil — jujur bahwa isinya dummy, tanpa mengganggu tampilan.
          Hapus setelah company profile resmi masuk. */}
      <p className="mt-4 text-xs text-brand-400">
        Data pada halaman ini masih contoh untuk keperluan demo.
      </p>

      {/* --------------------- Latar belakang --------------------- */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-brand-950">
          Latar Belakang
        </h2>
        <div className="mt-3 space-y-3 text-brand-700">
          <p>
            {/* TODO(compro): ganti dengan sejarah & latar belakang pendirian KBM */}
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

      {/* ---------------------------- Visi ------------------------ */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-brand-950">Visi</h2>
        <blockquote className="card mt-3 border-l-4 border-l-brand-600 p-5">
          <p className="font-serif text-lg text-brand-900">
            {/* TODO(compro): ganti dengan visi resmi KBM */}
            &ldquo;Menjadi lembaga pengelola wakaf dan zakat yang amanah,
            profesional, dan terpercaya dalam memberdayakan umat.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* ---------------------------- Misi ------------------------ */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-brand-950">Misi</h2>
        <ol className="mt-3 space-y-2">
          {MISI.map((m, i) => (
            <li key={i} className="card flex gap-3 p-4">
              <span className="font-serif text-lg font-bold text-brand-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm text-brand-700">{m}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* --------------------------- Tujuan ----------------------- */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-brand-950">
          Tujuan Lembaga
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {TUJUAN.map((t, i) => (
            <li key={i} className="card p-4 text-sm text-brand-700">
              <span className="mr-1.5 text-brand-500">✓</span>
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------- Legalitas --------------------- */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-brand-950">
          Legalitas Lembaga
        </h2>
        <p className="mt-2 text-sm text-brand-600">
          KBM beroperasi di bawah pengawasan Badan Wakaf Indonesia (BWI) dan
          instansi terkait. Dana yang dihimpun tidak berkaitan dengan pencucian
          uang maupun aktivitas terlarang.
        </p>
        <dl className="mt-4 divide-y divide-brand-100 overflow-hidden rounded-2xl border border-brand-100 bg-white">
          {LEGALITAS.map(([k, v]) => (
            <div
              key={k}
              className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <dt className="text-sm text-brand-500">{k}</dt>
              <dd className="font-mono text-sm font-semibold text-brand-900">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------------- Dewan pengurus -------------------- */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-brand-950">
          Dewan Pengurus &amp; Nazhir
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {PENGURUS.map(([jabatan, nama]) => (
            <div key={jabatan} className="card p-4">
              <dt className="text-xs uppercase tracking-wide text-brand-400">
                {jabatan}
              </dt>
              <dd className="mt-1 font-semibold text-brand-900">{nama}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------------------- Kontak ---------------------- */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-brand-950">
          Hubungi Kami
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="card p-4">
            <p className="text-xs uppercase tracking-wide text-brand-400">
              Kantor
            </p>
            {/* TODO(compro): alamat kantor resmi — saat ini dummy */}
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
            {/* TODO(compro): kontak resmi — saat ini dummy */}
            <p className="mt-1 text-sm text-brand-700">
              (021) 1234-5678 · WA 0812-3456-7890
              <br />
              info@kbm.or.id
            </p>
          </div>
        </div>
      </section>

      {/* ----------------------------- CTA ------------------------ */}
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
    </div>
  );
}
