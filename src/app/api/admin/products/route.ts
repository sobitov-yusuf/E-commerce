import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: true,
        reviews: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/products
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, base_price, old_price, images, category_id, badge, variants } = body;

    if (!name || !base_price || !category_id) {
      return NextResponse.json(
        { success: false, error: 'Name, base_price and category_id are required' },
        { status: 400 }
      );
    }

    const created = await prisma.product.create({
      data: {
        category_id: Number(category_id),
        name: typeof name === 'object' ? name : { uz: String(name), ru: String(name), en: String(name) },
        description: typeof description === 'object' ? description : { uz: String(description || ''), ru: String(description || ''), en: String(description || '') },
        base_price: Number(base_price),
        old_price: old_price ? Number(old_price) : null,
        images: Array.isArray(images) ? images : [],
        badge: badge && ['NEW', 'TOP', 'SALE'].includes(badge) ? badge : 'NONE',
        is_active: true,
        variants: variants && Array.isArray(variants) && variants.length > 0 ? {
          create: variants.map((v: any) => ({
            size: v.size || null,
            color: v.color || null,
            price: v.price ? Number(v.price) : null,
            stock_count: Number(v.stock_count || v.stock || 0),
            sku: v.sku || `SKU-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          }))
        } : undefined,
      },
      include: {
        category: true,
        variants: true,
      }
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product in DB:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/products
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    await prisma.product.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product in DB:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
