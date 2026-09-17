export const adminPaths = {
  "/api/admin/analytics": {
    get: {
      tags: ["Admin & Dashboard"],
      summary: "Data Analitik Dashboard Eksekutif",
      description: "Mengambil data metrik KPI, arus kas bulanan, sebaran instrumen, dan campaign radar untuk dashboard admin. Membutuhkan otorisasi admin.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Data analitik berhasil diambil.",
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
                          overview: {
                            type: "object",
                            properties: {
                              totalTerkumpul: { type: "number" },
                              totalDisalurkan: { type: "number" },
                              saldoMengendap: { type: "number" },
                              disbursementRatio: { type: "number" },
                              totalWakif: { type: "number" },
                              totalTransactions: { type: "number" },
                              paidTransactions: { type: "number" },
                              pendingTransactions: { type: "number" },
                              expiredTransactions: { type: "number" },
                              conversionRate: { type: "number" },
                              avgDonation: { type: "number" },
                              activeProgramCount: { type: "number" }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        403: {
          description: "Akses ditolak (bukan admin)."
        }
      }
    }
  }
};
