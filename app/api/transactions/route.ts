import type { NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { transactions, programs } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import { validateWakafForm } from "@/lib/validation";
import { VA_TTL_MS, BANK_OPTIONS } from "@/lib/config";
import { createId } from "@/lib/id";
import { createSnapTransaction } from "@/lib/midtrans";
import { serializeTransaction } from "@/lib/db/serialize";
import { eq, isNull, and, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/transactions            -> semua transaksi (admin)
// GET /api/transactions?email=...  -> riwayat transaksi wakif
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

    const conditions = [];
    if (email) {
      conditions.push(eq(transactions.emailWakif, email));
    }

    const items = await db.query.transactions.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [desc(transactions.createdAt)],
      limit: 100,
    });

    return ok(items.map(serializeTransaction));
  } catch (err) {
    console.error("GET /api/transactions error:", err);
    return fail("Gagal memuat transaksi.", 500);
  }
}

// POST /api/transactions — Buat transaksi donasi baru dan integrasikan dengan Midtrans Snap
export async function POST(req: NextRequest) {
  try {
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

    // Cari program di Neon DB
    const prog = await db.query.programs.findFirst({
      where: and(eq(programs.id, programId), isNull(programs.deletedAt)),
    });

    if (!prog) {
      return fail("Program tidak ditemukan.", 404);
    }

    const bank = (BANK_OPTIONS as readonly string[]).includes(values.bank)
      ? values.bank
      : "BSI";

    // Buat ID transaksi unik, misal: WKF-20260913-XXXXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = createId("tx").slice(-6).toUpperCase();
    const txId = `WKF-${dateStr}-${randomSuffix}`;

    // Nomor Virtual Account simulasi fallback
    const bankCodes: Record<string, string> = {
      BSI: "7001",
      BCA: "1234",
      Mandiri: "8899",
      BNI: "9876",
      Muamalat: "1472",
    };
    const code = bankCodes[bank] ?? "7001";
    const randDigits = Math.floor(10000000 + Math.random() * 90000000);
    const vaNumber = `${code}99${randDigits}`;

    // Waktu kedaluwarsa tagihan (default 24 jam, atau VA_TTL_MS untuk demo)
    const expiresAt = new Date(Date.now() + (VA_TTL_MS || 24 * 60 * 60 * 1000));

    // Request Snap Token dari Midtrans
    let snapToken: string | undefined;
    let snapRedirectUrl: string | undefined;
    try {
      const snapRes = await createSnapTransaction({
        order_id: txId,
        gross_amount: values.nominal,
        customer_details: {
          first_name: values.nama.trim(),
          email: values.email.trim().toLowerCase(),
          phone: values.telepon.trim(),
        },
        item_details: [
          {
            id: prog.id,
            price: values.nominal,
            quantity: 1,
            name: prog.nama.slice(0, 50),
          },
        ],
      });
      snapToken = snapRes.token;
      snapRedirectUrl = snapRes.redirect_url;
    } catch (midtransErr) {
      console.warn(
        "Midtrans Snap request warning (fallback ke direct VA):",
        midtransErr instanceof Error ? midtransErr.message : midtransErr,
      );
    }

    // Simpan data transaksi ke Neon PostgreSQL
    const [created] = await db
      .insert(transactions)
      .values({
        id: txId,
        programType: prog.programType,
        programId: prog.id,
        programNama: prog.nama,
        nominal: values.nominal,
        biayaAdmin: 0,
        total: values.nominal,
        namaWakif: values.nama.trim(),
        emailWakif: values.email.trim().toLowerCase(),
        teleponWakif: values.telepon.trim(),
        atasNama: values.atasNama,
        namaAtasNama:
          values.atasNama === "orang-lain" && values.namaAtasNama
            ? values.namaAtasNama.trim()
            : null,
        visibilitas: values.visibilitas,
        doa: values.doa.trim() || null,
        vaNumber,
        bank,
        status: "pending",
        expiresAt,
        snapToken: snapToken || null,
        snapRedirectUrl: snapRedirectUrl || null,
      })
      .returning();

    return ok(serializeTransaction(created), 201);
  } catch (err) {
    console.error("POST /api/transactions error:", err);
    return fail("Gagal membuat transaksi donasi.", 500);
  }
}
