import Navigation from '@/components/Navigation'

export default function TermsPage() {
  return (
    <main style={{ background: 'var(--obsidian)', minHeight: '100vh', color: 'var(--cream)' }}>
      <Navigation />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px' }}>
        <div className="section-label">Legal</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontWeight: 300, marginBottom: '40px' }}>Terms of Service</h1>
        
        <div className="policy-content" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '24px' }}>Last Updated: May 2026</p>
          
          <h2 style={{ color: 'var(--cream)', marginTop: '40px', marginBottom: '16px' }}>1. Use of Website</h2>
          <p style={{ marginBottom: '20px' }}>By accessing this website, you agree to comply with these terms and conditions. The content of this website is for your general information and use only.</p>

          <h2 style={{ color: 'var(--cream)', marginTop: '40px', marginBottom: '16px' }}>2. Product Information</h2>
          <p style={{ marginBottom: '20px' }}>We strive for accuracy in product descriptions and pricing. However, James & Sons reserves the right to correct any errors and to change or update information at any time without prior notice.</p>

          <h2 style={{ color: 'var(--cream)', marginTop: '40px', marginBottom: '16px' }}>3. Shipping & Delivery</h2>
          <p style={{ marginBottom: '20px' }}>Shipping costs are calculated dynamically based on weight and destination. Delivery timelines are estimates and may vary based on carrier performance. Risk of loss passes to you upon delivery to the carrier.</p>

          <h2 style={{ color: 'var(--cream)', marginTop: '40px', marginBottom: '16px' }}>4. Returns & Refunds</h2>
          <p style={{ marginBottom: '20px' }}>Due to the bespoke and fragile nature of our products, returns are only accepted for damaged or defective items within 48 hours of delivery. Please contact customer support for authorization.</p>

          <h2 style={{ color: 'var(--cream)', marginTop: '40px', marginBottom: '16px' }}>5. Limitation of Liability</h2>
          <p style={{ marginBottom: '20px' }}>James & Sons shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our products or website.</p>

          <h2 style={{ color: 'var(--cream)', marginTop: '40px', marginBottom: '16px' }}>6. Governing Law</h2>
          <p style={{ marginBottom: '20px' }}>These terms are governed by and construed in accordance with the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Aligarh, Uttar Pradesh.</p>
        </div>
      </div>
    </main>
  )
}
