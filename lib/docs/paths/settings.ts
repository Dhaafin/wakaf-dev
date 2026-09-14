export const settingsPaths = {
  "/api/banner": {
    get: {
      tags: ["Pengaturan Website"],
      summary: "Data Banner Pengumuman Atas",
      description: "Mengambil status tayang dan pesan banner pengumuman atas untuk situs publik.",
      responses: {
        200: {
          description: "Pengaturan banner berhasil diambil.",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiSuccessResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          enabled: { type: "boolean", example: true },
                          text: { type: "string", example: "🌙 Raih keberkahan jariyah: Salurkan wakaf dan sedekah terbaik Anda bersama Yayasan KBM" },
                          linkText: { type: "string", example: "Tunaikan Sekarang →" },
                          linkUrl: { type: "string", example: "/program" },
                        },
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
    put: {
      tags: ["Pengaturan Website"],
      summary: "Perbarui Banner Pengumuman",
      description: "Memperbarui pesan, tombol tautan, dan status aktif tayang banner pengumuman (khusus Admin).",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                enabled: { type: "boolean", example: true },
                text: { type: "string", example: "🌙 Raih keberkahan jariyah: Salurkan wakaf terbaik Anda" },
                linkText: { type: "string", example: "Lihat Program →" },
                linkUrl: { type: "string", example: "/program" },
              },
              required: ["text"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Pengaturan banner berhasil disimpan.",
        },
      },
    },
  },
  "/api/settings": {
    get: {
      tags: ["Pengaturan Website"],
      summary: "Semua Pengaturan Website",
      description: "Mengambil seluruh konfigurasi umum dan banner situs.",
      responses: {
        200: {
          description: "Konfigurasi berhasil diambil.",
        },
      },
    },
    put: {
      tags: ["Pengaturan Website"],
      summary: "Perbarui Pengaturan Website",
      description: "Memperbarui konfigurasi situs secara agregat.",
      responses: {
        200: {
          description: "Pengaturan berhasil diperbarui.",
        },
      },
    },
  },
};
