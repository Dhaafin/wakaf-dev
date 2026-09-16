import crypto from "crypto";

export interface MidtransCustomerDetails {
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
}

export interface MidtransItemDetails {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface CreateSnapTransactionParams {
  order_id: string;
  gross_amount: number;
  customer_details: MidtransCustomerDetails;
  item_details?: MidtransItemDetails[];
}

export interface SnapTransactionResult {
  token: string;
  redirect_url: string;
}

export interface MidtransNotificationPayload {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_id?: string;
  transaction_time?: string;
  settlement_time?: string;
}

// Konfigurasi Environment Midtrans
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const MIDTRANS_SNAP_URL = isProduction
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

const MIDTRANS_SNAP_API_URL = isProduction
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

/**
 * Membuat Snap transaction token via Midtrans API (server-side)
 */
export async function createSnapTransaction(
  params: CreateSnapTransactionParams,
): Promise<SnapTransactionResult> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi di environment.");
  }

  const authString = Buffer.from(`${serverKey}:`).toString("base64");

  const response = await fetch(MIDTRANS_SNAP_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: params.order_id,
        gross_amount: Math.round(params.gross_amount),
      },
      customer_details: params.customer_details,
      item_details: params.item_details,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Midtrans Snap API Error:", response.status, errorBody);
    throw new Error(
      `Gagal membuat Snap token Midtrans (HTTP ${response.status}): ${errorBody}`,
    );
  }

  const data = (await response.json()) as SnapTransactionResult;
  return data;
}

/**
 * Verifikasi signature key dari webhook notification Midtrans
 * Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifyMidtransSignature(
  payload: MidtransNotificationPayload,
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return false;

  const rawString = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;
  const computedHash = crypto
    .createHash("sha512")
    .update(rawString)
    .digest("hex");

  return computedHash.toLowerCase() === payload.signature_key.toLowerCase();
}

/**
 * Mapping status transaksi Midtrans ke status internal sistem kita:
 * 'pending' | 'paid' | 'expired' | 'failed'
 */
export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string,
): "paid" | "pending" | "expired" | "failed" {
  if (transactionStatus === "capture") {
    return fraudStatus === "accept" ? "paid" : "failed";
  }
  if (transactionStatus === "settlement") {
    return "paid";
  }
  if (
    transactionStatus === "pending" ||
    transactionStatus === "authorize"
  ) {
    return "pending";
  }
  if (transactionStatus === "expire") {
    return "expired";
  }
  return "failed";
}

const MIDTRANS_CORE_API_URL = isProduction
  ? "https://api.midtrans.com/v2"
  : "https://api.sandbox.midtrans.com/v2";

/**
 * Cek status transaksi langsung ke Midtrans Core API (server-side)
 * GET https://api.sandbox.midtrans.com/v2/{order_id}/status
 */
export async function checkMidtransStatus(
  orderId: string,
): Promise<MidtransNotificationPayload | null> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return null;

  const authString = Buffer.from(`${serverKey}:`).toString("base64");
  try {
    const response = await fetch(
      `${MIDTRANS_CORE_API_URL}/${encodeURIComponent(orderId)}/status`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${authString}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      console.warn(
        `Midtrans status check warning (${response.status}) for ${orderId}`,
      );
      return null;
    }

    const data = (await response.json()) as MidtransNotificationPayload;
    return data;
  } catch (err) {
    console.warn(`Failed to check Midtrans status for ${orderId}:`, err);
    return null;
  }
}

