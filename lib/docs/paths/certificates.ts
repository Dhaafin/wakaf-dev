export const certificatesPaths = {
  "/api/certificates/{id}": {
    get: {
      tags: ["Sertifikat"],
      summary: "Data Sertifikat Wakaf Digital",
      description: "Mengambil data resmi sertifikat wakaf berdasarkan nomor akta (mis. 'SW/2026/09/FEFF7D').",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Nomor sertifikat wakaf resmi (URL encoded)",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Sertifikat ditemukan.",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiSuccessResponse" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Certificate" },
                    },
                  },
                ],
              },
            },
          },
        },
        404: {
          description: "Sertifikat tidak ditemukan.",
        },
      },
    },
  },
};
