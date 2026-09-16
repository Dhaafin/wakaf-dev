export const apiInfo = {
  title: "API Wakaf Digital Yayasan Khazanah Berkah Mulia (KBM)",
  version: "1.0.0",
  description: `Dokumentasi resmi API platform Wakaf & Donasi Digital Yayasan Khazanah Berkah Mulia (KBM).
Platform ini memfasilitasi penghimpunan dana wakaf uang, wakaf melalui uang, infaq/shadaqah, dan zakat secara transparan, akuntabel, serta terintegrasi langsung dengan payment gateway Midtrans dan penerbitan Sertifikat Wakaf Digital resmi BWI (Badan Wakaf Indonesia).`,
  contact: {
    name: "Sekretariat Nazhir Yayasan Khazanah Berkah Mulia",
    email: "kontak@khazanahberkahmulia.org",
    url: "https://khazanahberkahmulia.org",
  },
  license: {
    name: "Akreditasi Nazhir Resmi Badan Wakaf Indonesia (BWI)",
    url: "https://bwi.go.id",
  },
};

export const apiServers = [
  {
    url: "/",
    description: "Current Server (Relative Host)",
  },
];

export const apiTags = [
  {
    name: "Program",
    description: "Pengelolaan katalog dan detail program wakaf, zakat, serta infaq.",
  },
  {
    name: "Transaksi",
    description: "Pembuatan tagihan donasi, pemeriksaan status, simulasi pelunasan, dan kadaluwarsa.",
  },
  {
    name: "Midtrans Webhook & Sync",
    description: "Endpoint rekonsiliasi status real-time dan penerimaan notifikasi webhook gerbang pembayaran.",
  },
  {
    name: "Sertifikat",
    description: "Pengambilan data sertifikat wakaf digital sah berformat akta ikrar wakaf.",
  },
  {
    name: "Verifikasi",
    description: "Pengecekan keabsahan dan audit trail publik sertifikat donasi/wakaf.",
  },
  {
    name: "Penyaluran (Disbursement)",
    description: "Pencatatan dan transparansi laporan realisasi penyaluran dana ke penerima manfaat.",
  },
  {
    name: "Wakif & Donasi Publik",
    description: "Feed donatur publik dan autentikasi riwayat wakif.",
  },
  {
    name: "Pengaturan Website",
    description: "Konfigurasi umum, bar pengumuman, dan tampilan publik Yayasan KBM.",
  },
  {
    name: "Sistem & Health",
    description: "Monitoring ketersediaan layanan dan koneksi database.",
  },
];
