export const commonSchemas = {
  ApiSuccessResponse: {
    type: "object",
    description: "Format standar respons sukses API KBM",
    properties: {
      ok: {
        type: "boolean",
        example: true,
        description: "Menandakan status keberhasilan operasi.",
      },
      data: {
        type: "object",
        description: "Payload data respons.",
      },
    },
    required: ["ok", "data"],
  },
  ApiErrorResponse: {
    type: "object",
    description: "Format standar respons kesalahan API KBM",
    properties: {
      ok: {
        type: "boolean",
        example: false,
        description: "Menandakan status kegagalan operasi.",
      },
      error: {
        type: "string",
        example: "Parameter yang diberikan tidak valid.",
        description: "Pesan kesalahan yang mudah dipahami.",
      },
    },
    required: ["ok", "error"],
  },
};
