import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products — Fetch active products from Supabase PostgreSQL
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('category_id');
    const badge = searchParams.get('badge');

    const where: any = { is_active: true };

    if (categoryId && categoryId !== 'all') {
      const numId = parseInt(categoryId, 10);
      if (!isNaN(numId)) {
        where.category_id = numId;
      }
    }

    if (badge && ['NEW', 'TOP', 'SALE', 'NONE'].includes(badge.toUpperCase())) {
      where.badge = badge.toUpperCase();
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
        reviews: {
          where: { status: 'APPROVED' },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error: any) {
    console.error('Error fetching products from DB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products', data: [] },
      { status: 500 }
    );
  }
}
