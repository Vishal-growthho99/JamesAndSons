import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, './.env.local') })

async function testConnection() {
  const url = process.env.DATABASE_URL
  console.log('Testing connection to:', url?.split('@')[1] || 'URL MISSING')

  const pool = new Pool({ 
    connectionString: url,
    ssl: { rejectUnauthorized: false }
  })

  try {
    const client = await pool.connect()
    console.log('✅ PostgreSQL connection successful!')
    client.release()

    const prisma = new PrismaClient()
    const userCount = await prisma.user.count()
    console.log(`✅ Prisma connection successful! Found ${userCount} users.`)
    
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    console.log('Admin Email in DB:', admin ? admin.email : 'NONE FOUND')
    
  } catch (err: any) {
    console.error('❌ Connection failed!')
    console.error('Error details:', err.message)
    if (err.message.includes('getaddrinfo')) {
      console.log('\nTIP: This looks like a network or DNS issue. Check your internet connection or if the DB host is typed correctly.')
    }
  } finally {
    await pool.end()
  }
}

testConnection()
