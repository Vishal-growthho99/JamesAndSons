const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@jamesandsons.com' }
  });
  console.log('User from Prisma:', user);
  process.exit(0);
}

check().catch(console.error);
