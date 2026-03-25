const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const url = "postgresql://postgres.juxvocfnvzzadfxeihxl:-R7d6-%25rgu%24NyG%2B@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const pool = new Pool({ 
  connectionString: url,
  max: 1,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding James & Sons Database (with Adapter)...');

  const categories = [
    { name: 'Modern Chandeliers', slug: 'modern', description: 'Contemporary designs for the modern home.' },
    { name: 'Classical Chandeliers', slug: 'classical', description: 'Timeless elegance and heritage designs.' },
    { name: 'Crystals', slug: 'crystals', description: 'Sparkling precision-cut crystal luminaires.' },
    { name: 'Bespoke Lighting', slug: 'bespoke', description: 'Custom engineered lighting for grand spaces.' },
    { name: 'Wall Sconces', slug: 'sconces', description: 'Elegant wall-mounted illumination.' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat
    });
  }
  console.log('Categories seeded.');

  const products = [
    {
      name: 'Omnia Crystal Chandelier',
      sku: 'JS-OMN-01',
      slug: 'omnia-crystal',
      description: 'A masterpiece of Swarovski crystals and gold-plated hardware. Perfect for grand foyers.',
      mrp: 145000,
      d2cPrice: 125000,
      b2bPrice: 95000,
      stockQuantity: 12,
      categorySlug: 'crystals'
    },
    {
      name: 'Linear Zenith Pendant',
      sku: 'JS-ZEN-02',
      slug: 'linear-zenith',
      description: 'Minimalist linear pendant with hand-brushed brass finish. Tunable white LED technology.',
      mrp: 42000,
      d2cPrice: 38000,
      b2bPrice: 28000,
      stockQuantity: 25,
      categorySlug: 'modern'
    },
    {
      name: 'Heritage Palace Chandelier',
      sku: 'JS-HER-03',
      slug: 'heritage-palace',
      description: 'Vintage-inspired 24-arm chandelier with Murano glass elements.',
      mrp: 275000,
      d2cPrice: 240000,
      b2bPrice: 185000,
      stockQuantity: 5,
      categorySlug: 'classical'
    }
  ];

  for (const prod of products) {
    const { categorySlug, ...data } = prod;
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (cat) {
      await prisma.product.upsert({
        where: { sku: prod.sku },
        update: { ...data, categoryId: cat.id },
        create: { ...data, categoryId: cat.id }
      });
    }
  }
  console.log('Sample products seeded.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
