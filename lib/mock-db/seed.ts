import type { Program, Transaction, Certificate } from "@/types";

// ============================================================================
// DATA DUMMY AWAL
// ----------------------------------------------------------------------------
// Semua angka dibuat "masuk akal" untuk yayasan yang baru memulai program
// wakaf digital. `imageUrl` sengaja dikosongkan sehingga tiap program memakai
// ILUSTRASI DUMMY sesuai kategori (components/program-illustration.tsx) —
// TODO(compro): isi dengan URL foto dokumentasi asli begitu materi dari
// yayasan tersedia. Transaksi riwayat sudah berstatus "paid" sejak awal supaya
// halaman Riwayat & Transparansi tidak kosong saat demo pertama kali dibuka.
// ============================================================================

export const SEED_PROGRAMS: Program[] = [
  {
    id: "prg-masjid-albarokah",
    program_type: "wakaf-melalui-uang",
    kategori: "masjid",
    nama: "Pembangunan Masjid Al-Barokah",
    slug: "pembangunan-masjid-al-barokah",
    lokasi: "Bandung, Jawa Barat",
    ringkasan:
      "Renovasi & perluasan Masjid Al-Barokah agar mampu menampung 800 jamaah pada salat Jumat.",
    deskripsi:
      "Masjid Al-Barokah berdiri sejak 1998 dan kini tidak lagi mampu menampung jamaah yang terus bertambah. Dana wakaf digunakan untuk perluasan lantai dua, perbaikan atap, sistem tata suara, serta area wudu ramah difabel. Aset wakaf dikelola nazhir resmi dan bersertifikat Badan Wakaf Indonesia.",
    imageUrl: "", // ilustrasi dummy dipakai selama foto asli belum ada
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
    program_type: "wakaf-uang",
    kategori: "pendidikan",
    nama: "Wakaf Beasiswa Santri Tahfiz",
    slug: "wakaf-beasiswa-santri-tahfiz",
    lokasi: "Yogyakarta, DI Yogyakarta",
    ringkasan:
      "Dana abadi pendidikan untuk 50 santri penghafal Al-Qur'an dari keluarga prasejahtera.",
    deskripsi:
      "Wakaf uang dikelola sebagai dana abadi (endowment). Hasil pengelolaannya menutup biaya asrama, makan, dan pendidikan santri tahfiz selama satu tahun ajaran. Pokok wakaf tidak berkurang sehingga manfaat mengalir terus-menerus.",
    imageUrl: "", // ilustrasi dummy dipakai selama foto asli belum ada
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
    program_type: "wakaf-uang",
    kategori: "produktif-umkm",
    nama: "Wakaf Produktif: Warung Berdaya",
    slug: "wakaf-produktif-warung-berdaya",
    lokasi: "Surabaya, Jawa Timur",
    ringkasan:
      "Modal usaha bergulir untuk 30 ibu rumah tangga pengelola warung kelontong binaan.",
    deskripsi:
      "Dana wakaf diputar sebagai modal usaha produktif. Surplus keuntungan disalurkan kembali untuk program sosial yayasan, sementara pokok wakaf tetap terjaga. Setiap mitra mendapat pendampingan pembukuan sederhana.",
    imageUrl: "", // ilustrasi dummy dipakai selama foto asli belum ada
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
    program_type: "wakaf-melalui-uang",
    kategori: "sumur-air-bersih",
    nama: "Wakaf Sumur Bor & Air Bersih",
    slug: "wakaf-sumur-bor-air-bersih",
    lokasi: "Gunungkidul, DI Yogyakarta",
    ringkasan:
      "Pembangunan 8 titik sumur bor dalam untuk 1.200 jiwa di wilayah rawan kekeringan.",
    deskripsi:
      "Dana wakaf membiayai pengeboran sumur dalam, pompa submersible tenaga surya, tandon, dan jaringan pipa ke titik-titik komunal. Aset air diwakafkan untuk kemaslahatan warga dan dikelola kelompok pengelola air desa.",
    imageUrl: "", // ilustrasi dummy dipakai selama foto asli belum ada
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
    program_type: "wakaf-melalui-uang",
    kategori: "pendidikan",
    nama: "Rehabilitasi Ruang Kelas MI Nurul Falah",
    slug: "rehabilitasi-ruang-kelas-mi-nurul-falah",
    lokasi: "Lombok Tengah, NTB",
    ringkasan:
      "Perbaikan 4 ruang kelas rusak berat pascagempa agar 160 siswa kembali belajar dengan aman.",
    deskripsi:
      "Wakaf pembangunan untuk mengganti kuda-kuda atap, plafon, lantai, serta perabot kelas. Tanah dan bangunan berstatus wakaf atas nama yayasan dan tercatat pada Kantor Urusan Agama setempat.",
    imageUrl: "", // ilustrasi dummy dipakai selama foto asli belum ada
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
    program_type: "wakaf-melalui-uang",
    kategori: "masjid",
    nama: "Musala Nelayan Pesisir Timur",
    slug: "musala-nelayan-pesisir-timur",
    lokasi: "Makassar, Sulawesi Selatan",
    ringkasan:
      "Pembangunan musala permanen di perkampungan nelayan yang selama ini salat di saung darurat.",
    deskripsi:
      "Dana wakaf membiayai pondasi tahan abrasi, dinding, atap, tempat wudu, dan sumur air tawar untuk musala berkapasitas 120 jamaah. Lahan hibah warga telah diikrarkan sebagai tanah wakaf.",
    imageUrl: "", // ilustrasi dummy dipakai selama foto asli belum ada
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

  // ---------------------------- INFAQ & SHADAQAH ---------------------------
  {
    id: "prg-dapur-dhuafa",
    program_type: "infaq-shadaqah",
    kategori: "sosial-dhuafa",
    nama: "Infaq Dapur Umum untuk Dhuafa",
    slug: "infaq-dapur-umum-untuk-dhuafa",
    lokasi: "Jakarta Timur, DKI Jakarta",
    ringkasan:
      "Menyediakan 500 porsi makanan bergizi setiap hari untuk lansia dan keluarga prasejahtera.",
    deskripsi:
      "Berbeda dengan wakaf, dana infaq disalurkan langsung habis untuk kebutuhan penerima manfaat. Setiap Rp15.000 setara satu porsi makanan lengkap. Dapur umum beroperasi setiap hari dengan pengawasan ahli gizi dan laporan distribusi harian.",
    imageUrl: "", // ilustrasi dummy dipakai selama foto asli belum ada
    target: 90_000_000,
    terkumpul: 41_300_000,
    jumlahWakif: 268,
    nazhir: "Tim Penyalur KBM",
    createdAt: "2026-07-15T02:00:00.000Z",
    aktif: true,
    disbursements: [
      {
        id: "dsb-dapur-1",
        programId: "prg-dapur-dhuafa",
        tanggal: "2026-08-10T04:00:00.000Z",
        judul: "Distribusi Agustus",
        deskripsi:
          "12.400 porsi tersalurkan ke 6 kelurahan. Rekap penerima & foto distribusi terlampir.",
        nominal: 18_600_000,
      },
    ],
  },
  {
    id: "prg-infaq-bencana",
    program_type: "infaq-shadaqah",
    kategori: "kemanusiaan",
    nama: "Infaq Kemanusiaan Korban Bencana",
    slug: "infaq-kemanusiaan-korban-bencana",
    lokasi: "Cianjur, Jawa Barat",
    ringkasan:
      "Bantuan tanggap darurat: air bersih, selimut, tenda keluarga, dan obat-obatan.",
    deskripsi:
      "Dana disalurkan langsung dalam bentuk paket kebutuhan mendesak untuk keluarga terdampak bencana. Tim relawan berada di lokasi dan mengirim laporan penyaluran setiap pekan.",
    imageUrl: "", // ilustrasi dummy dipakai selama foto asli belum ada
    target: 150_000_000,
    terkumpul: 78_900_000,
    jumlahWakif: 412,
    nazhir: "Tim Penyalur KBM",
    createdAt: "2026-08-06T02:00:00.000Z",
    aktif: true,
    disbursements: [],
  },

  // --------------------------------- ZAKAT ---------------------------------
  {
    id: "prg-zakat-asnaf",
    program_type: "zakat",
    kategori: "sosial-dhuafa",
    nama: "Zakat Maal untuk 8 Asnaf",
    slug: "zakat-maal-untuk-8-asnaf",
    lokasi: "Nasional",
    ringkasan:
      "Penyaluran zakat harta kepada delapan golongan penerima sesuai ketentuan syariah.",
    deskripsi:
      "Zakat maal wajib ditunaikan bila harta telah mencapai nisab (setara 85 gram emas) dan dimiliki selama satu haul. Dana dihimpun amil dan disalurkan kepada 8 asnaf: fakir, miskin, amil, mualaf, riqab, gharimin, fi sabilillah, dan ibnu sabil. Gunakan kalkulator zakat untuk menghitung kewajiban Anda.",
    imageUrl: "", // ilustrasi dummy dipakai selama foto asli belum ada
    target: 400_000_000,
    terkumpul: 156_400_000,
    jumlahWakif: 523,
    nazhir: "Amil Zakat KBM",
    createdAt: "2026-07-01T02:00:00.000Z",
    aktif: true,
    disbursements: [
      {
        id: "dsb-zakat-1",
        programId: "prg-zakat-asnaf",
        tanggal: "2026-08-25T04:00:00.000Z",
        judul: "Penyaluran asnaf fakir & miskin",
        deskripsi:
          "Bantuan tunai dan sembako untuk 310 keluarga penerima. Berita acara penyaluran terlampir.",
        nominal: 62_000_000,
      },
    ],
  },
  {
    id: "prg-zakat-penghasilan",
    program_type: "zakat",
    kategori: "pendidikan",
    nama: "Zakat Penghasilan: Beasiswa Anak Yatim",
    slug: "zakat-penghasilan-beasiswa-anak-yatim",
    lokasi: "Bogor, Jawa Barat",
    ringkasan:
      "Zakat penghasilan 2,5% disalurkan sebagai beasiswa pendidikan 120 anak yatim.",
    deskripsi:
      "Zakat penghasilan (zakat profesi) ditunaikan dari pendapatan rutin yang telah melewati nisab. Penyalurannya diarahkan pada asnaf fakir-miskin melalui beasiswa: biaya sekolah, seragam, buku, dan uang saku bulanan anak yatim binaan.",
    imageUrl: "", // ilustrasi dummy dipakai selama foto asli belum ada
    target: 250_000_000,
    terkumpul: 88_150_000,
    jumlahWakif: 197,
    nazhir: "Amil Zakat KBM",
    createdAt: "2026-07-28T02:00:00.000Z",
    aktif: true,
    disbursements: [],
  },
];

// ----------------------------------------------------------------------------
// Transaksi riwayat dummy (sudah selesai). Dua di antaranya memakai email
// "wakif@contoh.id" agar mudah dipakai saat mendemokan halaman Riwayat.
// ----------------------------------------------------------------------------
export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: "WKF-20260710-7QK2ZP",
    program_type: "wakaf-melalui-uang",
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
    program_type: "wakaf-uang",
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
    program_type: "wakaf-melalui-uang",
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
    program_type: "wakaf-melalui-uang",
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
  {
    id: "WKF-20260828-R3NX7C",
    program_type: "infaq-shadaqah",
    programId: "prg-dapur-dhuafa",
    programNama: "Infaq Dapur Umum untuk Dhuafa",
    nominal: 150_000,
    biayaAdmin: 0,
    total: 150_000,
    namaWakif: "Rahmat Hidayat",
    emailWakif: "rahmat.hidayat@contoh.id",
    teleponWakif: "081234567005",
    atasNama: "sendiri",
    visibilitas: "publik",
    doa: "Semoga cukup untuk sepuluh porsi hari ini.",
    vaNumber: "DEMO 3344 5560 0510",
    bank: "BRI",
    status: "paid",
    createdAt: "2026-08-28T02:20:00.000Z",
    expiresAt: "2026-08-29T02:20:00.000Z",
    paidAt: "2026-08-28T02:35:00.000Z",
    certificateId: "SW/2026/08/000005",
  },
  {
    id: "WKF-20260901-T8VK2M",
    program_type: "zakat",
    programId: "prg-zakat-asnaf",
    programNama: "Zakat Maal untuk 8 Asnaf",
    nominal: 3_250_000,
    biayaAdmin: 0,
    total: 3_250_000,
    namaWakif: "Hendra Kurniawan",
    emailWakif: "wakif@contoh.id",
    teleponWakif: "081234567006",
    atasNama: "sendiri",
    visibilitas: "anonim",
    vaNumber: "DEMO 7788 9900 0610",
    bank: "BSI",
    status: "paid",
    createdAt: "2026-09-01T04:10:00.000Z",
    expiresAt: "2026-09-02T04:10:00.000Z",
    paidAt: "2026-09-01T04:28:00.000Z",
    certificateId: "SW/2026/09/000006",
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
