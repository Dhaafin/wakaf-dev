export const statsPaths = {
  "/api/stats": {
    get: {
      tags: ["Statistik Publik"],
      summary: "Statistik Global Platform",
      description: "Mengambil data agregat riil platform (total dana, wakif, program, disalurkan) untuk halaman transparansi.",
      responses: {
        200: {
          description: "Data statistik berhasil diambil.",
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
                          totalTerkumpul: { type: "number", example: 125000000 },
                          totalWakif: { type: "number", example: 1250 },
                          totalTransaksiPaid: { type: "number", example: 1500 },
                          totalProgram: { type: "number", example: 12 },
                          totalDisalurkan: { type: "number", example: 45000000 },
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
  },
};
