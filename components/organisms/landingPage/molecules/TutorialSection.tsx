export function TutorialSection() {
  return (
    <div className="container-app">
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
          Empat langkah, selesai
        </h2>
        <p className="mt-2 text-sm text-brand-600 max-w-2xl mx-auto">
          Berwakaf dan berdonasi kini lebih mudah, cepat, dan transparan.
        </p>
      </div>
      
      {/* Expanding Flex Accordion */}
      <div className="flex flex-col md:flex-row w-full h-[600px] md:h-[450px] gap-4">
        {[
          {
            n: "01",
            t: "Pilih jenis & program",
            d: "Wakaf uang, wakaf melalui uang, infaq & shadaqah, atau zakat.",
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )
          },
          {
            n: "02",
            t: "Isi & konfirmasi",
            d: "Nominal, atas nama sendiri/orang lain, publik atau anonim.",
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )
          },
          {
            n: "03",
            t: "Bayar via Virtual Account",
            d: "Nomor VA terbit otomatis. Bayar sebelum waktu habis.",
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            )
          },
          {
            n: "04",
            t: "Terima bukti resmi",
            d: "Sertifikat wakaf / bukti donasi / bukti setor zakat, bernomor unik & bisa diverifikasi.",
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            )
          },
        ].map((s) => (
          <div
            key={s.n}
            className="group relative flex-1 flex flex-col justify-end overflow-hidden rounded-[2rem] bg-brand-50 border border-brand-100 transition-all duration-500 ease-out hover:flex-[2.5] hover:bg-emerald-800 hover:border-emerald-700 cursor-pointer hover:shadow-2xl"
          >
            {/* Background Number Watermark */}
            <div className="absolute top-6 left-6 text-7xl font-black text-brand-200/40 group-hover:text-emerald-700/50 transition-colors duration-500">
              {s.n}
            </div>

            {/* Floating Icon Top Right */}
            <div className="absolute top-6 right-6 h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-brand-600 group-hover:text-emerald-600 group-hover:bg-emerald-100 group-hover:scale-110 shadow-sm transition-all duration-500">
              {s.icon}
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 mt-auto z-10 w-full md:min-w-[280px]">
              <h3 className="font-serif text-xl font-bold text-brand-950 group-hover:text-white transition-colors duration-500 truncate md:whitespace-nowrap">
                {s.t}
              </h3>
              
              {/* Expandable Description */}
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                <p className="overflow-hidden mt-3 text-sm text-brand-600 group-hover:text-emerald-100 leading-relaxed max-w-sm whitespace-normal">
                  {s.d}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
