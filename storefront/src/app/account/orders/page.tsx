import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) redirect('/login?next=/account/orders')

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } }
      }
    }
  })

  const orders = dbUser?.orders || []

  return (
    <>
      <Navigation />
      <main style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--obsidian)' }}>
        <div style={{ background: 'var(--void)', borderBottom: '1px solid var(--border)', padding: '48px 40px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="section-label">Account</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', fontWeight: 300, color: 'var(--cream)', marginTop: '8px' }}>My Orders</h1>
          </div>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 40px' }}>
          {orders.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-muted)', marginBottom: '16px' }}>No orders found</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-dim)', marginBottom: '32px' }}>Your past and current orders will appear here once you make a purchase.</p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <Link href="/collections" className="btn-primary" style={{ padding: '12px 32px', textDecoration: 'none' }}>Browse Collections</Link>
                <Link href="/account" className="btn-outline" style={{ padding: '12px 32px', textDecoration: 'none' }}>Back to Account</Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {orders.map(order => (
                <div key={order.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Order Number</div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--cream)' }}>{order.orderNumber}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Date Placed</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--cream)' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Total Amount</div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--gold-light)' }}>₹{order.totalAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Status</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: order.status === 'DELIVERED' ? '#4ade80' : 'var(--accent)', padding: '4px 8px', border: `1px solid ${order.status === 'DELIVERED' ? '#4ade80' : 'var(--accent)'}`, display: 'inline-block' }}>
                        {order.status}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {order.items.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '48px', height: '60px', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>IMG</span>
                          </div>
                          <div>
                            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--cream)' }}>{item.product.name}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>QTY: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--cream)' }}>
                          ₹{item.total.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Section */}
                  {(order.trackingNumber || order.awbNumber) && (
                    <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Shipping Details</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--cream)' }}>Tracking ID: {order.trackingNumber || 'Pending'}</div>
                      </div>
                      
                      {order.awbNumber && (
                        <a 
                          href={`https://shiprocket.co/tracking/${order.awbNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary"
                          style={{ padding: '10px 24px', fontSize: '12px', textDecoration: 'none' }}
                        >
                          Track on Shiprocket ↗
                        </a>
                      )}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
