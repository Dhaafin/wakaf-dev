const LEGALITAS: [string, string][] = [
  ["Akta Pendirian", "No. 42 / 18 Februari 2021"],
  ["SK Kemenkumham RI", "AHU-0002841.AH.01.04 Tahun 2021"],
  ["Nomor Induk Berusaha (NIB)", "1274000512983"],
  ["Registrasi Nazhir Wakaf Uang (BWI)", "3.3.00417"],
  ["NPWP Yayasan", "91.234.567.8-045.000"],
];

export function ProfilLegalitas() {
  return (
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
  );
}
