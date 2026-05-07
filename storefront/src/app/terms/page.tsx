import Navigation from '@/components/Navigation'
import { prisma } from '@/lib/prisma'

export default async function TermsPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'terms' }
  })

  // Hardcoded fallback content
  const fallbackContent = `
    <h2 style="color: var(--cream); margin-top: 40px; margin-bottom: 16px;">1. Use of Website</h2>
    <p style="margin-bottom: 20px;">By accessing this website, you agree to comply with these terms and conditions.</p>
    <h2 style="color: var(--cream); margin-top: 40px; margin-bottom: 16px;">2. Shipping & Delivery</h2>
    <p style="margin-bottom: 20px;">Shipping costs are calculated dynamically based on weight and destination.</p>
    <h2 style="color: var(--cream); margin-top: 40px; margin-bottom: 16px;">3. Governing Law</h2>
    <p style="margin-bottom: 20px;">These terms are governed by and construed in accordance with the laws of India.</p>
  `;

  return (
    <main style={{ background: 'var(--obsidian)', minHeight: '100vh', color: 'var(--cream)' }}>
      <Navigation />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px' }}>
        <div className="section-label">Legal</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontWeight: 300, marginBottom: '40px' }}>
          {page?.title || 'Terms of Service'}
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
