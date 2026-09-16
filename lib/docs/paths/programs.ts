export const programsPaths = {
  "/api/programs": {
    get: {
      tags: ["Program"],
      summary: "Daftar Semua Program",
      description: "Mengambil seluruh program wakaf, infaq, dan zakat yang tersedia beserta histori penyaluran.",
      parameters: [
        {
          name: "tipe",
          in: "query",
          description: "Filter instrumen (wakaf-uang, wakaf-melalui-uang, infaq-shadaqah, zakat)",
          schema: { type: "string" },
        },
        {
          name: "kategori",
          in: "query",
          description: "Filter bidang (masjid, pendidikan, produktif-umkm, dll)",
          schema: { type: "string" },
        },
        {
          name: "search",
          in: "query",
          description: "Kata kunci pencarian nama atau ringkasan program",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Daftar program berhasil diambil.",
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
                        items: { $ref: "#/components/schemas/Program" },
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
      tags: ["Program"],
      summary: "Buat Program Baru",
      description: "Mendaftarkan program wakaf atau donasi baru ke sistem KBM.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateProgramInput" },
          },
        },
      },
      responses: {
        201: {
          description: "Program berhasil dibuat.",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiSuccessResponse" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Program" },
                    },
                  },
                ],
              },
            },
          },
        },
        400: {
          description: "Validasi gagal.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/api/programs/{id}": {
    get: {
      tags: ["Program"],
      summary: "Detail Program",
      description: "Mengambil informasi mendalam satu program berdasarkan ID atau slug.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID atau slug program",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Detail program ditemukan.",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiSuccessResponse" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Program" },
                    },
                  },
                ],
              },
            },
          },
        },
        404: {
          description: "Program tidak ditemukan.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            },
          },
        },
      },
    },
    put: {
      tags: ["Program"],
      summary: "Perbarui Program",
      description: "Memperbarui data dan status aktif program wakaf.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateProgramInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Program berhasil diperbarui.",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiSuccessResponse" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Program" },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Program"],
      summary: "Hapus Program",
      description: "Menghapus program (soft-delete untuk integritas audit).",
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
          description: "Program berhasil dihapus.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiSuccessResponse" },
            },
          },
        },
      },
    },
  },
};
