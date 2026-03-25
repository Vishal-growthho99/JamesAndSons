'use client';
import { useCartStore } from '@/store/cart';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, total, itemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeCart]);

  // Prevent body scroll when open; CRITICAL: also prevent horizontal overflow
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const currentItems = mounted ? items : [];
  const currentCount = mounted ? itemCount() : 0;
  const cartTotal = mounted ? total() : 0;

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop - only rendered when open */}
      {isOpen && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 9998,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Drawer panel - visibility-toggled instead of translateX to avoid overflow issues */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: '400px',
          maxWidth: '92vw',
          background: 'var(--obsidian)',
          borderLeft: '1px solid var(--border)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.6)',
          // Using visibility + opacity instead of translateX to avoid horizontal scrollbar
          visibility: isOpen ? 'visible' : 'hidden',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, visibility 0.3s ease',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 300, color: 'var(--cream)', margin: 0 }}>
            Mini Bag {currentCount > 0 && <span style={{ color: 'var(--gold)' }}>({currentCount})</span>}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', transition: 'color 0.2s', padding: '8px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px 28px', background: 'var(--void)' }}>
          {currentItems.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text-muted)', marginBottom: '8px' }}>Your bag is empty</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-dim)', marginBottom: '24px', lineHeight: 1.6 }}>Start exploring our curated collection.</p>
              <Link href="/collections" onClick={closeCart} className="btn-outline" style={{ display: 'inline-block', padding: '10px 28px', textDecoration: 'none' }}>Explore</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {currentItems.map((item, i) => (
                <div key={`${item.product.id}-${i}`} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <Link href={`/products/${item.product.slug}`} onClick={closeCart} style={{ width: '64px', height: '80px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
                    <svg width="32" height="40" viewBox="0 0 100 120" stroke="var(--gold)" fill="none" style={{ opacity: 0.6 }}>
                      <path d="M50 10 L50 40" strokeWidth="1" strokeDasharray="3 3" />
                      <path d="M20 70 Q50 30 80 70" strokeWidth="2" opacity="0.7" />
                      <circle cx="50" cy="95" r="4" fill="var(--gold-light)" stroke="none" />
                    </svg>
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <Link href={`/products/${item.product.slug}`} onClick={closeCart} style={{ textDecoration: 'none', color: 'var(--cream)', flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 300, lineHeight: 1.3, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Qty: {item.quantity}</div>
                      </Link>
                      <button onClick={() => removeItem(item.product.id)} aria-label="Remove item" style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '16px', padding: '4px', transition: 'color 0.2s', flexShrink: 0 }} onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}>✕</button>
                    </div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', color: 'var(--gold-light)', marginTop: '10px' }}>
                      {formatPrice(item.product.d2cPrice * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {currentItems.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '20px 28px', background: 'var(--obsidian)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 300, color: 'var(--cream)' }}>{formatPrice(cartTotal)}</span>
            </div>
            <Link href="/cart" onClick={closeCart} className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '14px', textDecoration: 'none', letterSpacing: '0.15em', width: '100%', marginBottom: '10px' }}>
              View Shopping Bag
            </Link>
            <Link href="/checkout" onClick={closeCart} style={{ display: 'block', textAlign: 'center', padding: '14px', textDecoration: 'none', letterSpacing: '0.15em', width: '100%', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)', transition: 'color 0.2s' }}>
              Checkout Directly
            </Link>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
