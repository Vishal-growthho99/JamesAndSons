const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.juxvocfnvzzadfxeihxl:-R7d6-%25rgu%24NyG%2B@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function main() {
  try {
    const products = await prisma.product.count();
    console.log(`Connection successful. Products: ${products}`);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
