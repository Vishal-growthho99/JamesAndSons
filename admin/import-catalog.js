const fs = require('fs');
const { parse } = require('csv-parse/sync');
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

const CSV_PATH = '/Users/abhishikt_mac/Skills/Coding/Growth-ho clients/JamesAndSons/do not shrink down product description keep it lo... - do not shrink down product description keep it lo....csv';

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function parsePrice(priceStr) {
  if (!priceStr || priceStr === '—') return 0;
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

function parseArray(val) {
  if (!val || val === '—') return [];
  return val.split(',').map(s => s.trim()).filter(Boolean);
}

async function main() {
  try {
    console.log('--- Wiping existing dummy data ---');
    // Delete in order to respect foreign key constraints
    await prisma.ticketMessage.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.returnRequest.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.rFQItem.deleteMany();
    await prisma.rFQ.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    console.log('Dummy data wiped successfully.');

    console.log('--- Reading CSV file ---');
    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Found ${records.length} products to import.`);

    let successCount = 0;
    let failCount = 0;

    for (const row of records) {
      try {
        const categoryName = row['Category']?.trim();
        let categoryId = null;

        if (categoryName && categoryName !== '—') {
          let category = await prisma.category.findFirst({
            where: { name: { equals: categoryName, mode: 'insensitive' } }
          });

          if (!category) {
            category = await prisma.category.create({
              data: {
                name: categoryName,
                slug: generateSlug(categoryName),
                description: `All ${categoryName} products`,
              }
            });
            console.log(`Created new category: ${categoryName}`);
          }
          categoryId = category.id;
        }

        let slug = generateSlug(row['Product Name']);
        const existing = await prisma.product.findUnique({ where: { slug } });
        if (existing) slug = `${slug}-${Date.now()}`;

        const mrp = parsePrice(row['Price (Before Disc.)']);
        const d2cPrice = parsePrice(row['Price (After Disc.)']);

        // Base B2B is usually slightly less than D2C, let's just make it D2C or slightly less, 
        // or just set it to d2cPrice if not provided. The schema requires b2bPrice.
        const b2bPrice = d2cPrice * 0.8; 

        await prisma.product.create({
          data: {
            sku: row['Product ID'] || `SKU-${Date.now()}`,
            name: row['Product Name'],
            slug,
            description: row['Product Description'] && row['Product Description'] !== '—' ? row['Product Description'] : '',
            mrp,
            d2cPrice,
            b2bPrice,
            dimensions: row['Dimensions'] && row['Dimensions'] !== '—' ? row['Dimensions'] : null,
            materialAndFinish: parseArray(row['Material & Finish']),
            bulbType: parseArray(row['Bulb Type']),
            style: parseArray(row['Style']),
            categoryId: categoryId || undefined,
            stockQuantity: 10, // Default stock so they show up
          }
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to import product ${row['Product Name']}:`, err.message);
        failCount++;
      }
    }

    console.log('--- Import Complete ---');
    console.log(`Successfully imported: ${successCount}`);
    console.log(`Failed to import: ${failCount}`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
