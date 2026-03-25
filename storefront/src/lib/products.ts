import { prisma } from './prisma';
import { Product } from './utils';

export async function getProducts(filter?: string): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      include: {
        category: true
      }
    });

    const products = dbProducts.map(p => ({
      ...p,
      collection: p.category?.name || 'Uncategorized',
      longDescription: p.description,
      finishes: ['Gold', 'Silver'], // Mock data for finishes
      spaces: ['Living Room', 'Dining'], // Mock data for spaces
      specs: [], // Empty specs for now
      images: p.images,
    })) as Product[];

    if (!filter || filter === 'All') return products;
    
    const f = filter.toLowerCase();
    return products.filter(p =>
      p.collection.toLowerCase().includes(f) ||
      p.spaces.some(s => s.toLowerCase().includes(f)) ||
      (f === 'led certified' && p.isLed) ||
      (f === 'modern' && p.collection.toLowerCase().includes('modern')) ||
      (f === 'classical' && p.collection.toLowerCase().includes('heritage'))
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: { category: true }
    });
    
    if (!p) return undefined;
    
    return {
      ...p,
      collection: p.category?.name || 'Uncategorized',
      longDescription: p.description,
      finishes: ['Gold', 'Silver'],
      spaces: ['Living Room', 'Dining'],
      specs: [],
      images: p.images,
    } as Product;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return undefined;
  }
}

