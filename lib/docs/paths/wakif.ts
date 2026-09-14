export const wakifPaths = {
  "/api/donations": {
    get: {
      tags: ["Wakif & Donasi Publik"],
      summary: "Feed Donasi & Doa Publik",
      description: "Mengambil daftar donasi terbaru yang berstatus lunas (paid) untuk ditampilkan di feed publik atau halaman program.",
      parameters: [
        {
          name: "programId",
          in: "query",
          description: "Filter donatur untuk program tertentu",
          schema: { type: "string" },
        },
        {
          name: "limit",
          in: "query",
          description: "Batas jumlah data (default 10)",
          schema: { type: "integer", default: 10 },
        },
      ],
      responses: {
        200: {
          description: "Feed donasi berhasil diambil.",
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
  },
  "/api/auth/wakif": {
    get: {
      tags: ["Wakif & Donasi Publik"],
      summary: "Cek Sesi Profil Wakif",
      description: "Mencari data transaksi terakhir wakif berdasarkan email untuk mengisi otomatis formulir donasi.",
      parameters: [
        {
          name: "email",
          in: "query",
          required: true,
          schema: { type: "string", format: "email" },
        },
      ],
      responses: {
        200: {
          description: "Data wakif ditemukan.",
        },
      },
    },
    post: {
      tags: ["Wakif & Donasi Publik"],
      summary: "Masuk Sesi Wakif",
      description: "Memulai sesi donatur tanpa kata sandi menggunakan email.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string", format: "email" },
                nama: { type: "string" },
              },
              required: ["email"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Sesi wakif aktif.",
        },
      },
    },
  },
};
