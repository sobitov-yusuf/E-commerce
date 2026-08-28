// Universal Telegram Mini App (TMA) E-Commerce — Admin Review Moderation API
// Secured with Input Sanitization, Parameterized Prisma Queries, and ReviewStatus Validation

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeInput, safeParseInt } from '@/lib/sanitize';
import { ReviewStatus } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const status: ReviewStatus = ['PENDING', 'APPROVED', 'REJECTED'].includes(statusParam || '')
      ? (statusParam as ReviewStatus)
      : 'PENDING';

    const reviews = await prisma.review.findMany({
      where: { status },
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { first_name: true, last_name: true, username: true } },
        product: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    console.error('Admin Reviews GET Error:', error);
    return NextResponse.json({ success: false, error: 'Server ichki xatosi' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const review_id = safeParseInt(body.review_id);
    const statusParam = sanitizeInput(body.status);
    const status: ReviewStatus | null = ['PENDING', 'APPROVED', 'REJECTED'].includes(statusParam)
      ? (statusParam as ReviewStatus)
      : null;

    if (!review_id || !status) {
      return NextResponse.json(
        { success: false, error: 'review_id va to\'g\'ri status majburiy' },
        { status: 400 }
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id: review_id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updatedReview });
  } catch (error: any) {
    console.error('Admin Reviews PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Server ichki xatosi' }, { status: 500 });
  }
}
