const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  try {
    const products = await prisma.product.count();
    const categories = await prisma.category.count();
    const users = await prisma.user.count();
    const orders = await prisma.order.count();
    
    console.log('Database Status:');
    console.log(`Products: ${products}`);
    console.log(`Categories: ${categories}`);
    console.log(`Users: ${users}`);
    console.log(`Orders: ${orders}`);
    
    if (products > 0) {
      const sample = await prisma.product.findFirst();
      console.log('Sample Product:', sample.name);
    }
  } catch (e) {
    console.error('Connection Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
