const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndFixUser() {
  const email = 'admin@jamesandsons.com';
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log('User not found in DB! Creating them...');
    user = await prisma.user.create({
      data: {
        email,
        role: 'ADMIN',
        firstName: 'Super',
        lastName: 'Admin'
      }
    });
    console.log('Created user:', user);
  } else {
    console.log('User found:', user);
    if (user.role !== 'ADMIN') {
      console.log('Role was not ADMIN, updating...');
      user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      });
      console.log('Updated user:', user);
    }
  }
}

checkAndFixUser().finally(() => prisma.$disconnect());
