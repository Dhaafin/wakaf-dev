import type { NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { transactions } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import {
  verifyMidtransSignature,
  mapMidtransStatus,
  type MidtransNotificationPayload,
} from "@/lib/midtrans";
import { settleTransaction } from "@/lib/settlement";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

// POST /api/payment/notification
// Webhook handler resmi untuk notifikasi status pembayaran dari Midtrans
export async function POST(req: NextRequest) {
  try {
    let payload: MidtransNotificationPayload;
    try {
      payload = await req.json();
    } catch {
      return fail("Body notifikasi JSON tidak valid.", 400);
    }

    // 1. Validasi Keamanan Signature Key (SHA-512)
    const isValidSignature = verifyMidtransSignature(payload);
    if (!isValidSignature) {
      console.warn("Midtrans Webhook: Invalid signature_key detected.", {
        order_id: payload.order_id,
        signature_key: payload.signature_key,
      });
      return fail("Signature tidak valid.", 401);
    }

    const {
      order_id,
      transaction_status,
      fraud_status,
      payment_type,
    } = payload;

    // 2. Cari transaksi terkait di database
    const tx = await db.query.transactions.findFirst({
      where: eq(transactions.id, order_id),
    });

    if (!tx) {
      console.warn(`Midtrans Webhook: Transaksi ${order_id} tidak ditemukan.`);
      return fail("Transaksi tidak ditemukan.", 404);
    }

    // Validasi kesesuaian nominal tagihan (mencegah manipulasi underpayment)
    const payloadAmount = Math.round(Number(payload.gross_amount));
    if (payloadAmount !== tx.total) {
      console.warn("Midtrans Webhook: Nominal mismatch detected.", {
        order_id,
        payloadAmount,
        expectedTotal: tx.total,
      });
      return fail("Nominal pembayaran tidak cocok dengan tagihan.", 400);
    }

    const targetStatus = mapMidtransStatus(transaction_status, fraud_status);

    // 3. Tangani Status: LUNAS (Paid) secara atomic & idempotent
    if (targetStatus === "paid") {
      const settlement = await settleTransaction(tx.id, {
        bank: payment_type ? payment_type.toUpperCase() : tx.bank,
      });

      return ok({
        status: "OK",
        transaction_status: "paid",
        certId:
          settlement.certificate?.id || settlement.transaction.certificateId,
        alreadyPaid: settlement.alreadyPaid,
      });
    }

    // 4. Tangani Status: EXPIRED (hanya jika transaksi masih berstatus pending)
    if (targetStatus === "expired") {
      await db
        .update(transactions)
        .set({ status: "expired" })
        .where(
          and(eq(transactions.id, tx.id), eq(transactions.status, "pending")),
        );

      return ok({ status: "OK", transaction_status: "expired" });
    }

    // 5. Tangani Status: PENDING / LAINNYA
    return ok({ status: "OK", transaction_status: targetStatus });
  } catch (err) {
    console.error("POST /api/payment/notification error:", err);
    return fail("Terjadi kesalahan saat memproses notifikasi Midtrans.", 500);
  }
}
