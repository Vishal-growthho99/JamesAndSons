import Navigation from '@/components/Navigation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function PrivacyPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'privacy' }
  })

  // Hardcoded fallback content
  const fallbackContent = `
    <h2 style="color: var(--cream); margin-top: 40px; margin-bottom: 16px;">1. Introduction</h2>
    <p style="margin-bottom: 20px;">Welcome to James & Sons. We respect your privacy and are committed to protecting your personal data.</p>
    <h2 style="color: var(--cream); margin-top: 40px; margin-bottom: 16px;">2. Data We Collect</h2>
    <p style="margin-bottom: 20px;">We collect information you provide directly to us, including your name, email address, and shipping address.</p>
    <h2 style="color: var(--cream); margin-top: 40px; margin-bottom: 16px;">3. Contact Us</h2>
    <p style="margin-bottom: 20px;">If you have any questions, please contact us at support@jamesandsons.in.</p>
  `;

  return (
    <main style={{ background: 'var(--obsidian)', minHeight: '100vh', color: 'var(--cream)' }}>
      <Navigation />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px' }}>
        <div className="section-label">Legal</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontWeight: 300, marginBottom: '40px' }}>
          {page?.title || 'Privacy Policy'}
        </h1>
        
        <div 
          className="policy-content" 
          style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.8, color: 'var(--text-muted)' }}
          dangerouslySetInnerHTML={{ __html: page?.content || fallbackContent }}
        />
      </div>
    </main>
  )
}
