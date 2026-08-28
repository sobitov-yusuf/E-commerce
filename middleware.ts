// Universal Telegram Mini App (TMA) E-Commerce — Next.js Middleware
// Upstash Redis Rate Limiting & JWT Blacklist Session Revocation Protection

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { jwtVerify } from 'jose';

// Initialize Upstash Redis & Rate Limiter safely
let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = Redis.fromEnv();
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '10 s'), // Max 20 requests per 10 seconds
      analytics: true,
    });
  }
} catch (e) {
  // Graceful fallback during static build time
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for') ?? request.ip ?? '127.0.0.1';

  // 1. Rate Limiting for all API endpoints (/api/*)
  if (pathname.startsWith('/api/') && ratelimit) {
    try {
      const { success, limit, remaining, reset } = await ratelimit.limit(`rate_limit:${ip}`);
      
      if (!success) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: 'Juda ko\'p so\'rov yuborildi. Iltimos bir ozdan so\'ng qayta urinib ko\'ring.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        );
      }
    } catch (e) {
      // Fallback
    }
  }

  // 2. Auth Protection for Admin Routes (/admin/* and /api/admin/*)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Exclude admin login page
    if (pathname === '/admin/login' || pathname === '/api/admin/login') {
      return NextResponse.next();
    }

    const token =
      request.cookies.get('admin_token')?.value ||
      request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Avtorizatsiyadan o\'tilmagan (Token topilmadi)' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
      const { payload } = await jwtVerify(token, secret);

      // Check JWT Blacklist in Redis (Instant Session Revocation)
      const jti = payload.jti as string;
      if (jti && redis) {
        const isBlacklisted = await redis.exists(`jwt_blacklist:${jti}`);
        if (isBlacklisted) {
          if (pathname.startsWith('/api/')) {
            return new NextResponse(
              JSON.stringify({ success: false, error: 'Seans bekor qilingan. Qayta kiring.' }),
              { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
          }
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }
      }

      // Token is valid
      const response = NextResponse.next();
      response.headers.set('x-admin-id', String(payload.admin_id || ''));
      response.headers.set('x-admin-role', String(payload.role || ''));
      return response;
    } catch (err) {
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Yaroqsiz yoki eskirgan token' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};
