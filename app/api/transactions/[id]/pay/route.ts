import { markTransactionPaid } from "@/lib/mock-db";
import { ok, fail } from "@/lib/api/server";

export const dynamic = "force-dynamic";

// POST /api/transactions/:id/pay
// ----------------------------------------------------------------------------
// MOCK WEBHOOK PEMBAYARAN.
// Di produksi, endpoint seperti ini dipanggil oleh payment gateway (Midtrans/
// Xendit/dsb.) setelah dana benar-benar masuk, lengkap dengan verifikasi
// signature. Untuk demo, tombol "Simulasikan pembayaran berhasil" di halaman
// tunggu memanggilnya langsung.
// Efek: status transaksi -> "paid", progres & jumlah wakif program bertambah,
// sertifikat wakaf dibuat.
// ----------------------------------------------------------------------------
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const result = markTransactionPaid(decodeURIComponent(params.id));
  if ("error" in result) return fail(result.error, 409);
  return ok(result);
}
