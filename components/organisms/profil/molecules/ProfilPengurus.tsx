const PENGURUS: [string, string][] = [
  ["Pembina", "H. Abdul Rahman Hakim, S.E."],
  ["Ketua Pengurus", "Muhammad Fadhil Ramadhan, S.H."],
  ["Sekretaris", "Nurul Aisyah Rahmawati, S.Pd."],
  ["Bendahara", "Siti Khadijah Amelia, S.E., Ak."],
  ["Pengawas", "Drs. H. Bambang Wijayanto, M.M."],
  ["Nazhir Wakaf Uang", "Ahmad Zulfikar Nugroho, S.H.I."],
];

export function ProfilPengurus() {
  return (
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
  );
}
