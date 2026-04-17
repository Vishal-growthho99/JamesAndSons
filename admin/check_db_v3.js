const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const urls = [
  "postgresql://postgres:-R7d6-%25rgu%24NyG%2B@db.juxvocfnvzzadfxeihxl.supabase.co:5432/postgres",
  "postgresql://postgres.juxvocfnvzzadfxeihxl:-R7d6-%25rgu%24NyG%2B@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
];

async function tryConnect(url) {
  console.log('Trying URL:', url.split('@')[1]); // Log only host for safety
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const count = await prisma.category.count();
    console.log('SUCCESS! Categories found:', count);
    const categories = await prisma.category.findMany();
    console.log('Category Names:', categories.map(c => c.name).join(', '));
    return true;
  } catch (e) {
    console.error('FAILED:', e.message);
    return false;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

async function main() {
  for (const url of urls) {
    if (await tryConnect(url)) break;
  }
}

main().catch(console.error);
