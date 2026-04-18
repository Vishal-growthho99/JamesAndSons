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
    // Check if any products are linked? The user might want to prevent deletion if linked.
    // For now, let's allow it but warn in the UI.
    await prisma.space.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
