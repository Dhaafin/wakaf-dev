export const uploadPaths = {
  "/api/upload": {
    post: {
      tags: ["Upload & Media"],
      summary: "Upload Gambar ke Vercel Blob",
      description: "Endpoint khusus (menggunakan `@vercel/blob/client`) untuk menerbitkan upload token kepada client (khusus admin).",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object"
            }
          }
        }
      },
      responses: {
        200: {
          description: "Upload token atau hasil unggahan berhasil dikembalikan."
        },
        403: {
          description: "Akses ditolak (bukan admin)."
        }
      }
    }
  }
};
