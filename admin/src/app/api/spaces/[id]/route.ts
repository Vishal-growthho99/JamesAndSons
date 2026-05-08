import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    const { name, slug, description, image } = await req.json();
    const space = await prisma.space.update({ 
      where: { id }, 
      data: { name, slug, description, image } 
    });
    return NextResponse.json(space);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    // For many-to-many relationships, we need to disconnect products first
    // to avoid potential constraint issues depending on the DB configuration.
    await prisma.space.update({
      where: { id },
      data: {
        products: {
          set: [] // Disconnect all products
        }
      }
    });

    await prisma.space.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Error deleting space:', e);
    return NextResponse.json({ 
      error: e.message || 'An error occurred while deleting the space. Please make sure no products are strictly dependent on it.' 
    }, { status: 500 });
  }
}
