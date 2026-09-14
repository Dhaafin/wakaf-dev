import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema.ts";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

const client = neon(connectionString);
const db = drizzle(client, { schema });

async function clearData() {
  console.log("🧹 Memulai pembersihan data pengujian...");

  // 1. Hapus sertifikat wakaf
  console.log("1. Mengosongkan tabel certificates...");
  await db.delete(schema.certificates);

  // 2. Hapus transaksi masuk
  console.log("2. Mengosongkan tabel transactions...");
  await db.delete(schema.transactions);

  // 3. Hapus penyaluran dana (disbursements) agar kas amanah tetap 0 dan tidak minus
  console.log("3. Mengosongkan tabel disbursements...");
  await db.delete(schema.disbursements);

  // 4. Reset progres capaian seluruh program ke 0
  console.log("4. Mereset capaian seluruh program (terkumpul = 0, jumlah_wakif = 0)...");
  await db.update(schema.programs).set({
    terkumpul: 0,
    jumlahWakif: 0,
    updatedAt: new Date(),
  });

  console.log("✨ Selesai! Semua program tetap ada, riwayat transaksi & penyaluran bersih, capaian dimulai dari Rp 0.");
}

clearData().catch((err) => {
  console.error("Gagal melakukan pembersihan data:", err);
  process.exit(1);
});
