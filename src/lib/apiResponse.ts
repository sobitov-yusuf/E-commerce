// Universal Telegram Mini App (TMA) E-Commerce — Standardized API Response & BigInt JSON Serializer

import { NextResponse } from 'next/server';

/**
 * Safely serializes objects containing BigInt values to standard JSON
 */
export function safeJsonStringify(data: any): string {
  return JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

/**
 * Returns a standardized success JSON response with BigInt handling
 */
export function apiSuccess<T = any>(
  data: T,
  status: number = 200,
  extraHeaders: Record<string, string> = {}
): NextResponse {
  const jsonString = safeJsonStringify({ success: true, data });
  return new NextResponse(jsonString, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

/**
 * Returns a standardized error JSON response with BigInt handling
 */
export function apiError(
  error: string,
  status: number = 400,
  extraHeaders: Record<string, string> = {}
): NextResponse {
  const jsonString = safeJsonStringify({ success: false, error });
  return new NextResponse(jsonString, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}
