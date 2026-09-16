export const transactionsPaths = {
  "/api/transactions": {
    get: {
      tags: ["Transaksi"],
      summary: "Daftar Riwayat Transaksi",
      description: "Mengambil daftar seluruh transaksi donasi/wakaf dengan filter status dan email wakif.",
      parameters: [
        {
          name: "status",
          in: "query",
          description: "Filter status pembayaran (pending, paid, expired)",
          schema: { type: "string" },
        },
        {
          name: "programId",
          in: "query",
          description: "Filter ID program tujuan",
          schema: { type: "string" },
        },
        {
          name: "email",
          in: "query",
          description: "Filter riwayat berdasarkan email wakif",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Daftar transaksi berhasil diambil.",
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
                        items: { $ref: "#/components/schemas/Transaction" },
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
      tags: ["Transaksi"],
      summary: "Inisiasi Transaksi & Token Snap",
      description: "Membuat invoice transaksi wakaf dan menghasilkan Snap token Midtrans untuk pembayaran digital.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateTransactionInput" },
          },
        },
      },
      responses: {
        201: {
          description: "Transaksi berhasil dibuat beserta token Midtrans.",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiSuccessResponse" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Transaction" },
                    },
                  },
                ],
              },
            },
          },
        },
        400: {
          description: "Data input tidak lengkap atau di bawah batas nominal minimum.",
        },
      },
    },
  },
  "/api/transactions/{id}": {
    get: {
      tags: ["Transaksi"],
      summary: "Detail Transaksi",
      description: "Mengambil status terkini dan rincian transaksi berdasarkan nomor invoice transaksi.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Nomor ID transaksi (mis. WKF-20260914-321916)",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Data transaksi ditemukan.",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiSuccessResponse" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Transaction" },
                    },
                  },
                ],
              },
            },
          },
        },
        404: {
          description: "Transaksi tidak ditemukan.",
        },
      },
    },
  },
  "/api/transactions/{id}/sync": {
    post: {
      tags: ["Midtrans Webhook & Sync"],
      summary: "Rekonsiliasi Real-Time ke Midtrans",
      description: "Memeriksa status pembayaran langsung ke server Midtrans API secara aktif. Jika status 'settlement', sistem otomatis memperbarui transaksi menjadi 'paid', menerbitkan Sertifikat Wakaf Digital, dan mengakumulasikan dana program.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Nomor ID transaksi",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Status transaksi berhasil disinkronkan.",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiSuccessResponse" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Transaction" },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/api/transactions/{id}/pay": {
    post: {
      tags: ["Transaksi"],
      summary: "Simulasi Pelunasan Pembayaran",
      description: "Melunasi transaksi secara langsung untuk keperluan pengujian demo/sandbox internal.",
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
          description: "Transaksi berhasil dilunasi secara simulasi.",
        },
      },
    },
  },
  "/api/transactions/{id}/expire": {
    post: {
      tags: ["Transaksi"],
      summary: "Tandai Transaksi Kadaluwarsa",
      description: "Mengubah status transaksi menjadi expired jika batas waktu pembayaran telah habis.",
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
          description: "Status transaksi diubah menjadi expired.",
        },
      },
    },
  },
};
