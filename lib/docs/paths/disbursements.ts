export const disbursementsPaths = {
  "/api/disbursements": {
    get: {
      tags: ["Penyaluran (Disbursement)"],
      summary: "Daftar Laporan Penyaluran",
      description: "Mengambil daftar seluruh laporan realisasi penyaluran dana wakaf kepada penerima manfaat.",
      parameters: [
        {
          name: "programId",
          in: "query",
          description: "Filter laporan penyaluran untuk program spesifik",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Daftar penyaluran dana berhasil diambil.",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiSuccessResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/DisbursementReport" },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Penyaluran (Disbursement)"],
      summary: "Catat Realisasi Penyaluran Baru",
      description: "Menambahkan laporan bukti penggunaan dana yang disalurkan beserta berkas kuitansi.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateDisbursementInput" },
          },
        },
      },
      responses: {
        201: {
          description: "Laporan penyaluran berhasil dicatat.",
        },
        400: {
          description: "Validasi data gagal.",
        },
      },
    },
  },
  "/api/disbursements/{id}": {
    delete: {
      tags: ["Penyaluran (Disbursement)"],
      summary: "Hapus Laporan Penyaluran",
      description: "Menghapus catatan penyaluran dana berdasarkan ID.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Laporan penyaluran berhasil dihapus.",
        },
      },
    },
  },
};
