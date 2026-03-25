'use server'

import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function syncCustomers() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    if (error) throw error

    let added = 0
    let updated = 0

    for (const user of users) {
      if (!user.email) continue;
      
      const meta = user.user_metadata || {}
      
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id }
      })

      if (existingUser) {
        updated++
        continue
      }

      // If B2B/business
      if (meta.accountType === 'business') {
        const companyName = meta.company_name || 'Business Partner'
        const contactName = meta.contact_name || 'Business User'
        
        await prisma.company.create({
          data: {
            name: companyName,
            gstin: meta.gstin,
            users: {
              create: {
                id: user.id,
                email: user.email,
                firstName: contactName.split(' ')[0],
                lastName: contactName.split(' ').slice(1).join(' ') || '',
                password: 'SUPABASE_AUTH',
                role: meta.is_b2b_pending ? 'CUSTOMER' : 'B2B_BUYER',
              }
            }
          }
        })
      } else {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            firstName: meta.first_name || 'New',
            lastName: meta.last_name || 'User',
            password: 'SUPABASE_AUTH',
            role: 'CUSTOMER',
          }
        })
      }
      added++
    }

    revalidatePath('/customers')
    return { success: true, message: `Synced successfully. Added ${added} new users.` }
  } catch (err: any) {
    console.error('Error syncing customers:', err)
    return { success: false, error: err.message || 'Error occurred.' }
  }
}
