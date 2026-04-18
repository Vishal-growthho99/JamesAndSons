import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const spaces = await prisma.space.findMany({
      include: { _count: { select: { products: true } } }
    });
    return NextResponse.json(spaces);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, slug, description, image } = await req.json();
    const space = await prisma.space.create({ 
      data: { name, slug, description, image } 
    });
    return NextResponse.json(space);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
