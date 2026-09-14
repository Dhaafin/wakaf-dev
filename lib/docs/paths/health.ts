export const healthPaths = {
  "/api/health": {
    get: {
      tags: ["Sistem & Health"],
      summary: "Health Check Server & Database",
      description: "Memeriksa status aktif server Next.js dan koneksi database Neon PostgreSQL.",
      responses: {
        200: {
          description: "Sistem dan database beroperasi normal.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "ok" },
                  timestamp: { type: "string", format: "date-time" },
                  database: { type: "string", example: "connected" },
                },
              },
            },
          },
        },
      },
    },
  },
};
