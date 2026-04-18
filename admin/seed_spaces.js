const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const url = "postgresql://postgres.juxvocfnvzzadfxeihxl:-R7d6-%25rgu%24NyG%2B@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1";

const pool = new Pool({ 
  connectionString: url,
  max: 1,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding James & Sons Spaces...');

  const spaces = [
    { name: 'Grand Foyer', slug: 'grand-foyer', description: 'Make a statement in the heart of your home.' },
    { name: 'Dining Estate', slug: 'dining', description: 'Illumination for memorable dinner parties.' },
    { name: 'Master Bed', slug: 'bedroom', description: 'Softer, warmer lights for relaxation.' },
    { name: 'Hotel Lobby', slug: 'hotel', description: 'Grandeur for commercial hospitality spaces.' },
    { name: 'Conference', slug: 'conference', description: 'Brilliant lighting for high-stakes business environments.' }
  ];

  for (const s of spaces) {
    await prisma.space.upsert({
      where: { slug: s.slug },
      update: s,
      create: s
    });
  }
  console.log('Spaces seeded.');

  // Link products to spaces
  const products = await prisma.product.findMany({ take: 3 });
  if (products.length > 0) {
    // Omnia Crystal -> Grand Foyer
    const foyer = await prisma.space.findUnique({ where: { slug: 'grand-foyer' } });
    if (foyer) {
      await prisma.space.update({
        where: { id: foyer.id },
        data: { products: { connect: { id: products[0].id } } }
      });
      console.log(`Linked ${products[0].name} to Grand Foyer`);
    }

    // Heritage Palace -> Dining Estate
    const dining = await prisma.space.findUnique({ where: { slug: 'dining' } });
    if (dining && products[2]) {
      await prisma.space.update({
        where: { id: dining.id },
        data: { products: { connect: { id: products[2].id } } }
      });
       console.log(`Linked ${products[2].name} to Dining Estate`);
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
