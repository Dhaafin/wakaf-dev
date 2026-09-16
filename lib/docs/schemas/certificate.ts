export const certificateSchemas = {
  Certificate: {
    type: "object",
    description: "Sertifikat Wakaf Digital resmi dari Nazhir Yayasan KBM.",
    properties: {
      id: { type: "string", example: "SW/2026/09/FEFF7D" },
      transactionId: { type: "string", example: "WKF-20260914-321916" },
      programId: { type: "string", example: "prg_f9a75a05f82e" },
      programNama: { type: "string", example: "Pembangunan Masjid Al-Barkah" },
      program_type: { $ref: "#/components/schemas/ProgramType" },
      namaPihak: { type: "string", example: "Ahmad Fauzi" },
      nominal: { type: "number", example: 1000000 },
      tanggal: { type: "string", format: "date-time" },
      nazhir: { type: "string", example: "Nazhir Yayasan Khazanah Berkah Mulia" },
    },
    required: [
      "id",
      "transactionId",
      "programId",
      "programNama",
      "program_type",
      "namaPihak",
      "nominal",
      "tanggal",
      "nazhir",
    ],
  },
  VerificationResult: {
    type: "object",
    description: "Hasil verifikasi keabsahan sertifikat wakaf/donasi.",
    properties: {
      valid: { type: "boolean", example: true },
      sertifikat: { $ref: "#/components/schemas/Certificate" },
      transaksi: {
        type: "object",
        properties: {
          id: { type: "string" },
          status: { type: "string", example: "paid" },
          paidAt: { type: "string", format: "date-time" },
          bank: { type: "string" },
          visibilitas: { type: "string" },
        },
      },
      program: {
        type: "object",
        properties: {
          id: { type: "string" },
          nama: { type: "string" },
          kategori: { type: "string" },
          lokasi: { type: "string" },
        },
      },
      audit: {
        type: "object",
        properties: {
          waktuPemeriksaan: { type: "string", format: "date-time" },
          legalitasNazhir: { type: "string", example: "Terdaftar Resmi BWI" },
        },
      },
    },
    required: ["valid", "sertifikat"],
  },
};
