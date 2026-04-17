const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const url = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = await prisma.category.findMany();
  console.log('Categories:', JSON.stringify(categories, null, 2));
  const productsCount = await prisma.product.count();
  console.log('Product Count:', productsCount);
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
