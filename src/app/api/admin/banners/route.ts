import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { sort_order: 'asc' },
    });

    return NextResponse.json({ success: true, data: banners });
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/banners
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, image_url, is_active } = body;

    if (!title || !image_url) {
      return NextResponse.json({ success: false, error: 'Title and image_url are required' }, { status: 400 });
    }

    const created = await prisma.banner.create({
      data: {
        title: typeof title === 'object' ? title : { uz: String(title), ru: String(title), en: String(title) },
        image_url: String(image_url),
        is_active: is_active ?? true,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/banners
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Banner ID is required' }, { status: 400 });
    }

    await prisma.banner.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true, message: 'Banner deleted' });
  } catch (error: any) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
