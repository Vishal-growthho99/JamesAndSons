const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  await client.connect();
  try {
    console.log('Running manual migration to convert fields to arrays...');
    await client.query(`
      ALTER TABLE "Product" DROP COLUMN IF EXISTS "materialAndFinish";
      ALTER TABLE "Product" DROP COLUMN IF EXISTS "bulbType";
      ALTER TABLE "Product" DROP COLUMN IF EXISTS "style";
      
      ALTER TABLE "Product" ADD COLUMN "materialAndFinish" TEXT[] DEFAULT ARRAY[]::TEXT[];
      ALTER TABLE "Product" ADD COLUMN "bulbType" TEXT[] DEFAULT ARRAY[]::TEXT[];
      ALTER TABLE "Product" ADD COLUMN "style" TEXT[] DEFAULT ARRAY[]::TEXT[];
      
      -- Add GIN indexes for efficient querying
      CREATE INDEX IF NOT EXISTS "Product_materialAndFinish_idx" ON "Product" USING GIN ("materialAndFinish");
      CREATE INDEX IF NOT EXISTS "Product_bulbType_idx" ON "Product" USING GIN ("bulbType");
      CREATE INDEX IF NOT EXISTS "Product_style_idx" ON "Product" USING GIN ("style");
    `);
    console.log('Array migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
