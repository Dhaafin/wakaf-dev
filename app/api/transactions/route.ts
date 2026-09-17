import type { NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { transactions, programs } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import { validateWakafForm } from "@/lib/validation";
import { BANK_OPTIONS } from "@/lib/config";
import { createId } from "@/lib/id";
import { createSnapTransaction } from "@/lib/midtrans";
import { serializeTransaction } from "@/lib/db/serialize";
import { eq, isNull, and, or, desc, asc, ilike, sql } from "drizzle-orm";
import type { ListTransactionsResult } from "@/types";

export const dynamic = "force-dynamic";

// GET /api/transactions — daftar transaksi dengan pagination, dynamic search, status filter, program filter, & sorting
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    const q = searchParams.get("q")?.trim();
    const status = searchParams.get("status")?.trim(); // 'all' | 'pending' | 'paid' | 'expired'
    const programId = searchParams.get("programId")?.trim();
    const sort = searchParams.get("sort")?.trim() || "latest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const offset = (page - 1) * limit;

    // Filter conditions
    const conditions = [];

    if (email) {
      conditions.push(eq(transactions.emailWakif, email));
    }

    if (status && status !== "all" && status !== "semua") {
      conditions.push(eq(transactions.status, status as "pending" | "paid" | "expired"));
    }

    if (programId) {
      conditions.push(eq(transactions.programId, programId));
    }

    if (q) {
      const pattern = `%${q}%`;
      conditions.push(
        or(
          ilike(transactions.id, pattern),
          ilike(transactions.namaWakif, pattern),
          ilike(transactions.emailWakif, pattern),
          ilike(transactions.teleponWakif, pattern),
          ilike(transactions.programNama, pattern),
        )!,
      );
    }

    // Determine deterministic sorting
    let orderBy = [desc(transactions.createdAt), desc(transactions.id)];
    if (sort === "oldest") {
      orderBy = [asc(transactions.createdAt), asc(transactions.id)];
    } else if (sort === "nominal_desc") {
      orderBy = [desc(transactions.nominal), desc(transactions.id)];
    } else if (sort === "nominal_asc") {
      orderBy = [asc(transactions.nominal), asc(transactions.id)];
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 1. Total hitungan data yang cocok
    const [countRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(transactions)
      .where(whereClause);
    const total = Number(countRow?.count ?? 0);

    // 2. Query items transaksi dengan limit & offset
    const records = await db.query.transactions.findMany({
      where: whereClause,
      orderBy,
      limit,
      offset,
    });

    // 3. Stats summary untuk kartu KPI transaksi admin
    const [statsRow] = await db
      .select({
        totalNominal: sql<number>`coalesce(sum(case when ${transactions.status} = 'paid' then ${transactions.nominal} else 0 end), 0)::bigint`,
        totalCount: sql<number>`count(*)::int`,
        paidCount: sql<number>`count(case when ${transactions.status} = 'paid' then 1 end)::int`,
        pendingCount: sql<number>`count(case when ${transactions.status} = 'pending' then 1 end)::int`,
        expiredCount: sql<number>`count(case when ${transactions.status} = 'expired' then 1 end)::int`,
      })
      .from(transactions);

    const statsSummary = {
      totalNominal: Number(statsRow?.totalNominal ?? 0),
      totalCount: Number(statsRow?.totalCount ?? 0),
      paidCount: Number(statsRow?.paidCount ?? 0),
      pendingCount: Number(statsRow?.pendingCount ?? 0),
      expiredCount: Number(statsRow?.expiredCount ?? 0),
    };

    const result: ListTransactionsResult = {
      items: records.map(serializeTransaction),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      statsSummary,
    };

    return ok(result);
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

    if (!prog.aktif) {
      return fail(
        "Program ini sedang tidak aktif menerima donasi atau wakaf baru.",
        400,
      );
    }

    const bank =
      values.bank && (BANK_OPTIONS as readonly string[]).includes(values.bank)
        ? values.bank
        : "Midtrans";

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

    // Fetch konfigurasi pembayaran dinamis dari database
    const { getPaymentConfig } = await import("@/lib/settings");
    const paymentConfig = await getPaymentConfig();

    let expiryMs = 24 * 60 * 60 * 1000;
    if (paymentConfig.expiryUnit === "minutes") expiryMs = paymentConfig.expiryDuration * 60 * 1000;
    else if (paymentConfig.expiryUnit === "hours") expiryMs = paymentConfig.expiryDuration * 60 * 60 * 1000;
    else if (paymentConfig.expiryUnit === "days") expiryMs = paymentConfig.expiryDuration * 24 * 60 * 60 * 1000;

    // Waktu kedaluwarsa tagihan (dihitung dari config)
    const expiresAt = new Date(Date.now() + expiryMs);

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
        custom_expiry: {
          expiry_duration: paymentConfig.expiryDuration,
          unit: paymentConfig.expiryUnit === "minutes" ? "minute" : paymentConfig.expiryUnit === "hours" ? "hour" : "day"
        }
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
