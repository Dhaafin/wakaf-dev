import type { ProgramCategory } from "@/types";

const PALET = {
  bg: "#eefaf1",
  bgAlt: "#d5f2dd",
  garis: "#79ce94",
  isi: "#44b06a",
  utama: "#1e9a4c",
  gelap: "#146333",
  aksen: "#e12e26",
};

function Bingkai({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-label="Ilustrasi program"
    >
      <defs>
        <linearGradient id="langit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PALET.bg} />
          <stop offset="100%" stopColor={PALET.bgAlt} />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#langit)" />
      <path
        d="M0 190 Q 70 158 140 182 T 280 176 T 400 190 L400 225 L0 225 Z"
        fill={PALET.garis}
        opacity="0.45"
      />
      <path
        d="M0 205 Q 100 182 200 200 T 400 198 L400 225 L0 225 Z"
        fill={PALET.isi}
        opacity="0.35"
      />
      {children}
    </svg>
  );
}

function Masjid() {
  return (
    <Bingkai>
      <rect x="86" y="96" width="14" height="94" rx="5" fill={PALET.utama} />
      <circle cx="93" cy="92" r="9" fill={PALET.gelap} />
      <rect x="300" y="96" width="14" height="94" rx="5" fill={PALET.utama} />
      <circle cx="307" cy="92" r="9" fill={PALET.gelap} />
      <rect x="118" y="118" width="164" height="72" rx="6" fill={PALET.utama} />
      <path d="M132 118 A 68 60 0 0 1 268 118 Z" fill={PALET.gelap} />
      <rect x="196" y="52" width="8" height="18" rx="4" fill={PALET.gelap} />
      <circle cx="200" cy="48" r="7" fill={PALET.aksen} />
      <path d="M186 190 v-34 a14 14 0 0 1 28 0 v34 Z" fill={PALET.bg} />
      <path d="M146 178 v-20 a10 10 0 0 1 20 0 v20 Z" fill={PALET.bg} opacity="0.85" />
      <path d="M234 178 v-20 a10 10 0 0 1 20 0 v20 Z" fill={PALET.bg} opacity="0.85" />
    </Bingkai>
  );
}

function Pendidikan() {
  return (
    <Bingkai>
      <rect x="120" y="160" width="160" height="16" rx="4" fill={PALET.gelap} />
      <rect x="132" y="142" width="136" height="16" rx="4" fill={PALET.utama} />
      <rect x="144" y="124" width="112" height="16" rx="4" fill={PALET.isi} />
      <path
        d="M200 122 L146 106 a4 4 0 0 1 0-8 L200 82 Z"
        fill={PALET.bg}
        stroke={PALET.gelap}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M200 122 L254 106 a4 4 0 0 0 0-8 L200 82 Z"
        fill={PALET.bg}
        stroke={PALET.gelap}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M200 46 L246 66 L200 86 L154 66 Z" fill={PALET.gelap} />
      <path d="M232 72 v20" stroke={PALET.aksen} strokeWidth="4" strokeLinecap="round" />
    </Bingkai>
  );
}

function Umkm() {
  return (
    <Bingkai>
      <rect x="112" y="112" width="176" height="78" rx="6" fill={PALET.utama} />
      <path d="M100 112 L300 112 L286 78 L114 78 Z" fill={PALET.bg} />
      <path d="M136 78 L124 112" stroke={PALET.isi} strokeWidth="12" />
      <path d="M182 78 L174 112" stroke={PALET.isi} strokeWidth="12" />
      <path d="M228 78 L226 112" stroke={PALET.isi} strokeWidth="12" />
      <path d="M274 78 L278 112" stroke={PALET.isi} strokeWidth="12" />
      <rect x="100" y="106" width="200" height="10" rx="5" fill={PALET.gelap} />
      <rect x="128" y="132" width="60" height="34" rx="4" fill={PALET.bg} opacity="0.9" />
      <rect x="222" y="132" width="46" height="58" rx="4" fill={PALET.bg} opacity="0.9" />
      <rect x="150" y="56" width="100" height="16" rx="8" fill={PALET.gelap} />
      <circle cx="200" cy="44" r="6" fill={PALET.aksen} />
    </Bingkai>
  );
}

function AirBersih() {
  return (
    <Bingkai>
      <rect x="96" y="96" width="72" height="70" rx="8" fill={PALET.utama} />
      <rect x="96" y="96" width="72" height="14" rx="7" fill={PALET.gelap} />
      <rect x="112" y="166" width="10" height="24" fill={PALET.gelap} />
      <rect x="142" y="166" width="10" height="24" fill={PALET.gelap} />
      <path
        d="M168 128 h44 v34"
        stroke={PALET.gelap}
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M212 176 c-9 12-13 18-13 24a13 13 0 0 0 26 0c0-6-4-12-13-24Z" fill={PALET.isi} />
      <path d="M290 78 c-18 26-27 38-27 51a27 27 0 0 0 54 0c0-13-9-25-27-51Z" fill={PALET.gelap} />
      <path d="M290 112 c-7 10-10 14-10 19a10 10 0 0 0 20 0c0-5-3-9-10-19Z" fill={PALET.bg} opacity="0.7" />
    </Bingkai>
  );
}

function Kemanusiaan() {
  return (
    <Bingkai>
      <path d="M92 190 L156 92 L220 190 Z" fill={PALET.utama} />
      <path d="M156 92 L156 190" stroke={PALET.gelap} strokeWidth="6" />
      <path d="M140 190 v-40 a16 16 0 0 1 32 0 v40 Z" fill={PALET.bg} opacity="0.9" />
      <rect x="236" y="140" width="76" height="50" rx="6" fill={PALET.gelap} />
      <path d="M274 140 v50" stroke={PALET.bg} strokeWidth="5" opacity="0.6" />
      <path d="M236 158 h76" stroke={PALET.bg} strokeWidth="5" opacity="0.6" />
      <path
        d="M274 118 c-10-14-30-12-30 4 0 13 16 22 30 32 14-10 30-19 30-32 0-16-20-18-30-4Z"
        fill={PALET.aksen}
        opacity="0.9"
      />
    </Bingkai>
  );
}

function SosialDhuafa() {
  return (
    <Bingkai>
      <path
        d="M118 186 c-14-12-22-30-22-46 0-8 10-10 13-3l8 17 2-44c0-9 13-9 13 0l2 40 4-30c1-9 14-8 13 1l-3 32 7-22c3-8 15-5 13 4l-9 40c-4 16-16 22-25 22Z"
        fill={PALET.utama}
      />
      <path
        d="M282 186 c14-12 22-30 22-46 0-8-10-10-13-3l-8 17-2-44c0-9-13-9-13 0l-2 40-4-30c-1-9-14-8-13 1l3 32-7-22c-3-8-15-5-13 4l9 40c4 16 16 22 25 22Z"
        fill={PALET.utama}
      />
      <path d="M156 156 h88 a44 30 0 0 1-88 0Z" fill={PALET.gelap} />
      <ellipse cx="200" cy="156" rx="44" ry="9" fill={PALET.isi} />
      <path d="M186 132 q8-10 0-20" stroke={PALET.garis} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M200 126 q8-10 0-20" stroke={PALET.garis} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M214 132 q8-10 0-20" stroke={PALET.garis} strokeWidth="5" fill="none" strokeLinecap="round" />
    </Bingkai>
  );
}

const PETA: Record<ProgramCategory, () => JSX.Element> = {
  masjid: Masjid,
  pendidikan: Pendidikan,
  "produktif-umkm": Umkm,
  "sumur-air-bersih": AirBersih,
  kemanusiaan: Kemanusiaan,
  "sosial-dhuafa": SosialDhuafa,
};

export function ProgramIllustration({
  kategori,
}: {
  kategori: ProgramCategory;
}) {
  const Gambar = PETA[kategori] ?? Masjid;
  return <Gambar />;
}
