const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const spaces = [
    { name: 'Grand Foyer', slug: 'grand-foyer' },
    { name: 'Dining Estate', slug: 'dining-estate' },
    { name: 'Master Suite', slug: 'master-suite' },
    { name: 'Executive Lounge', slug: 'executive-lounge' },
    { name: 'Boutique Hotel', slug: 'boutique-hotel' }
  ];

  console.log('Seeding spaces...');
  const createdSpaces = [];
  for (const s of spaces) {
    const created = await prisma.space.upsert({
      where: { slug: s.slug },
      update: {},
      create: { name: s.name, slug: s.slug, description: `Curated for the ${s.name}` }
    });
    createdSpaces.push(created);
  }

  console.log('Assigning spaces to products randomly...');
  const products = await prisma.product.findMany();
  
  for (const p of products) {
    // Assign 1 to 2 random spaces to each product
    const numSpaces = Math.floor(Math.random() * 2) + 1;
    const shuffled = [...createdSpaces].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numSpaces).map(s => ({ id: s.id }));
    
    await prisma.product.update({
      where: { id: p.id },
      data: {
        spaces: {
          connect: selected
        }
      }
    });
  }

  console.log('Successfully seeded spaces and updated products!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
