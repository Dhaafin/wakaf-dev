const MISI = [
  "Membangun sistem penghimpunan digital yang mudah diakses dari mana saja.",
  "Mengelola aset wakaf secara produktif dengan tata kelola yang terukur.",
  "Menyalurkan manfaat tepat sasaran dan melaporkannya secara terbuka.",
  "Mendampingi penerima manfaat agar naik kelas, bukan sekadar menerima bantuan.",
];

const TUJUAN = [
  "Menghimpun dan mengelola dana wakaf, infaq, shadaqah, dan zakat secara amanah dan profesional.",
  "Mengembangkan wakaf produktif agar manfaatnya berkelanjutan bagi penerima manfaat.",
  "Meningkatkan literasi wakaf dan zakat di masyarakat.",
  "Menyalurkan manfaat pada bidang ibadah, pendidikan, kesehatan, dan pemberdayaan ekonomi.",
  "Menyelenggarakan pelaporan yang terbuka dan mudah diperiksa publik.",
  "Membangun kemitraan dengan lembaga pemerintah, swasta, dan komunitas.",
];

export function ProfilVisiMisi() {
  return (
    <>
      {/* Visi */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-brand-950">Visi</h2>
        <blockquote className="card mt-3 border-l-4 border-l-brand-600 p-5">
          <p className="font-serif text-lg text-brand-900">
            &ldquo;Menjadi lembaga pengelola wakaf dan zakat yang amanah,
            profesional, dan terpercaya dalam memberdayakan umat.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* Misi */}
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

      {/* Tujuan */}
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
    </>
  );
}
