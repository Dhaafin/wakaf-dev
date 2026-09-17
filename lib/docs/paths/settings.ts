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
  "/api/hero": {
    get: {
      tags: ["Pengaturan Website"],
      summary: "Data Hero Section Beranda",
      description: "Mengambil kustomisasi tajuk, highlight aksen, deskripsi, dan tombol CTA Hero Section halaman utama.",
      responses: {
        200: {
          description: "Konfigurasi Hero Section berhasil diambil.",
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
                          badge: { type: "string", example: "Inovasi Wakaf Digital" },
                          title: { type: "string", example: "Kebaikan abadi yang" },
                          titleHighlight: { type: "string", example: "terus mengalir." },
                          description: { type: "string", example: "Kendalikan penuh amal jariyah Anda dengan platform terpadu untuk berdonasi..." },
                          primaryCtaText: { type: "string", example: "Mulai Berwakaf" },
                          primaryCtaUrl: { type: "string", example: "/program" },
                          secondaryCtaText: { type: "string", example: "Kalkulator Zakat" },
                          secondaryCtaUrl: { type: "string", example: "/zakat" },
                          showSecondaryCta: { type: "boolean", example: true },
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
      summary: "Perbarui Hero Section Beranda",
      description: "Memperbarui tajuk, deskripsi, tombol CTA, dan aksen Hero Section (khusus Admin).",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                badge: { type: "string", example: "Inovasi Wakaf Digital" },
                title: { type: "string", example: "Kebaikan abadi yang" },
                titleHighlight: { type: "string", example: "terus mengalir." },
                description: { type: "string", example: "Kendalikan penuh amal jariyah Anda..." },
                primaryCtaText: { type: "string", example: "Mulai Berwakaf" },
                primaryCtaUrl: { type: "string", example: "/program" },
                secondaryCtaText: { type: "string", example: "Kalkulator Zakat" },
                secondaryCtaUrl: { type: "string", example: "/zakat" },
                showSecondaryCta: { type: "boolean", example: true },
              },
              required: ["title", "primaryCtaText", "primaryCtaUrl"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Konfigurasi Hero Section berhasil disimpan.",
        },
      },
    },
  },
  "/api/settings": {
    get: {
      tags: ["Pengaturan Website"],
      summary: "Semua Pengaturan Website",
      description: "Mengambil seluruh konfigurasi umum, banner pengumuman, dan Hero Section situs.",
      responses: {
        200: {
          description: "Konfigurasi berhasil diambil.",
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
                          topBanner: { type: "object" },
                          hero: { type: "object" },
                          payment: { type: "object" },
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
      summary: "Perbarui Pengaturan Website",
      description: "Memperbarui konfigurasi situs secara agregat (banner & hero).",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                topBanner: { type: "object" },
                hero: { type: "object" },
                payment: {
                  type: "object",
                  properties: {
                    expiryDuration: { type: "number", example: 24 },
                    expiryUnit: { type: "string", enum: ["minutes", "hours", "days"], example: "hours" },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Pengaturan berhasil diperbarui.",
        },
      },
    },
  },
};
