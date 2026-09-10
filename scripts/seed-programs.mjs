import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../lib/db/schema.ts';
import { SEED_PROGRAMS } from '../lib/mock-db/seed.ts';
import { sql } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not defined in environment variables');
  process.exit(1);
}

const client = neon(connectionString);
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding programs to Neon PostgreSQL...');

  const [{ count }] = await db.select({ count: sql`count(*)` }).from(schema.programs);
  if (Number(count) > 0) {
    console.log(`Database already has ${count} programs. Skipping seed.`);
    return;
  }

  for (const p of SEED_PROGRAMS) {
    console.log(`- Inserting program: ${p.nama} (${p.id})`);
    await db.insert(schema.programs).values({
      id: p.id,
      nama: p.nama,
      slug: p.slug,
      programType: p.program_type,
      kategori: p.kategori,
      lokasi: p.lokasi,
      ringkasan: p.ringkasan,
      deskripsi: p.deskripsi,
      imageUrl: p.imageUrl || null,
      target: p.target,
      terkumpul: p.terkumpul,
      jumlahWakif: p.jumlahWakif,
      nazhir: p.nazhir,
      aktif: p.aktif,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.createdAt),
    });

    if (p.disbursements && p.disbursements.length > 0) {
      for (const d of p.disbursements) {
        console.log(`  * Inserting disbursement: ${d.judul}`);
        await db.insert(schema.disbursements).values({
          id: d.id,
          programId: p.id,
          tanggal: new Date(d.tanggal),
          judul: d.judul,
          deskripsi: d.deskripsi,
          nominal: d.nominal,
          buktiImageUrl: d.buktiImageUrl || null,
          buktiFileName: d.buktiFileName || null,
          createdAt: new Date(d.tanggal),
        });
      }
    }
  }

  console.log('✅ Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
