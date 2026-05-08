import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductFormClient from '../../ProductFormClient';

export const dynamic = 'force-dynamic';

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [product, categories, spaces] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { variants: true, spaces: { select: { id: true } } }
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.space.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!product) return notFound();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center bg-surface p-6 border border-border">
        <div className="flex items-center gap-4">
          <Link href="/products" className="p-2 text-muted hover:text-accent border border-border bg-background transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M5 12L12 19M5 12L12 5" /></svg>
          </Link>
          <div>
            <h1 className="font-serif text-[28px] font-light text-primary tracking-wide m-0">Edit Product</h1>
            <p className="font-mono text-[11px] text-muted mt-1 uppercase tracking-widest">{product.sku}</p>
          </div>
        </div>
        <Link href="/products" className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted border border-border px-6 py-2.5 hover:text-primary transition-colors">
          Cancel
        </Link>
      </div>
      <div className="bg-surface border border-border p-8">
        <ProductFormClient categories={categories} spaces={spaces} defaultValues={product} mode="edit" />
      </div>
    </div>
  );
}
