export const midtransPaths = {
  "/api/payment/notification": {
    post: {
      tags: ["Midtrans Webhook & Sync"],
      summary: "Webhook Handler Notifikasi Pembayaran",
      description: `Endpoint penerimaan webhook resmi dari payment gateway Midtrans.
Endpoint ini memverifikasi signature key (SHA-512), mencocokkan nominal tagihan (mencegah manipulasi underpayment), dan secara idempoten mengonfirmasi pelunasan serta menerbitkan sertifikat wakaf digital.`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                order_id: { type: "string", example: "WKF-20260914-321916" },
                status_code: { type: "string", example: "200" },
                gross_amount: { type: "string", example: "1000000.00" },
                signature_key: { type: "string" },
                transaction_status: { type: "string", example: "settlement" },
                fraud_status: { type: "string", example: "accept" },
                payment_type: { type: "string", example: "echannel" },
              },
              required: ["order_id", "status_code", "gross_amount", "signature_key", "transaction_status"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Notifikasi berhasil diverifikasi dan diproses.",
        },
        400: {
          description: "Nominal pembayaran tidak cocok dengan tagihan.",
        },
        401: {
          description: "Signature key tidak valid.",
        },
        404: {
          description: "Transaksi tidak ditemukan.",
        },
      },
    },
  },
};
