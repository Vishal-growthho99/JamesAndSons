import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const getConnectionUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }
  return url;
};

const createPrismaClient = () => {
  const url = getConnectionUrl();
  console.log(`Initializing Pool with URL length: ${url.length}`);

  const pool = new Pool({ 
    connectionString: url,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // Test pool error handling
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  const adapter = new PrismaPg(pool as any);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
