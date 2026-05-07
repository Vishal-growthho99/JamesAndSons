import Navigation from '@/components/Navigation'

export default function PrivacyPage() {
  return (
    <main style={{ background: 'var(--obsidian)', minHeight: '100vh', color: 'var(--cream)' }}>
      <Navigation />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px' }}>
        <div className="section-label">Legal</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontWeight: 300, marginBottom: '40px' }}>Privacy Policy</h1>
        
        <div className="policy-content" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '24px' }}>Last Updated: May 2026</p>
          
          <h2 style={{ color: 'var(--cream)', marginTop: '40px', marginBottom: '16px' }}>1. Introduction</h2>
          <p style={{ marginBottom: '20px' }}>Welcome to James & Sons. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>

          <h2 style={{ color: 'var(--cream)', marginTop: '40px', marginBottom: '16px' }}>2. Data We Collect</h2>
          <p style={{ marginBottom: '20px' }}>We collect information you provide directly to us, including your name, email address, phone number, and shipping address when you place an order or create an account.</p>

          <h2 style={{ color: 'var(--cream)', marginTop: '40px', marginBottom: '16px' }}>3. How We Use Your Data</h2>
          <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
            <li>To process and deliver your orders via our logistics partner, <strong>Shiprocket</strong>.</li>
            <li>To process secure payments via <strong>Razorpay</strong>.</li>
            <li>To provide customer support and order updates.</li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h2 style={{ color: 'var(--cream)', marginTop: '40px', marginBottom: '16px' }}>4. Security</h2>
          <p style={{ marginBottom: '20px' }}>We implement industry-standard security measures to protect your data. Your payment information is processed securely through Razorpay, and we do not store your full credit card details on our servers.</p>

          <h2 style={{ color: 'var(--cream)', marginTop: '40px', marginBottom: '16px' }}>5. Cookies</h2>
          <p style={{ marginBottom: '20px' }}>We use cookies to enhance your browsing experience, remember your cart items, and analyze our traffic.</p>

          <h2 style={{ color: 'var(--cream)', marginTop: '40px', marginBottom: '16px' }}>6. Contact Us</h2>
          <p style={{ marginBottom: '20px' }}>If you have any questions about this policy, please contact us at support@jamesandsons.in.</p>
        </div>
      </div>
    </main>
  )
}
