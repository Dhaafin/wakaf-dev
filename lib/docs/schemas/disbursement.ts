export const disbursementSchemas = {
  DisbursementReport: {
    type: "object",
    description: "Laporan penyaluran dana wakaf/donasi kepada penerima manfaat.",
    properties: {
      id: { type: "string", example: "dsb_cd593f0347b6" },
      programId: { type: "string", example: "prg_f9a75a05f82e" },
      tanggal: { type: "string", format: "date-time" },
      judul: { type: "string", example: "Pengadaan Semen & Material Fondasi" },
      deskripsi: { type: "string", example: "Pembelian 100 sak semen tahap konstruksi awal." },
      nominal: { type: "number", example: 6500000 },
      buktiImageUrl: { type: "string", example: "https://blob.../kuitansi.jpg" },
      buktiFileName: { type: "string", example: "kuitansi-semen.jpg" },
    },
    required: ["id", "programId", "tanggal", "judul", "deskripsi", "nominal"],
  },
  CreateDisbursementInput: {
    type: "object",
    description: "Payload pencatatan penyaluran dana baru.",
    properties: {
      programId: { type: "string", example: "prg_f9a75a05f82e" },
      judul: { type: "string", example: "Bantuan Pangan Santri Yatim" },
      deskripsi: { type: "string", example: "Penyaluran sembako bulanan untuk 40 santri." },
      nominal: { type: "number", minimum: 1000, example: 5000000 },
      tanggal: { type: "string", format: "date-time" },
      buktiImageUrl: { type: "string" },
      buktiFileName: { type: "string" },
    },
    required: ["programId", "judul", "deskripsi", "nominal"],
  },
};
