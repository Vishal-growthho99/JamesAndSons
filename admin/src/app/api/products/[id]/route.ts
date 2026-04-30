import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { syncProductToShiprocket } from '@/lib/shiprocket';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const body = await req.json();
    const { id, variants, specs, images, spaceIds, ...productData } = body;

    // Delete old variants and recreate
    await prisma.productVariant.deleteMany({ where: { productId: params.id } });

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...productData,
        images: images || [],
        specs: specs && Object.keys(specs).length > 0 ? specs : undefined,
        spaces: {
          set: spaceIds?.map((id: string) => ({ id })) || []
        },
        updatedAt: new Date(),
        variants: variants?.length > 0
          ? {
              create: variants.map((v: any) => ({
                name: v.name,
                sku: v.sku,
                d2cPrice: v.d2cPrice || null,
                mrp: v.mrp || null,
                b2bPrice: v.b2bPrice || null,
                stockQuantity: v.stockQuantity || 0,
                images: v.images || [],
                weight: v.weight || null,
                length: v.length || null,
                breadth: v.breadth || null,
                height: v.height || null,
              }))
            }
          : undefined,
      },
    });

    // Sync with Shiprocket
    try {
      const fullProduct = await prisma.product.findUnique({
        where: { id: params.id },
        include: { variants: true }
      });
      if (fullProduct) {
        await syncProductToShiprocket(fullProduct);
      }
    } catch (syncError) {
      console.error('Shiprocket Sync Error:', syncError);
    }

    return NextResponse.json(product);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
