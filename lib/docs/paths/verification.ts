export const verificationPaths = {
  "/api/verification": {
    get: {
      tags: ["Verifikasi"],
      summary: "Cek Keabsahan Sertifikat Publik BWI",
      description: "Memverifikasi apakah nomor sertifikat atau kode transaksi terdaftar sah dalam pembukuan Nazhir Yayasan Khazanah Berkah Mulia.",
      parameters: [
        {
          name: "id",
          in: "query",
          required: true,
          description: "Nomor sertifikat (SW/2026/...) atau nomor invoice transaksi (WKF-...)",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Hasil verifikasi keabsahan berhasil diperoleh.",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiSuccessResponse" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/VerificationResult" },
                    },
                  },
                ],
              },
            },
          },
        },
        400: {
          description: "Parameter pencarian id tidak disediakan.",
        },
        404: {
          description: "Sertifikat atau transaksi tidak ditemukan dalam catatan resmi.",
        },
      },
    },
  },
};
