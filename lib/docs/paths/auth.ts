export const authPaths = {
  "/api/auth/admin": {
    post: {
      tags: ["Otentikasi"],
      summary: "Login Admin (Mock)",
      description: "Endpoint otentikasi mock untuk login admin (legacy). Otentikasi utama menggunakan Better Auth.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string" },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login admin berhasil."
        },
        401: {
          description: "Kredensial tidak cocok."
        }
      }
    }
  }
};
