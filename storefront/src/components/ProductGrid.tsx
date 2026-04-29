'use client';
import { useState } from 'react';
import { formatPrice, Product } from '@/lib/utils';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';

export default function ProductGrid({ initialFilter = 'All', initialProducts }: { initialFilter?: string, initialProducts: Product[] }) {
  const [activeFilter, setActiveFilter] = useState(initialFilter || 'All');
  const { addItem } = useCartStore();

  const uniqueCollections = Array.from(new Set(initialProducts.map(p => p.collection))).filter(c => c !== 'Uncategorized').sort();
  const uniqueStyles = Array.from(new Set(initialProducts.flatMap(p => p.style || []))).filter(Boolean).sort();
  const uniqueMaterials = Array.from(new Set(initialProducts.flatMap(p => p.materialAndFinish || []))).filter(Boolean).sort();
  const uniqueSpaces = Array.from(new Set(initialProducts.flatMap(p => p.spaces || []))).filter(Boolean).sort();
  
  const filters = ['All', ...uniqueCollections, ...uniqueSpaces, ...uniqueStyles, ...uniqueMaterials, 'LED Certified'];
  
  const products = activeFilter === 'All' ? initialProducts : initialProducts.filter(p =>
    (p.collection === activeFilter) ||
    (p.spaces && p.spaces.includes(activeFilter)) ||
    (p.style && p.style.includes(activeFilter)) ||
    (p.materialAndFinish && p.materialAndFinish.includes(activeFilter)) ||
    (activeFilter === 'LED Certified' && p.isLed)
  );

  return (
    <section className="section" id="collections">
      <div className="section-header">
        <div>
          <div className="section-label">{activeFilter === 'All' ? 'Masterworks' : 'Curated Selection'}</div>
          <h2 className="section-title">
            {activeFilter === 'All' ? 'All Collections' : `The ${activeFilter} Collection`}
          </h2>
        </div>
        <Link href="/collections" className="link-all">View All {products.length} Products</Link>
      </div>

      <div className="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <span className="filter-label">Filter:</span>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {products.map(product => (
          <Link key={product.id} href={`/products/${product.slug}`} className="product-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
            {product.badge && (
              <div className={`product-badge ${product.badge === 'new' ? 'badge-new' : product.badge === 'bis' ? 'badge-bis' : product.badge === 'b2b' ? 'badge-sale' : 'badge-sale'}`}>
                {product.badge === 'new' ? 'New Release' : product.badge === 'bis' ? 'BIS Appv.' : 'B2B Volume'}
              </div>
            )}

            <div className="product-actions" style={{ zIndex: 2 }}>
              <button className="prod-action-btn" title="Add to Cart" onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}>+</button>
              <Link href={`/rfq?product=${product.slug}`} className="prod-action-btn" title="Request Quote" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>Q</Link>
            </div>

            <div className="product-img" style={{ position: 'relative' }}>
              <div className="product-img-bg" />
              
              {/* Placeholder SVG (always in background if there's an image, or as main if not) */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
                <svg className="prod-chandelier-svg" width="120" height="150" viewBox="0 0 100 120" stroke="#C4A05A" fill="none" style={{ opacity: 0.3 }}>
                  <path d="M50 10 L50 40" strokeWidth="1" strokeDasharray="3 3"/>
                  <path d="M20 70 Q50 30 80 70" strokeWidth="2" opacity="0.7"/>
                  <circle cx="50" cy="95" r="4" fill="#F5E9C8" stroke="none"/>
                </svg>
              </div>

              {product.images && product.images.length > 0 && (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="prod-actual-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    transition: 'opacity 0.5s ease',
                    opacity: 0
                  }}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target) target.style.opacity = '1';
                  }}
                  // Start at opacity 0 to show the placeholder
                  // Note: In some browsers/states this might flicker, but it's the standard way
                />
              )}
            </div>

            <div className="product-info" style={{ padding: '20px 20px 24px' }}>
              <div className="product-brand">{product.collection}</div>
              <div className="product-name" style={{ fontSize: '19px', marginBottom: '12px' }}>{product.name}</div>
              <div className="product-meta">
                <div className="product-price">
                  {formatPrice(product.d2cPrice)}
                  {product.mrp > product.d2cPrice && (
                    <span className="product-price-old">{formatPrice(product.mrp)}</span>
                  )}
                </div>
              </div>
              <div className="product-specs">
                {product.isLed && <span className="spec-pill led">{product.luminousEfficacy} lm/W LED</span>}
                {product.cri && <span className="spec-pill">CRI {product.cri}</span>}
                <span className="spec-pill gst">GST {product.gstRate}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
