import { type NextRequest } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db/client";
import { programs, transactions, disbursements } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { ok, fail } from "@/lib/api/server";
import { sql, eq, and, isNull, desc, asc, not, isNotNull } from "drizzle-orm";
import type {
  AdminAnalyticsData,
  MonthlyCashflowItem,
  InstrumentDistributionItem,
  PaymentChannelItem,
  CampaignRadarItem,
  RecentDoaItem,
  ProgramType,
  ProgramCategory,
} from "@/types";
import { PROGRAM_TYPE_LABEL } from "@/types";

export const dynamic = "force-dynamic";

// Format nama bulan Indonesia
const BULAN_INDONESIA: Record<string, string> = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "Mei",
  "06": "Jun",
  "07": "Jul",
  "08": "Agu",
  "09": "Sep",
  "10": "Okt",
  "11": "Nov",
  "12": "Des",
};

export async function GET(_req: NextRequest) {
  try {
    // 1. Verifikasi role admin via session Better Auth
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      const isDev = process.env.NODE_ENV !== "production";
      if (!isDev && (!session || session.user.role !== "admin")) {
        return fail("Akses ditolak: Hanya admin yang diizinkan.", 403);
      }
    } catch {
      if (process.env.NODE_ENV === "production") {
        return fail("Akses ditolak: Hanya admin yang diizinkan.", 403);
      }
    }

    // 2. Overview Metrics
    const [overviewRow] = await db.execute<{
      totalTerkumpul: string;
      totalWakif: string;
      totalProgram: string;
      totalDisalurkan: string;
      totalTx: string;
      paidTx: string;
      pendingTx: string;
      expiredTx: string;
    }>(sql`
      SELECT
        COALESCE((SELECT SUM(terkumpul) FROM programs WHERE deleted_at IS NULL), 0)::text AS "totalTerkumpul",
        COALESCE((SELECT SUM(jumlah_wakif) FROM programs WHERE deleted_at IS NULL), 0)::text AS "totalWakif",
        COALESCE((SELECT COUNT(*) FROM programs WHERE aktif = true AND deleted_at IS NULL), 0)::text AS "totalProgram",
        COALESCE((SELECT SUM(nominal) FROM disbursements), 0)::text AS "totalDisalurkan",
        COALESCE((SELECT COUNT(*) FROM transactions), 0)::text AS "totalTx",
        COALESCE((SELECT COUNT(*) FROM transactions WHERE status = 'paid'), 0)::text AS "paidTx",
        COALESCE((SELECT COUNT(*) FROM transactions WHERE status = 'pending'), 0)::text AS "pendingTx",
        COALESCE((SELECT COUNT(*) FROM transactions WHERE status = 'expired'), 0)::text AS "expiredTx"
    `).then((r) => r.rows);

    const totalTerkumpul = Number(overviewRow?.totalTerkumpul ?? 0);
    const totalDisalurkan = Number(overviewRow?.totalDisalurkan ?? 0);
    const saldoMengendap = Math.max(0, totalTerkumpul - totalDisalurkan);
    const disbursementRatio =
      totalTerkumpul > 0
        ? Number(((totalDisalurkan / totalTerkumpul) * 100).toFixed(1))
        : 0;
    const totalWakif = Number(overviewRow?.totalWakif ?? 0);
    const totalTransactions = Number(overviewRow?.totalTx ?? 0);
    const paidTransactions = Number(overviewRow?.paidTx ?? 0);
    const pendingTransactions = Number(overviewRow?.pendingTx ?? 0);
    const expiredTransactions = Number(overviewRow?.expiredTx ?? 0);
    const conversionRate =
      totalTransactions > 0
        ? Number(((paidTransactions / totalTransactions) * 100).toFixed(1))
        : 0;
    const avgDonation =
      paidTransactions > 0 ? Math.round(totalTerkumpul / paidTransactions) : 0;
    const activeProgramCount = Number(overviewRow?.totalProgram ?? 0);

    // 3. Monthly Cashflow (Tren 6 Bulan Terakhir)
    const now = new Date();
    const monthsKeys: string[] = [];
    const monthsLabels: string[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const key = `${y}-${m}`;
      monthsKeys.push(key);
      monthsLabels.push(`${BULAN_INDONESIA[m] || m} ${y}`);
    }

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Inflow per bulan
    const inflowRows = await db.execute<{
      monthKey: string;
      inflow: string;
      txCount: string;
    }>(sql`
      SELECT
        TO_CHAR(COALESCE(paid_at, created_at), 'YYYY-MM') AS "monthKey",
        COALESCE(SUM(nominal), 0)::text AS "inflow",
        COUNT(*)::text AS "txCount"
      FROM transactions
      WHERE status = 'paid'
        AND COALESCE(paid_at, created_at) >= ${sixMonthsAgo}
      GROUP BY 1
    `).then((r) => r.rows);

    // Outflow per bulan
    const outflowRows = await db.execute<{
      monthKey: string;
      outflow: string;
    }>(sql`
      SELECT
        TO_CHAR(tanggal, 'YYYY-MM') AS "monthKey",
        COALESCE(SUM(nominal), 0)::text AS "outflow"
      FROM disbursements
      WHERE tanggal >= ${sixMonthsAgo}
      GROUP BY 1
    `).then((r) => r.rows);

    const inflowMap = new Map(
      inflowRows.map((r) => [r.monthKey, { inflow: Number(r.inflow), count: Number(r.txCount) }]),
    );
    const outflowMap = new Map(
      outflowRows.map((r) => [r.monthKey, Number(r.outflow)]),
    );

    const monthlyCashflow: MonthlyCashflowItem[] = monthsKeys.map((key, idx) => {
      const inData = inflowMap.get(key) || { inflow: 0, count: 0 };
      const outData = outflowMap.get(key) || 0;
      return {
        monthKey: key,
        monthLabel: monthsLabels[idx],
        inflow: inData.inflow,
        outflow: outData,
        transactionCount: inData.count,
      };
    });

    // 4. Instrument Distribution (Wakaf Uang, Wakaf Melalui Uang, Infaq/Shadaqah, Zakat)
    const instrumentRows = await db.execute<{
      programType: ProgramType;
      totalNominal: string;
      programCount: string;
    }>(sql`
      SELECT
        program_type AS "programType",
        COALESCE(SUM(terkumpul), 0)::text AS "totalNominal",
        COUNT(*)::text AS "programCount"
      FROM programs
      WHERE deleted_at IS NULL
      GROUP BY 1
    `).then((r) => r.rows);

    const instrumentDistribution: InstrumentDistributionItem[] = (
      ["wakaf-uang", "wakaf-melalui-uang", "infaq-shadaqah", "zakat"] as ProgramType[]
    ).map((type) => {
      const match = instrumentRows.find((r) => r.programType === type);
      const nominal = Number(match?.totalNominal ?? 0);
      const count = Number(match?.programCount ?? 0);
      const pct =
        totalTerkumpul > 0
          ? Number(((nominal / totalTerkumpul) * 100).toFixed(1))
          : 0;
      return {
        type,
        label: PROGRAM_TYPE_LABEL[type] || type,
        totalNominal: nominal,
        programCount: count,
        percentage: pct,
      };
    });

    // 5. Payment Channels Distribution
    const channelRows = await db.execute<{
      bank: string;
      count: string;
      totalNominal: string;
    }>(sql`
      SELECT
        COALESCE(NULLIF(bank, ''), 'Midtrans / Lainnya') AS "bank",
        COUNT(*)::text AS "count",
        COALESCE(SUM(nominal), 0)::text AS "totalNominal"
      FROM transactions
      WHERE status = 'paid'
      GROUP BY 1
      ORDER BY 2 DESC
      LIMIT 5
    `).then((r) => r.rows);

    const paymentChannels: PaymentChannelItem[] = channelRows.map((r) => {
      const c = Number(r.count);
      return {
        bank: r.bank,
        count: c,
        totalNominal: Number(r.totalNominal),
        percentage:
          paidTransactions > 0 ? Number(((c / paidTransactions) * 100).toFixed(1)) : 0,
      };
    });

    // 6. Campaign Radar (Top Capaian & Program Butuh Dorongan)
    const allActivePrograms = await db.query.programs.findMany({
      where: and(eq(programs.aktif, true), isNull(programs.deletedAt)),
      limit: 50,
    });

    const mappedCampaigns: CampaignRadarItem[] = allActivePrograms.map((p) => {
      const pct =
        p.target > 0 ? Math.round((Number(p.terkumpul) / Number(p.target)) * 100) : 0;
      return {
        id: p.id,
        nama: p.nama,
        slug: p.slug,
        programType: p.programType as ProgramType,
        kategori: p.kategori as ProgramCategory,
        target: Number(p.target),
        terkumpul: Number(p.terkumpul),
        percentage: pct,
        jumlahWakif: p.jumlahWakif,
      };
    });

    // Top 3 Capaian
    const topCampaigns = [...mappedCampaigns]
      .sort((a, b) => b.percentage - a.percentage || b.terkumpul - a.terkumpul)
      .slice(0, 3);

    // 3 Program Butuh Dorongan (paling rendah persentasenya dan belum 100%)
    const needHelpCampaigns = [...mappedCampaigns]
      .filter((p) => p.percentage < 100)
      .sort((a, b) => a.percentage - b.percentage || a.terkumpul - b.terkumpul)
      .slice(0, 3);

    // 7. Recent Doa & Aspirasi Wakif
    const doaRows = await db.query.transactions.findMany({
      where: and(
        isNotNull(transactions.doa),
        not(eq(transactions.doa, "")),
      ),
      orderBy: [desc(transactions.createdAt)],
      limit: 4,
    });

    const recentDoa: RecentDoaItem[] = doaRows.map((tx) => ({
      id: tx.id,
      namaWakif: tx.namaWakif,
      visibilitas: tx.visibilitas as "publik" | "anonim",
      nominal: tx.nominal,
      programNama: tx.programNama,
      doa: tx.doa || "",
      createdAt: tx.createdAt.toISOString(),
    }));

    const response: AdminAnalyticsData = {
      overview: {
        totalTerkumpul,
        totalDisalurkan,
        saldoMengendap,
        disbursementRatio,
        totalWakif,
        totalTransactions,
        paidTransactions,
        pendingTransactions,
        expiredTransactions,
        conversionRate,
        avgDonation,
        activeProgramCount,
      },
      monthlyCashflow,
      instrumentDistribution,
      paymentChannels,
      topCampaigns,
      needHelpCampaigns,
      recentDoa,
    };

    return ok(response);
  } catch (err) {
    console.error("GET /api/admin/analytics error:", err);
    return fail("Gagal memuat data analitik dashboard.", 500);
  }
}
