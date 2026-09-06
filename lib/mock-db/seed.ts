import type { Program, Transaction, Certificate } from "@/types";

// ============================================================================
// DATA DUMMY AWAL
// ----------------------------------------------------------------------------
// Semua angka dibuat "masuk akal" untuk yayasan yang baru memulai program
// wakaf digital. Gambar memakai Unsplash (placeholder sesuai konteks program).
// 4 transaksi riwayat sudah berstatus "paid" sejak awal supaya halaman
// Riwayat & Transparansi tidak kosong saat demo pertama kali dibuka.
// ============================================================================

export const SEED_PROGRAMS: Program[] = [
  {
    id: "prg-masjid-albarokah",
    program_type: "wakaf",
    kategori: "masjid",
    nama: "Pembangunan Masjid Al-Barokah",
    slug: "pembangunan-masjid-al-barokah",
    lokasi: "Bandung, Jawa Barat",
    ringkasan:
      "Renovasi & perluasan Masjid Al-Barokah agar mampu menampung 800 jamaah pada salat Jumat.",
    deskripsi:
      "Masjid Al-Barokah berdiri sejak 1998 dan kini tidak lagi mampu menampung jamaah yang terus bertambah. Dana wakaf digunakan untuk perluasan lantai dua, perbaikan atap, sistem tata suara, serta area wudu ramah difabel. Aset wakaf dikelola nazhir resmi dan bersertifikat Badan Wakaf Indonesia.",
    imageUrl:
      "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=1200&q=80",
    target: 750_000_000,
    terkumpul: 313_500_000,
    jumlahWakif: 214,
    nazhir: "Nazhir Yayasan Khazanah Berkah Mulia",
    createdAt: "2026-06-12T02:00:00.000Z",
    aktif: true,
    disbursements: [
      {
        id: "dsb-albarokah-1",
        programId: "prg-masjid-albarokah",
        tanggal: "2026-07-20T04:00:00.000Z",
        judul: "Pembelian material tahap 1",
        deskripsi:
          "Pembelian besi, semen, dan bata ringan untuk struktur lantai dua. Bukti kuitansi & foto material terlampir.",
        nominal: 120_000_000,
      },
    ],
  },
  {
    id: "prg-beasiswa-tahfiz",
    program_type: "wakaf",
    kategori: "pendidikan",
    nama: "Wakaf Beasiswa Santri Tahfiz",
    slug: "wakaf-beasiswa-santri-tahfiz",
    lokasi: "Yogyakarta, DI Yogyakarta",
    ringkasan:
      "Dana abadi pendidikan untuk 50 santri penghafal Al-Qur'an dari keluarga prasejahtera.",
    deskripsi:
      "Wakaf uang dikelola sebagai dana abadi (endowment). Hasil pengelolaannya menutup biaya asrama, makan, dan pendidikan santri tahfiz selama satu tahun ajaran. Pokok wakaf tidak berkurang sehingga manfaat mengalir terus-menerus.",
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
    target: 500_000_000,
    terkumpul: 187_250_000,
    jumlahWakif: 132,
    nazhir: "Nazhir Yayasan Khazanah Berkah Mulia",
    createdAt: "2026-06-25T02:00:00.000Z",
    aktif: true,
    disbursements: [],
  },
  {
    id: "prg-warung-berdaya",
    program_type: "wakaf",
    kategori: "produktif-umkm",
    nama: "Wakaf Produktif: Warung Berdaya",
    slug: "wakaf-produktif-warung-berdaya",
    lokasi: "Surabaya, Jawa Timur",
    ringkasan:
      "Modal usaha bergulir untuk 30 ibu rumah tangga pengelola warung kelontong binaan.",
    deskripsi:
      "Dana wakaf diputar sebagai modal usaha produktif. Surplus keuntungan disalurkan kembali untuk program sosial yayasan, sementara pokok wakaf tetap terjaga. Setiap mitra mendapat pendampingan pembukuan sederhana.",
    imageUrl:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80",
    target: 300_000_000,
    terkumpul: 268_900_000,
    jumlahWakif: 305,
    nazhir: "Nazhir Koperasi Wakaf Nusantara",
    createdAt: "2026-05-30T02:00:00.000Z",
    aktif: true,
    disbursements: [
      {
        id: "dsb-warung-1",
        programId: "prg-warung-berdaya",
        tanggal: "2026-07-05T04:00:00.000Z",
        judul: "Penyaluran modal gelombang 1",
        deskripsi:
          "Modal usaha Rp5.000.000 disalurkan kepada 20 mitra pertama beserta paket sembako awal.",
        nominal: 100_000_000,
      },
      {
        id: "dsb-warung-2",
        programId: "prg-warung-berdaya",
        tanggal: "2026-08-18T04:00:00.000Z",
        judul: "Pendampingan & restock",
        deskripsi:
          "Pelatihan pencatatan keuangan dan bantuan restok barang dagangan untuk mitra gelombang 1.",
        nominal: 45_000_000,
      },
    ],
  },
  {
    id: "prg-sumur-nkri",
    program_type: "wakaf",
    kategori: "sumur-air-bersih",
    nama: "Wakaf Sumur Bor & Air Bersih",
    slug: "wakaf-sumur-bor-air-bersih",
    lokasi: "Gunungkidul, DI Yogyakarta",
    ringkasan:
      "Pembangunan 8 titik sumur bor dalam untuk 1.200 jiwa di wilayah rawan kekeringan.",
    deskripsi:
      "Dana wakaf membiayai pengeboran sumur dalam, pompa submersible tenaga surya, tandon, dan jaringan pipa ke titik-titik komunal. Aset air diwakafkan untuk kemaslahatan warga dan dikelola kelompok pengelola air desa.",
    imageUrl:
      "https://picsum.photos/seed/kbm-air-bersih/1200/675",
    target: 240_000_000,
    terkumpul: 96_400_000,
    jumlahWakif: 178,
    nazhir: "Nazhir Yayasan Khazanah Berkah Mulia",
    createdAt: "2026-07-02T02:00:00.000Z",
    aktif: true,
    disbursements: [],
  },
  {
    id: "prg-rehab-sekolah",
    program_type: "wakaf",
    kategori: "pendidikan",
    nama: "Rehabilitasi Ruang Kelas MI Nurul Falah",
    slug: "rehabilitasi-ruang-kelas-mi-nurul-falah",
    lokasi: "Lombok Tengah, NTB",
    ringkasan:
      "Perbaikan 4 ruang kelas rusak berat pascagempa agar 160 siswa kembali belajar dengan aman.",
    deskripsi:
      "Wakaf pembangunan untuk mengganti kuda-kuda atap, plafon, lantai, serta perabot kelas. Tanah dan bangunan berstatus wakaf atas nama yayasan dan tercatat pada Kantor Urusan Agama setempat.",
    imageUrl:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    target: 180_000_000,
    terkumpul: 45_800_000,
    jumlahWakif: 61,
    nazhir: "Nazhir Yayasan Khazanah Berkah Mulia",
    createdAt: "2026-08-01T02:00:00.000Z",
    aktif: true,
    disbursements: [],
  },
  {
    id: "prg-masjid-pesisir",
    program_type: "wakaf",
    kategori: "masjid",
    nama: "Musala Nelayan Pesisir Timur",
    slug: "musala-nelayan-pesisir-timur",
    lokasi: "Makassar, Sulawesi Selatan",
    ringkasan:
      "Pembangunan musala permanen di perkampungan nelayan yang selama ini salat di saung darurat.",
    deskripsi:
      "Dana wakaf membiayai pondasi tahan abrasi, dinding, atap, tempat wudu, dan sumur air tawar untuk musala berkapasitas 120 jamaah. Lahan hibah warga telah diikrarkan sebagai tanah wakaf.",
    imageUrl:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80",
    target: 220_000_000,
    terkumpul: 132_750_000,
    jumlahWakif: 149,
    nazhir: "Nazhir Koperasi Wakaf Nusantara",
    createdAt: "2026-06-18T02:00:00.000Z",
    aktif: true,
    disbursements: [
      {
        id: "dsb-pesisir-1",
        programId: "prg-masjid-pesisir",
        tanggal: "2026-08-02T04:00:00.000Z",
        judul: "Pengerjaan pondasi",
        deskripsi:
          "Pembuatan pondasi cakar ayam dan sloof. Dokumentasi progres 20% terlampir.",
        nominal: 60_000_000,
      },
    ],
  },
];

// ----------------------------------------------------------------------------
// Transaksi riwayat dummy (sudah selesai). Dua di antaranya memakai email
// "wakif@contoh.id" agar mudah dipakai saat mendemokan halaman Riwayat.
// ----------------------------------------------------------------------------
export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: "WKF-20260710-7QK2ZP",
    program_type: "wakaf",
    programId: "prg-masjid-albarokah",
    programNama: "Pembangunan Masjid Al-Barokah",
    nominal: 1_000_000,
    biayaAdmin: 0,
    total: 1_000_000,
    namaWakif: "Ahmad Fauzi",
    emailWakif: "wakif@contoh.id",
    teleponWakif: "081234567001",
    atasNama: "sendiri",
    visibilitas: "publik",
    doa: "Semoga menjadi amal jariyah yang tak terputus.",
    vaNumber: "DEMO 1234 5670 0120",
    bank: "BSI",
    status: "paid",
    createdAt: "2026-07-10T03:10:00.000Z",
    expiresAt: "2026-07-11T03:10:00.000Z",
    paidAt: "2026-07-10T03:24:00.000Z",
    certificateId: "SW/2026/07/000001",
  },
  {
    id: "WKF-20260722-M4TR8A",
    program_type: "wakaf",
    programId: "prg-warung-berdaya",
    programNama: "Wakaf Produktif: Warung Berdaya",
    nominal: 500_000,
    biayaAdmin: 0,
    total: 500_000,
    namaWakif: "Siti Nurhaliza",
    emailWakif: "wakif@contoh.id",
    teleponWakif: "081234567002",
    atasNama: "orang-lain",
    namaAtasNama: "Almh. Hj. Rukmini",
    visibilitas: "anonim",
    doa: "Untuk almarhumah ibunda tercinta.",
    vaNumber: "DEMO 9876 5430 0210",
    bank: "Mandiri",
    status: "paid",
    createdAt: "2026-07-22T06:40:00.000Z",
    expiresAt: "2026-07-23T06:40:00.000Z",
    paidAt: "2026-07-22T07:02:00.000Z",
    certificateId: "SW/2026/07/000002",
  },
  {
    id: "WKF-20260805-JD91KE",
    program_type: "wakaf",
    programId: "prg-sumur-nkri",
    programNama: "Wakaf Sumur Bor & Air Bersih",
    nominal: 2_500_000,
    biayaAdmin: 0,
    total: 2_500_000,
    namaWakif: "Budi Santoso",
    emailWakif: "budi.santoso@contoh.id",
    teleponWakif: "081234567003",
    atasNama: "sendiri",
    visibilitas: "publik",
    vaNumber: "DEMO 1122 3340 0310",
    bank: "BCA",
    status: "paid",
    createdAt: "2026-08-05T01:15:00.000Z",
    expiresAt: "2026-08-06T01:15:00.000Z",
    paidAt: "2026-08-05T01:40:00.000Z",
    certificateId: "SW/2026/08/000003",
  },
  {
    id: "WKF-20260819-P05WQN",
    program_type: "wakaf",
    programId: "prg-masjid-pesisir",
    programNama: "Musala Nelayan Pesisir Timur",
    nominal: 750_000,
    biayaAdmin: 0,
    total: 750_000,
    namaWakif: "Dewi Lestari",
    emailWakif: "dewi.lestari@contoh.id",
    teleponWakif: "081234567004",
    atasNama: "sendiri",
    visibilitas: "publik",
    doa: "Semoga jamaah selalu diberi keberkahan rezeki.",
    vaNumber: "DEMO 5566 7780 0410",
    bank: "BNI",
    status: "paid",
    createdAt: "2026-08-19T08:05:00.000Z",
    expiresAt: "2026-08-20T08:05:00.000Z",
    paidAt: "2026-08-19T08:30:00.000Z",
    certificateId: "SW/2026/08/000004",
  },
];

export const SEED_CERTIFICATES: Certificate[] = SEED_TRANSACTIONS.map((t) => ({
  id: t.certificateId!,
  transactionId: t.id,
  programId: t.programId,
  programNama: t.programNama,
  program_type: t.program_type,
  namaPihak: t.atasNama === "orang-lain" && t.namaAtasNama ? t.namaAtasNama : t.namaWakif,
  nominal: t.nominal,
  tanggal: t.paidAt!,
  nazhir:
    SEED_PROGRAMS.find((p) => p.id === t.programId)?.nazhir ??
    "Nazhir Yayasan Khazanah Berkah Mulia",
}));

// Nomor urut sertifikat berikutnya (lanjut dari seed).
export const SEED_CERT_SEQ = SEED_CERTIFICATES.length; // -> 4
