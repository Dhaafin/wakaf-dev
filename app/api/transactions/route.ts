import type { NextRequest } from "next/server";
import {
  createTransaction,
  listTransactions,
  listTransactionsByEmail,
} from "@/lib/mock-db";
import { ok, fail } from "@/lib/api/server";
import { validateWakafForm } from "@/lib/validation";
import { VA_TTL_MS, BANK_OPTIONS } from "@/lib/config";

export const dynamic = "force-dynamic";

// GET /api/transactions            -> semua transaksi (admin)
// GET /api/transactions?email=...  -> transaksi milik satu wakif (riwayat)
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (email) return ok(listTransactionsByEmail(email));
  return ok(listTransactions());
}

// POST /api/transactions — submit form wakaf, menghasilkan transaksi + VA mock.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Body tidak valid.", 400);
  }

  const values = {
    nominal: Number(body.nominal ?? 0),
    nama: String(body.nama ?? ""),
    email: String(body.email ?? ""),
    telepon: String(body.telepon ?? ""),
    atasNama: (body.atasNama === "orang-lain" ? "orang-lain" : "sendiri") as
      | "sendiri"
      | "orang-lain",
    namaAtasNama: String(body.namaAtasNama ?? ""),
    visibilitas: (body.visibilitas === "anonim" ? "anonim" : "publik") as
      | "publik"
      | "anonim",
    doa: String(body.doa ?? ""),
    bank: String(body.bank ?? "BSI"),
  };

  const fieldErrors = validateWakafForm(values);
  if (Object.keys(fieldErrors).length > 0) {
    return fail("Periksa kembali isian form.", 422, fieldErrors);
  }

  const programId = String(body.programId ?? "");
  if (!programId) return fail("Program tidak dipilih.", 400);

  const bank = (BANK_OPTIONS as readonly string[]).includes(values.bank)
    ? values.bank
    : "BSI";

  const tx = createTransaction({
    programId,
    nominal: values.nominal,
    namaWakif: values.nama.trim(),
    emailWakif: values.email.trim().toLowerCase(),
    teleponWakif: values.telepon.trim(),
    atasNama: values.atasNama,
    namaAtasNama: values.namaAtasNama.trim() || undefined,
    visibilitas: values.visibilitas,
    doa: values.doa.trim() || undefined,
    bank,
    // DEMO: masa berlaku VA dipercepat (lihat lib/config.ts -> VA_TTL_MS).
    ttlMs: VA_TTL_MS,
  });

  if (!tx) return fail("Program tidak ditemukan.", 404);
  return ok(tx, 201);
}
